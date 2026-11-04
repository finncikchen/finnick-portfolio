import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Footer: the projector's light falling onto the horse, with dust drifting through it.
const DUST = 90
const TOP = 0.03, BOTTOM = 0.42     // beam half-width at the top and bottom, as a share of the footer's width

gsap.registerPlugin(ScrollTrigger)

export default function ProjectorBeam() {
  const beamRef = useRef(null)
  const dustRef = useRef(null)

  useEffect(() => {
    const beam = beamRef.current, canvas = dustRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, visible = false

    const motes = Array.from({ length: DUST }, () => ({
      x: (Math.random() - 0.5) * 2, y: Math.random(),
      size: 0.6 + Math.random() * 1.1, speed: 0.006 + Math.random() * 0.016,
      phase: Math.random() * Math.PI * 2,
    }))

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
    }

    const draw = (ms) => {
      const time = ms / 1000, dt = Math.min(0.05, last ? time - last : 0); last = time
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#dfe8ff'
      motes.forEach((m) => {
        m.y -= m.speed * dt
        if (m.y < 0) m.y += 1
        const half = (TOP + (BOTTOM - TOP) * m.y) * w     // stay inside the cone
        const x = w / 2 + m.x * half * 0.92 + Math.sin(time * 0.3 + m.phase) * 6
        const twinkle = 0.5 + 0.5 * Math.sin(time * 0.8 + m.phase)
        ctx.globalAlpha = (0.12 + twinkle * 0.5) * (1 - m.y * 0.55)
        ctx.fillRect(x, m.y * h, m.size, m.size)
      })
      // the lamp is never perfectly steady
      beam.style.opacity = String(0.9 + Math.sin(time * 23) * 0.025 + Math.sin(time * 7.3) * 0.04)
    }

    const frame = (ms) => {
      raf = requestAnimationFrame(frame)
      if (visible) draw(ms)
    }

    build()
    window.addEventListener('resize', build)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (reduce && visible) draw(1000) })
    io.observe(canvas)
    if (!reduce) raf = requestAnimationFrame(frame)

    // the lamp strikes and the cone opens as the footer arrives
    const anim = gsap.context(() => {
      if (reduce) return
      gsap.fromTo(beam.parentElement, { autoAlpha: 0, scaleX: 0.2 }, {
        autoAlpha: 1, scaleX: 1, ease: 'power2.out', transformOrigin: '50% 0%',
        scrollTrigger: { trigger: canvas.closest('footer'), start: 'top 75%', end: 'top 5%', scrub: 0.6 },
      })
    })

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); anim.revert()
      window.removeEventListener('resize', build)
    }
  }, [])

  const edge = `${50 - BOTTOM * 100}% 100%`, edge2 = `${50 + BOTTOM * 100}% 100%`
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, filter: 'blur(36px)' }}>
          <div ref={beamRef} style={{
            position: 'absolute', inset: 0,
            clipPath: `polygon(${50 - TOP * 100}% 0, ${50 + TOP * 100}% 0, ${edge2}, ${edge})`,
            background: 'linear-gradient(to bottom, rgba(190,212,255,0.22), rgba(170,195,250,0.08) 60%, rgba(170,195,250,0))',
          }} />
        </div>
        <div style={{ position: 'absolute', left: '12%', right: '12%', top: '30%', bottom: '4%', background: 'radial-gradient(closest-side, rgba(170,195,250,0.08), transparent)' }} />
        <canvas ref={dustRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}
