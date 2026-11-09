import { Hexagon, LayoutDashboard, WandSparkles, X } from 'lucide-react'
import { Stage } from '../../vendor/stageshow/stage'
import './InsightCover.css'

// The home cover for Cisco: the AI Insights cards, lifted out of the page and set on the background.
// Three cards of glass breathe in as they load, the critical one comes forward and turns solid, its action runs
// and it lands on the product's own done state and toast. Cards, states and copy are the product's.

// The real status icon: a red hexagon with a white cross
function Alert({ size = 18 }) {
  return (
    <span className="ic-alert" style={{ width: size, height: size }}>
      <Hexagon size={size * 1.08} strokeWidth={2.5} fill="currentColor" />
      <X size={size * 0.56} strokeWidth={3.5} />
    </span>
  )
}

function Words({ text }) {
  return text.split(' ').map((word, i) => <span key={i} className="ic-word" style={{ '--i': i }}>{word} </span>)
}

function Skeleton() {
  return (
    <div className="ic-skeleton">
      <i className="ic-bar" style={{ width: '46%', left: 42, top: 19 }}><b /></i>
      <i className="ic-bar" style={{ width: '86%', left: 16, top: 52 }}><b /></i>
      <i className="ic-bar" style={{ width: '62%', left: 16, top: 72 }}><b /></i>
    </div>
  )
}

// What every card is made of: its shadow, its glow, its surface and the dot field
function Shell({ className, face, children }) {
  return (
    <div className={`ic-obj ic-card ${className}`} data-face={face}>
      <i className="ic-shade" />
      <i className="ic-halo" />
      <div className="ic-breath">
        <i className="ic-plate" />
        <i className="ic-field" />
        <i className="ic-pulse"><b /><b /></i>
        {children}
      </div>
    </div>
  )
}

function Insight({ face }) {
  return (
    <Shell className="ic-insight" face={face}>
      <Skeleton />
      <span className="ic-mark"><Alert /></span>
      <div className="ic-face ic-ready" data-on={face === 'ready' || undefined}>
        <div className="ic-title"><Words text="Power Supply 1 lost input" /></div>
        <div className="ic-desc"><Words text="Power Supply 1 has lost input or the input is out of range. Check the power source or replace the power supply." /></div>
        <div className="ic-btns">
          <span className="ic-btn" data-target="led" data-cursor="hand"><WandSparkles size={13} strokeWidth={2.25} />Turn on Locator LED</span>
          <span className="ic-btn ic-btn--quiet"><LayoutDashboard size={13} strokeWidth={2.25} />Open in Canvas</span>
        </div>
      </div>
      <div className="ic-face ic-run" data-on={face === 'run' || undefined}>
        <div className="ic-title">Turning on Locator LED</div>
        <div className="ic-desc">Sending the command to the server…</div>
      </div>
      <div className="ic-face ic-done" data-on={face === 'done' || undefined}>
        <span className="ic-check"><svg viewBox="0 0 20 20" width="20" height="20" aria-hidden><path d="M5 10.5l3.4 3.4L15 7" pathLength="1" /></svg></span>
        <div>Locator LED is on</div>
      </div>
    </Shell>
  )
}

function Toast({ on }) {
  return (
    <div className="ic-toast" data-on={on || undefined}>
      <span className="ic-toast-check"><svg viewBox="0 0 20 20" width="15" height="15" aria-hidden><path d="M5 10.5l3.4 3.4L15 7" pathLength="1" /></svg></span>
      <div><b>Action successful</b>Locator LED has been turned on.</div>
    </div>
  )
}

// The still the card rests on until it scrolls into view: the logo on its background
const RESTING = { live: false, hand: false, scene: 'rest', face: 'load', toast: false }
const REST = { x: 770, y: 440 }

async function script(a) {
  await a.set({ live: true, hand: true, scene: 'load' })
  await a.wait(1150)
  a.mark('forward')
  await a.set({ scene: 'ask' })
  await a.wait(180)
  await a.set({ face: 'ready' })
  await a.wait(760)
  await a.enter({ at: 'led', x: 0.5, y: 0.6 })
  await a.click({ at: 'led', x: 0.5, y: 0.6 })
  a.mark('run')
  await a.set({ face: 'run', hand: false })
  a.move(REST, { duration: 200 })
  await a.wait(1200)
  a.mark('done')
  await a.set({ face: 'done' })
  await a.wait(320)
  await a.set({ toast: true })
  await a.wait(1400)
  a.mark('end')
  await a.set(RESTING)
  // The logo holds a moment before the cards come in again
  await a.wait(1600)
}

export default function InsightCover() {
  return (
    <Stage
      width={720}
      height={405}
      fill
      unframed
      initial={RESTING}
      play="loop"
      inViewAt={0.6}
      poster={{ ...RESTING, live: true, scene: 'ask', face: 'done', toast: true }}
      script={script}
      cursor={{ at: REST, style: 'large', ripple: true }}
      tokens={{ '--ss-font': 'Inter, system-ui, sans-serif' }}
      className="ic"
    >
      {s => (
        <div className="ic-scene" data-scene={s.scene} data-toast={s.toast || undefined} data-live={s.live || undefined} data-hand={s.hand || undefined}>
          <i className="ic-bg" />
          <i className="ic-logo" />
          <Shell className="ic-side" face="load"><Skeleton /></Shell>
          <Shell className="ic-side ic-side--right" face="load"><Skeleton /></Shell>
          <Insight face={s.face} />
          <Toast on={s.toast} />
        </div>
      )}
    </Stage>
  )
}
