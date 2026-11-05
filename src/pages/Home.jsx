import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import CurtainIntro from '../components/CurtainIntro'
import AsciiField from '../components/AsciiField'
import Studio3D from '../components/Studio3D'
import SiteFooter from '../components/SiteFooter'
import homeBg from '../assets/images/home-bg.webp'

import thumbBytedance  from '../assets/images/thumb-bytedance.webp'
import thumbBosch      from '../assets/images/thumb-bosch.png'
import thumbYhlo       from '../assets/images/thumb-yhlo.png'
import thumbFlowerStar from '../assets/images/thumb-flower-star.png'
import Cover from '../components/HomeCovers'
import thumbColorDiary from '../assets/images/thumb-colordiary.webp'
// Cisco thumbnail not yet available — card uses gradient placeholder

gsap.registerPlugin(useGSAP, Flip, ScrollTrigger, SplitText)

const DISPLAY = '"Manrope", "Inter", sans-serif'
const SANS    = '"Manrope", "Inter", sans-serif'
const EASE_OUT = 'cubic-bezier(0.23,1,0.32,1)'

const PROJECTS = [
  {
    id: 'cisco', title: 'Cisco · Intersight',
    subtitle: 'Making AI actionable in complex infrastructure operations.',
    tags: ['Cloud Infrastructure', 'Enterprise AI'], year: '2026',
    category: 'products', thumb: null, cover: true, objectPos: 'center center',
    gradient: 'radial-gradient(ellipse 70% 80% at 8% 10%, rgba(150,225,250,0.85) 0%, transparent 65%), radial-gradient(ellipse 60% 70% at 95% 95%, rgba(140,165,245,0.7) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 70% 25%, rgba(255,255,255,0.9) 0%, transparent 70%), linear-gradient(160deg, #e3f1fb 0%, #c9dcf5 55%, #d9e2f8 100%)',
  },
  {
    id: 'bosch', title: 'Bosch · Down Payment & Deposit Platform',
    subtitle: 'Turning manual financial clearing into one streamlined workflow.',
    tags: ['Enterprise Finance', 'Internal Platform'], year: '2025',
    category: 'products', thumb: thumbBosch, cover: true, objectPos: 'center 30%',
  },
  {
    id: 'bytedance', title: 'ByteDance · Robot Management System',
    subtitle: 'Connecting operators with fleets of autonomous robots.',
    tags: ['Robotics', 'Warehouse Logistics'], year: '2024',
    category: 'products', thumb: thumbBytedance, cover: true, objectPos: 'center center',
  },
  {
    id: 'yhlo', title: 'YHLO · Lab Automation System',
    subtitle: 'Making complex lab automation safer and easier to operate.',
    tags: ['Healthcare UX', 'HMI'], year: '2024',
    category: 'products', thumb: thumbYhlo, cover: true, objectPos: 'center center',
  },
  {
    id: 'flower-star', title: 'Flower Star',
    subtitle: 'An original mobile game designed from concept to play.',
    tags: ['Gaming', 'Mobile App'], year: '2025',
    category: 'visuals', thumb: thumbFlowerStar, cover: true, objectPos: 'center top',
  },
  {
    id: 'color-diary', title: 'Color Diary',
    subtitle: 'A vibe-coded cover generator reaching 80K+ views on RedNote.',
    tags: ['Creator Tools', 'Vibe Coding', '8K+ Likes & Saves'], year: '2026',
    category: 'visuals', thumb: thumbColorDiary, cover: true, objectPos: 'center center',
    url: 'https://colordiary.finnickchen.site/',
  },
]

const FILTERS = [
  { key: 'all',      label: 'All' },
  { key: 'products', label: 'Products' },
  { key: 'visuals',  label: 'Visuals' },
]

export default function Home() {
  const pageRef = useRef(null)
  const stageRef = useRef(null)
  // the screen starts at the very top of the page, behind the header
  useLayoutEffect(() => {
    const stage = stageRef.current
    stage.style.marginTop = `-${stage.previousElementSibling.offsetHeight}px`
  }, [])
  // leaving the first screen: the words go first, then the view pushes in on him as the lamp dims (Studio3D reads --exit)
  const fadeTitle = useCallback((p) => {
    gsap.set('section.home-hero', { opacity: Math.max(0, 1 - p * 2.1) })
    gsap.set('.studio-scene', { opacity: Math.max(0, 1 - Math.max(0, p - 0.34) * 2.2), '--exit': p.toFixed(3) })
  }, [])
  const flipState = useRef(null)
  const overlayRef = useRef(null)
  const [curtainDone, setCurtainDone] = useState(false)
  const [visible, setVisible]         = useState(false)
  const [filter, setFilter]           = useState('all')

  const handleMouseMove = useCallback((e) => {
    // spotlight mask position
    if (overlayRef.current) {
      overlayRef.current.style.setProperty('--mx', `${e.clientX}px`)
      overlayRef.current.style.setProperty('--my', `${e.clientY}px`)
    }
  }, [])

  // 同一 session 只播一次开场动画
  const alreadyPlayed = sessionStorage.getItem('curtain-played') === 'true'

  const handleCurtainDone = useCallback(() => {
    setCurtainDone(true)
    setVisible(true)
    sessionStorage.setItem('curtain-played', 'true')
  }, [])

  // 内容在幕布开始拉动后约 0.6s 就开始淡入（仅首次）
  // 再次进入时跳过动画直接显示
  useEffect(() => {
    if (alreadyPlayed) {
      setCurtainDone(true)
      setVisible(true)
      return
    }
    const t = setTimeout(() => setVisible(true), 400 + 600)
    return () => clearTimeout(t)
  }, [])

  const filtered = PROJECTS.filter(p => filter === 'all' || p.category === filter)

  const changeFilter = (next) => {
    if (next === filter) return
    flipState.current = Flip.getState(pageRef.current.querySelectorAll('.home-card'))
    setFilter(next)
  }

  // kept cards glide to their new slots, returning ones rise in
  useLayoutEffect(() => {
    if (!flipState.current) return
    const state = flipState.current
    flipState.current = null
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    Flip.from(state, {
      targets: pageRef.current.querySelectorAll('.home-card'),
      duration: 0.55, ease: 'power3.inOut', stagger: 0.03,
      onEnter: els => gsap.fromTo(els, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 }),
      onComplete: () => ScrollTrigger.refresh(),
    })
  }, [filter])

  useGSAP((_, contextSafe) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!visible) {
      gsap.set('.home-card', { autoAlpha: 0, y: 72, clipPath: 'inset(16% 7% 0% 7% round 24px)' })
      gsap.set('.home-hero', { autoAlpha: 0 })
      return
    }
    // the headline assembles letter by letter, then leans toward the cursor
    gsap.set('.home-hero', { autoAlpha: 1 })
    ScrollTrigger.create({ trigger: stageRef.current, start: 'top top', end: 'bottom top', onUpdate: (self) => fadeTitle(self.progress) })
    let chars = []
    SplitText.create('.home-title', {
      type: 'words, chars', charsClass: 'home-title-char', autoSplit: true,
      onSplit: (self) => {
        chars = self.chars.map(el => ({
          el,
          y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }),
          r: gsap.quickTo(el, 'rotation', { duration: 0.5, ease: 'power3.out' }),
        }))
        return gsap.from(self.chars, { autoAlpha: 0, yPercent: 60, duration: 0.7, ease: 'power3.out', stagger: 0.012 })
      },
    })
    gsap.from('.home-sub', { autoAlpha: 0, y: 14, duration: 0.8, delay: 0.9, ease: 'power3.out' })

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const REACH = 130
    let resting = true
    const onMove = contextSafe((e) => {
      const hero = pageRef.current.querySelector('.home-title').getBoundingClientRect()
      const near = e.clientY > hero.top - REACH && e.clientY < hero.bottom + REACH
      if (!near) {
        if (!resting) { chars.forEach(c => { c.y(0); c.r(0) }); resting = true }
        return
      }
      resting = false
      chars.forEach(({ el, y, r }) => {
        const b = el.getBoundingClientRect()
        const dx = e.clientX - b.left - b.width / 2
        const dy = e.clientY - b.top - b.height / 2 + gsap.getProperty(el, 'y')
        const pull = Math.max(0, 1 - Math.hypot(dx, dy) / REACH)
        y(-12 * pull * pull)
        r(gsap.utils.clamp(-7, 7, dx / 14) * pull)
      })
    })

    // hovering a word sends a ripple through it
    const ripple = contextSafe((el) => {
      gsap.fromTo(el.querySelectorAll('.home-title-char'), { yPercent: 0 }, { yPercent: -16, duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1, stagger: 0.022, overwrite: 'auto' })
    })
    const cleanups = []
    if (fine) {
      window.addEventListener('mousemove', onMove, { passive: true })
      cleanups.push(() => window.removeEventListener('mousemove', onMove))
      pageRef.current.querySelectorAll('.home-title-hit').forEach((el) => {
        const enter = () => ripple(el)
        el.addEventListener('mouseenter', enter)
        cleanups.push(() => el.removeEventListener('mouseenter', enter))
      })
    }
    ScrollTrigger.batch('.home-card', {
      start: 'top 92%', once: true,
      onEnter: batch => gsap.to(batch, { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 24px)', clearProps: 'clipPath', duration: 1.15, ease: 'power3.out', stagger: 0.09, overwrite: 'auto' }),
    })
    // screen one to two: the headline lifts away and the filters come up to meet the cards
    gsap.to('section.home-hero', { y: -120, ease: 'none', scrollTrigger: { trigger: stageRef.current, start: 'top top', end: 'bottom top', scrub: 0.5 } })
    gsap.from('.home-filters', { autoAlpha: 0, y: 28, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.home-filters', start: 'top 88%', once: true } })
    // screen two to three: the cards fall back into the dark as the footer's projector opens up over them
    const footer = pageRef.current.querySelector('footer')
    gsap.fromTo('.home-grid', { scale: 1, opacity: 1, y: 0 }, { scale: 0.92, opacity: 0.18, y: -36, transformOrigin: '50% 100%', ease: 'none', scrollTrigger: { trigger: footer, start: 'top 82%', end: 'top 18%', scrub: 0.5 } })
    return () => cleanups.forEach(fn => fn())
  }, { scope: pageRef, dependencies: [visible], revertOnUpdate: true })

  return (
    <div style={{ minHeight: '100vh', background: '#07090f', cursor: 'none' }}
         onMouseMove={handleMouseMove}>

      {/* curtain bg — fades in with the content, not before */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url(${homeBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: curtainDone ? 0.55 : 0,
        filter: 'brightness(1.3)',
        transition: `opacity 0.9s ${EASE_OUT}`,
      }} />

      {/* spotlight mask */}
      {curtainDone && (
        <div ref={overlayRef} style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 3,
          '--mx': '50vw', '--my': '28vh',
          background: 'rgba(2,4,12,0.82)',
          WebkitMaskImage: 'radial-gradient(ellipse 380px 440px at var(--mx) var(--my), transparent 0%, rgba(0,0,0,0.5) 55%, black 80%)',
          maskImage:        'radial-gradient(ellipse 380px 440px at var(--mx) var(--my), transparent 0%, rgba(0,0,0,0.5) 55%, black 80%)',
          opacity: visible ? 1 : 0,
          transition: `opacity 0.9s ${EASE_OUT}`,
        }} />
      )}

      {/* ASCII star and drifting glyphs over the whole page, above the spotlight mask so it reads everywhere */}
      <AsciiField style={{ zIndex: 4, opacity: visible ? 1 : 0, transition: `opacity 1.2s ${EASE_OUT}` }} />


      {curtainDone && <SpotlightCursor />}

      {/* page */}
      <div ref={pageRef} style={{
        position: 'relative', zIndex: 10,
        opacity: visible ? 1 : 0,
        transition: `opacity 0.8s ${EASE_OUT}`,
      }}>
        <Header />

        {/* ── HERO ── */}
        <div ref={stageRef} style={{ position: 'relative', height: '100dvh', overflow: 'hidden', pointerEvents: 'none' }}>
        <Studio3D />
        <section className="home-hero" style={{ pointerEvents: 'auto', position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 clamp(20px, 8vw, 160px) clamp(28px, 5vh, 56px)', maxWidth: '1120px', margin: '0 auto', boxSizing: 'content-box' }}>
          {/* verified badge */}
          <div style={{ marginBottom: 20 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2L21.5 6.5L27.5 5.5L28.5 11.5L34 14L31.5 19.5L34 25L28.5 27.5L27.5 33.5L21.5 32.5L18 37L14.5 32.5L8.5 33.5L7.5 27.5L2 25L4.5 19.5L2 14L7.5 11.5L8.5 5.5L14.5 6.5L18 2Z" fill="#1D9BF0"/>
              <path d="M12 18.5L16 22.5L24 14.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="home-title" style={{
            fontFamily: DISPLAY, fontWeight: 400,
            fontSize: 'clamp(28px, 3.4vw, 48px)',
            lineHeight: 1.16, letterSpacing: '-0.03em',
            color: '#edf0f7', margin: '0 0 20px', maxWidth: 1000,
          }}>
            <span style={{ display: 'block' }}>Finnick is a <span className="home-title-hit">Product Designer</span></span>
            <span style={{ display: 'block' }}>based in <span className="home-title-hit">Seattle.</span></span>
            <span style={{ display: 'block', color: 'rgba(237,240,247,0.5)', marginTop: '0.18em' }}>Worked at <span className="home-title-hit home-title-co" data-project="cisco">Cisco</span>, <span className="home-title-hit home-title-co" data-project="bytedance">ByteDance</span>, and <span className="home-title-hit home-title-co" data-project="bosch">Bosch</span>.</span>
          </h1>
          <p className="home-sub" style={{
            fontFamily: SANS, fontWeight: 300,
            color: 'rgba(228,232,240,0.62)', margin: 0, lineHeight: 1.6, fontSize: '18px',
          }}>
            Experience across AI, B2B SaaS, and enterprise platforms.
          </p>
        </section>
        </div>

        {/* ── FILTER + GRID ── */}
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 clamp(20px, 8vw, 160px) clamp(32px, 4vw, 56px)', boxSizing: 'content-box' }}>

          {/* filter row */}
          <div className="home-filters" style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '32px',
          }}>
            <FilterTabs filter={filter} onChange={changeFilter} />
            <span style={{ fontFamily: SANS, fontSize: '15px', color: 'rgba(255,255,255,0.45)' }}>
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* 2 × 2 grid — fixed, no layout changes */}
          <style>{'.home-title-co{color:rgba(237,240,247,0.86);border-bottom:1px solid rgba(237,240,247,0.25);transition:border-color 0.2s}.home-title-co:hover{border-color:rgba(237,240,247,0.8)}.home-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(20px,2.4vw,32px)}@media(max-width:760px){.home-grid{grid-template-columns:1fr}}.home-card:active{scale:0.985}.home-card:focus-visible,.home-tab:focus-visible{outline:2px solid rgba(180,210,255,0.9);outline-offset:4px}.home-tab:active{scale:0.97}@media(prefers-reduced-motion:reduce){.home-card{transform:none!important;translate:none!important;filter:none!important;transition:opacity 0.2s ease!important}}'}</style>
          <div className="home-grid">
            {filtered.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>

        </div>

        {/* ── FOOTER ── */}
        <SiteFooter />
      </div>

      {!alreadyPlayed && <CurtainIntro onComplete={handleCurtainDone} />}
    </div>
  )
}

/* ── Card ─────────────────────────────────────────────────── */

function ProjectCard({ project: p }) {
  const cardRef  = useRef(null)
  const glowRef  = useRef(null)
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left   // 0 → rect.width
    const y = e.clientY - rect.top    // 0 → rect.height
    // specular glow follows cursor
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(280px circle at ${x}px ${y}px, rgba(255,255,255,0.07), transparent 70%)`
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    if (glowRef.current)
      glowRef.current.style.background = 'transparent'
  }, [])

  // bytedance has a full case study; everything else opens behind a password gate
  const href = `/work/${p.id}`

  const Wrapper = p.url ? 'a' : Link
  const wrapperProps = p.url ? { href: p.url, target: '_blank', rel: 'noopener noreferrer' } : { to: href }

  return (
    <Wrapper
      {...wrapperProps}
      ref={cardRef}
      className="home-card"
      data-project={p.id}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'block', textDecoration: 'none',
        borderRadius: '22px', overflow: 'hidden', padding: 6,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered
          ? '0 30px 60px -20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 10px 30px -18px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        willChange: 'transform',
        transition: [
          `scale 160ms ${EASE_OUT}`,
          `border-color 0.2s ${EASE_OUT}`,
          `box-shadow 0.25s ${EASE_OUT}`,
        ].join(', '),
      }}
    >
      {/* specular surface glow layer */}
      <div ref={glowRef} style={{
        position: 'absolute', inset: 0, zIndex: 10,
        pointerEvents: 'none', borderRadius: '22px',
        transition: 'background 0.1s',
      }} />

      {/* image */}
      <div style={{
        position: 'relative', aspectRatio: '16/9',
        overflow: 'hidden', borderRadius: 16,
        transform: 'translateZ(0)', backfaceVisibility: 'hidden',
        background: '#0b0e18',
      }}>
        {p.cover ? (
          <Cover id={p.id} hovered={hovered} />
        ) : p.thumb ? (
          <img
            src={p.thumb} alt={p.title}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: p.objectPos, display: 'block',
              filter: (p.id === 'bytedance' || p.id === 'bosch' || p.id === 'yhlo' || p.id === 'flower-star' || p.id === 'color-diary')
                ? (hovered ? 'brightness(1.0)' : 'brightness(0.82)')
                : (hovered ? 'brightness(0.55) blur(1.5px)' : 'brightness(0.45) blur(1.5px)'),
              transition: `filter 0.2s ${EASE_OUT}`,
            }}
          />
        ) : p.gradient ? (
          <>
            <div style={{
              width: '100%', height: '100%',
              background: p.gradient,
              opacity: hovered ? 1 : 0.9,
              transition: `opacity 0.2s ${EASE_OUT}`,
            }} />
            {p.id === 'cisco' && (
              <>
                {/* glass arcs */}
                <div style={{ position: 'absolute', width: '90%', aspectRatio: '1', left: '-35%', top: '-55%', borderRadius: '50%', border: '28px solid rgba(255,255,255,0.35)', filter: 'blur(6px)' }} />
                <div style={{ position: 'absolute', width: '110%', aspectRatio: '1', right: '-60%', bottom: '-95%', borderRadius: '50%', border: '40px solid rgba(255,255,255,0.28)', boxShadow: 'inset 0 0 60px rgba(120,160,240,0.35)', filter: 'blur(4px)' }} />
                {/* grain */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.22, mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")` }} />
              </>
            )}
          </>
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 14px)',
          }}>
            <span style={{
              fontFamily: SANS, fontSize: '11px', letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
            }}>
              In Progress
            </span>
          </div>
        )}
        {p.id !== 'bytedance' && p.id !== 'cisco' && p.id !== 'bosch' && p.id !== 'yhlo' && p.id !== 'flower-star' && p.id !== 'color-diary' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(8,11,22,0.55)', border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(3px)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="white" strokeOpacity="0.85" strokeWidth="1.6" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="white" strokeOpacity="0.85" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1.4" fill="white" fillOpacity="0.85" />
              </svg>
            </div>
            <span style={{
              fontFamily: SANS, fontSize: '10px', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
            }}>
              Password Protected
            </span>
          </div>
        )}
      </div>

      {/* info */}
      <div style={{ padding: '18px 16px 16px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: '12px', marginBottom: '16px',
        }}>
          <div>
            <h3 style={{
              fontFamily: SANS, fontWeight: 600,
              fontSize: '18px', lineHeight: 1.2, letterSpacing: '-0.01em',
              color: '#fff',
              margin: 0, transition: 'color 0.22s',
            }}>
              {p.title}
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {p.tags.map(t => (
            <span key={t} style={{
              fontFamily: SANS, fontWeight: 400, fontSize: '12px',
              letterSpacing: '0.01em',
              color: hovered ? '#fff' : 'rgba(255,255,255,0.6)',
              background: hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${hovered ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '100px', padding: '4px 12px', whiteSpace: 'nowrap',
              transition: `color 0.2s ${EASE_OUT}, border-color 0.2s ${EASE_OUT}, background 0.2s ${EASE_OUT}`,
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </Wrapper>
  )
}

/* ── Filter tabs with sliding pill ───────────────────────── */
function FilterTabs({ filter, onChange }) {
  const refs   = useRef({})
  const barRef = useRef(null)
  const [pill, setPill] = useState(null)

  useEffect(() => {
    const el = refs.current[filter]
    if (el && barRef.current) {
      const br = barRef.current.getBoundingClientRect()
      const er = el.getBoundingClientRect()
      setPill(prev => ({ left: er.left - br.left, width: er.width, moved: !!prev }))
    }
  }, [filter])

  return (
    <div ref={barRef} style={{ position: 'relative', display: 'flex', gap: '24px', paddingBottom: 8 }}>
      {/* sliding underline under the active tab */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: 1, height: 2, background: '#fff',
        transformOrigin: 'left',
        transform: pill ? `translateX(${pill.left}px) scaleX(${pill.width})` : 'scaleX(0)',
        transition: pill?.moved ? 'transform 0.25s cubic-bezier(0.77,0,0.175,1)' : 'none',
        pointerEvents: 'none',
      }} />
      {FILTERS.map(f => (
        <button key={f.key}
          className="home-tab"
          ref={el => { refs.current[f.key] = el }}
          onClick={() => onChange(f.key)}
          onMouseEnter={e => { if (filter !== f.key) e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
          onMouseLeave={e => { if (filter !== f.key) e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
          style={{
            fontFamily: SANS, fontWeight: 400, fontSize: '18px', letterSpacing: '-0.01em',
            color: filter === f.key ? '#fff' : 'rgba(255,255,255,0.45)',
            background: 'transparent', border: 'none', padding: 0,
            cursor: 'pointer', transition: `color 0.2s ${EASE_OUT}, scale 160ms ${EASE_OUT}`,
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

/* ── Cursor ──────────────────────────────────────────────── */
function SpotlightCursor() {
  const ref = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)
  useGSAP((_, contextSafe) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const xTo = gsap.quickTo(ref.current, 'x', { duration: 0.14, ease: 'power3.out' })
    const yTo = gsap.quickTo(ref.current, 'y', { duration: 0.14, ease: 'power3.out' })
    let first = true, over = null
    const move = contextSafe(e => {
      if (first) { first = false; gsap.set(ref.current, { x: e.clientX, y: e.clientY, opacity: 1 }) }
      xTo(e.clientX); yTo(e.clientY)
      const state = e.target.closest?.('a:not(.home-card), button') || document.body.dataset.sceneHot ? 'link' : e.target.closest?.('.home-card') ? 'project' : null
      if (state === over) return
      over = state
      gsap.to(dotRef.current, { scale: state === 'link' ? 3 : state === 'project' ? 0 : 1, duration: 0.25, ease: 'power3.out', overwrite: 'auto' })
      gsap.to(labelRef.current, state === 'project'
        ? { scale: 1, opacity: 1, duration: 0.32, ease: 'back.out(1.6)', overwrite: 'auto' }
        : { scale: 0.6, opacity: 0, duration: 0.16, ease: 'power2.out', overwrite: 'auto' })
    })
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, { scope: ref })
  return (
    <div ref={ref} style={{ position: 'fixed', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: 50, willChange: 'transform' }}>
      <div ref={dotRef} style={{
        position: 'absolute', left: -2.5, top: -2.5, width: 5, height: 5, borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)',
      }} />
      <div ref={labelRef} style={{
        position: 'absolute', left: 0, top: 0, translate: '-50% -50%', opacity: 0, scale: 0.6, whiteSpace: 'nowrap',
        padding: '9px 16px', borderRadius: 999, background: '#0a0c12', color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        fontFamily: SANS, fontSize: 13, fontWeight: 500, letterSpacing: '-0.005em',
      }}>
        View project
      </div>
    </div>
  )
}
