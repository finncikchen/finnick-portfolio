import { useEffect, useRef, useState } from 'react'
import { FONT, KEYFRAMES } from './kit'
import { TicketDetail } from './screens'

// The laptop screen on the home cover: the real ticket screen, drawn live so its text stays sharp,
// and laid out narrower than the desktop so it reads at card size. Rests on the ticket; plays while live.
const CW = 1000, CH = 645, BAR = 26
const START = { screen: 'detail', step: 2 }
const REST = [760, 470]
const MESSAGE = 'Dear Wei, please upload the invoice number ASAP.'
const LOG = ['Manual reminder sent', `"${MESSAGE}"`, 'Cheng ZHANG · just now']

// Canvas position of a hot spot. The screen sits under a 3D transform, so client rects can't be used here.
function hotPoint(root, hot) {
  const el = root.querySelector(`[data-hot="${hot}"]`)
  if (!el) return null
  let x = el.offsetWidth / 2, y = el.offsetHeight / 2
  for (let n = el; n && n !== root; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop }
  return [x, y]
}

export default function ScreenLoop({ live }) {
  const outer = useRef(null), canvas = useRef(null)
  const [size, setSize] = useState([1, 1])
  const [s, setS] = useState(START)
  const [cur, setCur] = useState(REST)

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize([e.contentRect.width, e.contentRect.height]))
    ro.observe(outer.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!live) { setS(START); setCur(REST); return }
    let alive = true
    const sleep = ms => new Promise(r => setTimeout(r, ms))
    const click = async (hot, then) => {
      const p = hotPoint(canvas.current, hot)
      if (p) { setCur([p[0], p[1]]); await sleep(620) }
      if (!alive) return
      setS(x => ({ ...x, press: hot })); await sleep(170)
      if (alive) setS(x => ({ ...x, press: null, ...then }))
    }
    ;(async () => {
      await sleep(250)
      await click('btn-remind', { modal: 'remind', focus: 'msg' })
      await sleep(250)
      for (let c = 1; c <= MESSAGE.length && alive; c++) { setS(x => ({ ...x, msg: MESSAGE.slice(0, c) })); await sleep(18) }
      if (!alive) return
      await click('modal-ok', { modal: null, focus: null, toast: 'Reminder sent to Wei KANG', logs: [LOG] })
    })()
    return () => { alive = false }
  }, [live])

  return (
    <div ref={outer} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#fff', fontFamily: FONT }}>
      <style>{KEYFRAMES}</style>
      <div ref={canvas} style={{ position: 'absolute', left: 0, top: 0, width: CW, height: CH, overflow: 'hidden', transformOrigin: '0 0', transform: `scale(${size[0] / CW}, ${size[1] / CH})` }}>
        {/* The app sits below the notch, as it would under a menu bar */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: BAR, bottom: 0 }}><TicketDetail s={s} /></div>
        <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 50, pointerEvents: 'none', transform: `translate(${cur[0]}px, ${cur[1]}px)`, transition: 'transform .6s cubic-bezier(.6,0,.25,1)' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" style={{ position: 'absolute', left: -4, top: -3, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.3))' }}><path d="M4 2l15 10.5-6.6 1.3 3.8 7.3-2.8 1.4-3.8-7.3L4 20z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  )
}
