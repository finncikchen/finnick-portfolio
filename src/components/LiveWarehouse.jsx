import { useRef, useState, useEffect } from 'react'
import robotIcon from '../assets/images/bytedance/pin/robot.webp'

// RMS V2.0 "Warehouse" screen, rebuilt from the Figma components so the robots can move.
// Sized for the Cisco monitor mockup (screen area 1267 x 618).
const UI = "Inter, 'PingFang SC', sans-serif"
const BLUE = '#165dff'
const GRAY = '#86909c'

// Pin colors taken from the Figma robot pin (dark / light pairs per status)
const PIN = {
  run: ['#00b42a', '#23c343'],
  alarm: ['#cb272d', '#f76560'],
  chg: ['#165dff', '#4080ff'],
  idle: ['#ff7d00', '#ffb65d'],
}

// Floor plan: shelf rows on a 900 x 520 map
const SHELF_ROWS = [60, 130, 200, 290, 360, 430]
const SHELF_COLS = [[70, 380], [440, 830]]

// Every route is a closed loop through the aisles, so the heading arrow always faces the way the robot travels
const ROBOTS = [
  { id: '22-EVT1', net: 4, bat: 86, s: 'run', d: 'M60,95 H390 V165 H60 Z', dur: 18 },
  { id: '16-EVT1', net: 3, bat: 64, s: 'run', d: 'M430,95 H840 V250 H430 Z', dur: 22 },
  { id: '27-EVT1', net: 4, bat: 32, s: 'chg', d: 'M410,40 V480 H420 V40 Z', dur: 16 },
  { id: '23-EVT1', net: 1, bat: 12, s: 'alarm', d: 'M60,250 H400 V325 H60 Z', dur: 20 },
  { id: '20-EVT1', net: 2, bat: 71, s: 'run', d: 'M840,325 H430 V395 H840 Z', dur: 19 },
  { id: '28-EVT1', net: 3, bat: 95, s: 'idle', d: 'M60,395 H390 V465 H60 Z', dur: 26 },
  { id: '12-EVT1', net: 4, bat: 48, s: 'run', d: 'M430,465 H840 V395 H430 Z', dur: 24 },
  { id: '13-EVT1', net: 2, bat: 22, s: 'alarm', d: 'M840,40 V250 H430 V40 Z', dur: 30 },
]

// The Figma robot pin: soft halo, blurred ring, gradient disc, top-down robot, and a heading arrow on the rim.
// Drawn facing +x; animateMotion rotate="auto" turns it along the route.
function PinBody({ s, k }) {
  const [dark, light] = PIN[s]
  const g = `lw-g-${k}`, a = `lw-a-${k}`
  return (
    <g>
      <defs>
        <radialGradient id={g}><stop offset="0" stopColor={dark} /><stop offset="1" stopColor={light} /></radialGradient>
        <linearGradient id={a} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={dark} /><stop offset="1" stopColor={light} /></linearGradient>
      </defs>
      <circle r="15" fill={dark} fillOpacity="0.17" stroke={dark} strokeOpacity="0.1" />
      <circle r="11.6" fill="none" stroke={dark} strokeWidth="0.8" style={{ filter: 'blur(0.9px)' }} />
      <circle r="12" fill={`url(#${g})`} stroke={dark} strokeWidth="0.4" />
      <image href={robotIcon} x="-9" y="-5.6" width="18" height="11.2" />
      {/* heading arrow */}
      <path d="M19.5,0 L14.2,-4.4 Q15.6,0 14.2,4.4 Z" fill={`url(#${a})`} />
    </g>
  )
}

function WarehouseMap() {
  return (
    <svg viewBox="0 0 900 520" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid slice">
      {/* floor: tinted slab with a light dot pattern and a hairline wall */}
      <defs>
        <pattern id="lw-dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#d4dcea" /></pattern>
      </defs>
      <rect x="0" y="0" width="900" height="520" fill="#f1f4f9" />
      <rect x="0" y="0" width="900" height="520" fill="url(#lw-dots)" />
      {/* racks: back-to-back shelving, each side a row of bays */}
      {SHELF_ROWS.map(y => SHELF_COLS.map(([x0, x1]) => {
        const n = Math.floor((x1 - x0 + 4) / 24)
        return (
          <g key={`${y}-${x0}`}>
            {Array.from({ length: n }, (_, k) => (
              <g key={k}>
                <rect x={x0 + k * 24} y={y + 11} width="20" height="8" rx="2" fill="#cfd8e7" />
                <rect x={x0 + k * 24} y={y + 21} width="20" height="8" rx="2" fill="#dbe2ee" />
              </g>
            ))}
          </g>
        )
      }))}
      {ROBOTS.map((r, k) => {
        const motion = { dur: `${r.dur}s`, repeatCount: 'indefinite', path: r.d, begin: `-${k * 2.3}s` }
        return (
          <g key={r.id}>
            <g><animateMotion {...motion} rotate="auto" /><PinBody s={r.s} k={k} /></g>
            <g>
              <animateMotion {...motion} />
              <rect x="-22" y="17" width="44" height="13" rx="6.5" fill="#fff" stroke="#e5e6eb" />
              <text y="26.5" textAnchor="middle" fontFamily={UI} fontSize="8.5" fill="#4e5969">{r.id}</text>
            </g>
          </g>
        )
      })}
    </svg>
  )
}


function Check({ on, mixed, onClick }) {
  return (
    <span onClick={onClick} role="checkbox" aria-checked={mixed ? 'mixed' : on} style={{ width: 11, height: 11, borderRadius: 2, boxSizing: 'border-box', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: on || mixed ? 'none' : '1px solid #c9cdd4', background: on || mixed ? BLUE : '#fff' }}>
      {on && <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      {mixed && !on && <span style={{ width: 5, height: 1.5, background: '#fff', borderRadius: 1 }} />}
    </span>
  )
}

function Signal({ n }) {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" style={{ display: 'block' }}>
      {[0, 1, 2, 3].map(i => <rect key={i} x={i * 3.6} y={7 - i * 2.2} width="2.4" height={3 + i * 2.2} rx="0.6" fill={i < n ? (n <= 1 ? '#f53f3f' : '#4e5969') : '#e5e6eb'} />)}
    </svg>
  )
}

function Battery({ v }) {
  const c = v < 20 ? '#f53f3f' : v < 50 ? '#ff7d00' : '#00b42a'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ position: 'relative', width: 18, height: 9, borderRadius: 2, border: '1px solid #c9cdd4', boxSizing: 'border-box', padding: 1 }}>
        <span style={{ display: 'block', height: '100%', width: `${v}%`, background: c, borderRadius: 1 }} />
        <span style={{ position: 'absolute', right: -3, top: 2, width: 2, height: 3, borderRadius: 1, background: '#c9cdd4' }} />
      </span>
      <span style={{ color: '#4e5969' }}>{v}%</span>
    </span>
  )
}

function Card({ children, style }) {
  return <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(20,40,90,0.06)', ...style }}>{children}</div>
}
const title = { fontSize: 13, fontWeight: 600, color: '#1d2129', borderLeft: `2px solid ${BLUE}`, paddingLeft: 6, margin: 0 }
const seg = (a, b) => (
  <span style={{ fontSize: 10, background: '#f2f3f5', borderRadius: 4, padding: 2, whiteSpace: 'nowrap' }}>
    <span style={{ background: '#fff', color: BLUE, borderRadius: 3, padding: '2px 6px' }}>{a}</span>
    <span style={{ color: '#4e5969', padding: '2px 6px' }}>{b}</span>
  </span>
)

export default function LiveWarehouse() {
  const rows = ROBOTS.slice(0, 5)
  const [sel, setSel] = useState(() => new Set([rows[0].id, rows[2].id]))
  const all = sel.size === rows.length
  const toggle = id => setSel(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAll = () => setSel(all ? new Set() : new Set(rows.map(r => r.id)))
  const metric = (k, v) => (
    <div style={{ background: '#f7f8fa', borderRadius: 4, padding: '7px 4px', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: GRAY }}>{k}</div>
      <div style={{ fontSize: 11, color: '#1d2129', marginTop: 2 }}>{v}</div>
    </div>
  )
  const chip = (k, v, c, bg) => (
    <div style={{ background: bg, borderRadius: 4, padding: '7px 4px', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: c }}>● {k}</div>
      <div style={{ fontSize: 11, color: '#1d2129', marginTop: 2 }}>{v}</div>
    </div>
  )
  const cols = '14px 1.1fr 0.5fr 1fr 0.6fr 0.7fr 1.1fr'
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 10, padding: 10, fontFamily: UI, background: 'linear-gradient(160deg, #eef3fb 0%, #e6edf8 100%)', overflow: 'hidden' }}>
      {/* left column */}
      <div style={{ flex: '0 0 30%', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        <Card style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: '#1d2129' }}>Warehouse</span>
            <span style={{ fontSize: 10, color: '#4e5969', background: '#f2f3f5', borderRadius: 4, padding: '2px 8px' }}>Picking ▾</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 9, color: GRAY }}>
            2024-01-01 Monday 12:00:00
            <span style={{ marginLeft: 'auto', color: '#f53f3f', background: '#ffece8', borderRadius: 4, padding: '2px 6px' }}>Stop Work</span>
            <span style={{ color: '#ff7d00', background: '#fff7e8', borderRadius: 4, padding: '2px 6px' }}>Stop Collection</span>
          </div>
        </Card>
        <Card style={{ padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={title}>Real-time Data</p>{seg('Pick First', 'Sort while picking')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5 }}>
            {metric('Efficiency', '50 pcs/h')}{metric('Avg Time', '20 min')}{metric('Cart', '50 pcs/h')}{metric('Progress', '50%')}
            {metric('Completed', '50 Orders')}{metric('Created', '90 Orders')}{metric('In Progress', '30 Orders')}{metric('Cancelled', '10 Orders')}
            {chip('Running', '50 Units', '#00b42a', '#e8ffea')}{chip('No Tasks', '20 Units', '#ff9a2e', '#fff7e8')}{chip('Offline', '10 Units', '#f53f3f', '#ffece8')}{chip('Charging', '10 Units', BLUE, '#e8f3ff')}
          </div>
        </Card>
        <Card style={{ padding: 12, flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <p style={title}>Device</p>{seg('Robot', 'Charging Station')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: GRAY, marginBottom: 6 }}>
            <span onClick={toggleAll} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer', color: '#4e5969' }}><Check on={all} mixed={sel.size > 0 && !all} onClick={() => {}} />Select All{sel.size > 0 && <span style={{ color: GRAY }}>({sel.size})</span>}</span><span style={{ border: '1px solid #e5e6eb', borderRadius: 4, padding: '1px 6px' }}>One-Click Operation ▾</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 4, fontSize: 9, color: '#4e5969', background: '#f7f8fa', borderRadius: 4, padding: '6px 6px' }}>
            <Check on={all} mixed={sel.size > 0 && !all} onClick={toggleAll} /><span>Name</span><span>Floor</span><span>Task Status</span><span>Status</span><span>Network</span><span>Battery</span>
          </div>
          {rows.map(r => (
            <div key={r.id} onClick={() => toggle(r.id)} style={{ display: 'grid', gridTemplateColumns: cols, gap: 4, alignItems: 'center', fontSize: 9, color: GRAY, padding: '6px', borderBottom: '1px solid #f2f3f5', cursor: 'pointer', background: sel.has(r.id) ? '#f2f7ff' : 'transparent' }}>
              <Check on={sel.has(r.id)} onClick={() => {}} />
              <span style={{ color: '#1d2129' }}>{r.id}</span><span>F1</span>
              <span style={{ color: r.s === 'idle' ? GRAY : r.s === 'alarm' ? '#f53f3f' : '#00b42a', background: r.s === 'idle' ? '#f2f3f5' : r.s === 'alarm' ? '#ffece8' : '#e8ffea', borderRadius: 3, padding: '1px 4px', justifySelf: 'start' }}>{{ run: 'Busy', chg: 'Charging', alarm: 'Error', idle: 'Idle' }[r.s]}</span>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: PIN[r.s][1] }} />
              <Signal n={r.net} />
              <Battery v={r.bat} />
            </div>
          ))}
        </Card>
        <Card style={{ padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={title}>Abnormal Alarm</p>
          <span style={{ fontSize: 9, color: GRAY, display: 'flex', gap: 6 }}>Today <span style={{ color: BLUE, background: '#e8f3ff', borderRadius: 3, padding: '0 4px' }}>Three days</span> Priority ▾</span>
        </Card>
      </div>

      {/* map */}
      <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Card style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, background: '#f2f3f5', borderRadius: 4, padding: 2, display: 'inline-flex' }}>
            {['F1', 'F2', 'F3'].map((f, k) => (
              <span key={f} style={{ padding: '2px 10px', borderRadius: 3, background: k === 0 ? '#fff' : 'transparent', color: k === 0 ? BLUE : '#4e5969', boxShadow: k === 0 ? '0 1px 2px rgba(0,0,0,0.08)' : 'none' }}>{f}</span>
            ))}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#4e5969', border: '1px solid #e5e6eb', borderRadius: 4, padding: '2px 8px' }}>Location Inf ▴</span>
        </Card>
        <Card style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <WarehouseMap />
          <div style={{ position: 'absolute', right: 16, top: 16, width: 112, background: '#fff', borderRadius: 6, padding: '4px 0', boxShadow: '0 2px 10px rgba(20,40,90,0.12)', fontSize: 10, color: '#4e5969' }}>
            {['Picking Point', 'Packing Point', 'Waiting Point'].map((t, k) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: k === 0 ? '#f2f3f5' : '#fff' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', border: `2px solid ${BLUE}`, boxSizing: 'border-box' }} />{t}
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ height: 30, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
          <span style={{ ...title, fontSize: 11 }}>26-EVT1 Practical Operation</span>
          <span style={{ fontSize: 10, color: BLUE, background: '#e8f3ff', borderRadius: 4, padding: '2px 8px' }}>Sort while picking</span>
        </Card>
      </div>
    </div>
  )
}

// Scales the fixed 1267 x 618 screen to fill whatever box it sits in
export function ScaledWarehouse() {
  const ref = useRef(null)
  const [k, setK] = useState(0.5)
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / 1267))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1267, height: 618, transformOrigin: '0 0', transform: `scale(${k})` }}>
        <LiveWarehouse />
      </div>
    </div>
  )
}
