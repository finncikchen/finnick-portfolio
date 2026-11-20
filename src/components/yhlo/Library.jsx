import { useEffect, useState } from 'react'
import { F, SUB } from '../caseTokens'
import { Scaled } from '../bosch/Dashboard'
import rocket from '../../assets/images/yhlo/units/rocket.svg'
import artInit from '../../assets/images/yhlo/units/init.webp'
import artLock from '../../assets/images/yhlo/units/lock.webp'
import artDisable from '../../assets/images/yhlo/units/disable.webp'

// The ITLA design library, shown as live parts instead of the old slide.
// Specs follow the YHLO Figma components (亚辉龙 file); icons are the original vectors (28:17855, 28:17913).
const ICONS = import.meta.glob('../../assets/images/yhlo/icons/*.svg', { eager: true, import: 'default' })
const ic = n => ICONS[`../../assets/images/yhlo/icons/${n}.svg`]

const CY = '#0bc5d1', BODY = '#434343', MUTE = '#838484', LINE = '#d9d9d9'
const UI = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const WASH = 'radial-gradient(ellipse 70% 90% at 92% 0%,rgba(102,223,231,0.18) 0%,rgba(102,223,231,0) 62%),linear-gradient(180deg,#f6fbfc 0%,#ecf5f6 100%)'

const CSS = `
.yl-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.4vw,20px);row-gap:clamp(28px,3vw,40px)}
.yl-full{grid-column:1/-1}
.yl-tile{border-radius:24px;overflow:hidden;background:${WASH}}
.yl-cell{height:clamp(240px,22vw,300px);display:grid;grid-template-columns:minmax(0,1fr);place-items:center;padding:24px;box-sizing:border-box}
.yl-cap{font-family:${F};font-size:13px;color:${SUB};margin:12px 0 0}
.yl-strip{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));row-gap:clamp(18px,2.4vw,30px);padding:clamp(28px,3.4vw,44px) clamp(16px,3vw,40px)}
.yl-x{transition:opacity .35s ease,color .35s ease}
@media (max-width:900px){.yl-grid{grid-template-columns:minmax(0,1fr)}.yl-strip{grid-template-columns:repeat(8,minmax(0,1fr))}}
@media (max-width:640px){.yl-strip{grid-template-columns:repeat(6,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){.yl-x{transition:none}}
`

function useTick(ms, n) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI(x => (x + 1) % n), ms)
    return () => clearInterval(id)
  }, [ms, n])
  return i
}

const Icon = ({ n, s = 22, style }) => <img src={ic(n)} alt="" width={s} height={s} style={{ display: 'block', ...style }} />
const Cell = ({ cap, full, children }) => (
  <figure style={{ margin: 0 }} className={full ? 'yl-full' : undefined}>
    <div className="yl-tile">{children}</div>
    <figcaption className="yl-cap">{cap}</figcaption>
  </figure>
)

/* Navigation (Figma Component 1/3/33): flat tabs; the active one gets the light fill, a cyan border and the filled icon */
function Nav({ bare }) {
  const tabs = [['Home', 'home'], ['Units', 'units'], ['Tasks', 'tasks'], ['Events', 'events'], ['Timeouts', 'timeout']]
  const a = useTick(1600, tabs.length)
  return (
    <div style={{ display: 'flex', gap: 6, padding: bare ? 0 : 10, borderRadius: 10, background: bare ? 'transparent' : '#fff' }}>
      {tabs.map(([l, n], i) => {
        const on = a === i
        return (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 56, padding: '0 18px', boxSizing: 'border-box', borderRadius: 5, background: on ? '#ecfbfa' : 'transparent', border: `1.6px solid ${on ? CY : 'transparent'}`, color: on ? CY : BODY, fontFamily: UI, fontSize: 16, whiteSpace: 'nowrap' }}>
            <Icon n={on ? `${n}-fill` : n} s={20} />{l}
          </span>
        )
      })}
    </div>
  )
}

/* Status tags */
function Tags() {
  const tags = [['Notice', CY, 'rgba(11,197,209,0.12)'], ['Minor', '#fa8c16', 'rgba(250,140,22,0.12)'], ['Severe', '#fb4d51', 'rgba(251,77,81,0.12)']]
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {tags.map(([l, c, bg]) => <span key={l} style={{ fontFamily: UI, fontSize: 14, color: c, background: bg, padding: '6px 16px', borderRadius: 99 }}>{l}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <span style={{ fontFamily: UI, fontSize: 14, color: CY, background: '#ecfbfa', boxShadow: `inset 0 0 0 1px ${CY}`, padding: '6px 16px', borderRadius: 99 }}>View</span>
        <span style={{ fontFamily: UI, fontSize: 14, color: MUTE, background: '#eef0f2', padding: '6px 16px', borderRadius: 99 }}>Done</span>
      </div>
    </div>
  )
}

/* Pill buttons (Figma unit control_card_*): outlined when available, 30% when not. Pressing one hands the turn to its partner */
const Btn = ({ icon, label, off }) => (
  <span className="yl-x" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 32, padding: '0 15px', boxSizing: 'border-box', borderRadius: 40, background: '#fff', border: `1.2px solid ${MUTE}`, opacity: off ? 0.3 : 1, fontFamily: UI, fontSize: 13, color: BODY, whiteSpace: 'nowrap' }}>
    <Icon n={icon} s={15} />{label}
  </span>
)
function Buttons() {
  const rows = [[['pause', 'Pause'], ['run', 'Resume']], [['lock', 'Lock'], ['unlock', 'Unlock']], [['run', 'Enable'], ['disable', 'Disable']]]
  const t = useTick(1300, rows.length * 2)
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {rows.map(([a, b], r) => {
        const flipped = Math.floor(t / 2) === r && t % 2 === 1
        return <div key={a[1]} style={{ display: 'flex', gap: 12 }}><Btn icon={a[0]} label={a[1]} off={flipped} /><Btn icon={b[0]} label={b[1]} off={!flipped} /></div>
      })}
    </div>
  )
}

/* Run / Pause card (Figma 28:17980), flipping between running and paused */
function UnitCard() {
  const paused = useTick(2200, 2) === 1
  return (
    <div style={{ position: 'relative', width: 320, flex: 'none', height: 182, boxSizing: 'border-box', borderRadius: 12.8, background: '#fff', border: '1.4px solid #dadada', boxShadow: '0 2.8px 15.8px rgba(0,0,0,0.17)', overflow: 'hidden', fontFamily: UI }}>
      <div style={{ position: 'absolute', left: 0, top: 51, width: 146, height: 128, overflow: 'hidden' }}>
        <img src={rocket} alt="" style={{ position: 'absolute', left: 2.1, top: 12.8, transform: 'scale(0.889)', transformOrigin: '0 0', display: 'block' }} />
      </div>
      <span style={{ position: 'absolute', left: 27, top: 27, fontSize: 20, fontWeight: 700, color: BODY, lineHeight: '26px' }}>Run / Pause</span>
      <span className="yl-x" style={{ position: 'absolute', left: 154, top: 35, display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 500, color: paused ? MUTE : CY }}>
        <Icon n="info" s={12} style={{ filter: paused ? 'none' : 'invert(62%) sepia(83%) saturate(1700%) hue-rotate(140deg) brightness(92%)' }} />{paused ? 'Paused' : 'Running'}
      </span>
      <span style={{ position: 'absolute', left: 27, top: 57, fontSize: 10, fontWeight: 300, color: '#b5b5b6' }}>{paused ? 'Tip: tap "Resume" to restore the running state' : 'Tip: tap "Pause" to stop running'}</span>
      <div style={{ position: 'absolute', right: 28, top: 120 }}>
        {paused ? <Btn icon="run" label="Resume" /> : <Btn icon="pause" label="Pause" />}
      </div>
    </div>
  )
}

/* Confirm dialog */
function Dialog() {
  return (
    <div style={{ width: 340, maxWidth: '100%', boxSizing: 'border-box', borderRadius: 14, background: '#fff', padding: '22px 24px 20px', boxShadow: '0 1px 2px rgba(15,70,80,0.06), 0 18px 40px -18px rgba(15,70,80,0.22)', fontFamily: UI }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 19, fontWeight: 700, color: CY }}>Pause the machine?</span>
        <span style={{ fontSize: 18, color: BODY, lineHeight: 1 }}>×</span>
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.5, color: MUTE, margin: '10px 0 22px' }}>The machine will pause. Check the power and the area around it.</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <span style={{ fontSize: 14, color: BODY, padding: '7px 18px', borderRadius: 6, boxShadow: `inset 0 0 0 1px ${LINE}` }}>Cancel</span>
        <span style={{ fontSize: 14, color: '#fff', background: CY, padding: '7px 18px', borderRadius: 6 }}>Pause</span>
      </div>
    </div>
  )
}

/* A static unit card (Figma unit control cards): art lower left, first action available, second at 30% */
function Card({ title, tip, art, artW, btns, x, y }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 320, height: 182, boxSizing: 'border-box', borderRadius: 12.8, background: '#fff', border: '1.4px solid #dadada', boxShadow: '0 2.8px 15.8px rgba(0,0,0,0.17)', overflow: 'hidden', fontFamily: UI }}>
      <img src={art} alt="" style={{ position: 'absolute', left: 2, top: 74, width: artW, height: 94, display: 'block' }} />
      <span style={{ position: 'absolute', left: 27, top: 27, fontSize: 20, fontWeight: 700, color: BODY, lineHeight: '26px' }}>{title}</span>
      <span style={{ position: 'absolute', left: 27, top: 57, fontSize: 10, fontWeight: 300, color: '#b5b5b6' }}>{tip}</span>
      <div style={{ position: 'absolute', right: 28, top: 120, display: 'flex', gap: 10 }}>{btns.map(([i, l], k) => <Btn key={l} icon={i} label={l} off={k === 1} />)}</div>
    </div>
  )
}

/* The wide scene: the nav bar and a row of unit cards, as they sit in the product, running off the right edge */
function Scene() {
  return (
    <Scaled w={1200} h={392}>
      <div style={{ position: 'absolute', left: 48, top: 44, width: 1200, height: 76, borderRadius: '10px 0 0 10px', background: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
        <Nav bare />
      </div>
      <div style={{ position: 'absolute', left: 48, top: 162 }}><UnitCard /></div>
      <Card x={400} y={162} title="Initialize unit" tip="The unit resets to its default state after initializing" art={artInit} artW={155} btns={[['init', 'Initialize']]} />
      <Card x={752} y={162} title="Lock / Unlock cover" tip="After unlocking, the cover can be opened" art={artLock} artW={107} btns={[['lock', 'Lock'], ['unlock', 'Unlock']]} />
      <Card x={1104} y={162} title="Disable unit" tip="A disabled unit leaves the line" art={artDisable} artW={105} btns={[['run', 'Enable'], ['disable', 'Disable']]} />
    </Scaled>
  )
}

/* Icon set: line icons next to their filled, selected versions */
const SET = ['home', 'home-fill', 'units', 'units-fill', 'tasks', 'tasks-fill', 'ctrl', 'ctrl-fill', 'events', 'events-fill', 'timeout', 'timeout-fill',
  'snap', 'bell-fill', 'stack-fill', 'vent', 'info', 'pause', 'run', 'init', 'bypass', 'disable', 'lock', 'unlock']

export default function Library() {
  return (
    <div className="yl-grid">
      <style>{CSS}</style>
      <Cell full cap="Navigation and unit cards, as they sit in the product"><Scene /></Cell>
      <Cell cap="Buttons: outlined when available, faded when not"><div className="yl-cell"><Buttons /></div></Cell>
      <Cell cap="Status tags"><div className="yl-cell"><Tags /></div></Cell>
      <Cell cap="Confirm dialog"><div className="yl-cell"><Dialog /></div></Cell>
      <Cell full cap="Icons: line by default, filled when selected">
        <div className="yl-strip">{SET.map(n => <div key={n} style={{ display: 'grid', placeItems: 'center' }}><Icon n={n} s={30} /></div>)}</div>
      </Cell>
    </div>
  )
}
