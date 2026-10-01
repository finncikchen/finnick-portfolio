import { useEffect, useRef, useState } from 'react'

// Scales the 1440 x 900 canvas to its container width
export function Scaled({ children, w = 1440, h = 900, style }) {
  const ref = useRef(null)
  const [k, setK] = useState(0.5)
  useEffect(() => { const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / w)); ro.observe(ref.current); return () => ro.disconnect() }, [w])
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', aspectRatio: `${w} / ${h}`, overflow: 'hidden', ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transform: `scale(${k})`, transformOrigin: '0 0' }}>{children}</div>
    </div>
  )
}
import { C, FONT, BoschLogo, Field, KEYFRAMES } from './kit'

// Phase 1 hi-fi dashboard, rebuilt live. Canvas 1440 x 900.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
const DATA = {
  dp: {
    kpi: [['Overdue 6 months', '740 items', 165, '+0.10%', '#f39200'], ['Total overdue', '1,123 items', 211, '-0.25%', '#d6009f'], ['Open', '12,123 items', 603, '-0.15%', '#35c4c0']],
    lines: [[140, 160, 150, 250, 330, 360, 340, 380], [80, 100, 120, 140, 150, 160, 200, 230], [40, 60, 90, 100, 110, 115, 190, 175]],
    aging: [300, 102, 45], entities: [['RBCN', 42, 18, 9], ['RBCC', 30, 14, 6], ['ABCD', 26, 12, 8], ['RBCG', 22, 10, 4], ['AABB', 18, 9, 5], ['QWER', 15, 8, 3], ['RBSH', 12, 6, 2]],
  },
  dep: {
    kpi: [['Overdue 6 months', '1,123 items', 123, '-1.5%', '#f39200'], ['Total overdue', '1,123 items', 246, '-0.25%', '#d6009f'], ['Open', '1,123 items', 189, '+0.10%', '#35c4c0']],
    lines: [[130, 150, 135, 260, 320, 350, 300, 370], [70, 95, 110, 140, 130, 150, 220, 225], [30, 45, 90, 95, 120, 110, 160, 150]],
    aging: [220, 140, 80], entities: [['RBCN', 36, 20, 12], ['RBCC', 34, 12, 8], ['ABCD', 20, 16, 6], ['RBCG', 24, 8, 6], ['AABB', 14, 10, 7], ['QWER', 18, 6, 4], ['RBSH', 10, 8, 3]],
  },
}
const T = ({ children, c = C.text, s = 13, w = 400, style }) => <span style={{ fontFamily: FONT, fontSize: s, color: c, fontWeight: w, ...style }}>{children}</span>

function useCount(to, key) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf, t0
    const tick = t => { t0 ??= t; const p = Math.min(1, (t - t0) / 1100); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, key])
  return v
}

function Kpi({ title, items, value, delta, color, k, alert }) {
  const v = useCount(value, k)
  const up = delta.startsWith('+')
  return (
    <div style={{ background: '#fff', borderRadius: 6, padding: '16px 18px', flex: 1, border: alert ? `1px solid ${C.redSoft}` : '1px solid #eceef1' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{!alert && <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />}<T s={14} w={alert ? 700 : 500} c={alert ? C.red : C.ink}>{title}</T></div>
      <T s={12} c={C.sub}>{items}</T>
      <div style={{ margin: '10px 0 6px' }}><T s={14} c={alert ? C.red : C.ink}>¥</T><T s={28} w={700} c={alert ? C.red : C.ink}>{Math.round(v).toLocaleString('en-US')}k</T></div>
      <T s={12} w={600} c={up ? C.red : C.green}>{up ? '↑' : '↓'} {delta}</T> <T s={11.5} c={C.faint} style={{ marginLeft: 6 }}>since last month</T>
    </div>
  )
}

function Overview({ lines, hover, k }) {
  const W = 760, H = 230, px = i => 40 + i * ((W - 60) / 7), py = v => H - 20 - v * ((H - 40) / 400)
  const cols = ['#35c4c0', '#d6009f', '#f39200']
  const path = arr => arr.map((v, i) => `${i ? 'L' : 'M'}${px(i)},${py(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} width="100%" style={{ display: 'block' }}>
      <defs>{cols.map((c, i) => <linearGradient key={c} id={`bkg${i}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={c} stopOpacity={i === 0 ? 0.22 : 0.12} /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient>)}</defs>
      {[0, 100, 200, 300, 400].map(v => <g key={v}><line x1="40" x2={W - 20} y1={py(v)} y2={py(v)} stroke="#eef0f3" /><text x="30" y={py(v) + 4} fontSize="11" fill={C.faint} textAnchor="end" fontFamily={FONT}>{v}k</text></g>)}
      {MONTHS.map((m, i) => <text key={m} x={px(i)} y={H + 12} fontSize="11.5" fill={C.sub} textAnchor="middle" fontFamily={FONT}>{m}</text>)}
      {lines.map((arr, i) => <path key={'a' + i + k} d={`${path(arr)} L${px(7)},${py(0)} L${px(0)},${py(0)} Z`} fill={`url(#bkg${i})`} style={{ animation: 'bkFade 1.2s .4s both' }} />)}
      {lines.map((arr, i) => <path key={'l' + i + k} d={path(arr)} fill="none" stroke={cols[i]} strokeWidth="2.2" strokeLinejoin="round" pathLength="1" strokeDasharray="1" style={{ animation: 'bkDraw 1.4s cubic-bezier(.4,0,.2,1) both' }} />)}
      {hover != null && (
        <g style={{ transition: 'transform .6s cubic-bezier(.5,0,.2,1)', transform: `translateX(${px(hover)}px)` }}>
          <line x1="0" x2="0" y1="14" y2={H - 20} stroke={C.ink} strokeWidth="1.2" />
          <circle cx="0" cy={H - 20} r="5" fill="#fff" stroke={C.ink} strokeWidth="2" />
          {lines.map((arr, i) => <circle key={i} cx="0" cy={py(arr[hover])} r="4" fill="#fff" stroke={cols[i]} strokeWidth="2" style={{ transition: 'cy .6s' }} />)}
          <g transform={`translate(${hover > 4 ? -172 : 12}, 18)`}>
            <rect width="160" height="84" rx="4" fill="#16263a" />
            <text x="12" y="20" fontSize="11" fill="#9fb0c4" fontFamily={FONT}>2025{String(hover + 1).padStart(2, '0')} · Down payment</text>
            {['Open', 'Total overdue', 'Overdue 6 months'].map((t, i) => <g key={t} transform={`translate(12, ${38 + i * 17})`}><rect y="-7" width="7" height="7" fill={cols[i]} /><text x="13" fontSize="11.5" fill="#fff" fontFamily={FONT}>{t}</text><text x="136" fontSize="11.5" fill="#fff" fontWeight="700" textAnchor="end" fontFamily={FONT}>{lines[i][hover]}k</text></g>)}
          </g>
        </g>
      )}
    </svg>
  )
}

function Donut({ vals, k }) {
  const tot = vals.reduce((a, b) => a + b, 0), cols = ['#b8e0f6', '#3aa0dc', '#0a4f8a']
  let acc = 0
  return (
    <svg viewBox="0 0 200 150" width="100%">
      {vals.map((v, i) => { const f = v / tot, off = acc; acc += f; return <circle key={i + '' + k} cx="72" cy="75" r="46" fill="none" stroke={cols[i]} strokeWidth="22" pathLength="1" strokeDasharray={`${f} ${1 - f}`} strokeDashoffset={-off} transform="rotate(-90 72 75)" style={{ animation: `bkFade .6s ${i * 0.15}s both` }} /> })}
      <text x="72" y="72" fontSize="10" fill={C.sub} textAnchor="middle" fontFamily={FONT}>Total</text>
      <text x="72" y="88" fontSize="14" fontWeight="700" fill={C.ink} textAnchor="middle" fontFamily={FONT}>{tot}k</text>
      {['0-6 mth', '7-12 mth', '>12 mth'].map((t, i) => <g key={t} transform={`translate(140, ${52 + i * 20})`}><rect y="-8" width="9" height="9" fill={cols[i]} /><text x="14" fontSize="10.5" fill={C.text} fontFamily={FONT}>{t}</text></g>)}
    </svg>
  )
}

function Bars({ rows, k }) {
  const cols = ['#b8e0f6', '#3aa0dc', '#0a4f8a']
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 130, padding: '0 6px' }}>
      {rows.map(([n, ...v], i) => (
        <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column-reverse', height: 108 }}>
            {v.map((x, j) => <div key={j + '' + k} style={{ height: x * 1.55, background: cols[j], transformOrigin: 'bottom', animation: `bkGrow .7s ${0.2 + i * 0.05}s cubic-bezier(.3,0,.2,1) both` }} />)}
          </div>
          <T s={10.5} c={C.sub}>{n}</T>
        </div>))}
    </div>
  )
}

export default function Dashboard({ tab: tabProp, hover: hoverProp, auto = true }) {
  const [tab, setTab] = useState('dp')
  const [hover, setHover] = useState(4)
  useEffect(() => {
    if (!auto) return
    let i = 0
    const id = setInterval(() => { i++; setHover(h => (h + 1) % 8); if (i % 8 === 0) setTab(t => (t === 'dp' ? 'dep' : 'dp')) }, 1300)
    return () => clearInterval(id)
  }, [auto])
  const t = tabProp ?? tab, h = hoverProp ?? hover, d = DATA[t]
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      <style>{KEYFRAMES + '@keyframes bkDraw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}@keyframes bkGrow{from{transform:scaleY(0)}}'}</style>
      <div style={{ height: 60, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 28, borderBottom: `1px solid ${C.line}` }}>
        <BoschLogo /><T s={15} w={700} c={C.ink}>DOWN PAYMENT AND DEPOSIT PLATFORM</T>
        <span style={{ marginLeft: 'auto' }}><T c={C.sub}>Report month  |  </T><T c={C.blue} w={600}>Aug 2025 ▾</T></span>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: C.blueSoft, color: C.blue, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>CZ</span>
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ width: 210, background: '#fff', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12, borderRight: `1px solid ${C.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><T s={12} c={C.sub}>Filters</T><T s={12} c={C.blue}>↺ Reset</T></div>
          {['Legal entity', 'Company code', 'Cost centre', 'User', 'Vendor'].map(l => <Field key={l} label={l} placeholder="Select" select />)}
          <T s={12} c={C.sub}>Invoice expire period</T>
          {['0-6 months', '7-12 months', 'Over 12 months'].map(l => <div key={l} style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ width: 14, height: 14, borderRadius: 3, background: '#0a4f8a', color: '#fff', fontSize: 9, display: 'grid', placeItems: 'center' }}>✓</span><T s={12.5}>{l}</T></div>)}
          <div style={{ background: C.blue, color: '#fff', borderRadius: 4, textAlign: 'center', padding: 8, fontSize: 13 }}>Apply</div>
        </div>
        <div style={{ flex: 1, padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
            {[['dp', 'Down Payment'], ['dep', 'Deposit']].map(([k, l]) => <div key={k} style={{ padding: '9px 28px', borderRadius: '6px 6px 0 0', background: t === k ? '#fff' : '#e8eaee', fontSize: 14, fontWeight: t === k ? 600 : 400, color: t === k ? C.ink : C.sub, transition: 'all .3s' }}>{l}</div>)}
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: -14 }}>
            <Kpi title="Overdue in next month" items="24 items" value={6927} delta="-0.25%" alert k={t} />
            {d.kpi.map(([ti, it, v, de, c]) => <Kpi key={ti} title={ti} items={it} value={v} delta={de} color={c} k={t} />)}
          </div>
          <div style={{ background: '#fff', borderRadius: 6, padding: '14px 18px', border: '1px solid #eceef1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><T s={14} w={700} c={C.ink}>OVERVIEW</T><T s={12} c={C.blue}>Jan 2025  →  Aug 2025</T></div>
            <Overview lines={d.lines} hover={h} k={t} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 6, padding: '14px 18px', border: '1px solid #eceef1' }}><T s={13} w={600} c={C.ink}>Value by aging period</T><Donut vals={d.aging} k={t} /></div>
            <div style={{ background: '#fff', borderRadius: 6, padding: '14px 18px', border: '1px solid #eceef1' }}><div style={{ marginBottom: 10 }}><T s={13} w={600} c={C.ink}>Value by legal entity</T></div><Bars rows={d.entities} k={t} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
