/* global process */
import { sql, ensureSchema } from './_db.js'

const TZ = 'America/Los_Angeles'
const PAGE_NAMES = {
  '/': 'Home', '/about': 'About', '/work/cisco': 'Cisco', '/work/bytedance': 'ByteDance',
  '/work/bosch': 'Bosch', '/work/yhlo': 'YHLO', '/work/flower-star': 'Flower Star',
}
const name = p => PAGE_NAMES[p] || p

// Aggregated traffic for the /admin dashboard. Protected by the ADMIN_KEY env var.
export default async function handler(req, res) {
  if (!process.env.ADMIN_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'unauthorized' })
  const days = Math.min(Math.max(parseInt(req.query.days) || 7, 1), 90)
  await ensureSchema()

  const [totals, prevTotals, hourly, daily, weekly, hourOfDay, cities, pages, clicks, referrers, devices, sessions] = await Promise.all([
    sql`SELECT count(DISTINCT vid)::int AS visitors, count(DISTINCT sid)::int AS sessions,
               count(*) FILTER (WHERE type = 'pageview')::int AS pageviews
        FROM events WHERE ts > now() - make_interval(days => ${days})`,
    sql`SELECT count(DISTINCT vid)::int AS visitors FROM events
        WHERE ts > now() - make_interval(days => ${days * 2}) AND ts <= now() - make_interval(days => ${days})`,
    sql`SELECT to_char(date_trunc('hour', ts AT TIME ZONE ${TZ}), 'YYYY-MM-DD"T"HH24') AS t, count(DISTINCT vid)::int AS v
        FROM events WHERE ts > now() - interval '48 hours' GROUP BY 1 ORDER BY 1`,
    sql`SELECT to_char(date_trunc('day', ts AT TIME ZONE ${TZ}), 'YYYY-MM-DD') AS t, count(DISTINCT vid)::int AS v,
               count(*) FILTER (WHERE type = 'pageview')::int AS pv
        FROM events WHERE ts > now() - interval '30 days' GROUP BY 1 ORDER BY 1`,
    sql`SELECT to_char(date_trunc('week', ts AT TIME ZONE ${TZ}), 'YYYY-MM-DD') AS t, count(DISTINCT vid)::int AS v
        FROM events WHERE ts > now() - interval '84 days' GROUP BY 1 ORDER BY 1`,
    sql`SELECT extract(dow FROM ts AT TIME ZONE ${TZ})::int AS dow, extract(hour FROM ts AT TIME ZONE ${TZ})::int AS h,
               count(DISTINCT vid)::int AS v
        FROM events WHERE ts > now() - make_interval(days => ${Math.max(days, 28)}) GROUP BY 1, 2`,
    sql`SELECT coalesce(city, 'Unknown') AS city, coalesce(region, '') AS region, coalesce(country, '') AS country,
               count(DISTINCT vid)::int AS v
        FROM events WHERE ts > now() - make_interval(days => ${days}) GROUP BY 1, 2, 3 ORDER BY v DESC LIMIT 15`,
    sql`WITH per AS (
          SELECT sid, path,
                 count(*) FILTER (WHERE type = 'pageview') AS views,
                 sum(value) FILTER (WHERE type = 'duration') AS secs,
                 max(value) FILTER (WHERE type = 'scroll') AS scroll,
                 min(vid) AS vid
          FROM events WHERE ts > now() - make_interval(days => ${days}) GROUP BY sid, path)
        SELECT path, sum(views)::int AS views, count(DISTINCT vid)::int AS visitors,
               round(avg(secs))::int AS avg_sec, round(avg(scroll))::int AS avg_scroll
        FROM per GROUP BY path HAVING sum(views) > 0 ORDER BY views DESC`,
    sql`SELECT label, path, count(*)::int AS n
        FROM events WHERE type = 'click' AND ts > now() - make_interval(days => ${days})
        GROUP BY 1, 2 ORDER BY n DESC LIMIT 15`,
    sql`SELECT coalesce(nullif(referrer, ''), 'Direct') AS source, count(DISTINCT vid)::int AS v
        FROM events WHERE type = 'pageview' AND ts > now() - make_interval(days => ${days}) GROUP BY 1 ORDER BY v DESC LIMIT 10`,
    sql`SELECT device, count(DISTINCT vid)::int AS v
        FROM events WHERE ts > now() - make_interval(days => ${days}) GROUP BY 1 ORDER BY v DESC`,
    sql`SELECT sid, count(*) FILTER (WHERE type = 'pageview')::int AS pages,
               coalesce(sum(value) FILTER (WHERE type = 'duration'), 0)::int AS secs,
               bool_or(type = 'pageview' AND path LIKE '/work/%') AS saw_work
        FROM events WHERE ts > now() - make_interval(days => ${days}) GROUP BY sid`,
  ])

  const t = totals[0]
  const n = sessions.length || 1
  const bounced = sessions.filter(s => s.pages <= 1 && s.secs < 10).length
  const summary = {
    ...t,
    prevVisitors: prevTotals[0].visitors,
    avgSessionSec: Math.round(sessions.reduce((a, s) => a + s.secs, 0) / n),
    bounceRate: Math.round((bounced / n) * 100),
    pagesPerSession: +(sessions.reduce((a, s) => a + s.pages, 0) / n).toFixed(1),
    workReachRate: Math.round((sessions.filter(s => s.saw_work).length / n) * 100),
  }
  const pagesNamed = pages.map(p => ({ ...p, name: name(p.path) }))

  res.setHeader('Cache-Control', 'no-store')
  res.json({
    days, summary, hourly, daily, weekly, hourOfDay, cities, pages: pagesNamed, clicks, referrers, devices,
    insights: insights({ summary, pages: pagesNamed, referrers, devices, hourOfDay, clicks, cities }),
  })
}

// Rule-based observations and suggestions. Each rule only fires with enough data to mean something.
function insights({ summary, pages, referrers, devices, hourOfDay, clicks, cities }) {
  const out = []
  const add = (level, title, detail) => out.push({ level, title, detail })
  if (summary.sessions < 5) {
    add('info', 'Not enough data yet', 'Insights appear once the site has a handful of sessions. Share your link on LinkedIn or in applications to start collecting.')
    return out
  }

  if (summary.prevVisitors > 0) {
    const ch = Math.round(((summary.visitors - summary.prevVisitors) / summary.prevVisitors) * 100)
    if (ch >= 30) add('good', `Visitors up ${ch}% vs the previous period`, 'Check Sources below to see what drove it, and repeat that channel.')
    if (ch <= -30) add('warn', `Visitors down ${Math.abs(ch)}% vs the previous period`, 'Traffic follows your outreach. Re-share the site, or pin it in your LinkedIn featured section.')
  }

  if (summary.bounceRate >= 50) add('warn', `${summary.bounceRate}% of visits leave within 10 seconds`, 'The first screen is not hooking people. Lead with one strong project image and your role in one line above the fold.')
  if (summary.workReachRate < 50) add('warn', `Only ${summary.workReachRate}% of visits open a case study`, 'Make the project cards more inviting: clearer outcome in the card copy, or a "View case study" cue on hover.')
  else add('good', `${summary.workReachRate}% of visits open a case study`, 'The home page is doing its job of getting people into your work.')

  const work = pages.filter(p => p.path.startsWith('/work/') && p.views >= 3)
  if (work.length >= 2) {
    const byTime = [...work].sort((a, b) => (b.avg_sec || 0) - (a.avg_sec || 0))
    const best = byTime[0], worst = byTime[byTime.length - 1]
    add('good', `${best.name} holds attention best (${fmt(best.avg_sec)} on average)`, 'Consider placing it first on the home page and linking to it in applications.')
    if ((worst.avg_sec || 0) < 30) add('warn', `${worst.name} is skimmed in ${fmt(worst.avg_sec)}`, 'Visitors leave before the story lands. Move the outcome and key visuals higher, and cut text before the first image.')
    const shallow = work.filter(p => p.avg_scroll != null && p.avg_scroll < 50)
    for (const p of shallow) add('warn', `Most readers stop halfway down ${p.name} (${p.avg_scroll}% scrolled)`, 'Put the strongest result and visuals in the first half, or add section anchors so people can jump ahead.')
  }

  const mobile = devices.find(d => d.device === 'mobile')
  const total = devices.reduce((a, d) => a + d.v, 0)
  if (mobile && total && mobile.v / total >= 0.35) add('info', `${Math.round((mobile.v / total) * 100)}% of visitors are on mobile`, 'Check that live UI covers and long case studies read well on a phone; that is a large share of first impressions.')

  const linkedin = referrers.find(r => /linkedin/i.test(r.source))
  if (!linkedin) add('info', 'No visits from LinkedIn yet', 'Add the site to your LinkedIn profile (Featured and Contact info). It is usually the top source for recruiters.')

  const contact = clicks.filter(c => /contact|email|mail|resume/i.test(c.label || '')).reduce((a, c) => a + c.n, 0)
  if (contact === 0) add('warn', 'Nobody clicked Contact or Resume', 'Add a clear call to action at the end of each case study, for example "Let’s talk" with your email.')
  else add('good', `${contact} contact or resume clicks`, 'People are reaching out. Keep the call to action visible at the end of each case study.')

  if (hourOfDay.length) {
    const top = [...hourOfDay].sort((a, b) => b.v - a.v)[0]
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    add('info', `Busiest time: ${days[top.dow]} around ${top.h}:00 Pacific`, 'Share new work or post on LinkedIn just before this window for the most eyes.')
  }

  const known = cities.filter(c => c.city !== 'Unknown')
  if (known[0]) add('info', `Top city: ${known[0].city}${known[0].country ? ', ' + known[0].country : ''}`, 'If this is a hiring hub you are targeting, tailor outreach there; if not, focus sharing on the cities you want to work in.')
  return out
}

const fmt = s => (s == null ? 'n/a' : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`)
