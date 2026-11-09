import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ScaledWarehouse } from './LiveWarehouse'
import YhloCover from './YhloCover'
import ScreenLoop from './bosch/ScreenLoop'
import fsLoop from '../assets/images/flowerstar/thumb-loop.mp4'
import fsPoster from '../assets/images/flowerstar/thumb-poster.jpg'
import cdUI from '../assets/images/colordiary-ui.webp'

const InsightCover = lazy(() => import('./cisco/InsightCover'))

const SPRING = 'cubic-bezier(0.32,0.72,0,1)'
// How much of a cover must be in view before it starts moving
const IN_VIEW = 0.6
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

function CiscoCover() {
  return (
    <div style={{ ...fill, overflow: 'hidden', background: '#1c2a44 url(/cisco-ui/cover-bg.webp) center / cover no-repeat' }}>
      <Suspense fallback={null}><InsightCover /></Suspense>
    </div>
  )
}

// Covers rest on their first frame until their card scrolls into view, and go back to it once it
// has scrolled fully away.
// Two videos composited at once hold the whole page near 30fps, so each cover paints its frames
// to a canvas and the video stays hidden. Browsers without frame callbacks just show the video.
function CoverVideo({ live, src, poster, startAt = 0, style }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  useEffect(() => {
    const video = videoRef.current
    if (live) video.play().catch(() => {})
    else {
      video.pause()
      if (video.currentTime !== startAt) video.currentTime = startAt
    }
  }, [live, startAt])
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video.requestVideoFrameCallback) return
    let frame
    const draw = () => {
      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
      }
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      video.style.visibility = 'hidden'
    }
    const paint = () => {
      draw()
      frame = video.requestVideoFrameCallback(paint)
    }
    frame = video.requestVideoFrameCallback(paint)
    video.addEventListener('seeked', draw)
    return () => {
      video.cancelVideoFrameCallback(frame)
      video.removeEventListener('seeked', draw)
    }
  }, [])
  return (
    <>
      <video ref={videoRef} src={src} muted loop={!startAt} playsInline preload="auto" style={style}
        onEnded={e => { e.target.currentTime = startAt; e.target.play().catch(() => {}) }} />
      <canvas ref={canvasRef} aria-hidden style={style} />
      {poster && <img src={poster} alt="" style={{ ...style, opacity: live ? 0 : 1, transition: `opacity 0.25s ease, ${style.transition}` }} />}
    </>
  )
}

// The display's frame is one even bezel, and the screen's corners are the frame's minus that bezel, so the two curves share a centre
const BEZEL = 1.1, RADIUS = 2.6
// A bare display in a dark studio, turned away and run off the cover's left edge, the live screen on it. While the cover
// plays, the camera eases round to face it.
function BoschCover({ live }) {
  return (
    <div style={{ ...fill, overflow: 'hidden', background: 'radial-gradient(110% 95% at 88% 4%, #50535a 0%, #1d1e22 36%, #08080a 72%)' }}>
      <div style={{ ...fill, perspective: 1600, perspectiveOrigin: '60% 40%', WebkitMaskImage: 'linear-gradient(180deg, #000 55%, transparent 97%)', maskImage: 'linear-gradient(180deg, #000 55%, transparent 97%)' }}>
        <div style={{
          position: 'absolute', left: '4%', top: '14%', width: '94%', aspectRatio: `100 / ${(100 - 2 * BEZEL) * 0.645 + 2 * BEZEL}`, transformOrigin: '100% 50%', containerType: 'inline-size',
          transform: live ? 'rotateY(13deg) rotateX(5deg)' : 'rotateY(24deg) rotateX(9deg)',
          transition: live ? 'transform 9s cubic-bezier(0.2, 0.6, 0.3, 1)' : 'transform 0.9s cubic-bezier(0.65, 0, 0.15, 1)',
          borderRadius: `${RADIUS}% / ${RADIUS / ((100 - 2 * BEZEL) * 0.00645 + 2 * BEZEL / 100)}%`, background: 'linear-gradient(135deg, #2a2b30 0%, #0e0f11 38%, #050506 100%)',
          boxShadow: '0 70px 140px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 0 0 1px rgba(255,255,255,0.06)',
        }}>
          <div style={{ position: 'absolute', inset: `${BEZEL}cqw`, overflow: 'hidden', borderRadius: `${RADIUS - BEZEL}cqw` }}>
            {/* Chrome rasters a perspective layer at its layout size, so the screen is laid out at twice its size and halved */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '200%', height: '200%', transformOrigin: '0 0', transform: 'scale(0.5)' }}><ScreenLoop live={live} bar={0} /></div>
            {/* The glass catching the light */}
            <div aria-hidden style={{ ...fill, background: 'linear-gradient(118deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0) 46%)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>
      {/* Whatever runs off the frame falls into shadow */}
      <div aria-hidden style={{ ...fill, background: 'linear-gradient(270deg, rgba(0,0,0,0) 80%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </div>
  )
}

function ByteDanceCover({ hovered, live }) {
  return (
    <div style={{ ...fill, background: '#1a1d22' }}>
      <CoverVideo live={live} src="/bytedance-warehouse.mp4" style={media} />
      <div aria-hidden style={{ ...fill, background: 'linear-gradient(180deg, rgba(10,12,18,0.15), rgba(10,12,18,0.35))' }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: '66%', aspectRatio: '1040 / 650', overflow: 'hidden', background: '#fff', borderRadius: 4,
        boxShadow: '0 2px 6px rgba(0,0,0,0.18), 0 24px 60px rgba(0,0,0,0.45)',
        transition: 'transform 0.5s ease', transform: hovered ? 'translate(-50%, -50%) scale(1.03)' : 'translate(-50%, -50%)',
      }}>
        <ScaledWarehouse tall paused={!live} />
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

// A cover's videos and images only start downloading as its card nears the viewport, so they never
// compete with the 3D scene on the first screen. It moves once most of it is in view, and keeps
// moving while it scrolls partly away, until it is gone.
export default function Cover(props) {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  const [live, setLive] = useState(false)
  useEffect(() => {
    const el = ref.current
    const nearby = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); nearby.disconnect() } }, { rootMargin: '300px 0px' })
    const seen = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) setLive(false)
      else if (e.intersectionRatio >= IN_VIEW) setLive(true)
    }, { threshold: [0, IN_VIEW] })
    nearby.observe(el)
    seen.observe(el)
    return () => { nearby.disconnect(); seen.disconnect() }
  }, [])
  return <div ref={ref} style={fill}>{near && <CoverMedia {...props} live={live} />}</div>
}

function CoverMedia({ id, hovered, live }) {
  if (id === 'cisco') return <CiscoCover />
  if (id === 'bosch') return <BoschCover live={live} />
  if (id === 'bytedance') return <ByteDanceCover hovered={hovered} live={live} />
  if (id === 'yhlo') return <YhloCover hovered={hovered} live={live} />
  if (id === 'color-diary') return <ColorDiaryCover hovered={hovered} />
  if (id === 'flower-star') return (
    // The clip fades up from black, so it starts just past that, on the frame the poster shows
    <CoverVideo live={live} src={fsLoop} poster={fsPoster} startAt={0.4}
      style={{ ...media, transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.04)' : 'none' }} />
  )
  return null
}
