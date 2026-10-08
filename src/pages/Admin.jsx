import { useEffect, useState } from 'react'

// Private traffic dashboard. Reads /api/stats with the admin key; opening it also opts this
// browser out of tracking so your own visits don't skew the numbers.
const SANS = 'Inter, sans-serif'
const C = { bg: '#f6f7f9', card: '#fff', ink: '#14161b', sub: '#6b7180', line: '#e7e9ee', accent: '#3b6cf6', good: '#16a34a', warn: '#d97706', info: '#3b6cf6' }
const fmt = s => (s == null ? '–' : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`)
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

function Heat({ cells }) {
  const max = Math.max(1, ...cells.map(c => c.v))
  const get = (d, h) => cells.find(c => c.dow === d && c.h === h)?.v || 0
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '32px repeat(24, minmax(10px, 1fr))', gap: 2, fontSize: 10, color: C.sub, minWidth: 360 }}>
        <span />{Array.from({ length: 24 }, (_, h) => <span key={h} style={{ textAlign: 'center' }}>{h % 6 === 0 ? h : ''}</span>)}
        {DOW.map((d, i) => [
          <span key={d}>{d}</span>,
          ...Array.from({ length: 24 }, (_, h) => {
            const v = get(i, h)
            return <div key={d + h} title={`${d} ${h}:00 · ${v}`} style={{ aspectRatio: '1', borderRadius: 2, background: v ? `rgba(59,108,246,${0.15 + 0.85 * (v / max)})` : '#f0f1f4' }} />
          }),
        ])}
      </div>
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

            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 16 }}>
              <Card title="Visitors per hour · last 48h"><Bars data={data.hourly} label={t => `${t.slice(5, 10)} ${t.slice(11)}:00`} /></Card>
              <Card title="Visitors per day · last 30 days"><Bars data={data.daily} label={t => t.slice(5)} /></Card>
              <Card title="Visitors per week · last 12 weeks"><Bars data={data.weekly} label={t => `wk of ${t.slice(5)}`} /></Card>
            </div>

            <div style={{ gridColumn: '1 / -1' }}><Card title="When people visit · day × hour"><Heat cells={data.hourOfDay} /></Card></div>

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
