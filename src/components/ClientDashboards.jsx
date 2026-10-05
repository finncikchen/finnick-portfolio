import { useRef, useState, useEffect } from 'react'
import robotBYD from '../assets/images/bytedance/robots/byd.webp'
import robotBD from '../assets/images/bytedance/robots/bytedance.webp'
import robotTT from '../assets/images/bytedance/robots/tiktok.webp'
import icRefresh from '../assets/images/bytedance/card/refresh.svg'
import icTabOn from '../assets/images/bytedance/card/tab-transport.svg'
import icTabOff from '../assets/images/bytedance/card/tab-select.svg'
import icRobot from '../assets/images/bytedance/card/robot-icon.svg'
import ellA from '../assets/images/bytedance/card/ellipse1219.svg'
import ellB from '../assets/images/bytedance/card/ellipse1218.svg'
import v0 from '../assets/images/bytedance/card/v0.svg'
import v1 from '../assets/images/bytedance/card/v1.svg'
import v2 from '../assets/images/bytedance/card/v2.svg'
import v3 from '../assets/images/bytedance/card/v3.svg'
import v4 from '../assets/images/bytedance/card/v4.svg'
import v5 from '../assets/images/bytedance/card/v5.svg'
import v6 from '../assets/images/bytedance/card/v6.svg'
import v7 from '../assets/images/bytedance/card/v7.svg'
import v8 from '../assets/images/bytedance/card/v8.svg'
import v9 from '../assets/images/bytedance/card/v9.svg'
import v10 from '../assets/images/bytedance/card/v10.svg'
import v11 from '../assets/images/bytedance/card/v11.svg'
import v12 from '../assets/images/bytedance/card/v12.svg'
import v13 from '../assets/images/bytedance/card/v13.svg'
import v14 from '../assets/images/bytedance/card/v14.svg'

// The three client dashboards, built on the exact spec of the banner "Dashboard" card
// (Figma node 2:4025, 450 x 216 units). Positions, colors, type and decoration all come
// from that node; only the fields per client differ.
const CW = 450, CH = 216
const PF = "'PingFang SC', Inter, sans-serif"
const C = { title: '#111827', label: '#556174', unit: '#748094', num: '#111827', blue: '#2563ff', tab: '#667085', panel: '#f2f8ff', robotBg: '#f1f8ff', line: '#dcebfa' }
const abs = (s) => ({ position: 'absolute', ...s })

// Wave lines from the banner robot card: [svg, left, top, boxW, boxH, rotate, skew, w, h]
const WAVES = [
  [v0, -8.36, -97.5, 316.55, 212.984, -17.87, -1.96, 296.019, 127.033],
  [v1, -8.8, -88.64, 314.485, 203.402, -15.82, -1.88, 295.15, 126.652],
  [v2, -9.25, -79.71, 312.062, 193.598, -13.78, -1.79, 294.299, 126.263],
  [v3, -9.69, -70.74, 309.287, 183.585, -11.73, -1.69, 293.465, 125.866],
  [v4, -10.14, -61.73, 306.163, 173.378, -9.67, -1.58, 292.653, 125.46],
  [v5, -10.58, -52.69, 302.696, 162.991, -7.61, -1.46, 291.861, 125.043],
  [v6, -11.03, -43.65, 298.892, 152.436, -5.55, -1.33, 291.093, 124.617],
  [v7, -11.47, -34.6, 294.757, 141.729, -3.48, -1.2, 290.348, 124.181],
  [v8, -11.91, -25.58, 290.297, 130.885, -1.42, -1.06, 289.629, 123.734],
  [v9, -15.76, -19.89, 292.315, 126.542, 0.66, -0.92, 288.936, 123.276],
  [v10, -24.83, -22.83, 298.202, 145.886, 4.81, -0.63, 287.631, 122.327],
  [v11, -29.29, -24.29, 300.553, 155.245, 6.89, -0.47, 287.021, 121.835],
  [v12, -33.7, -25.76, 302.508, 164.383, 8.97, -0.32, 286.438, 121.333],
  [v13, -38.06, -27.23, 304.064, 173.29, 11.05, -0.16, 285.885, 120.818],
  [v14, -42.34, -28.69, 305.223, 181.956, 13.13, 0, 285.36, 120.293],
]

function RobotCard({ x, y, w, h, img, rows }) {
  const three = rows.length === 3
  return (
    <div style={abs({ left: x, top: y, width: w, height: h, background: C.robotBg, overflow: 'hidden' })}>
      <div style={abs({ left: w * 0.875 + 7.8, top: -30.12, width: 77.083, height: 149.572 })}>
        <img src={ellA} alt="" style={abs({ left: '-118.94%', right: '-118.94%', top: '-61.3%', bottom: '-61.3%', width: '337.88%', height: '222.6%' })} />
      </div>
      {WAVES.map(([src, l, t, bw, bh, r, sk, iw, ih], k) => (
        <div key={k} style={abs({ left: l, top: t, width: bw, height: bh, display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
          <div style={{ flex: 'none', transform: `rotate(${r}deg) skewX(${sk}deg)` }}>
            <img src={src} alt="" style={{ display: 'block', width: iw, height: ih }} />
          </div>
        </div>
      ))}
      <div style={abs({ left: -53.84, top: -50.54, width: 71.046, height: 71.046, display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
        <div style={{ flex: 'none', transform: 'rotate(-77.91deg)', position: 'relative', width: 59.841, height: 59.841 }}>
          <img src={ellB} alt="" style={abs({ left: '-38.3%', top: '-38.3%', width: '176.6%', height: '176.6%' })} />
        </div>
      </div>
      <img src={img} alt="" style={abs({ left: 2, bottom: 3, height: h - 12, width: 48, objectFit: 'contain', objectPosition: 'bottom' })} />
      <div style={abs({ left: w * 0.625 + 20.52, top: 0.51, width: 58.706, height: 14.294, borderRadius: '0 1.5px 2px 2px', backgroundImage: 'linear-gradient(252.7deg, rgba(61,116,255,0.8) 6.5%, rgba(110,181,255,0.8) 95.1%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 })}>
        <img src={icRobot} alt="" style={{ width: 8.2, height: 8.2 }} />
        <span style={{ fontFamily: PF, fontWeight: 700, fontSize: 6.4, color: '#fff' }}>Robots</span>
      </div>
      <div style={abs({ right: 9.2, top: three ? 19 : 26, display: 'grid', gridTemplateColumns: three ? '14px repeat(3, 45px)' : 'repeat(3, 45px)', columnGap: 4, rowGap: three ? 1 : 4 })}>
        {rows.flat().map((c, i) => typeof c === 'string'
          ? <span key={i} style={{ fontFamily: PF, fontSize: 5, color: C.unit, alignSelf: 'center' }}>{c}</span>
          : (
            <div key={i} style={{ height: three ? 28 : 34, textAlign: 'center' }}>
              <div style={{ fontFamily: PF, fontWeight: 700, fontSize: 7.8, lineHeight: '11px', color: c[2] ? C.blue : '#0f172a' }}>{c[1]}</div>
              <div style={{ fontFamily: PF, fontWeight: 500, fontSize: 5.5, lineHeight: '8.8px', color: C.label, marginTop: three ? 2 : 4 }}>{c[0]}</div>
            </div>
          ))}
      </div>
    </div>
  )
}

function Kpi({ k, v, u, blue, small }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 0 }}>
      <div style={{ fontFamily: PF, fontWeight: 500, fontSize: small ? 5.2 : 5.9, lineHeight: '8.4px', color: C.label, whiteSpace: 'nowrap' }}>{k}</div>
      <div style={{ fontFamily: PF, fontWeight: 700, fontSize: 10.1, lineHeight: '13px', color: blue ? C.blue : C.num, margin: '5px 0 3px' }}>{v}</div>
      <div style={{ fontFamily: PF, fontWeight: 500, fontSize: 5.2, lineHeight: '7.6px', color: C.unit }}>{u}</div>
    </div>
  )
}

function KpiRow({ x, y, w, h = 52, items, cols }) {
  return (
    <div style={abs({ left: x, top: y, width: w, height: h, background: C.panel, display: 'grid', gridTemplateColumns: cols || `repeat(${items.length}, 1fr)`, alignItems: 'center', padding: '0 4px', boxSizing: 'border-box' })}>
      {items.map((it, i) => <Kpi key={i} k={it[0]} v={it[1]} u={it[2]} blue={it[3]} small={items.length > 3} />)}
    </div>
  )
}

function Header({ tabs }) {
  return (
    <>
      <div style={abs({ left: 7.78, top: 6.18, height: 16, display: 'flex', alignItems: 'center', gap: 2 })}>
        <span style={{ width: 1, height: 8.2, background: '#3f75ff' }} />
        <span style={{ fontFamily: PF, fontWeight: 700, fontSize: 8.2, color: C.title }}>Dashboard</span>
      </div>
      <div style={abs({ left: 66, top: 4.88, height: 18, display: 'flex', gap: 6 })}>
        {tabs.map((t, i) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, height: 18, borderBottom: i === 0 ? '1px solid #165dff' : '1px solid transparent', boxSizing: 'border-box', padding: '0 2px' }}>
            <img src={i === 0 ? icTabOn : icTabOff} alt="" style={{ width: 7.1, height: 7.1 }} />
            <span style={{ fontFamily: PF, fontWeight: 700, fontSize: 6.2, color: i === 0 ? C.blue : C.tab, whiteSpace: 'nowrap' }}>{t}</span>
          </div>
        ))}
      </div>
      <div style={abs({ right: 62.65, top: 6.78, height: 16.5, background: '#f2f3f5', borderRadius: 2, display: 'flex', alignItems: 'center', padding: '1.5px 2px', boxSizing: 'border-box' })}>
        {['Today', 'Past 3 days', 'Past 7 days', 'Custom'].map((t, i) => (
          <span key={t} style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            {i > 1 && <span style={{ width: 0.5, height: 7.1, background: '#e5e6eb' }} />}
            <span style={{ fontFamily: PF, fontWeight: i === 0 ? 700 : 500, fontSize: 6.2, color: i === 0 ? '#165dff' : '#4e5969', background: i === 0 ? '#fff' : 'transparent', borderRadius: 2, padding: '2px 4.5px', whiteSpace: 'nowrap' }}>{t}</span>
          </span>
        ))}
      </div>
      <div style={abs({ right: 7.48, top: 6.78, width: 49, height: 16.5, background: '#f2f3f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 })}>
        <img src={icRefresh} alt="" style={{ width: 5.1, height: 5.1 }} />
        <span style={{ fontFamily: PF, fontWeight: 700, fontSize: 6.4, color: C.tab }}>Refresh</span>
      </div>
    </>
  )
}

function InfoStack({ items }) {
  return (
    <div style={abs({ left: 229.5, top: 35.48, width: 211.6, height: 168.2, background: C.panel, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 })}>
      {items.map((it, i) => (
        <div key={it[0]} style={{ display: 'contents' }}>
          {i > 0 && <span style={{ width: 175.6, height: 0.65, background: C.line }} />}
          <div style={{ textAlign: 'center', width: 187.6 }}>
            <div style={{ fontFamily: PF, fontWeight: 500, fontSize: 5.9, lineHeight: '8.6px', color: '#4b5870' }}>{it[0]}</div>
            <div style={{ fontFamily: PF, fontWeight: 700, fontSize: i ? 10.2 : 10.8, lineHeight: '14px', color: '#0f172a', margin: '4px 0' }}>{it[1]}</div>
            <div style={{ fontFamily: PF, fontWeight: 500, fontSize: 5.2, lineHeight: '7.6px', color: C.unit }}>{it[2]}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Chart({ x, y, w, h }) {
  const [t, setT] = useState(0)
  useEffect(() => { const id = setInterval(() => setT(v => v + 1), 2000); return () => clearInterval(id) }, [])
  const base = [0.35, 0.72, 0.5, 0.62, 0.25, 0.14, 0.58, 0.74, 0.3, 0.86, 0.42]
  const bars = base.map((b, i) => Math.min(0.95, Math.max(0.1, b + Math.sin(t + i) * 0.06)))
  const P = bars.map((b, i) => [(i + 0.5) / bars.length * 100, 100 - (38 + ((i * 29) % 34)) + Math.cos(t * 0.7 + i) * 4])
  // smooth Catmull-Rom curve through the points
  const curve = P.map((p, i) => {
    if (!i) return `M${p[0]},${p[1]}`
    const p0 = P[i - 2] || P[i - 1], p1 = P[i - 1], p3 = P[i + 1] || p
    const c1 = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6]
    const c2 = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6]
    return `C${c1} ${c2} ${p}`
  }).join(' ')
  return (
    <div style={abs({ left: x, top: y, width: w, height: h, background: C.panel, padding: '10px 10px 6px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' })}>
      <div style={{ position: 'relative', flex: 1, borderBottom: `0.65px solid ${C.line}` }}>
        {bars.map((b, i) => <span key={i} style={{ position: 'absolute', bottom: 0, left: `${(i + 0.5) / bars.length * 100}%`, width: `${100 / bars.length * 0.62}%`, transform: 'translateX(-50%)', height: `${b * 100}%`, borderRadius: '2px 2px 0 0', background: 'linear-gradient(180deg, #4d9bff 0%, rgba(29,139,255,0.55) 100%)', transition: 'height 0.9s cubic-bezier(0.3,0.7,0.2,1)' }} />)}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={abs({ inset: 0, width: '100%', height: '100%', overflow: 'visible' })}>
          <defs><linearGradient id="cd-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6ad8ee" stopOpacity="0.35" /><stop offset="1" stopColor="#6ad8ee" stopOpacity="0" /></linearGradient></defs>
          <path d={`${curve} L${P[P.length - 1][0]},100 L${P[0][0]},100 Z`} fill="url(#cd-area)" style={{ transition: 'd 0.9s ease' }} />
          <path d={curve} fill="none" stroke="#3ccbe6" strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ transition: 'd 0.9s ease' }} />
        </svg>
        {P.map(([x, y], i) => <span key={i} style={abs({ left: `${x}%`, top: `${y}%`, width: 3, height: 3, marginLeft: -1.5, marginTop: -1.5, borderRadius: '50%', background: '#fff', border: '0.8px solid #3ccbe6', boxSizing: 'border-box', transition: 'top 0.9s ease' })} />)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: PF, fontSize: 4.6, color: C.unit, margin: '3px 0' }}>
        {['1:00', '3:00', '5:00', '7:00', '9:00', '11:00'].map(v => <span key={v}>{v}</span>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: PF, fontSize: 5, color: C.label }}>
        <span><i style={{ display: 'inline-block', width: 5, height: 5, background: '#1d8bff', marginRight: 3 }} />Average Picking Quantity per Hour</span>
        <span><i style={{ display: 'inline-block', width: 5, height: 5, background: '#6ad8ee', marginRight: 3 }} />Number of Robots</span>
      </div>
    </div>
  )
}

const L = { x: 7.78, w: 213.22 }, R = { x: 229.5, w: 211.6 }

function BYD() {
  return (
    <>
      <Header tabs={['Transporting']} />
      <KpiRow x={L.x} y={35.48} w={L.w} items={[['In Progress', '583', 'orders', true], ['Abnormal', '89', 'orders'], ['Completed', 'XXX', 'orders']]} />
      <RobotCard x={L.x} y={96.48} w={L.w} h={107.2} img={robotBYD} rows={[[['Total Units', 6], ['In Task', 0, true], ['Idle', 5]], [['Charging', 1], ['Offline', 5], ['Low Battery', 4]]]} />
      <InfoStack items={[['Average Duration of Transport Orders', '20:00', 'min'], ['Transport / Return / Abnormal Task Duration', '0 / 0 / 0 / 0', 'min'], ['Clothing / Bags / Supply Return Areas', '0 / 0 / 0', 'orders']]} />
    </>
  )
}

function Workspace() {
  const cell = (x, y, w, h, k, v, u) => <div key={k} style={abs({ left: x, top: y, width: w, height: h, background: C.panel, display: 'flex', alignItems: 'center', justifyContent: 'center' })}><Kpi k={k} v={v} u={u} /></div>
  const g = 6, cw3 = (R.w - 2 * g) / 3, cw2 = (R.w - g) / 2
  return (
    <>
      <Header tabs={['Pick and Sort', 'Pick First, Sort Later']} />
      <KpiRow x={L.x} y={35.48} w={L.w} items={[['Required Orders', '276', 'orders', true], ['Ongoing Orders', '276', 'orders'], ['Completed Orders', '276', 'orders']]} />
      <RobotCard x={L.x} y={96.48} w={L.w} h={107.2} img={robotBD} rows={[[['Total Units', 6], ['In Task', 0, true], ['Idle', 5]], [['Charging', 0], ['Offline', 5], ['Low Battery', 6]]]} />
      <KpiRow x={R.x} y={35.48} w={R.w} cols="1.25fr 1fr 1fr 1fr" items={[['Fulfillment Packages', '276', 'orders'], ['Ongoing', '276', 'orders'], ['Completed', '276', 'orders'], ['Job Count', '50', 'orders']]} />
      {cell(R.x, 96.48, cw3, 50.6, 'PCT75', '23', 'min')}
      {cell(R.x + cw3 + g, 96.48, cw3, 50.6, 'Avg Delivery Time', '0', 'min')}
      {cell(R.x + 2 * (cw3 + g), 96.48, cw3, 50.6, 'Punctuality Rate', '80', '%')}
      {cell(R.x, 153.08, cw2, 50.6, 'Pending / Returned / Delayed', '0 / 0 / 0', 'orders')}
      {cell(R.x + cw2 + g, 153.08, cw2, 50.6, 'User / Abnormal Cancellation', '0 / 0', 'orders')}
    </>
  )
}

function Warehouse() {
  return (
    <>
      <Header tabs={['Picking and Sorting', 'Pick First, Sort Later']} />
      <KpiRow x={L.x} y={35.48} w={L.w} items={[0, 1, 2, 3].map(i => ['Completed Today', '276', 'orders', i === 0])} />
      <RobotCard x={L.x} y={96.48} w={L.w} h={107.2} img={robotTT} rows={[[['Total Units', 6], ['In Task', 0, true], ['Idle', 5]], [['Charging', 0], ['Offline', 5], ['Low Battery', 6]]]} />
      <KpiRow x={R.x} y={35.48} w={R.w} items={[['Average Time', '276', 'min'], ['Cut-off Time', '20:00', 'next 02:00'], ['Efficiency', '0', 'pcs/h']]} />
      <Chart x={R.x} y={96.48} w={R.w} h={107.2} />
    </>
  )
}

const VIEWS = { byd: BYD, workspace: Workspace, warehouse: Warehouse }

export default function ClientDashboard({ client }) {
  const ref = useRef(null)
  const [k, setK] = useState(1)
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / CW))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  const View = VIEWS[client]
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', aspectRatio: `${CW} / ${CH}` }}>
      <div style={abs({ left: 0, top: 0, width: CW, height: CH, transformOrigin: '0 0', transform: `scale(${k})`, background: '#f8fbff', border: '1px solid #fdffff', borderRadius: 2, overflow: 'hidden', boxSizing: 'border-box' })}>
        <View />
      </div>
    </div>
  )
}
