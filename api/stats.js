/* global process */
import { sql, ensureSchema } from './_db.js'

const TZ = 'America/Los_Angeles'
const PAGE_NAMES = {
  '/': 'Home', '/about': 'About', '/work/cisco': 'Cisco', '/work/bytedance': 'ByteDance',
  '/work/bosch': 'Bosch', '/work/yhlo': 'YHLO', '/work/flower-star': 'Flower Star',
}
const name = p => PAGE_NAMES[p] || p
// Cloud data-center towns: traffic from here is almost always crawlers, link previewers or uptime bots.
const DATACENTER = /^(Boydton|Des Moines|Council Bluffs|Ashburn|The Dalles|Quincy|Prineville|Forest City|Altoona|Papillion|Lenoir|Moncks Corner|Pryor|Mayes County|Clarksville|New Albany|Columbus|Santa Clara|North Charleston|Dublin|Hillsboro|Boardman)$/i
// Clicks on internal links are stored as their path; show them as "Opened Cisco".
const clickLabel = l => (l && l.startsWith('/') ? `Opened ${name(l)}` : l)

// Aggregated traffic for the /admin dashboard. Protected by the ADMIN_KEY env var.
export default async function handler(req, res) {
  if (!process.env.ADMIN_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'unauthorized' })
  if (req.query.grid === 'week') return res.json(await weekGrid(parseInt(req.query.week) || 0))
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
  const visits = await visitLog(days)

  res.setHeader('Cache-Control', 'no-store')
  res.json({
    days, summary, visits, hourly, daily, weekly, hourOfDay, cities, pages: pagesNamed, clicks: clicks.map(c => ({ ...c, label: clickLabel(c.label) })), referrers, devices,
    insights: insights({ summary, pages: pagesNamed, referrers, devices, hourOfDay, clicks, cities }),
  })
}

// One entry per visit, newest first: who, where, when, and the page-by-page path with time spent,
// scroll depth and clicks. A visit is one visitor's activity with no gap longer than 30 minutes,
// so several tabs opened together count as one visit.
const GAP_MS = 30 * 60 * 1000
async function visitLog(days) {
  const rows = await sql`
    WITH active AS (SELECT DISTINCT vid FROM events WHERE ts > now() - make_interval(days => ${days}))
    SELECT e.vid, e.ts, e.type, e.path, e.label, e.value, e.referrer, e.city, e.region, e.country, e.device
    FROM events e JOIN active USING (vid) ORDER BY e.vid, e.ts, e.id`
  const cutoff = Date.now() - days * 86400000
  const out = []
  let cur = null, prevVid = null, prevTs = 0, n = 0
  const perVid = {}
  for (const r of rows) {
    const t = new Date(r.ts).getTime()
    if (r.vid !== prevVid || t - prevTs > GAP_MS) {
      n = r.vid === prevVid ? n + 1 : 1
      cur = { vid: r.vid, start: r.ts, end: r.ts, city: r.city, region: r.region, country: r.country, device: r.device,
              source: null, visitNo: n, pages: [] }
      out.push(cur)
      perVid[r.vid] = n
    }
    prevVid = r.vid; prevTs = t
    cur.end = r.ts
    cur.city ??= r.city; cur.country ??= r.country; cur.region ??= r.region
    const last = cur.pages[cur.pages.length - 1]
    if (r.type === 'pageview') {
      if (cur.source == null) cur.source = r.referrer || 'Direct'
      cur.pages.push({ path: r.path, name: name(r.path), at: r.ts, secs: 0, scroll: null, clicks: [] })
      continue
    }
    // Attach to the current page, or to the latest view of that path if it arrived late from another tab.
    const seg = last && last.path === r.path ? last : [...cur.pages].reverse().find(p => p.path === r.path) || last
    if (!seg) continue
    if (r.type === 'duration') seg.secs += r.value || 0
    if (r.type === 'scroll') seg.scroll = Math.max(seg.scroll ?? 0, r.value ?? 0)
    if (r.type === 'click' && r.label) seg.clicks.push(clickLabel(r.label))
  }
  return out
    .filter(v => v.pages.length && new Date(v.start).getTime() > cutoff)
    .map(v => ({
      ...v,
      totalVisits: perVid[v.vid],
      totalSecs: v.pages.reduce((a, p) => a + p.secs, 0),
      // Likely bot: comes from a cloud data-center town rather than a real ISP location.
      likelyBot: DATACENTER.test(v.city || ''),
    }))
    .sort((a, b) => new Date(b.start) - new Date(a.start))
    .slice(0, 300)
}

// Visitors per hour for one calendar week (Mon–Sun, Pacific). week=0 is this week, 1 last week, etc.
// Data-center bot traffic is left out.
async function weekGrid(week) {
  week = Math.min(Math.max(week, 0), 104)
  const rows = await sql`
    WITH bounds AS (
      SELECT date_trunc('week', now() AT TIME ZONE ${TZ}) - make_interval(weeks => ${week}) AS lo)
    SELECT to_char(ts AT TIME ZONE ${TZ}, 'YYYY-MM-DD') AS d, extract(hour FROM ts AT TIME ZONE ${TZ})::int AS h,
           count(DISTINCT vid)::int AS v, (SELECT to_char(lo, 'YYYY-MM-DD') FROM bounds) AS lo
    FROM events, bounds
    WHERE ts AT TIME ZONE ${TZ} >= lo AND ts AT TIME ZONE ${TZ} < lo + interval '7 days'
      AND NOT coalesce(city, '') ~* ${DATACENTER.source}
    GROUP BY 1, 2`
  const lo = rows[0]?.lo || (await sql`SELECT to_char(date_trunc('week', now() AT TIME ZONE ${TZ}) - make_interval(weeks => ${week}), 'YYYY-MM-DD') AS lo`)[0].lo
  const perDay = await sql`
    SELECT to_char(ts AT TIME ZONE ${TZ}, 'YYYY-MM-DD') AS d, count(DISTINCT vid)::int AS v FROM events
    WHERE ts AT TIME ZONE ${TZ} >= ${lo}::timestamp AND ts AT TIME ZONE ${TZ} < ${lo}::timestamp + interval '7 days'
      AND NOT coalesce(city, '') ~* ${DATACENTER.source}
    GROUP BY 1`
  const start = new Date(lo + 'T00:00:00Z')
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start.getTime() + i * 86400000).toISOString().slice(0, 10)
    const hours = Array(24).fill(0)
    rows.filter(r => r.d === d).forEach(r => { hours[r.h] = r.v })
    return { date: d, hours, total: perDay.find(r => r.d === d)?.v || 0 }
  })
  return { week, start: lo, days }
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
