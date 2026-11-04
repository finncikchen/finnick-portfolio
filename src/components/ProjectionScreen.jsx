import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import flowerStar from '../assets/images/flowerstar/thumb-loop.mp4'

// Homepage opening: the work, projected as light points on a curved cinema screen.
// Scrolling flattens the screen and brings it up to fill the house.
const REEL = ['/bytedance-warehouse.mp4', flowerStar]
const SHOT = 6            // seconds per clip
const LEVELS = 10         // tone steps; dots are batched by tone
const CURVE = 0.16
const DARK = 0.01         // below this scroll progress nothing is projected

gsap.registerPlugin(ScrollTrigger)

export default function ProjectionScreen({ stageRef, onProgress }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const off = document.createElement('canvas')
    const sample = off.getContext('2d', { willReadFrequently: true })
    const state = { p: 0 }
    let w = 0, h = 0, dpr = 1, cols = 0, rows = 0, raf = 0, lastDraw = 0, visible = true, shot = 0

    const clips = REEL.map((src) => {
      const v = document.createElement('video')
      v.src = src; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto'
      return v
    })
    const play = () => { if (!reduce && visible && state.p >= DARK) clips[shot].play().catch(() => {}) }
    const cut = setInterval(() => {
      if (reduce || !visible) return
      clips[shot].pause()
      shot = (shot + 1) % clips.length
      clips[shot].currentTime = 0
      play()
    }, SHOT * 1000)

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      cols = w < 760 ? 96 : 210
      rows = Math.round(cols * h / w)
      off.width = cols; off.height = rows
    }

    const draw = () => {
      const video = clips[shot]
      if (video.readyState < 2) return
      const p = state.p
      const narrow = w < 760
      const startW = (narrow ? 0.9 : 0.6) * w, startH = (narrow ? 0.34 : 0.44) * h
      const W = startW + (w - startW) * p, H = startH + (h - startH) * p
      // points stay square: the grid follows the screen's current shape
      const nextRows = Math.max(1, Math.round(cols * H / W))
      if (nextRows !== rows) { rows = nextRows; off.height = rows }
      // cover-crop the clip into the sampling grid
      const scale = Math.max(cols / video.videoWidth, rows / video.videoHeight)
      const sw = cols / scale, sh = rows / scale
      sample.drawImage(video, (video.videoWidth - sw) / 2, (video.videoHeight - sh) / 2, sw, sh, 0, 0, cols, rows)
      const px = sample.getImageData(0, 0, cols, rows).data

      const cx = w / 2, cy = (narrow ? 0.27 : 0.3) * h + (h / 2 - (narrow ? 0.27 : 0.3) * h) * p
      const k = reduce ? 0 : CURVE * (1 - p)
      const cell = W / cols

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      // halftone: tone sets the size of each point, and the light stays one colour
      const buckets = Array.from({ length: LEVELS }, () => [])
      for (let j = 0; j < rows; j++) {
        const v = (j + 0.5) / rows * 2 - 1
        for (let i = 0; i < cols; i++) {
          const n = (j * cols + i) * 4
          const luma = (px[n] * 0.3 + px[n + 1] * 0.59 + px[n + 2] * 0.11) / 255
          const tone = Math.floor(Math.pow(luma, 1.25) * LEVELS)
          if (tone < 1) continue
          const u = (i + 0.5) / cols * 2 - 1
          buckets[Math.min(LEVELS - 1, tone)].push(cx + u * W / 2, cy + v * H / 2 * (1 - k * u * u))
        }
      }
      buckets.forEach((list, tone) => {
        const t = tone / (LEVELS - 1), size = cell * (0.22 + t * 0.6)
        ctx.fillStyle = `rgba(205,220,255,${(0.28 + t * 0.6).toFixed(2)})`
        ctx.beginPath()
        for (let n = 0; n < list.length; n += 2) ctx.rect(list[n] - size / 2, list[n + 1] - size / 2, size, size)
        ctx.fill()
      })
    }

    const frame = (ms) => {
      raf = requestAnimationFrame(frame)
      if (!visible || ms - lastDraw < 40) return
      lastDraw = ms
      // the projector stays off until the house lights go down
      if (state.p < DARK) { clips[shot].pause(); return }
      if (clips[shot].paused) play()
      draw()
    }

    build()
    window.addEventListener('resize', build)
    clips[0].addEventListener('loadeddata', play, { once: true })
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) play(); else clips[shot].pause()
    })
    io.observe(canvas)
    if (!reduce) raf = requestAnimationFrame(frame)

    const anim = gsap.context(() => {
      if (reduce) return
      gsap.to(state, {
        p: 1, ease: 'none',
        onUpdate: () => { canvas.style.opacity = gsap.utils.clamp(0, 1, (state.p - 0.05) / 0.3) },
        scrollTrigger: {
          trigger: stageRef.current, start: 'top top', end: '+=110%', pin: true, scrub: 0.5,
          onUpdate: (self) => onProgress?.(self.progress),
        },
      })
    })

    return () => {
      cancelAnimationFrame(raf); clearInterval(cut); io.disconnect(); anim.revert()
      window.removeEventListener('resize', build)
      clips.forEach((v) => { v.pause(); v.removeAttribute('src'); v.load() })
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0 }} />
}
