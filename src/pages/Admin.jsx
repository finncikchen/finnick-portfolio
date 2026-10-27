import { useEffect, useState } from 'react'

// Private traffic dashboard. Reads /api/stats with the admin key; opening it also opts this
// browser out of tracking so your own visits don't skew the numbers.
const SANS = '"Manrope", "Inter", sans-serif'
const C = { bg: '#f6f7f9', card: '#fff', ink: '#14161b', sub: '#6b7180', line: '#e7e9ee', accent: '#3b6cf6', good: '#16a34a', warn: '#d97706', info: '#3b6cf6' }
const fmt = s => (s == null ? '–' : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`)

function Card({ title, children, span = 1 }) {
  return (
    <section style={{ gridColumn: `span ${span}`, background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 20, minWidth: 0 }}>
      {title && <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, color: C.sub, letterSpacing: '0.02em' }}>{title}</h3>}
      {children}
    </section>
  )
}

function Bars({ data, label }) {
  const max = Math.max(1, ...data.map(d => d.v))
  if (!data.length) return <Empty />
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 140 }}>
        {data.map(d => (
          <div key={d.t} title={`${label(d.t)}: ${d.v} visitors`} style={{ flex: 1, minWidth: 2, height: `${(d.v / max) * 100}%`, background: C.accent, opacity: 0.85, borderRadius: '3px 3px 0 0' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: C.sub }}>
        <span>{label(data[0].t)}</span><span>peak {max}</span><span>{label(data[data.length - 1].t)}</span>
      </div>
    </div>
  )
}

function WeekHeat({ adminKey }) {
  const [week, setWeek] = useState(0)
  const [grid, setGrid] = useState(null)
  useEffect(() => {
    let live = true
    fetch(`/api/stats?grid=week&week=${week}`, { headers: { 'x-admin-key': adminKey } })
      .then(r => (r.ok ? r.json() : null)).then(g => { if (live) setGrid(g) })
    return () => { live = false }
  }, [week, adminKey])
  const max = Math.max(1, ...(grid?.days || []).flatMap(d => d.hours))
  const label = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' })
  const range = grid ? `${label(grid.days[0].date)} – ${label(grid.days[6].date)}` : ''
  const btn = dis => ({ border: `1px solid ${C.line}`, background: C.card, borderRadius: 6, padding: '4px 10px', fontSize: 13, cursor: dis ? 'default' : 'pointer', opacity: dis ? 0.4 : 1, fontFamily: SANS })
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <button style={btn(false)} onClick={() => setWeek(w => w + 1)}>← Earlier</button>
        <button style={btn(week === 0)} disabled={week === 0} onClick={() => setWeek(w => Math.max(0, w - 1))}>Later →</button>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{week === 0 ? 'This week' : week === 1 ? 'Last week' : `${week} weeks ago`}</span>
        <span style={{ fontSize: 13, color: C.sub }}>{range}</span>
      </div>
      {!grid ? <Empty /> : (
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '96px repeat(24, minmax(12px, 1fr)) 44px', gap: 2, fontSize: 10, color: C.sub, minWidth: 560, alignItems: 'center' }}>
            <span />{Array.from({ length: 24 }, (_, h) => <span key={h} style={{ textAlign: 'center' }}>{h % 3 === 0 ? (h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`) : ''}</span>)}<span style={{ textAlign: 'right' }}>people</span>
            {grid.days.map(d => [
              <span key={d.date} style={{ fontSize: 12, color: C.ink }}>{label(d.date)}</span>,
              ...d.hours.map((v, h) => (
                <div key={d.date + h} title={`${label(d.date)}, ${h}:00–${h + 1}:00 · ${v} ${v === 1 ? 'person' : 'people'}`}
                  style={{ aspectRatio: '1', borderRadius: 2, background: v ? `rgba(59,108,246,${0.2 + 0.8 * (v / max)})` : '#f0f1f4' }} />
              )),
              <span key={d.date + 't'} style={{ textAlign: 'right', fontSize: 12, fontWeight: 600, color: d.total ? C.ink : C.sub }}>{d.total}</span>,
            ])}
          </div>
        </div>
      )}
      <p style={{ margin: '10px 0 0', fontSize: 11, color: C.sub }}>Pacific time. Hover a square for the exact hour. Bots from data centers are excluded.</p>
    </div>
  )
}

function Table({ cols, rows }) {
  if (!rows.length) return <Empty />
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead><tr>{cols.map((c, i) => <th key={c} style={{ textAlign: i ? 'right' : 'left', fontWeight: 500, color: C.sub, padding: '0 0 8px', borderBottom: `1px solid ${C.line}` }}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, j) => <tr key={j}>{r.map((v, i) => <td key={i} style={{ textAlign: i ? 'right' : 'left', padding: '8px 0', borderBottom: `1px solid ${C.line}`, color: C.ink, maxWidth: i ? undefined : 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</td>)}</tr>)}</tbody>
    </table>
  )
}

const Empty = () => <p style={{ margin: 0, fontSize: 13, color: C.sub }}>No data yet.</p>

const when = t => new Date(t).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
const ago = t => { const m = Math.round((Date.now() - new Date(t)) / 60000); return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago` }
const place = v => [v.city, v.region, v.country].filter(Boolean).join(', ') || 'Unknown location'

function VisitLog({ visits: all }) {
  const [open, setOpen] = useState(null)
  const [showBots, setShowBots] = useState(false)
  if (!all?.length) return <Empty />
  const bots = all.filter(v => v.likelyBot).length
  const visits = showBots ? all : all.filter(v => !v.likelyBot)
  return (
    <div style={{ display: 'grid', gap: 8, overflowX: 'auto' }}>
      {bots > 0 && (
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: C.sub, cursor: 'pointer' }}>
          <input type="checkbox" checked={showBots} onChange={e => setShowBots(e.target.checked)} />
          Show {bots} likely bot visit{bots > 1 ? 's' : ''} (from cloud data-center locations)
        </label>
      )}
      {!visits.length && <Empty />}
      {visits.map(v => {
        const isOpen = open === (v.vid + v.start)
        return (
          <div key={(v.vid + v.start)} style={{ minWidth: 680, border: `1px solid ${C.line}`, borderRadius: 10, background: isOpen ? '#fafbfc' : C.card }}>
            <button onClick={() => setOpen(isOpen ? null : (v.vid + v.start))} style={{ all: 'unset', boxSizing: 'border-box', width: '100%', cursor: 'pointer', padding: '12px 14px', display: 'grid', gridTemplateColumns: '190px 110px minmax(150px, 1fr) 64px 110px 14px', gap: 12, alignItems: 'center', fontFamily: SANS, fontSize: 13 }}>
              <span style={{ whiteSpace: 'nowrap' }}><strong style={{ fontWeight: 600 }}>{when(v.start)}</strong><span style={{ color: C.sub }}> · {ago(v.start)}</span></span>
              <span style={{ whiteSpace: 'nowrap' }}><span style={{ color: C.sub }}>Stayed </span><strong style={{ fontWeight: 600 }}>{fmt(v.totalSecs)}</strong><span style={{ color: C.sub }}> · {v.pages.length} pg</span></span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place(v)}{v.likelyBot && <span style={{ marginLeft: 6, fontSize: 11, color: C.warn }}>likely bot</span>}</span>
              <span style={{ color: C.sub }}>{v.device}</span>
              <span style={{ color: v.visitNo > 1 ? C.good : C.sub, whiteSpace: 'nowrap' }}>{v.visitNo > 1 ? `Return visit #${v.visitNo}` : 'First visit'}</span>
              <span style={{ color: C.sub, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}>›</span>
            </button>
            {isOpen && (
              <div style={{ padding: '0 14px 14px' }}>
                <p style={{ margin: '0 0 10px', fontSize: 12, color: C.sub }}>Came from <strong style={{ color: C.ink, fontWeight: 500 }}>{v.source || 'Direct'}</strong> · left {when(v.end)}</p>
                <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
                  {v.pages.map((p, i) => (
                    <li key={i} style={{ display: 'grid', gridTemplateColumns: '72px 96px 1fr', gap: 12, alignItems: 'baseline', fontSize: 13, padding: '8px 10px', background: C.card, border: `1px solid ${C.line}`, borderRadius: 8 }}>
                      <span style={{ color: C.sub, fontVariantNumeric: 'tabular-nums' }}>{new Date(p.at).toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' })}</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}><span style={{ color: C.sub }}>stayed </span><strong style={{ fontWeight: 600 }}>{fmt(p.secs)}</strong></span>
                      <span>
                        <strong style={{ fontWeight: 600 }}>{p.name}</strong>
                        {p.scroll != null && <span style={{ color: C.sub }}> · scrolled {p.scroll}%</span>}
                        {p.clicks.length > 0 && <span style={{ display: 'block', marginTop: 3, color: C.sub, fontSize: 12 }}>Clicked: {p.clicks.join(', ')}</span>}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Kpi({ label, value, note }) {
  return (
    <Card>
      <p style={{ margin: 0, fontSize: 12, color: C.sub }}>{label}</p>
      <p style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 600, color: C.ink, letterSpacing: '-0.02em' }}>{value}</p>
      {note && <p style={{ margin: '4px 0 0', fontSize: 12, color: C.sub }}>{note}</p>}
    </Card>
  )
}

export default function Admin() {
  const [key, setKey] = useState(() => { try { return localStorage.getItem('fc_admin_key') || '' } catch { return '' } })
  const [draft, setDraft] = useState('')
  const [days, setDays] = useState(7)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    try { localStorage.setItem('fc_no_track', '1') } catch { /* ignore */ }
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'; document.head.appendChild(m)
    return () => m.remove()
  }, [])

  useEffect(() => {
    if (!key) return
    let live = true
    fetch(`/api/stats?days=${days}`, { headers: { 'x-admin-key': key } })
      .then(r => (r.status === 401 ? Promise.reject(new Error('Wrong key')) : r.ok ? r.json() : Promise.reject(new Error(`Server error ${r.status}`))))
      .then(d => { if (live) { setData(d); setError('') } })
      .catch(e => { if (!live) return; setError(e.message); if (e.message === 'Wrong key') { setKey(''); try { localStorage.removeItem('fc_admin_key') } catch { /* ignore */ } } })
    return () => { live = false }
  }, [key, days])

  const page = { minHeight: '100vh', background: C.bg, color: C.ink, fontFamily: SANS, padding: 'clamp(16px, 4vw, 40px)' }

  if (!key) return (
    <div style={{ ...page, display: 'grid', placeItems: 'center' }}>
      <form onSubmit={e => { e.preventDefault(); try { localStorage.setItem('fc_admin_key', draft) } catch { /* ignore */ } setKey(draft) }}
        style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 28, width: 'min(360px, 100%)' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 20 }}>Site analytics</h1>
        <p style={{ margin: '0 0 18px', fontSize: 13, color: C.sub }}>Enter your admin key.</p>
        <input type="password" value={draft} onChange={e => setDraft(e.target.value)} autoFocus
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 14, fontFamily: SANS }} />
        {error && <p style={{ margin: '10px 0 0', fontSize: 13, color: '#dc2626' }}>{error}</p>}
        <button style={{ marginTop: 14, width: '100%', padding: '10px', border: 0, borderRadius: 8, background: C.ink, color: '#fff', fontSize: 14, cursor: 'pointer' }}>Open dashboard</button>
      </form>
    </div>
  )

  const s = data?.summary
  const change = s && s.prevVisitors ? Math.round(((s.visitors - s.prevVisitors) / s.prevVisitors) * 100) : null
  return (
    <div style={page}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <header style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, letterSpacing: '-0.01em' }}>Site analytics</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: C.sub }}>finnickchen.site · times in Pacific · your own visits are excluded</p>
          </div>
          <div style={{ display: 'flex', gap: 4, background: C.card, border: `1px solid ${C.line}`, borderRadius: 8, padding: 3 }}>
            {[1, 7, 30, 90].map(d => (
              <button key={d} onClick={() => setDays(d)} style={{ border: 0, borderRadius: 6, padding: '6px 12px', fontSize: 13, cursor: 'pointer', fontFamily: SANS, background: days === d ? C.ink : 'transparent', color: days === d ? '#fff' : C.sub }}>
                {d === 1 ? '24h' : `${d}d`}
              </button>
            ))}
          </div>
        </header>

        {error && <p style={{ color: '#dc2626', fontSize: 14 }}>{error}</p>}
        {!data ? <p style={{ color: C.sub, fontSize: 14 }}>Loading…</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
            <Kpi label="Visitors" value={s.visitors} note={change == null ? 'no previous period' : `${change >= 0 ? '+' : ''}${change}% vs previous`} />
            <Kpi label="Page views" value={s.pageviews} note={`${s.pagesPerSession} pages per visit`} />
            <Kpi label="Avg. visit length" value={fmt(s.avgSessionSec)} note={`${s.sessions} visits`} />
            <Kpi label="Opened a case study" value={`${s.workReachRate}%`} note={`${s.bounceRate}% left within 10s`} />

            <section style={{ gridColumn: '1 / -1', background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, color: C.sub }}>Insights and suggestions</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {data.insights.map((i, n) => (
                  <div key={n} style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 8, background: '#fafbfc', borderLeft: `3px solid ${C[i.level]}` }}>
                    <div><p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{i.title}</p><p style={{ margin: '3px 0 0', fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{i.detail}</p></div>
                  </div>
                ))}
              </div>
            </section>

            <div style={{ gridColumn: '1 / -1' }}>
              <Card title={`Every visit · ${data.visits?.filter(v => !v.likelyBot).length || 0} people in this period · click one to see its path`}><VisitLog visits={data.visits} /></Card>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 16 }}>
              <Card title="Visitors per hour · last 48h"><Bars data={data.hourly} label={t => `${t.slice(5, 10)} ${t.slice(11)}:00`} /></Card>
              <Card title="Visitors per day · last 30 days"><Bars data={data.daily} label={t => t.slice(5)} /></Card>
              <Card title="Visitors per week · last 12 weeks"><Bars data={data.weekly} label={t => `wk of ${t.slice(5)}`} /></Card>
            </div>

            <div style={{ gridColumn: '1 / -1' }}><Card title="When people visit · by date and hour"><WeekHeat adminKey={key} /></Card></div>

            <div style={{ gridColumn: '1 / -1' }}>
              <Card title="Pages · time on page and scroll depth">
                <Table cols={['Page', 'Views', 'Visitors', 'Avg. time', 'Avg. scroll']} rows={data.pages.map(p => [p.name, p.views, p.visitors, fmt(p.avg_sec), p.avg_scroll == null ? '–' : `${p.avg_scroll}%`])} />
              </Card>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 16 }}>
              <Card title="Cities"><Table cols={['City', 'Visitors']} rows={data.cities.map(c => [[c.city, c.region, c.country].filter(Boolean).join(', '), c.v])} /></Card>
              <Card title="Top interactions"><Table cols={['Clicked', 'Page', 'Count']} rows={data.clicks.map(c => [c.label, c.path, c.n])} /></Card>
              <Card title="Sources"><Table cols={['Source', 'Visitors']} rows={data.referrers.map(r => [r.source, r.v])} /></Card>
              <Card title="Devices"><Table cols={['Device', 'Visitors']} rows={data.devices.map(d => [d.device, d.v])} /></Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
