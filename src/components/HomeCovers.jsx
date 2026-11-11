import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ScaledWarehouse } from './LiveWarehouse'
import YhloCover from './YhloCover'
import ScreenLoop from './bosch/ScreenLoop'
import fsLoop from '../assets/images/flowerstar/thumb-loop.mp4'
import fsPoster from '../assets/images/flowerstar/thumb-poster.jpg'
import cdPhoto from '../assets/images/thumb-colordiary.webp'
import cdPlinth from '../assets/images/colordiary-plinth.webp'
import fsMonitor from '../assets/images/flowerstar/monitor-dunes.webp'
import boschDesk from '../assets/images/bosch-desk.webp'

const InsightCover = lazy(() => import('./cisco/InsightCover'))

const SPRING = 'cubic-bezier(0.32,0.72,0,1)'
// How much of a cover must be in view before it starts moving
const IN_VIEW = 0.6
const fill = { position: 'absolute', inset: 0 }
const media = { ...fill, width: '100%', height: '100%', objectFit: 'cover' }

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

// The display's four corners in the 1536x864 photograph, as the transform that lays a 2000x1290 screen onto them
const BOSCH_SCREEN = 'matrix3d(0.3891567, 8.113104e-05, 0, 1.375102e-07, -0.001268767, 0.3619141, 0, -2.857584e-06, 0, 0, 1, 0, 444, 120.9559, 0, 1)'

// Someone at a desk against a lit wall, the ticket screen running on the display in front of them
function BoschCover({ hovered, live }) {
  const ref = useRef(null)
  const [k, setK] = useState(0)
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / 1536))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ ...fill, overflow: 'hidden', background: '#0b0e18' }}>
      <div style={{ ...fill, transform: hovered ? 'scale(1.035)' : 'none', transformOrigin: '58% 42%', transition: `transform 1.1s ${SPRING}` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1536, height: 864, transformOrigin: '0 0', transform: `scale(${k})`, opacity: k ? 1 : 0 }}>
          <img src={boschDesk} alt="" draggable={false} style={{ ...fill, width: '100%', height: '100%' }} />
          {/* Laid out at twice the size it is seen, so the transformed layer rasters sharp */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: 2000, height: 1290, overflow: 'hidden', background: '#0a0a0a', transformOrigin: '0 0', transform: BOSCH_SCREEN }}>
            <ScreenLoop live={live} bar={0} />
          </div>
        </div>
      </div>
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

// The tool's own phone layout, drawn at 375 wide and scaled to the handset. One loop: a photo goes in, its colour is
// pulled out onto the cover, the split is dragged. At rest it shows the finished cover.
const MONO = '"Courier Prime", "Courier New", monospace'
const CD_STEPS = [1000, 520, 1500, 2100, 900, 3200, 600]
const CD_REST = 5
const CD_TABS = [['⊕', 'Photo'], ['T', 'Title'], ['≡', 'Date'], ['/', 'Split ratio'], ['Aa', 'Font size'], ['■', 'Background color']]
const CD_TAPS = { 1: [187, 612], 3: [344, 541], 4: [219, 541], 5: [187, 629] }
const CD_ROW = { display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid #e7e5e4', fontSize: 11, letterSpacing: '0.2em', color: '#a8a29e' }

function useColorDiaryLoop(live) {
  const [step, setStep] = useState(CD_REST)
  useEffect(() => {
    if (!live || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let i = CD_STEPS.length - 1, timer
    const run = () => {
      setStep(i)
      timer = setTimeout(() => { i = (i + 1) % CD_STEPS.length; run() }, CD_STEPS[i])
    }
    timer = setTimeout(run, 500)
    return () => { clearTimeout(timer); setStep(CD_REST) }
  }, [live])
  return step
}

function ColorDiaryScreen({ live }) {
  const ref = useRef(null)
  const [k, setK] = useState(0)
  useEffect(() => {
    const el = ref.current
    const ro = new ResizeObserver(() => setK(el.clientWidth / 375))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const s = useColorDiaryLoop(live)
  const photo = s >= 2 && s <= 5
  const gone = s === 6
  const tab = s < 3 ? 0 : s === 3 ? 5 : 3
  const split = s >= 5 ? 38 : 50
  const ink = photo || gone ? '#f4e9dc' : '#292524'
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
  const panel = on => ({ position: 'absolute', left: 16, right: 16, top: 16, opacity: on ? 1 : 0, transition: 'opacity 0.25s ease 0.2s' })
  return (
    <div ref={ref} style={{ ...fill, overflow: 'hidden', background: '#fafaf9' }}>
      <style>{`
        @keyframes cdTap { 0% { opacity: 0; transform: scale(1.35) } 30% { opacity: 1; transform: scale(1) } 55% { opacity: 1; transform: scale(0.82) } 100% { opacity: 0; transform: scale(1.1) } }
        @keyframes cdDrag { 0% { opacity: 0; transform: scale(1.35) } 15% { opacity: 1; transform: scale(0.85); animation-timing-function: ease-in-out } 75% { opacity: 1; transform: translateX(-41px) scale(0.85) } 100% { opacity: 0; transform: translateX(-41px) scale(1.15) } }
      `}</style>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 375, height: 812, transformOrigin: '0 0', transform: `scale(${k})`, fontFamily: MONO, color: '#292524' }}>
        <div aria-hidden style={{ position: 'absolute', left: '50%', top: 11, width: 108, height: 31, marginLeft: -54, borderRadius: 16, background: '#000' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 50, height: 57, padding: '0 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #e7e5e4' }}>
          <span style={{ fontSize: 14, color: '#57534e' }}>Color Diary</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, letterSpacing: '0.1em' }}>EN <span style={{ color: '#d6d3d1' }}>/</span> <span style={{ color: '#a8a29e' }}>CN</span></span>
          <span style={{ marginLeft: 16, fontSize: 12, letterSpacing: '0.1em', color: '#a8a29e' }}>ABOUT</span>
        </div>

        <div style={{ position: 'absolute', left: 0, right: 0, top: 107, height: 340, background: '#1c1917' }}>
          <div style={{ position: 'absolute', left: 84, top: 25, width: 207, height: 290, overflow: 'hidden', background: '#b9b0a6', boxShadow: '0 14px 34px rgba(0,0,0,0.5)', opacity: gone ? 0 : 1, transition: 'opacity 0.45s ease' }}>
            <span style={{ position: 'absolute', left: 0, right: 0, top: '73%', textAlign: 'center', fontSize: 4.5, letterSpacing: '0.12em', color: '#6b645d' }}>UPLOAD A PHOTO OR VIDEO</span>
            <div style={{ ...fill, backgroundImage: `url(${cdPhoto})`, backgroundSize: '516px 290px', backgroundPosition: '-25px 0', opacity: photo || gone ? 1 : 0, transform: photo || gone ? 'none' : 'scale(1.06)', transition: photo ? `opacity 0.5s ease, transform 0.9s ${SPRING}` : 'none' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: `${split}%`, background: photo || gone ? '#7d4e34' : '#c9bba8', transition: `${s === 5 ? 'height 0.84s ease-in-out 0.21s' : 'height 0s'}, ${photo ? 'background-color 0.9s ease 0.15s' : 'background-color 0s'}` }}>
              <div style={{ ...fill, background: 'linear-gradient(180deg, #e2d7c5, #b5a793)', opacity: photo || gone ? 0 : 1, transition: photo ? 'opacity 0.9s ease 0.15s' : 'none' }} />
              <div style={{ ...fill, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7, color: ink, transition: photo ? 'color 0.9s ease 0.15s' : 'none' }}>
                <span style={{ fontSize: 6.5, letterSpacing: '0.26em' }}>Turn moments into color.</span>
                <span style={{ width: 17, height: 0.5, background: 'currentColor', opacity: 0.5 }} />
                <span style={{ fontSize: 3.6, letterSpacing: '0.24em', opacity: 0.75 }}>{date}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: 0, right: 0, top: 447, height: 58, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0efed' }}>
          <span style={{ fontSize: 12, lineHeight: '16px', letterSpacing: '0.1em', color: '#a8a29e', width: 140 }}>exports at full resolution</span>
          <span style={{ padding: '10px 20px', fontSize: 12, letterSpacing: '0.16em', background: '#292524', color: '#fafaf9' }}>EXPORT AS PNG</span>
        </div>

        <div style={{ position: 'absolute', left: 0, right: 0, top: 505, height: 72, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {CD_TABS.map(([icon, label], i) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12, gap: 6, textAlign: 'center', color: i === tab ? '#1c1917' : '#a8a29e', boxShadow: `inset 0 -2px 0 ${i === tab ? '#292524' : 'transparent'}`, transition: 'color 0.2s ease 0.2s, box-shadow 0.2s ease 0.2s' }}>
              <span style={{ fontSize: 13, lineHeight: '14px', color: i === 5 && i !== tab ? '#c9bba8' : undefined }}>{icon}</span>
              <span style={{ fontSize: 9, lineHeight: '13px' }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', left: 0, right: 0, top: 577, bottom: 0 }}>
          <div style={panel(tab === 0)}>
            <div style={{ height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d6d3d1', fontSize: 11, letterSpacing: '0.2em', color: '#57534e', background: s === 1 ? '#e7e5e4' : 'transparent', transition: 'background-color 0.2s ease 0.12s' }}>UPLOAD PHOTO / VIDEO</div>
          </div>
          <div style={panel(tab === 5)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14 }}>
              <span style={{ width: 40, height: 28, background: '#7d4e34', border: '1px solid #d6d3d1' }} />
              <span style={{ fontSize: 12, letterSpacing: '0.04em' }}>#7D4E34</span>
              <span style={{ fontSize: 11, color: '#a8a29e' }}>auto-extracted</span>
            </div>
            <div style={CD_ROW}><span>GRADIENT</span><span>OFF</span></div>
            <div style={CD_ROW}><span>GRAIN</span><span>OFF</span></div>
          </div>
          <div style={panel(tab === 3)}>
            <div style={{ ...CD_ROW, border: 0, padding: 0 }}><span>SPLIT RATIO</span><span>{split} / {100 - split}</span></div>
            <div style={{ position: 'relative', height: 2, marginTop: 22, background: '#d6d3d1' }}>
              <span style={{ position: 'absolute', top: -6, left: `${split}%`, width: 14, height: 14, marginLeft: -7, borderRadius: '50%', background: '#292524', transition: s === 5 ? 'left 0.84s ease-in-out 0.21s' : 'none' }} />
            </div>
          </div>
        </div>

        {live && CD_TAPS[s] && (
          <span key={s} aria-hidden style={{ position: 'absolute', left: CD_TAPS[s][0] - 17, top: CD_TAPS[s][1] - 17, width: 34, height: 34, borderRadius: '50%', background: 'rgba(41,37,36,0.28)', boxShadow: '0 0 0 1px rgba(255,255,255,0.5)', opacity: 0, animation: s === 5 ? 'cdDrag 1.4s linear both' : 'cdTap 0.5s ease-out both' }} />
        )}
      </div>
    </div>
  )
}

// The screen's four corners in the 1536x864 photograph, as the transform that lays a 375x812 screen onto them
const CD_SCREEN = 'matrix3d(0.5673107, 0.3790543, 0, -7.866417e-05, -0.7112865, 0.4578319, 0, -0.0001452756, 0, 0, 1, 0, 1111.027, 73.73501, 0, 1)'

// A handset lying on a cast stone plinth, the tool running on its screen
function ColorDiaryCover({ hovered, live }) {
  const ref = useRef(null)
  const [k, setK] = useState(0)
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / 1536))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ ...fill, overflow: 'hidden', background: '#2a2b2d', containerType: 'inline-size' }}>
      <div style={{ ...fill, transform: hovered ? 'scale(1.035)' : 'none', transformOrigin: '62% 48%', transition: `transform 1.1s ${SPRING}` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1536, height: 864, transformOrigin: '0 0', transform: `scale(${k})`, opacity: k ? 1 : 0 }}>
          <img src={cdPlinth} alt="" draggable={false} style={{ ...fill, width: '100%', height: '100%' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, width: 375, height: 812, overflow: 'hidden', borderRadius: 52, transformOrigin: '0 0', transform: CD_SCREEN }}>
            <ColorDiaryScreen live={live} />
            {/* The room's light across the glass */}
            <div aria-hidden style={{ ...fill, pointerEvents: 'none', background: 'linear-gradient(200deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 38%, rgba(20,22,26,0.1) 100%)' }} />
          </div>
        </div>
      </div>
      <span style={{ position: 'absolute', left: '7cqw', top: '11cqw', fontFamily: MONO, fontSize: '3.4cqw', letterSpacing: '-0.02em', color: '#e9e7e2', whiteSpace: 'nowrap' }}>Color Diary</span>
    </div>
  )
}

// A cover's videos and images only start downloading as its card nears the viewport, so they never
// compete with the 3D scene on the first screen. It moves once most of it is in view, and keeps
// moving while it scrolls partly away, until it is gone.
// The display's four corners in the 1536x864 photograph, as the transform that lays a 1500x836 screen onto them
const FS_SCREEN = 'matrix3d(0.4929163, -0.0001401085, 0, -9.53119e-07, 0, 0.4941941, 0, 0, 0, 0, 1, 0, 396, 147, 0, 1)'

// A display standing among black dunes, the film playing on it
function FlowerStarCover({ hovered, live }) {
  const ref = useRef(null)
  const [k, setK] = useState(0)
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / 1536))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ ...fill, overflow: 'hidden', background: '#161617' }}>
      <div style={{ ...fill, transform: hovered ? 'scale(1.035)' : 'none', transformOrigin: '50% 42%', transition: `transform 1.1s ${SPRING}` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1536, height: 864, transformOrigin: '0 0', transform: `scale(${k})`, opacity: k ? 1 : 0 }}>
          <img src={fsMonitor} alt="" draggable={false} style={{ ...fill, width: '100%', height: '100%' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1500, height: 836, overflow: 'hidden', background: '#0a0a0a', transformOrigin: '0 0', transform: FS_SCREEN }}>
            {/* The clip fades up from black, so it starts just past that, on the frame the poster shows */}
            <CoverVideo live={live} src={fsLoop} poster={fsPoster} startAt={0.4} style={media} />
            {/* The room's light across the glass */}
            <div aria-hidden style={{ ...fill, pointerEvents: 'none', background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 36%, rgba(20,22,26,0.1) 100%)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

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
  if (id === 'bosch') return <BoschCover hovered={hovered} live={live} />
  if (id === 'bytedance') return <ByteDanceCover hovered={hovered} live={live} />
  if (id === 'yhlo') return <YhloCover hovered={hovered} live={live} />
  if (id === 'color-diary') return <ColorDiaryCover hovered={hovered} live={live} />
  if (id === 'flower-star') return <FlowerStarCover hovered={hovered} live={live} />
  return null
}
