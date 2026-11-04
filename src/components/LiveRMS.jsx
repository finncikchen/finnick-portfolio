import { useEffect, useRef, useState } from 'react'

import base from '../assets/images/bytedance/hero-screen.png'
import robot from '../assets/images/bytedance/live/robot.png'
import row0 from '../assets/images/bytedance/live/row0.png'
import row1 from '../assets/images/bytedance/live/row1.png'
import row2 from '../assets/images/bytedance/live/row2.png'
import fav0 from '../assets/images/bytedance/live/fav0.png'
import fav1 from '../assets/images/bytedance/live/fav1.png'
import fav2 from '../assets/images/bytedance/live/fav2.png'
import fav3 from '../assets/images/bytedance/live/fav3.png'
import fav4 from '../assets/images/bytedance/live/fav4.png'
import fav5 from '../assets/images/bytedance/live/fav5.png'
import fav6 from '../assets/images/bytedance/live/fav6.png'
import fav7 from '../assets/images/bytedance/live/fav7.png'
import fav8 from '../assets/images/bytedance/live/fav8.png'

// Base is the untouched Figma export (1470×919). Every animated piece below is a crop of that
// same export laid back over its exact source box, so the resting state is pixel-identical.
const DW = 1470
const DH = 919
const CARD = 'rgb(252,252,254)'

const box = ([x0, y0, x1, y1], extra) => ({ position: 'absolute', left: x0, top: y0, width: x1 - x0, height: y1 - y0, ...extra })

const ROWS = [row0, row1, row2]
const ROW_Y = [628, 691, 754]
const FAVS = [
  [fav0, [1196, 191, 1233, 228]], [fav1, [1288, 191, 1325, 228]], [fav2, [1377, 191, 1414, 228]],
  [fav3, [1196, 286, 1233, 323]], [fav4, [1286, 286, 1323, 323]], [fav5, [1377, 286, 1414, 323]],
  [fav6, [1196, 381, 1233, 418]], [fav7, [1286, 381, 1323, 418]], [fav8, [1377, 381, 1414, 418]],
]
const BAR_Y = [665, 692, 719, 746, 773, 800]
const BAR_W = [92, 69, 160, 58, 87, 24]
const BAR_C = ['rgb(29,78,216)', 'rgb(37,99,235)', 'rgb(59,130,246)', 'rgb(91,155,255)', 'rgb(131,184,255)', 'rgb(183,216,255)']


const INK_A = 'rgb(17,24,39)'
const INK_B = 'rgb(15,23,42)'
const INK_C = 'rgb(37,49,66)'
const BLUE_A = 'rgb(37,99,255)'
const BLUE_B = 'rgb(29,78,216)'
const LIGHT = 'rgb(242,248,255)'
// [x0, y0, x1, y1, cover color, text color] measured from the Figma export
const NUM_BOX = {
  inProg: [321, 237, 357, 253, LIGHT, BLUE_A],
  abnormal: [449, 237, 485, 253, LIGHT, INK_A],
  completed: [572, 237, 619, 253, LIGHT, INK_A],
  avg: [889, 244, 945, 261, LIGHT, INK_B],
  durations: [857, 355, 977, 371, LIGHT, INK_B],
  supply: [875, 465, 958, 480, LIGHT, INK_B],
  rTotal: [420, 364, 428, 376, 'rgb(241,248,255)', INK_B],
  rProg: [518, 364, 526, 376, 'rgb(241,248,255)', BLUE_A],
  rIdle: [616, 364, 624, 376, 'rgb(238,246,255)', INK_B],
  rCharging: [420, 440, 426, 452, 'rgb(241,248,255)', INK_B],
  rOffline: [518, 440, 526, 452, 'rgb(241,248,255)', INK_B],
  rLow: [615, 440, 625, 452, 'rgb(238,246,255)', INK_B],
}
const CNT_Y = [[664, 675], [691, 702], [719, 729], [746, 756], [773, 783], [799, 810]]

function useDigitRatio() {
  const [r] = useState(() => {
    const ctx = document.createElement('canvas').getContext('2d')
    ctx.font = `100px ${NUM_FONT}`
    return ctx.measureText('0123456789').actualBoundingBoxAscent / 100 || 0.72
  })
  return r
}
const NUM_FONT = '"PingFang SC", "SF Pro Text", -apple-system, Inter, sans-serif'

function fmtAvg(sec) {
  const m = Math.floor(sec / 60), s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function LiveRMS() {
  const wrap = useRef(null)
  const [scale, setScale] = useState(0.5)
  const [bars, setBars] = useState(BAR_W.map(() => 0))
  const [shift, setShift] = useState(0)
  const [hover, setHover] = useState(null)
  const ratio = useDigitRatio()
  const [vals, setVals] = useState({ inProg: 583, abnormal: 879, completed: 1879, avg: 1200, d: [8, 6, 3, 5], sup: [4, 2, 7], r: [6, 0, 5, 1, 5, 4] })

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / DW))
    ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setBars(BAR_W), 400)
    const a = setInterval(() => setBars(BAR_W.map(w => Math.max(12, Math.min(160, w + Math.round(Math.random() * 30 - 15))))), 2800)
    const b = setInterval(() => setShift(s => (s + 1) % 3), 3800)
    const c = setInterval(() => setVals(v => {
      const j = (x, lo, hi, step = 1) => Math.max(lo, Math.min(hi, x + Math.round((Math.random() * 2 - 1) * step)))
      const prog = j(v.r[1], 0, 3)
      return {
        inProg: j(v.inProg, 560, 610, 4),
        abnormal: j(v.abnormal, 860, 900, 2),
        completed: v.completed + 1 + Math.round(Math.random() * 2),
        avg: j(v.avg, 1140, 1260, 9),
        d: v.d.map((x, i) => j(x, [6, 4, 2, 3][i], [10, 8, 5, 7][i])),
        sup: v.sup.map((x, i) => j(x, [2, 1, 5][i], [6, 4, 9][i])),
        r: [6, prog, Math.max(0, 5 - prog), 1, 5, j(v.r[5], 3, 5)],
      }
    }), 1700)
    return () => { clearTimeout(t); clearInterval(a); clearInterval(b); clearInterval(c) }
  }, [])

  return (
    <div ref={wrap} style={{ width: '100%', aspectRatio: `${DW}/${DH}`, position: 'relative', overflow: 'hidden', borderRadius: 14 }}>
      <style>{`
        @keyframes rms-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-5px) } }
        @keyframes rms-row { from { transform: translateY(-18px); opacity: 0 } to { transform: none; opacity: 1 } }
        @keyframes rms-pulse { 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: .3; transform: scale(.7) } }
      `}</style>
      <div style={{ width: DW, height: DH, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', left: 0, top: 0 }}>
        <img src={base} alt="RMS homepage dashboard" style={{ position: 'absolute', inset: 0, width: DW, height: DH, display: 'block' }} />


        <svg width={DW} height={DH} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {Object.entries({
            inProg: vals.inProg, abnormal: vals.abnormal, completed: vals.completed, avg: fmtAvg(vals.avg),
            durations: vals.d.join(' / '), supply: vals.sup.join(' / '),
            rTotal: vals.r[0], rProg: vals.r[1], rIdle: vals.r[2], rCharging: vals.r[3], rOffline: vals.r[4], rLow: vals.r[5],
          }).map(([k, text]) => {
            const [x0, y0, x1, y1, bg, fg] = NUM_BOX[k]
            const h = y1 - y0
            const pad = k === 'durations' || k === 'supply' ? 16 : 8
            return (
              <g key={k}>
                <rect x={x0 - pad} y={y0 - 3} width={x1 - x0 + pad * 2} height={h + 6} fill={bg} />
                <text x={(x0 + x1) / 2} y={y1} textAnchor="middle" fontFamily={NUM_FONT} fontSize={h / ratio} fill={fg} style={{ fontVariantNumeric: 'tabular-nums' }}>{text}</text>
              </g>
            )
          })}
          {CNT_Y.map(([y0, y1], i) => (
            <g key={i}>
              <rect x={560} y={y0 - 3} width={34} height={y1 - y0 + 6} fill="rgb(252,252,254)" />
              <text x={566} y={y1} fontFamily={NUM_FONT} fontSize={(y1 - y0) / ratio} fill={i === 0 ? BLUE_B : INK_C}>{Math.max(1, Math.round(bars[i] / 11.4))}</text>
            </g>
          ))}
        </svg>
        <div style={box([270, 331, 358, 528], { background: 'rgb(240,247,255)' })}>
          <img src={robot} alt="" style={{ display: 'block', width: '100%', height: '100%', animation: 'rms-float 3.6s ease-in-out infinite' }} />
        </div>

        {BAR_Y.map((y, i) => (
          <div key={y} style={box([364, y - 2, 530, y + 7], { background: CARD, padding: '2px 3px', boxSizing: 'border-box' })}>
            <div style={{ height: 5, background: 'rgb(234,242,251)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: bars[i], background: BAR_C[i], borderRadius: 3, transition: 'width 1.2s cubic-bezier(.4,0,.2,1)' }} />
            </div>
          </div>
        ))}

        <div style={box([664, 628, 1130, 812], { background: CARD, overflow: 'hidden' })}>
          {[0, 1, 2].map(slot => {
            const src = ROWS[(slot + shift) % 3]
            return (
              <img key={`${shift}-${slot}`} src={src} alt="" style={{ position: 'absolute', left: 0, top: ROW_Y[slot] - 628, width: 466, height: 58, display: 'block', animation: slot === 0 ? 'rms-row .6s ease both' : 'none' }} />
            )
          })}
          <span style={{ position: 'absolute', left: 452, top: 12, width: 7, height: 7, borderRadius: '50%', background: 'rgb(30,107,255)', animation: 'rms-pulse 1.2s ease-in-out infinite' }} />
        </div>

        {FAVS.map(([src, b], i) => (
          <div key={i} style={box(b, { background: CARD })}>
            <img src={src} alt="" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer', transition: 'transform .2s, filter .2s', transform: hover === i ? 'translateY(-4px)' : 'none', filter: hover === i ? 'drop-shadow(0 6px 10px rgba(30,107,255,.3))' : 'none' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
