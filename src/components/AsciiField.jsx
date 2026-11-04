import { useEffect, useRef } from 'react'

// Full-page backdrop: a sparse field of dots that fade over many seconds.
const CW = 6, CH = 10
const TONES = 9

const tone = (k) => {
  const f = k / (TONES - 1)
  const r = Math.round(70 + f * 170), g = Math.round(95 + f * 150), b = 255
  return `rgba(${r},${g},${b},${(0.2 + f * 0.72).toFixed(2)})`
}

export default function AsciiField({ style }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tones = Array.from({ length: TONES }, (_, k) => tone(k))
    let w = 0, h = 0, dpr = 1, cols = 0, rows = 0, raf = 0, lastDraw = 0, seed = []

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      cols = Math.ceil(w / CW); rows = Math.ceil(h / CH)
      seed = Array.from({ length: cols * rows }, () => Math.random())
    }

    const frame = (ms) => {
      if (!reduce) raf = requestAnimationFrame(frame)
      if (ms - lastDraw < 40) return
      lastDraw = ms
      const time = ms / 1000
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.font = '7.5px ui-monospace, "SF Mono", Menlo, monospace'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const r = seed[j * cols + i]
          if (r <= 0.993) continue
          const k = Math.floor(TONES * 0.16 * (0.5 + 0.5 * Math.sin(time * 0.25 + r * 400)))
          if (k < 1) continue
          ctx.fillStyle = tones[k]
          ctx.fillText('·', i * CW + CW / 2, j * CH + CH / 2)
        }
      }
    }

    const onResize = () => { build(); if (reduce) { lastDraw = -1e9; frame(performance.now()) } }

    build()
    if (reduce) frame(1000); else raf = requestAnimationFrame(frame)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }} />
}
