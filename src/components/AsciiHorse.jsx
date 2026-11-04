import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import stripUrl from '../assets/muybridge-strip.png'

// Homepage footer: Muybridge's 1878 "The Horse in Motion" (public domain), cut into tonal silhouettes
// and printed in ASCII. Glyphs resolve in on first view and scatter away from the cursor.
const CELL = 3, SS = 2
const RAMP = ['·', ':', '/', '+', '×', '×', '#']
const INKS = ['#e6ebf7', '#a9b6d6', '#5f6f96']   // bright, mid, dim
const FRAMES = 11, FW = 600, FH = 292
const MAX_W = 840                    // widest size on screen
const FPS = 16
const CUT = 0.4, GAMMA = 0.5         // tone curve
const REVEAL = 1.1                   // seconds
const HOVER = 30                     // cursor radius, in cells

gsap.registerPlugin(ScrollTrigger)

const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s) }

export default function AsciiHorse({ height = 441 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const strip = new Image()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const DW = Math.min(MAX_W, canvas.clientWidth), DH = DW * FH / FW
    const cols = Math.floor(DW / CELL), rows = Math.floor(DH / CELL)
    const pointer = { x: -1e4, y: -1e4, a: 0, on: false }
    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, lastDraw = 0, visible = false, tones = null, phase = 0
    const motion = { reveal: reduce ? 1 : 0, gait: 1, runIn: 0, leanX: 0, leanY: 0 }
    const shock = { x: 0, y: 0, r: 0, a: 0 }
    const gaitTo = gsap.quickTo(motion, 'gait', { duration: 0.7, ease: 'power2.out' })
    const leanXTo = gsap.quickTo(motion, 'leanX', { duration: 0.9, ease: 'power3.out' })
    const leanYTo = gsap.quickTo(motion, 'leanY', { duration: 0.9, ease: 'power3.out' })
    // the horse gallops in as the section scrolls up, and the glyphs resolve each time it does
    const anim = gsap.context(() => {
      if (reduce) return
      gsap.fromTo(motion, { runIn: -1 }, { runIn: 0, ease: 'none', scrollTrigger: { trigger: canvas.closest('footer') || canvas, start: 'top bottom', end: 'top top', scrub: 0.8 } })
      ScrollTrigger.create({
        trigger: canvas, start: 'top 85%',
        onEnter: () => gsap.fromTo(motion, { reveal: 0 }, { reveal: 1, duration: REVEAL, ease: 'power2.out', overwrite: 'auto' }),
        onUpdate: (self) => gaitTo(1 + Math.min(1.6, Math.abs(self.getVelocity()) / 1800)),   // scrolling spurs it on
      })
    })

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
    }

    // every frame's cell tones are computed once, up front
    const prepare = () => {
      const off = document.createElement('canvas')
      off.width = cols * SS; off.height = rows * SS
      const g = off.getContext('2d', { willReadFrequently: true })
      tones = Array.from({ length: FRAMES }, (_, f) => {
        g.clearRect(0, 0, off.width, off.height)
        g.drawImage(strip, f * FW, 0, FW, FH, 0, 0, off.width, off.height)
        const px = g.getImageData(0, 0, off.width, off.height).data
        const out = new Float32Array(cols * rows)
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
          let sum = 0, solid = 0
          for (let y = 0; y < SS; y++) for (let x = 0; x < SS; x++) {
            const v = px[((j * SS + y) * off.width + i * SS + x) * 4 + 3] / 255
            sum += v; if (v > 0.55) solid++
          }
          let c = sum / (SS * SS)
          const fill = solid / (SS * SS)
          if (c < 0.5 && fill >= 0.4) c = Math.max(c, Math.min(0.9, fill * 1.6))   // thin legs and reins hold up
          out[j * cols + i] = c <= CUT ? 0 : Math.pow((c - CUT) / (1 - CUT), GAMMA)
        }
        return out
      })
    }

    const frame = (ms) => {
      if (!reduce) raf = requestAnimationFrame(frame)
      if (!tones || !visible || ms - lastDraw < 33) return
      const dt = Math.min(0.05, last ? (ms - last) / 1000 : 0); last = ms; lastDraw = ms
      const time = ms / 1000
      phase += dt * FPS * motion.gait
      const ease = motion.reveal
      pointer.a += ((pointer.on ? 1 : 0) - pointer.a) * Math.min(1, dt * 5)
      const data = tones[reduce ? 0 : Math.floor(phase) % FRAMES]
      const tick = Math.floor(time * 9)
      // projected, not printed: the image shivers in its gate and the lamp breathes
      const gate = reduce ? 0 : hash(Math.floor(time * 12), 3) - 0.5
      const ox = (w - cols * CELL) / 2 + motion.runIn * w * 0.32 + motion.leanX + gate * 1.2, oy = (h - rows * CELL) / 2 + motion.leanY + (hash(Math.floor(time * 12), 9) - 0.5) * (reduce ? 0 : 1.6)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.globalAlpha = reduce ? 1 : 0.88 + hash(Math.floor(time * 18), 5) * 0.12
      ctx.font = `${CELL * 1.2}px ui-monospace, "SF Mono", Menlo, monospace`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      const buckets = INKS.map(() => [])

      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        if (ease < 1 && hash(i, j) > ease) continue
        let v = data[j * cols + i], px = 0, py = 0, shift = 0
        if (pointer.a > 0.02) {
          const dx = i - pointer.x, dy = j - pointer.y, d = Math.hypot(dx, dy)
          if (d < HOVER) {
            const k = (1 - d / HOVER) * (0.5 + hash(i, j + tick) * 0.7) * pointer.a
            const push = k * k * 7 + hash(i * 3, j + tick) * 3 * k
            const ang = hash(i + 7, j * 5 + tick) * Math.PI * 2
            const ux = d > 0.001 ? dx / d : 0, uy = d > 0.001 ? dy / d : 0
            const si = Math.round(i - ux * push + Math.cos(ang) * k * 3), sj = Math.round(j - uy * push + Math.sin(ang) * k * 3)
            v = si >= 0 && si < cols && sj >= 0 && sj < rows ? data[sj * cols + si] : 0
            if (hash(i * 5, j * 7 + tick) < k * 0.22) v = 0
            px = (ux * push * 0.7 + Math.cos(ang) * k) * CELL; py = (uy * push * 0.7 + Math.sin(ang) * k) * CELL
            shift = Math.floor(hash(i, j * 3 + tick) * 7) - 3
          }
        }
        if (shock.a > 0.01) {                                 // a click blows a ring outward through the glyphs
          const dx = i - shock.x, dy = j - shock.y, d = Math.hypot(dx, dy) || 1
          const band = Math.max(0, 1 - Math.abs(d - shock.r) / 12) * shock.a
          if (band > 0) {
            const kick = band * band * 9
            const si = Math.round(i - dx / d * kick), sj = Math.round(j - dy / d * kick)
            v = si >= 0 && si < cols && sj >= 0 && sj < rows ? data[sj * cols + si] : 0
            px += dx / d * kick * CELL * 0.8; py += dy / d * kick * CELL * 0.8
          }
        }
        if (v < 0.06) continue
        const g = Math.min(RAMP.length - 1, Math.max(0, Math.floor(Math.min(v, 0.999) * RAMP.length) + (shift && hash(i, j + tick) < 0.5 ? shift : 0)))
        buckets[v > 0.55 ? 0 : v > 0.22 ? 1 : 2].push(RAMP[g], ox + i * CELL + CELL / 2 + px, oy + j * CELL + CELL / 2 + py)
      }
      buckets.forEach((list, n) => {
        ctx.fillStyle = INKS[n]
        for (let k = 0; k < list.length; k += 3) ctx.fillText(list[k], list[k + 1], list[k + 2])
      })
    }

    const onMove = (ev) => {
      const r = canvas.getBoundingClientRect()
      const x = (ev.clientX - r.left - (w - cols * CELL) / 2 - motion.leanX) / CELL, y = (ev.clientY - r.top - (h - rows * CELL) / 2 - motion.leanY) / CELL
      if (!reduce && ev.clientY > r.top && ev.clientY < r.bottom) {
        const nx = (ev.clientX - r.left) / w - 0.5, ny = (ev.clientY - r.top) / h - 0.5
        leanXTo(nx * 36); leanYTo(ny * 18)                     // it drifts toward the cursor
        gaitTo(1 + Math.max(0, 1 - Math.hypot(nx, ny) * 2) * 0.9)   // and runs harder the closer it gets
      }
      pointer.on = x >= 0 && x < cols && y >= 0 && y < rows
      pointer.x += (x - pointer.x) * (pointer.a < 0.02 ? 1 : 0.35); pointer.y += (y - pointer.y) * (pointer.a < 0.02 ? 1 : 0.35)
    }

    const onDown = (ev) => {
      const r = canvas.getBoundingClientRect()
      if (reduce || ev.clientY < r.top || ev.clientY > r.bottom) return
      shock.x = (ev.clientX - r.left - (w - cols * CELL) / 2 - motion.leanX) / CELL
      shock.y = (ev.clientY - r.top - (h - rows * CELL) / 2 - motion.leanY) / CELL
      gsap.fromTo(shock, { r: 0, a: 1 }, { r: 95, a: 0, duration: 1.1, ease: 'power2.out', overwrite: true })
      gsap.fromTo(motion, { gait: 3 }, { gait: 1, duration: 1.6, ease: 'power2.out', overwrite: 'auto' })
    }

    build()
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (reduce && visible) { lastDraw = -1e9; frame(1000) } })
    io.observe(canvas)
    strip.onload = () => { prepare(); if (reduce && visible) { lastDraw = -1e9; frame(1000) } }
    strip.src = stripUrl
    if (!reduce) raf = requestAnimationFrame(frame)
    window.addEventListener('resize', build)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); anim.revert()
      gsap.killTweensOf([motion, shock])
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('resize', build)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" style={{ display: 'block', width: '100%', height }} />
}
