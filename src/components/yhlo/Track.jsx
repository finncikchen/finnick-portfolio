import { useEffect, useState } from 'react'
import unitThumb from '../../assets/images/yhlo/unit-thumb.webp'

// Track unit screens, rebuilt live in English from Figma "Frame 184" (4:2090, 1280 x 800)
// and the English case deck (4010:20142). Wrap with <Scaled w={1280} h={800}>.
const CY = '#0bc5d1', CY2 = '#66dfe7', CYS = '#ecfbfa', INK = '#07090a', BODY = '#434343', SUB = '#838484', FAINT = '#b5b5b6', LINE = '#d9d9d9', BG = '#f4f6fa', RED = '#fb4d51', ORG = '#fa8c16'
const RACK = ['#0bc5d1', '#fc7876', '#fca948', '#6aa8f7']
const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const T = ({ children, s = 14, c = BODY, w = 400, style }) => <span style={{ fontFamily: FONT, fontSize: s, color: c, fontWeight: w, whiteSpace: 'nowrap', ...style }}>{children}</span>
const abs = (x, y, w, h, extra) => ({ position: 'absolute', left: x, top: y, width: w, height: h, ...extra })
const KF = '@keyframes trIn{from{opacity:0;transform:translateY(6px)}}@keyframes trPop{from{opacity:0;transform:scale(.95)}}@keyframes trDot{from{transform:scale(.2);opacity:0}}'

function useTick(ms, n) {
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => setI(x => (x + 1) % n), ms); return () => clearInterval(id) }, [ms, n])
  return i
}
const Ico = ({ d, c = BODY, s = 22, sw = 1.7 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
const I = {
  home: 'M3 11l9-8 9 8v10h-6v-6H9v6H3z', units: 'M4 5h16v14H4zM4 9h16M8 13h.01M11 13h.01M14 13h.01', tools: 'M14.5 6.5l3-3 3 3-3 3zM3 21l10-10M4 4l6 6-2 2-6-6z', cut: 'M6 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM8.5 7.5L20 19M8.5 16.5L20 5',
  img: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6', bell: 'M6 16V11a6 6 0 1112 0v5l2 2H4zM10 20a2 2 0 004 0', help: 'M12 21a9 9 0 100-18 9 9 0 000 18zM9.5 9a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17h.01', info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.5h.01',
  play: 'M12 21a9 9 0 100-18 9 9 0 000 18zM10 8.5l5 3.5-5 3.5z', pause: 'M12 21a9 9 0 100-18 9 9 0 000 18zM10 9v6M14 9v6', lock: 'M6 11h12v10H6zM8 11V7a4 4 0 118 0v4', unlock: 'M6 11h12v10H6zM8 11V7a4 4 0 017.5-2', clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2', list: 'M4 5h16v14H4zM8 9h8M8 13h8M8 17h5', stack: 'M4 5h16v5H4zM4 14h16v5H4z', refresh: 'M20 12a8 8 0 11-2.3-5.7M20 4v5h-5',
  enter: 'M12 4v11M7 10l5 5 5-5M5 20h14', out: 'M12 20V9M7 14l5-5 5 5M5 4h14', inbox: 'M4 14l3-8h10l3 8v5H4zM4 14h5l1 2h4l1-2h5',
}
const Bar = ({ x, y, h = 20 }) => <span style={abs(x, y, 3, h, { background: `linear-gradient(${CY}, ${CY2})`, borderRadius: 2 })} />

/* ── Frame: NaviBar (12,18 1256x80) + StatusBar (12,702 1256x80) ── */
export function TrackFrame({ nav = 'home', badge = 5, running = false, children }) {
  const Tab = ({ x, w, k, icon, label, caret, dot }) => (
    <div style={abs(x, 18, w, 80, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 6, background: nav === k ? CYS : 'transparent', boxShadow: nav === k ? `inset 0 0 0 1.5px ${CY}` : 'none' })}>
      <span style={{ position: 'relative', display: 'flex' }}><Ico d={icon} c={nav === k ? CY : BODY} />{dot && <span style={abs(14, -6, 14, 14, { borderRadius: '50%', background: CY, color: '#fff', fontSize: 10, display: 'grid', placeItems: 'center' })}>{dot}</span>}</span>
      <T s={20} c={nav === k ? CY : BODY}>{label}</T>{caret && <T s={12} c={nav === k ? CY : BODY}>▼</T>}
    </div>
  )
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, fontFamily: FONT, overflow: 'hidden' }}>
      <style>{KF}</style>
      <div style={abs(12, 18, 1256, 80, { background: '#fff', borderRadius: 6 })} />
      <div style={abs(40, 18, 200, 80, { display: 'flex', alignItems: 'center', gap: 12 })}>
        <svg width="42" height="46" viewBox="0 0 25 28"><path d="M12.5 1.5l10.5 6v13l-10.5 6-10.5-6v-13z" fill="none" stroke={CY} strokeWidth="3.4" /><path d="M12.5 8.5l5 2.9v5.8l-5 2.9-5-2.9v-5.8z" fill={CY} /></svg>
        <T s={54} w={800} c={CY} style={{ letterSpacing: '0.01em' }}>ITLA</T>
      </div>
      <Tab x={272} w={132} k="home" icon={I.home} label="Home" />
      <Tab x={420} w={150} k="units" icon={I.units} label="Units" caret />
      <Tab x={586} w={200} k="tasks" icon={I.tools} label="Maintenance" dot={nav === 'tasks' ? null : 7} />
      <div style={abs(830, 18, 170, 80, { display: 'flex', alignItems: 'center', gap: 10 })}><Ico d={I.cut} /><T s={20}>Snapshot</T></div>
      <span style={abs(1000, 40, 1, 36, { background: LINE })} />
      <div style={abs(1014, 18, 36, 80, { display: 'grid', placeItems: 'center' })}><Ico d={I.img} s={26} /></div>
      <span style={abs(1062, 40, 1, 36, { background: LINE })} />
      <div style={abs(1070, 18, 140, 80, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 })}>
        <span style={{ position: 'relative', display: 'flex' }}><Ico d={I.bell} c={nav === 'events' ? CY : BODY} />{badge > 0 && <span style={abs(12, -6, 16, 16, { borderRadius: '50%', background: ORG, color: '#fff', fontSize: 12, display: 'grid', placeItems: 'center' })}>{badge}</span>}</span>
        <T s={20} c={nav === 'events' ? CY : BODY}>Events</T><T s={12} c={nav === 'events' ? CY : BODY}>▼</T>
      </div>
      <span style={abs(1214, 40, 1, 36, { background: LINE })} />
      <div style={abs(1216, 18, 52, 80, { display: 'grid', placeItems: 'center' })}><Ico d={I.help} /></div>

      {children}

      <div style={abs(12, 702, 1256, 80, { background: '#fff' })} />
      <div style={abs(85, 727, 140, 40)}><T s={22} w={500} c={SUB}>{running ? 'Running' : 'Paused'}</T><span style={abs(2, 33, 24, 6, { borderRadius: 3, background: running ? CY : SUB })} /></div>
      <div style={abs(236, 727, 330, 30, { display: 'flex', alignItems: 'center', gap: 6 })}><Ico d={I.info} c={SUB} /><T s={22} c={SUB}>Status: {running ? 'running since 14:30' : 'paused at 14:30'}</T></div>
      <div style={abs(572, 722, 120, 40, { borderRadius: 30, boxShadow: `inset 0 0 0 1.5px ${SUB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 })}><Ico d={running ? I.pause : I.play} s={22} /><T s={18}>{running ? 'Pause' : 'Run'}</T></div>
      <div style={abs(1005, 728, 260, 30)}><T s={22} c={SUB}>2024-01-23      17:00:00</T></div>
    </div>
  )
}

/* ── Home: sample display ── */
const EV = ['2401107300 Centrifuge rule error', '2401107301 Barcode unreadable', '2401107302 Tube height mismatch', '2401107303 Cap not detected']
const SYS = ['Reagent low · Unit B', 'Cover unlocked · Unit A', 'Calibration complete']
function Rack({ x, color, fill, out }) {
  return (
    <>
      <div style={abs(x, 181, 26, 240, { background: BG, borderRadius: 3, boxShadow: `inset 0 0 0 1px ${color && fill ? color + '99' : LINE}` })}>
        {Array.from({ length: 5 }, (_, k) => <span key={k} style={abs(5, 28 + k * 32, 16, 16, { borderRadius: '50%', background: color && k < fill ? color : LINE, animation: color && k < fill ? `trDot .35s ${k * 0.05}s both` : 'none' })} />)}
        {color && fill > 0 && <span style={abs(4, 206, 18, 18, { borderRadius: 3, background: FAINT, display: 'grid', placeItems: 'center' })}><Ico d={out ? I.out : I.enter} c="#fff" s={13} sw={2.4} /></span>}
      </div>
    </>
  )
}
function ListCard({ x, title, rows, empty, hi }) {
  return (
    <>
      <div style={abs(x, 492, 398, 200, { background: '#fff', borderRadius: 6 })} />
      <Bar x={x + 24} y={512} /><span style={abs(x + 42, 510, 280, 24)}><T s={18} c={BODY} w={500}>{title}</T></span>
      <span style={abs(x + 330, 514, 60, 20)}><T s={14} c={FAINT}>More ›</T></span>
      <div style={abs(x + 24, 554, 350, 118, { borderRadius: 8, boxShadow: `inset 0 0 0 1px ${empty ? '#eceff1' : CY}`, background: hi ? '#f7feff' : '#fff' })}>
        {empty ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}><Ico d={I.inbox} c={LINE} s={52} sw={1.3} /><T s={13} c={FAINT}>No data</T></div>
        ) : rows.slice(0, 3).map((r, k) => (
          <div key={r} style={abs(20, 18 + k * 30, 320, 20, { display: 'flex', alignItems: 'center', gap: 10 })}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: hi && k === 0 ? RED : CY }} />
            <T s={14} style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r}</T><T s={14}>09-26  20:0{4 - k}</T>
          </div>
        ))}
      </div>
    </>
  )
}

export function TrackHome({ empty, popover }) {
  const t = useTick(380, 40)
  const loaded = empty ? 0 : Math.min(4, Math.floor(t / 4) + 1)
  return (
    <TrackFrame running={!empty} badge={empty ? 0 : 5}>
      <div style={abs(12, 108, 1256, 374, { background: '#fff', borderRadius: 6 })} />
      <Bar x={60} y={142} /><span style={abs(76, 138, 300, 26)}><T s={18} w={500} c={INK}>Sample display</T></span>
      {Array.from({ length: 28 }, (_, i) => <Rack key={i} x={60 + i * 42} color={i < 4 ? RACK[i] : null} fill={i < loaded ? 5 : 0} out={i === 1 || i === 3} />)}
      {Array.from({ length: 28 }, (_, i) => <span key={i} style={abs(60 + i * 42, 438, 26, 20, { textAlign: 'center' })}><T s={14}>{i + 1}</T></span>)}

      <div style={abs(12, 492, 428, 200, { background: '#fff', borderRadius: 6, overflow: 'hidden' })}>
        <div style={abs(218, 20, 250, 190, { background: `radial-gradient(circle at 50% 60%, ${CYS} 0%, rgba(236,251,250,0) 70%)` })} />
        <img src={unitThumb} alt="" style={abs(236, 62, 186, 161, { objectFit: 'contain', opacity: empty ? 0.9 : 1 })} />
      </div>
      <Bar x={36} y={512} /><span style={abs(54, 510, 300, 24)}><T s={18} w={500}>Connected unit: iTLA-01</T></span>
      <span style={abs(58, 570, 90, 20)}><T s={14} c={SUB}>Connection</T></span><span style={abs(150, 570, 100, 20)}><T s={14} c={SUB}>Processing</T></span>
      <span style={abs(58, 594, 90, 28)}><T s={22} c={empty ? SUB : BODY}>{empty ? '-' : 'Online'}</T></span>
      <span style={abs(150, 594, 90, 28)}><T s={22} c={empty ? SUB : BODY}>{empty ? '-' : `${loaded * 5 - 2}/100`}</T></span>

      <ListCard x={456} title="Watch: recent timed-out samples" rows={EV} empty={empty} hi />
      <ListCard x={870} title="Watch: recent system events" rows={SYS} empty={empty} />

      {popover && !empty && (
        <div key={t >= 20 ? 'b' : 'a'} style={abs(790, 360, 470, 260, { background: '#fff', borderRadius: 12, boxShadow: '0 22px 54px rgba(0,40,50,0.2)', animation: 'trPop .35s both' })}>
          <Bar x={28} y={30} h={24} /><span style={abs(44, 27, 360, 30)}><T s={21} w={600} c={INK}>Watch: recent timed-out samples</T></span>
          <span style={abs(390, 32, 70, 22)}><T s={16} c={FAINT}>More ›</T></span>
          <div style={abs(28, 78, 414, 156, { borderRadius: 8, boxShadow: `inset 0 0 0 1.5px ${CY}` })}>
            {EV.map((r, k) => <div key={r} style={abs(22, 18 + k * 32, 380, 22, { display: 'flex', alignItems: 'center', gap: 12, animation: `trIn .3s ${k * 0.07}s both` })}><span style={{ width: 8, height: 8, borderRadius: '50%', background: CY }} /><T s={16} style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r}</T><T s={16}>09-26  20:0{4 - k}</T></div>)}
          </div>
        </div>
      )}
    </TrackFrame>
  )
}

/* ── Panel used by list screens ── */
const Panel = ({ icon, title, extra, children }) => (
  <>
    <div style={abs(12, 108, 1256, 584, { background: '#fff', borderRadius: 6 })} />
    <div style={abs(56, 138, 400, 28, { display: 'flex', alignItems: 'center', gap: 10 })}><Ico d={icon} c={CY} /><T s={18} w={600} c={INK}>{title}</T>{extra}</div>
    {children}
  </>
)
function Pager() {
  return (
    <div style={abs(800, 646, 440, 28, { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 })}>
      {['‹', '1', '2', '3', '4', '5', '…', '50', '›'].map((p, i) => <span key={i} style={{ minWidth: 26, height: 26, display: 'grid', placeItems: 'center', borderRadius: 4, boxShadow: p === '1' ? `inset 0 0 0 1px ${CY}` : 'none' }}><T s={13} c={p === '1' ? CY : BODY}>{p}</T></span>)}
      <span style={{ height: 26, padding: '0 10px', borderRadius: 4, boxShadow: `inset 0 0 0 1px ${LINE}`, display: 'grid', placeItems: 'center' }}><T s={13}>10 / page ▾</T></span>
    </div>
  )
}
function Table({ cols, head, rows, y = 188, h = 42 }) {
  return (
    <div style={abs(44, y, 1192, rows.length * h + h, { display: 'grid', gridTemplateColumns: cols, gridAutoRows: h })}>
      {head.map(x => <div key={x} style={{ display: 'grid', placeItems: 'center', borderBottom: '1px solid #eef0f2' }}><T s={14} w={500} c={INK}>{x}</T></div>)}
      {rows.flatMap((r, i) => r.map((cell, k) => <div key={i + '-' + k} style={{ display: 'grid', placeItems: 'center', borderBottom: '1px solid #eef0f2' }}>{cell}</div>))}
    </div>
  )
}

/* ── Sample events ── */
export function TrackEvents() {
  const cleared = useTick(800, 10)
  const rows = Array.from({ length: 10 }, (_, i) => {
    const done = i >= 7 || i < Math.max(0, cleared - 3)
    const c = done ? FAINT : BODY
    return [<T s={14} c={c}>{`M${String(i + 1).padStart(5, '0')}`}</T>, <T s={14} c={done ? FAINT : i === 1 ? RED : c}>{i === 1 ? 'High' : '-'}</T>, <T s={14} c={c}>{'Input module · allocation region ' + (i % 3 + 1)}</T>, <T s={14} c={c}>{['Centrifuge rule error', 'Barcode unreadable', 'Tube height mismatch'][i % 3]}</T>, <T s={14} c={c}>2024-01-02</T>,
      <span style={{ padding: '3px 14px', borderRadius: 12, boxShadow: `inset 0 0 0 1px ${done ? '#e1e4e6' : CY2}`, background: done ? '#f3f4f5' : CYS, transition: 'all .4s' }}><T s={12} c={done ? SUB : CY}>{done ? 'Cleared' : 'Clear'}</T></span>]
  })
  return (
    <TrackFrame nav="events">
      <Panel icon={I.stack} title="Sample events">
        <div style={abs(820, 136, 300, 30, { display: 'flex', gap: 12, justifyContent: 'flex-end' })}>
          <span style={{ height: 30, padding: '0 16px', borderRadius: 4, boxShadow: `inset 0 0 0 1px ${CY}`, background: CYS, display: 'grid', placeItems: 'center' }}><T s={14} c={CY}>Clear all</T></span>
          <span style={{ width: 170, height: 30, borderRadius: 4, boxShadow: `inset 0 0 0 1px ${LINE}`, display: 'flex', alignItems: 'center', padding: '0 10px' }}><T s={14} c="#c3c7ca">Search</T></span>
        </div>
        <Table cols="1fr 0.6fr 2.4fr 1.5fr 1fr 0.7fr" head={['Barcode', 'Priority', 'Current location', 'Error reason', 'Arrived ↕', 'Action']} rows={rows} h={40} y={184} />
        <Pager />
      </Panel>
      <div style={abs(1100, 96, 160, 170, { background: '#fff', borderRadius: 6, boxShadow: '0 14px 34px rgba(0,40,50,0.16)', padding: 8, animation: 'trPop .3s both' })}>
        {[[I.clock, 'Timed-out samples'], [I.list, 'System events'], [I.stack, 'Sample events', true]].map(([d, l, on]) => <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 10px', borderRadius: 5, background: on ? CYS : 'transparent' }}><Ico d={d} c={on ? CY : BODY} s={18} /><T s={14} c={on ? CY : BODY} w={on ? 600 : 400}>{l}</T></div>)}
      </div>
    </TrackFrame>
  )
}

/* ── Maintenance tasks ── */
export function TrackTasks() {
  const t = useTick(1000, 10)
  const due = [6, 9]
  const rows = Array.from({ length: 10 }, (_, i) => {
    const late = due.includes(i), c = late ? RED : BODY, hi = i === t
    return [<T s={14} c={c}>{`M${String(i + 1).padStart(5, '0')}`}</T>, <T s={14} c={c}>3d</T>, <T s={14} c={c}>2023-11-18 11:48:52</T>, <T s={14} c={c}>{['Check centrifuge', '-', '-', 'Clean gripper', 'Replace filter', '-', '-', 'Replace filter', '-', '-'][i]}</T>, <T s={14} c={c}>{late ? '2023-12-28' : ['2024-02-27', '2024-02-25', '2024-02-24', '2024-01-02', '2024-01-02', '2024-01-02', '', '2024-01-02', '2024-01-02'][i]}</T>,
      <span style={{ padding: '3px 12px', borderRadius: 12, background: late ? '#fff0f0' : CYS, boxShadow: `inset 0 0 0 1px ${late ? '#ffc9c9' : CY2}`, transform: hi ? 'scale(1.08)' : 'none', transition: 'transform .3s' }}><T s={12} c={late ? RED : CY}>{late ? 'Overdue' : 'Scheduled'}</T></span>]
  })
  return (
    <TrackFrame nav="tasks">
      <Panel icon={I.tools} title="Maintenance tasks" extra={<span style={{ marginLeft: 24, display: 'flex', gap: 18 }}><T s={13} c={CY} style={{ borderBottom: `2px solid ${CY}`, paddingBottom: 3 }}>Task list</T><T s={13}>History (completed)</T></span>}>
        <div style={abs(1206, 140, 24, 24)}><Ico d={I.refresh} c={FAINT} s={20} /></div>
        <Table cols="1fr 0.8fr 1.6fr 1.3fr 1.3fr 0.8fr" head={['Task', 'Interval', 'Next maintenance', 'Content', 'Planned ↕', 'Status']} rows={rows} h={40} y={184} />
        <Pager />
      </Panel>
    </TrackFrame>
  )
}

/* ── Unit control ── */
export function TrackUnits() {
  const t = useTick(1400, 5)
  const cards = [
    ['Run / Pause', 'Tip: tap "Resume" to restore the running state', 'M12 3l5 9h-3v8h-4v-8H7z', [['Pause', I.pause], ['Resume', I.play]]],
    ['Initialize unit', 'The unit resets to its default state after initializing', I.units, [['Initialize', I.clock]]],
    ['Lock / Unlock cover', 'After unlocking, the cover can be opened', I.lock, [['Lock', I.lock], ['Unlock', I.unlock]]],
    ['Bypass unit', 'Bypass this unit so the line keeps running', 'M6 4v6a4 4 0 004 4h8M15 10l3 4-3 4', [['Connect', I.units], ['Bypass', 'M4 12h16']]],
    ['Disable unit', 'A disabled unit leaves the line', 'M5 5l14 14M12 21a9 9 0 100-18 9 9 0 000 18z', [['Enable', I.play], ['Disable', 'M5 5l14 14']]],
  ]
  return (
    <TrackFrame nav="units">
      <Panel icon={I.units} title="Unit control">
        {cards.map(([ti, d, icon, btns], i) => {
          const x = 100 + (i % 3) * 385, y = 196 + Math.floor(i / 3) * 226, on = t === i
          return (
            <div key={ti} style={abs(x, y, 320, 180, { borderRadius: 10, background: '#fff', boxShadow: on ? `0 0 0 1.5px ${CY2}, 0 16px 34px rgba(11,197,209,0.18)` : '0 0 0 1px #eceff1, 0 8px 22px rgba(0,0,0,0.06)', overflow: 'hidden', transition: 'box-shadow .4s' })}>
              <div style={abs(18, 70, 120, 120, { opacity: 0.09 })}><Ico d={icon} c={INK} s={112} sw={1.3} /></div>
              <span style={abs(28, 30, 280, 30)}><T s={22} w={700} c={INK}>{ti}</T></span>
              <span style={abs(28, 64, 280, 18)}><T s={11.5} c={SUB}>{d}</T></span>
              <div style={abs(0, 126, 300, 30, { display: 'flex', justifyContent: 'flex-end', gap: 10 })}>
                {btns.map(([l, ic], k) => {
                  const primary = k === 0, press = on && btns.length > 1 && k === 1
                  return <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 30, padding: '0 16px', borderRadius: 15, boxShadow: `inset 0 0 0 1px ${press ? CY : primary ? BODY : '#e1e4e6'}`, background: press ? CY : '#fff', transition: 'all .3s' }}><Ico d={ic} s={14} c={press ? '#fff' : primary ? BODY : '#c3c7ca'} /><T s={13} c={press ? '#fff' : primary ? INK : '#c3c7ca'}>{l}</T></span>
                })}
              </div>
            </div>
          )
        })}
      </Panel>
    </TrackFrame>
  )
}

/* ── Device + its own screen, magnified: the small on-device display runs the live Home,
   and a large window shows the same screen, joined to it by connector lines.
   device-front.webp is 1456 x 1080 (front view, own light backdrop); screen spans x 350–525, y 103–223. ── */
const IMG_W = 1456, IMG_H = 1080, SCR = { x: 350, y: 103, w: 175, h: 120 }
// fade the photo's own backdrop into whatever sits behind it
const EDGE_FADE = { WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 4%, #000 96%, transparent 100%), linear-gradient(to bottom, transparent 0, #000 1.5%, #000 92%, transparent 100%)', WebkitMaskComposite: 'source-in', maskImage: 'linear-gradient(to right, transparent 0, #000 4%, #000 96%, transparent 100%), linear-gradient(to bottom, transparent 0, #000 1.5%, #000 92%, transparent 100%)', maskComposite: 'intersect' }

export function DeviceZoom({ device, screen = <TrackHome />, cw = 1600, ch = 900, annotate }) {
  const D = { x: 60, y: 262, w: 740 }, k = D.w / IMG_W
  const S = { x: D.x + SCR.x * k, y: D.y + SCR.y * k, w: SCR.w * k, h: SCR.h * k }
  const Z = { x: 720, y: 118, w: 820, h: 820 / 1.6 }
  const floorY = D.y + IMG_H * k - 14
  const Screen = ({ w, h }) => (
    <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 800, transform: `scale(${w / 1280}, ${h / 800})`, transformOrigin: '0 0' }}>{screen}</div>
    </div>
  )
  const A1 = [S.x + S.w, S.y], A2 = [S.x + S.w, S.y + S.h], B1 = [Z.x, Z.y + 10], B2 = [Z.x, Z.y + Z.h - 10]
  return (
    <div style={{ position: 'relative', width: cw, height: ch }}>
      <img src={device} alt="YHLO iTLA track unit" style={abs(D.x, D.y, D.w, IMG_H * k, EDGE_FADE)} />
      <div style={abs(S.x, S.y, S.w, S.h, { borderRadius: 2, overflow: 'hidden', boxShadow: `0 0 0 1px #000, 0 0 14px ${CY}88` })}><Screen w={S.w} h={S.h} /></div>
      {/* beam */}
      <svg width={cw} height={ch} style={abs(0, 0, cw, ch, { pointerEvents: 'none' })}>
        <defs>
          <linearGradient id="dzBeam" x1="0" x2="1"><stop offset="0" stopColor={CY} stopOpacity="0.22" /><stop offset="1" stopColor={CY} stopOpacity="0.02" /></linearGradient>
          <linearGradient id="dzLine" x1="0" x2="1"><stop offset="0" stopColor={CY} stopOpacity="0.9" /><stop offset="1" stopColor={CY} stopOpacity="0.15" /></linearGradient>
        </defs>
        <polygon points={`${A1} ${B1} ${B2} ${A2}`} fill="url(#dzBeam)" />
        <line x1={A1[0]} y1={A1[1]} x2={B1[0]} y2={B1[1]} stroke="url(#dzLine)" strokeWidth="1" />
        <line x1={A2[0]} y1={A2[1]} x2={B2[0]} y2={B2[1]} stroke="url(#dzLine)" strokeWidth="1" />
        {[A1, A2].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke={CY} strokeWidth="1.5" />)}
      </svg>
      {/* magnified screen */}
      <div style={abs(Z.x, Z.y, Z.w, Z.h, { borderRadius: 18, padding: 7, boxSizing: 'border-box', background: 'linear-gradient(160deg, #2a2f33 0%, #0d1012 60%)', boxShadow: '0 1px 0 rgba(255,255,255,0.35) inset, 0 0 0 1px rgba(0,0,0,0.25), 0 30px 60px rgba(15,60,70,0.16), 0 60px 120px rgba(15,60,70,0.12)' })}>
        <div style={{ borderRadius: 11, overflow: 'hidden', position: 'relative' }}>
          <Screen w={Z.w - 14} h={Z.h - 14} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 28%)', pointerEvents: 'none' }} />
        </div>
      </div>
      {annotate && (
        <div style={abs(70, 64, 560, 90, { fontFamily: '"SF Mono", Menlo, monospace', letterSpacing: '0.12em' })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, color: '#0e6f76' }}><span style={{ width: 11, height: 11, borderRadius: '50%', background: CY, boxShadow: `0 0 0 4px ${CY}33` }} />iTLA 8000-4</div>
          <div style={{ marginTop: 12, fontSize: 19, color: '#8fa3a6' }}>TRACK UNIT · UI REDESIGN</div>
        </div>
      )}
    </div>
  )
}

/* ── Device alone, with the live Home on its own display ── */
export function DeviceOnly({ device, x = 0, y = 0, w = 1000, shadow = true }) {
  const k = w / IMG_W, S = { x: SCR.x * k, y: SCR.y * k, w: SCR.w * k, h: SCR.h * k }
  return (
    <div style={abs(x, y, w, IMG_H * k)}>
      {shadow && <div style={abs(w * 0.04, IMG_H * k - 30, w * 0.92, 60, { background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(10,40,50,0.22) 0%, rgba(10,40,50,0) 70%)' })} />}
      <img src={device} alt="YHLO iTLA track unit" style={abs(0, 0, w, IMG_H * k, EDGE_FADE)} />
      <div style={abs(S.x, S.y, S.w, S.h, { borderRadius: 3, overflow: 'hidden', boxShadow: '0 0 0 1px #000' })}>
        <div style={{ width: 1280, height: 800, transform: `scale(${S.w / 1280}, ${S.h / 800})`, transformOrigin: '0 0' }}><TrackHome /></div>
      </div>
    </div>
  )
}
