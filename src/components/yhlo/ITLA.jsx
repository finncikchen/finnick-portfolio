import { useEffect, useState } from 'react'
import panelDevice from '../../assets/images/yhlo/panel-device.webp'

// Live English rebuild of the YHLO iTLA touchscreen, measured from Figma node 5:7772
// (file fdE28HOn12vCFzLT4guaoN). Canvas is the design's own 1173 x 660; wrap with <Scaled w={1173} h={660}>.
export const W = 1173, H = 660
export const CY = '#0bc5d1', CY2 = '#66dfe7', CYS = '#ecfbfa', INK = '#07090a', BODY = '#434343', SUB = '#838484', LINE = '#d9d9d9', BG = '#f4f6fa', RED = '#fb4d51', ORG = '#fa8c16'
const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const T = ({ children, s = 12.2, c = BODY, w = 400, style }) => <span style={{ fontFamily: FONT, fontSize: s, color: c, fontWeight: w, whiteSpace: 'nowrap', ...style }}>{children}</span>
const abs = (x, y, w, h, extra) => ({ position: 'absolute', left: x, top: y, width: w, height: h, ...extra })
const KF = '@keyframes itIn{from{opacity:0;transform:translateY(6px)}}@keyframes itPop{from{opacity:0;transform:scale(.95)}}@keyframes itDot{from{transform:scale(.3);opacity:.3}}'

function useTick(ms, n) {
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => setI(x => (x + 1) % n), ms); return () => clearInterval(id) }, [ms, n])
  return i
}

const Ico = ({ d, c = BODY, s = 16, sw = 1.7 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
const I = {
  home: 'M3 11l9-8 9 8v10h-6v-6H9v6H3z', units: 'M4 5h16v14H4zM4 9h16M8 13h.01M11 13h.01M14 13h.01', tools: 'M14.5 6.5l3-3 3 3-3 3zM3 21l10-10M4 4l6 6-2 2-6-6z', cut: 'M6 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM8.5 7.5L20 19M8.5 16.5L20 5',
  img: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6', bell: 'M6 16V11a6 6 0 1112 0v5l2 2H4zM10 20a2 2 0 004 0', help: 'M12 21a9 9 0 100-18 9 9 0 000 18zM9.5 9a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17h.01', info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.5h.01',
  play: 'M12 21a9 9 0 100-18 9 9 0 000 18zM10 8.5l5 3.5-5 3.5z', pause: 'M12 21a9 9 0 100-18 9 9 0 000 18zM10 9v6M14 9v6', lock: 'M6 11h12v10H6zM8 11V7a4 4 0 118 0v4', unlock: 'M6 11h12v10H6zM8 11V7a4 4 0 017.5-2', clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2', list: 'M4 5h16v14H4zM8 9h8M8 13h8M8 17h5', stack: 'M4 5h16v5H4zM4 14h16v5H4z',
}
const Bar = ({ x, y }) => <span style={abs(x, y, 2, 15, { background: `linear-gradient(${CY}, ${CY2})`, borderRadius: 1.2 })} />

/* ── Frame: NaviBar (11,11 1151x49) + StatusBar (11,600 1151x49) ── */
export function Frame({ nav = 'home', badge = 5, running = false, children }) {
  const Tab = ({ x, w, k, icon, label, caret, dot }) => (
    <div style={abs(x, 11, w, 49, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 3.7, background: nav === k ? CYS : 'transparent', boxShadow: nav === k ? `inset 0 0 0 1px ${CY}` : 'none' })}>
      <span style={{ position: 'relative', display: 'flex' }}><Ico d={icon} c={nav === k ? CY : BODY} />{dot && <span style={{ position: 'absolute', top: -4, right: -5, width: 9, height: 9, borderRadius: '50%', background: CY, color: '#fff', fontSize: 6.5, display: 'grid', placeItems: 'center' }}>{dot}</span>}</span>
      <T c={nav === k ? CY : BODY}>{label}</T>{caret && <T s={8} c={nav === k ? CY : BODY}>▼</T>}
    </div>
  )
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, fontFamily: FONT, borderRadius: 14.7, overflow: 'hidden' }}>
      <style>{KF}</style>
      <div style={abs(11, 11, 1151, 49, { background: '#fff', borderRadius: 3.7 })} />
      <div style={abs(26, 11, 110, 49, { display: 'flex', alignItems: 'center', gap: 8 })}>
        <svg width="25" height="28" viewBox="0 0 25 28"><path d="M12.5 1.5l10.5 6v13l-10.5 6-10.5-6v-13z" fill="none" stroke={CY} strokeWidth="3.4" /><path d="M12.5 8.5l5 2.9v5.8l-5 2.9-5-2.9v-5.8z" fill={CY} /></svg>
        <T s={33} w={800} c={CY} style={{ letterSpacing: '0.01em' }}>ITLA</T>
      </div>
      <Tab x={178} w={98} k="home" icon={I.home} label="Home" />
      <Tab x={276} w={110} k="units" icon={I.units} label="Units" caret />
      <Tab x={386} w={98} k="tasks" icon={I.tools} label="Maintenance" dot={nav === 'tasks' ? 7 : null} />
      <div style={abs(893, 11, 111, 49, { display: 'flex', alignItems: 'center', gap: 7 })}><Ico d={I.cut} /><T>Snapshot</T><span style={{ width: 1, height: 24, background: LINE, margin: '0 8px 0 2px' }} /><Ico d={I.img} s={18} /></div>
      <span style={abs(1015, 23, 1, 24, { background: LINE })} /><span style={abs(1125, 23, 1, 24, { background: LINE })} />
      <div style={abs(1015, 11, 110, 49, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 })}>
        <span style={{ position: 'relative', display: 'flex' }}><Ico d={I.bell} c={nav === 'events' ? CY : BODY} />{badge > 0 && <span style={{ position: 'absolute', top: -3, left: 8, width: 10, height: 10, borderRadius: '50%', background: ORG, color: '#fff', fontSize: 7.3, display: 'grid', placeItems: 'center' }}>{badge}</span>}</span>
        <T c={nav === 'events' ? CY : BODY}>Events</T><T s={8} c={nav === 'events' ? CY : BODY}>▼</T>
      </div>
      <div style={abs(1125, 11, 37, 49, { display: 'grid', placeItems: 'center' })}><Ico d={I.help} s={15} /></div>

      {children}

      <div style={abs(11, 600, 1151, 49, { background: '#fff' })} />
      <div style={abs(54, 612, 70, 30)}><T s={13.4} w={500} c={SUB}>{running ? 'Running' : 'Paused'}</T><span style={abs(2, 20, 15, 5, { borderRadius: 3, background: running ? CY : SUB })} /></div>
      <div style={abs(147, 615, 200, 19, { display: 'flex', alignItems: 'center', gap: 4 })}><Ico d={I.info} c={SUB} s={15} /><T s={13.4} c={SUB}>Status: {running ? 'running since 14:30' : 'paused at 14:30'}</T></div>
      <div style={abs(353, 612, 72, 24, { borderRadius: 30, boxShadow: `inset 0 0 0 1px ${SUB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 })}><Ico d={running ? I.pause : I.play} s={14} /><T s={11}>{running ? 'Pause' : 'Run'}</T></div>
      <div style={abs(976, 616, 150, 18)}><T s={13.4} c={SUB}>2024-01-23   17:00:00</T></div>
    </div>
  )
}

/* ── Drawer card (95 x 403) + button (89 x 29) ── */
const PX = 13.45, PY = 12.2
function Tray({ x, y, rows, fill = 0 }) {
  return Array.from({ length: rows * 6 }, (_, k) => {
    const r = Math.floor(k / 6), c = k % 6, on = r < fill && c < 5
    return <span key={k} style={abs(x + c * PX, y + r * PY, 10, 10, { borderRadius: '50%', background: on ? CY : LINE, transition: 'background .3s', animation: on ? `itDot .35s ${(r * 6 + c) * 0.012}s both` : 'none' })} />
  })
}
const Dash = ({ x, y, w, h }) => <span style={abs(x, y, w, h, { borderRadius: 3.7, border: `1px dashed ${LINE}` })} />
function Drawer({ x, name, full, fill = 5, btn, hi, tip }) {
  const B = { unlock: [CYS, CY2, CY, 'Unlock', I.unlock], lock: ['#fff', LINE, BODY, 'Lock', I.lock], run: [BG, LINE, SUB, 'Locked · run', I.lock] }[btn]
  return (
    <>
      <div style={abs(x, 123, 95, 403, { borderRadius: 3.7, background: full ? BG : '#fff', boxShadow: hi ? `inset 0 0 0 1.5px ${CY}, 0 8px 22px rgba(11,197,209,0.22)` : `inset 0 0 0 1px ${LINE}`, transition: 'box-shadow .3s' })}>
        <span style={abs(7, 7, 90, 18)}><T c={SUB}>{name}</T></span>
        {full ? <><Tray x={9} y={40} rows={12} fill={fill} /><Tray x={9} y={223} rows={12} fill={fill} /></>
          : <><Dash x={9} y={39} w={77} h={59} /><Tray x={9} y={125} rows={5} /><Dash x={9} y={222} w={77} h={144} /></>}
        {tip && (
          <div style={abs(-3, 34, 101, 205, { background: 'linear-gradient(transparent 0, transparent 58%, #fff 58%)', borderRadius: 4, boxShadow: `inset 0 0 0 1.5px ${CY}, 0 10px 26px rgba(0,60,70,0.18)`, padding: '124px 8px 0', display: 'flex', flexDirection: 'column', gap: 5, animation: 'itPop .3s both' })}>
            {[['Rack', 'Blue'], ['Size', '[6, 12] L'], ['Priority', 'High / Mid / Low'], ['Use', 'Assay test'], ['Centrifuge', '-'], ['Archive', 'Off']].map(([k, v]) => <T key={k} s={7.5} c={BODY}>{k}: {v}</T>)}
          </div>
        )}
      </div>
      <div style={abs(x + 3, 533, 89, 29, { borderRadius: 7.3, background: B[0], boxShadow: `inset 0 0 0 1px ${B[1]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all .3s' })}><Ico d={B[4]} c={B[2]} s={12} sw={2} /><T s={11} c={B[2]}>{B[3]}</T></div>
    </>
  )
}

/* ── Workbench (Home) ── */
const EV = ['24011073000 Centrifuge rule error', '24011073001 Barcode unreadable', '24011073002 Tube height mismatch', '24011073003 Cap not detected']
export function Workbench({ right = 'device', popover, tube }) {
  const t = useTick(700, 20)
  const load = Math.min(5, Math.floor(t / 1.2) + 1)
  const lock2 = t % 10 < 5
  return (
    <Frame running>
      <div style={abs(11, 66, 831, 528, { background: '#fff', borderRadius: 3.7 })} />
      {[[33, 'Loading'], [489, 'Dispatch'], [725, 'Fast release']].map(([x, l]) => <div key={l}><Bar x={x} y={88} /><span style={abs(x + 15, 86, 120, 18)}><T s={13.4} w={600} c={INK}>{l}</T></span></div>)}
      <span style={abs(473, 66, 0, 528, { borderLeft: `1px dashed ${LINE}` })} /><span style={abs(709, 66, 0, 528, { borderLeft: `1px dashed ${LINE}` })} />
      <Drawer x={33} name="Drawer 1" btn="unlock" />
      <Drawer x={143} name="Drawer 2" full fill={load} btn={lock2 ? 'lock' : 'unlock'} hi={tube} tip={tube} />
      <Drawer x={253} name="Drawer 3" btn="unlock" />
      <Drawer x={363} name="Drawer 4" btn="unlock" />
      <Drawer x={489} name="Drawer 5" full btn="run" />
      <Drawer x={599} name="Drawer 6" full btn="run" />
      <Drawer x={725} name="Drawer 7" btn="unlock" />

      {right === 'device' && <img src={panelDevice} alt="" style={abs(856, 66, 305, 528, { borderRadius: 3.7, objectFit: 'cover' })} />}

      {right === 'events' && (
        <div style={abs(856, 66, 305, 528, { background: '#fff', borderRadius: 3.7, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 26 })}>
          {['Watch: recent timed-out samples', 'Watch: recent sample events'].map(h => (
            <div key={h}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}><span style={{ width: 2, height: 13, background: CY }} /><T s={11} w={600} c={INK}>{h}</T><span style={{ marginLeft: 'auto' }}><T s={9} c={SUB}>More ›</T></span></div>
              <div style={{ border: `1px solid ${CY}`, borderRadius: 3, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {EV.map((e, k) => <div key={e} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: CY }} /><T s={8.6} c={BODY} style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{e}</T><T s={8.6} c={BODY}>09-26  20:0{4 - k}</T></div>)}
              </div>
            </div>
          ))}
        </div>
      )}
      {right === 'events' && popover && (
        <div key={t > 10 ? 'b' : 'a'} style={abs(700, 78, 452, 262, { background: '#fff', borderRadius: 8, boxShadow: '0 18px 44px rgba(0,40,50,0.18)', padding: '26px 28px', animation: 'itPop .35s both' })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}><span style={{ width: 3, height: 20, background: `linear-gradient(${CY}, ${CY2})` }} /><T s={19} w={600} c={INK}>Watch: recent timed-out samples</T><span style={{ marginLeft: 'auto' }}><T s={14} c={LINE}>More ›</T></span></div>
          <div style={{ border: `1.5px solid ${CY}`, borderRadius: 5, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {EV.map((e, k) => <div key={e} style={{ display: 'flex', alignItems: 'center', gap: 12, animation: `itIn .3s ${k * 0.07}s both` }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: CY }} /><T s={14} c={BODY} style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{e}</T><T s={14} c={BODY}>09-26   20:0{4 - k}</T></div>)}
          </div>
        </div>
      )}

      {right === 'tube' && <TubePanel sel={t % 6} />}
    </Frame>
  )
}

function TubePanel({ sel }) {
  const on = k => { const r = Math.floor(k / 6), c = k % 6; return r < 5 && c < 5 }
  const pick = [8, 9, 14, 15, 20, 21][sel]
  return (
    <div style={abs(856, 66, 305, 528, { background: '#fff', borderRadius: 3.7, padding: '18px 18px', display: 'flex', flexDirection: 'column' })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}><span style={{ width: 2, height: 13, background: CY }} /><T s={11} w={600} c={INK}>Drawer 2-1</T><span style={{ marginLeft: 'auto', color: LINE, fontSize: 14 }}>✕</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px 9px', padding: '0 6px' }}>
        {Array.from({ length: 48 }, (_, k) => {
          const r = Math.floor(k / 6) + 1, c = k % 6 + 1, p = k === pick
          return <span key={k} style={{ aspectRatio: '1', borderRadius: '50%', background: on(k) ? CY : LINE, color: '#fff', fontSize: 8, display: 'grid', placeItems: 'center', boxShadow: p ? `0 0 0 2.5px #fff, 0 0 0 4px ${CY}` : 'none', transition: 'box-shadow .3s' }}>{p ? '✓' : `${r}-${c}`}</span>
        })}
      </div>
      <div style={{ marginTop: 'auto', borderTop: `1px solid ${LINE}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: CY }} /><T s={17} w={500} c={INK}>{Math.floor(pick / 6) + 1}-{pick % 6 + 1}</T></div>
        {[['Sampled', '2024-01-29'], ['Operator', '-'], ['Sample no.', '24012930448']].map(([k, v]) => <div key={k} style={{ display: 'flex', gap: 14 }}><T s={9.5} c={SUB} style={{ width: 62 }}>{k}</T><T s={9.5} c={BODY}>{v}</T></div>)}
      </div>
    </div>
  )
}

/* ── Drawer allocation ── */
export function Allocation() {
  const cur = useTick(1800, 5)
  const plans = [['Storage first', [['Barcode error', 59], ['Error zone', 59], ['Tube type error', 134]]], ['Plan name', [['Barcode error', 59], ['Barcode error', 59], ['Tube type error', 134]]], ['Plan name', [[null, 59], ['Sample type', 59], [null, 134]]], ['Plan name', [['Barcode error', 59], ['Barcode error', 59], ['Tube type error', 134]]], ['Plan name', [['Barcode error', 59], ['Barcode error', 59], ['Tube type error', 134]]]]
  return (
    <Frame nav="units">
      <div style={abs(11, 66, 1151, 528, { background: '#fff', borderRadius: 3.7 })} />
      <div style={abs(36, 88, 600, 20, { display: 'flex', alignItems: 'center', gap: 8 })}><Ico d={I.stack} c={CY} s={15} /><T s={13.4} w={600} c={INK}>Drawer allocation</T>
        <span style={{ marginLeft: 26, display: 'flex', gap: 14 }}>{[1, 2, 3, 4, 5, 6, 7].map(n => <T key={n} s={9.5} c={n === 1 ? CY : BODY} style={{ borderBottom: n === 1 ? `1.5px solid ${CY}` : 'none', paddingBottom: 2 }}>Drawer {n}</T>)}</span>
      </div>
      {plans.map(([name, zones], i) => {
        const x = 36 + i * 222, on = i === cur
        const tops = [160, 227, 318]
        return (
          <div key={i}>
            <div style={abs(x, 124, 190, 408, { borderRadius: 5, background: '#fff', boxShadow: on ? `inset 0 0 0 2px ${CY}, 0 12px 28px rgba(11,197,209,0.2)` : `inset 0 0 0 1px ${LINE}`, transition: 'box-shadow .35s', overflow: 'hidden' })}>
              <div style={{ height: 28, display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', background: on ? CY : 'transparent', transition: 'background .35s' }}>{on && <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#fff', color: CY, fontSize: 9, display: 'grid', placeItems: 'center' }}>✓</span>}<T s={11} c={on ? '#fff' : SUB} w={on ? 600 : 400}>{on ? 'Current plan' : 'Not selected'}</T></div>
            </div>
            {zones.map(([label, zh], k) => (
              <div key={k} style={abs(x + 10, tops[k], 170, zh, { borderRadius: 4, border: label ? 'none' : `1px dashed ${LINE}`, background: label ? (on ? `linear-gradient(180deg, ${CY}33, ${CY}cc)` : '#fff') : 'transparent', boxShadow: label && !on ? `inset 0 0 0 1px ${LINE}` : 'none', transition: 'background .35s', overflow: 'hidden' })}>
                {label && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 5, padding: '8px 14px' }}>{Array.from({ length: zh > 100 ? 48 : 16 }, (_, d) => <span key={d} style={{ aspectRatio: '1', borderRadius: '50%', background: on ? 'rgba(255,255,255,0.45)' : '#e3e5e7' }} />)}</div>}
                {label && <span style={abs(6, zh - 17, 160, 14)}><T s={9} c={on ? '#fff' : BODY}>{label}</T></span>}
              </div>
            ))}
            <span style={abs(x, 544, 190, 16, { textAlign: 'center' })}><T s={10.5} c={on ? INK : BODY} w={on ? 600 : 400}>Plan {i + 1}: {name}</T></span>
          </div>
        )
      })}
    </Frame>
  )
}

/* ── Unit control ── */
export function Units() {
  const t = useTick(1400, 5)
  const cards = [
    ['Run / Pause', 'Tip: tap "Resume" to restore the running state', 'M12 3l5 9h-3v8h-4v-8H7z', [['Pause', I.pause], ['Resume', I.play]]],
    ['Initialize unit', 'The unit resets to its default state after initializing', I.units, [['Initialize', I.clock]]],
    ['Lock / Unlock cover', 'After unlocking, the cover can be opened', I.lock, [['Lock', I.lock], ['Unlock', I.unlock]]],
    ['Bypass unit', 'Bypass this unit so the line keeps running', 'M6 4v6a4 4 0 004 4h8M15 10l3 4-3 4', [['Connect', I.units], ['Bypass', 'M4 12h16']]],
    ['Disable unit', 'A disabled unit leaves the line', 'M5 5l14 14M12 21a9 9 0 100-18 9 9 0 000 18z', [['Enable', I.play], ['Disable', 'M5 5l14 14']]],
  ]
  return (
    <Frame nav="units">
      <div style={abs(11, 66, 1151, 528, { background: '#fff', borderRadius: 3.7 })} />
      <div style={abs(50, 92, 300, 20, { display: 'flex', alignItems: 'center', gap: 8 })}><Ico d={I.units} c={CY} s={15} /><T s={13.4} w={600} c={INK}>Unit control</T></div>
      {cards.map(([ti, d, icon, btns], i) => {
        const x = 86 + (i % 3) * 360, y = 145 + Math.floor(i / 3) * 176, on = t === i
        return (
          <div key={ti} style={abs(x, y, 280, 138, { borderRadius: 8, background: '#fff', boxShadow: on ? `0 0 0 1px ${CY2}, 0 14px 30px rgba(11,197,209,0.18)` : `0 0 0 1px #eceff1, 0 6px 18px rgba(0,0,0,0.06)`, overflow: 'hidden', transition: 'box-shadow .4s' })}>
            <div style={abs(14, 58, 90, 90, { opacity: 0.09 })}><Ico d={icon} c={INK} s={84} sw={1.4} /></div>
            <span style={abs(22, 22, 240, 22)}><T s={15} w={700} c={INK}>{ti}</T></span>
            <span style={abs(22, 48, 240, 14)}><T s={8.5} c={SUB}>{d}</T></span>
            <div style={abs(0, 94, 262, 24, { display: 'flex', justifyContent: 'flex-end', gap: 8 })}>
              {btns.map(([l, ic], k) => {
                const primary = k === 0, press = on && btns.length > 1 && k === 1
                return <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, height: 22, padding: '0 12px', borderRadius: 12, boxShadow: `inset 0 0 0 1px ${press ? CY : primary ? BODY : '#e1e4e6'}`, background: press ? CY : '#fff', transition: 'all .3s' }}><Ico d={ic} s={11} c={press ? '#fff' : primary ? BODY : '#c3c7ca'} /><T s={9.5} c={press ? '#fff' : primary ? INK : '#c3c7ca'}>{l}</T></span>
              })}
            </div>
          </div>
        )
      })}
    </Frame>
  )
}

/* ── Sample events list ── */
export function EventList() {
  const cleared = useTick(800, 10)
  const rows = Array.from({ length: 10 }, (_, i) => [`M${String(i + 1).padStart(5, '0')}`, i === 1 ? 'High' : '-', 'Input module · allocation region ' + (i % 3 + 1), ['Centrifuge rule error', 'Barcode unreadable', 'Tube height mismatch'][i % 3], '2024-01-02'])
  return (
    <Frame nav="events">
      <div style={abs(11, 66, 1151, 528, { background: '#fff', borderRadius: 3.7 })} />
      <div style={abs(50, 92, 300, 20, { display: 'flex', alignItems: 'center', gap: 8 })}><Ico d={I.stack} c={CY} s={15} /><T s={13.4} w={600} c={INK}>Sample events</T></div>
      <div style={abs(700, 88, 290, 24, { display: 'flex', gap: 10, justifyContent: 'flex-end' })}>
        <span style={{ height: 22, padding: '0 12px', borderRadius: 3, boxShadow: `inset 0 0 0 1px ${CY}`, background: CYS, display: 'grid', placeItems: 'center' }}><T s={10} c={CY}>Clear all</T></span>
        <span style={{ width: 140, height: 22, borderRadius: 3, boxShadow: `inset 0 0 0 1px ${LINE}`, display: 'flex', alignItems: 'center', padding: '0 8px' }}><T s={10} c="#c3c7ca">Search</T></span>
      </div>
      <div style={abs(44, 124, 1085, 374, { display: 'grid', gridTemplateColumns: '1fr 0.6fr 2.4fr 1.5fr 1fr 0.7fr', gridAutoRows: 34 })}>
        {['Barcode', 'Priority', 'Current location', 'Error reason', 'Arrived ↕', 'Action'].map(h => <div key={h} style={{ display: 'grid', placeItems: 'center', borderBottom: '1px solid #eef0f2' }}><T s={10.5} c={INK} w={500}>{h}</T></div>)}
        {rows.map((r, i) => {
          const done = i >= 7 || i < Math.max(0, cleared - 3)
          return [...r.map((v, k) => <div key={i + '-' + k} style={{ display: 'grid', placeItems: 'center', borderBottom: '1px solid #eef0f2' }}><T s={10.5} c={done ? '#b5b5b6' : k === 1 && v === 'High' ? RED : BODY} style={{ transition: 'color .4s' }}>{v}</T></div>),
            <div key={i + 'a'} style={{ display: 'grid', placeItems: 'center', borderBottom: '1px solid #eef0f2' }}><span style={{ padding: '2px 11px', borderRadius: 10, boxShadow: `inset 0 0 0 1px ${done ? '#e1e4e6' : CY2}`, background: done ? '#f3f4f5' : CYS, transition: 'all .4s' }}><T s={9} c={done ? SUB : CY}>{done ? 'Cleared' : 'Clear'}</T></span></div>]
        })}
      </div>
      <div style={abs(780, 556, 350, 22, { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 })}>
        {['‹', '1', '2', '3', '4', '5', '…', '50', '›'].map((p, i) => <span key={i} style={{ minWidth: 20, height: 20, display: 'grid', placeItems: 'center', borderRadius: 3, boxShadow: p === '1' ? `inset 0 0 0 1px ${CY}` : 'none' }}><T s={9.5} c={p === '1' ? CY : BODY}>{p}</T></span>)}
        <span style={{ height: 20, padding: '0 8px', borderRadius: 3, boxShadow: `inset 0 0 0 1px ${LINE}`, display: 'grid', placeItems: 'center' }}><T s={9.5}>10 / page ▾</T></span>
      </div>
      <div style={abs(1010, 62, 140, 128, { background: '#fff', borderRadius: 5, boxShadow: '0 12px 30px rgba(0,40,50,0.15)', padding: 6, animation: 'itPop .3s both' })}>
        {[[I.clock, 'Timed-out samples'], [I.list, 'System events'], [I.stack, 'Sample events', true]].map(([d, l, on]) => <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 8px', borderRadius: 4, background: on ? CYS : 'transparent' }}><Ico d={d} c={on ? CY : BODY} s={14} /><T s={10.5} c={on ? CY : BODY} w={on ? 600 : 400}>{l}</T></div>)}
      </div>
    </Frame>
  )
}
