import { useEffect, useRef, useState } from 'react'
import { ScaledWarehouse } from './LiveWarehouse'
import YhloCover from './YhloCover'
import fsLoop from '../assets/images/flowerstar/thumb-loop.mp4'
import fsPoster from '../assets/images/flowerstar/thumb-poster.jpg'
import cdUI from '../assets/images/colordiary-ui.webp'

const SPRING = 'cubic-bezier(0.32,0.72,0,1)'
const fill = { position: 'absolute', inset: 0 }
const media = { ...fill, width: '100%', height: '100%', objectFit: 'cover' }
const grain = (size, freq) => `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`

// Maps a flat screen onto the device in a photo. Coefficients are fractions of the cover's size.
function useHomography([a, b, c, d, e, f, g, h]) {
  const ref = useRef(null)
  const [matrix, setMatrix] = useState('none')
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth, H = el.clientHeight
      setMatrix(`matrix3d(${a},${d * H / w},0,${g / w},${b * w / H},${e},0,${h / H},0,0,1,0,${c * w},${f * H},0,1)`)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [a, b, c, d, e, f, g, h])
  return [ref, matrix]
}

function CiscoCover({ hovered }) {
  const [ending, setEnding] = useState(false)
  return (
    <div style={{ ...fill, overflow: 'hidden', background: ending ? '#020309' : '#f2f3f5', transition: 'background 0.6s' }}>
      <video src="/cisco-ui/insight-to-action.mp4" autoPlay muted loop playsInline preload="metadata"
        onTimeUpdate={e => { const v = e.currentTarget; setEnding(v.duration && v.currentTime > v.duration - 2.2) }}
        style={{ ...media, transform: `scale(${hovered ? 1.27 : 1.23})`, opacity: ending ? 0 : 1, transition: `transform 0.7s ${SPRING}, opacity 0.4s ease` }} />
      <div style={{
        position: 'absolute', inset: -2, display: 'grid', placeItems: 'center', opacity: ending ? 1 : 0, transition: `opacity 0.6s ${SPRING}`,
        background: 'radial-gradient(ellipse 90% 70% at 38% 118%, rgba(14,140,230,0.85) 0%, rgba(20,90,200,0.45) 38%, rgba(10,30,90,0) 72%), radial-gradient(ellipse 70% 60% at 80% 120%, rgba(150,60,180,0.6) 0%, rgba(90,50,170,0.3) 40%, rgba(20,20,60,0) 75%), radial-gradient(ellipse 120% 80% at 50% 110%, rgba(25,55,150,0.55) 0%, rgba(8,14,40,0) 70%), linear-gradient(180deg, #020309 0%, #040817 50%, #0a1638 100%)',
      }}>
        <div aria-hidden style={{ ...fill, opacity: 0.22, mixBlendMode: 'overlay', backgroundImage: grain(160, 0.9) }} />
        <img src="/cisco-ui/cisco-logo.png" alt="Cisco" style={{ position: 'relative', height: '18%', width: 'auto', transform: ending ? 'none' : 'scale(0.92)', transition: `transform 0.8s ${SPRING}` }} />
      </div>
    </div>
  )
}

const LAPTOP = [0.354324, -0.04734, 0.380859, -0.036233, 0.487587, 0.141204, -0.110833, -0.031596]
function BoschCover({ hovered }) {
  const [ref, matrix] = useHomography(LAPTOP)
  return (
    <div ref={ref} style={{ ...fill, overflow: 'hidden', background: '#5f87a8' }}>
      <div style={{ ...fill, transform: `scale(${hovered ? 1.03 : 1})`, transition: `transform 0.7s ${SPRING}` }}>
        <video src="/bosch-flow.mp4" autoPlay muted loop playsInline preload="metadata"
          style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', background: '#fff', transformOrigin: '0 0', transform: matrix }} />
        <img src="/laptop-gen.webp" alt="" style={media} />
      </div>
    </div>
  )
}

function ByteDanceCover({ hovered }) {
  return (
    <div style={{ ...fill, background: '#1a1d22' }}>
      <video src="/bytedance-warehouse.mp4" autoPlay muted loop playsInline preload="metadata" style={media} />
      <div aria-hidden style={{ ...fill, background: 'linear-gradient(180deg, rgba(10,12,18,0.15), rgba(10,12,18,0.35))' }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: '72%', aspectRatio: '1267 / 618', overflow: 'hidden', background: '#fff', borderRadius: 4,
        boxShadow: '0 2px 6px rgba(0,0,0,0.18), 0 24px 60px rgba(0,0,0,0.45)',
        transition: 'transform 0.5s ease', transform: hovered ? 'translate(-50%, -50%) scale(1.03)' : 'translate(-50%, -50%)',
      }}>
        <ScaledWarehouse />
      </div>
    </div>
  )
}

const TABLET = [0.528849, 0.068542, 0.152995, -0.116762, 0.61485, 0.195602, 0.064342, -0.01653]
function ColorDiaryCover({ hovered }) {
  const [ref, matrix] = useHomography(TABLET)
  return (
    <div ref={ref} style={{ ...fill, overflow: 'hidden', background: '#1d1c1e' }}>
      <div style={{ ...fill, transform: `scale(${hovered ? 1.03 : 1})`, transition: `transform 0.7s ${SPRING}` }}>
        <img src={cdUI} alt="" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover', transformOrigin: '0 0', transform: matrix }} />
        <img src="/tablet-gen.webp" alt="" style={media} />
      </div>
      <div aria-hidden style={{ ...fill, background: 'rgba(60,40,20,0.06)', mixBlendMode: 'lighten', pointerEvents: 'none' }} />
      <div aria-hidden style={{ ...fill, opacity: 0.28, mixBlendMode: 'overlay', pointerEvents: 'none', backgroundImage: grain(180, 1.1) }} />
    </div>
  )
}

// A cover's videos and images only start downloading as its card nears the viewport, so they never compete with the 3D scene on the first screen.
export default function Cover(props) {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } }, { rootMargin: '300px 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} style={fill}>{near && <CoverMedia {...props} />}</div>
}

function CoverMedia({ id, hovered }) {
  if (id === 'cisco') return <CiscoCover hovered={hovered} />
  if (id === 'bosch') return <BoschCover hovered={hovered} />
  if (id === 'bytedance') return <ByteDanceCover hovered={hovered} />
  if (id === 'yhlo') return <YhloCover hovered={hovered} />
  if (id === 'color-diary') return <ColorDiaryCover hovered={hovered} />
  if (id === 'flower-star') return (
    <video src={fsLoop} poster={fsPoster} autoPlay muted loop playsInline
      style={{ ...media, transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.04)' : 'none' }} />
  )
  return null
}
