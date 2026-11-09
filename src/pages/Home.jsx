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
      gsap.set('.home-card', { autoAlpha: 0, y: 72 })
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
      onEnter: batch => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.15, ease: 'power3.out', stagger: 0.09, overwrite: 'auto' }),
    })
    // each project opens up to full width as it comes up the screen, and its title follows a beat behind
    gsap.utils.toArray('.home-card').forEach(card => {
      gsap.fromTo(card.querySelector('.home-media'), { scale: 0.86 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 28%', scrub: 0.6 } })
      gsap.fromTo(card.querySelector('.home-info'), { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 35%', scrub: 0.6 } })
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

          {/* one project to a row, studio style */}
          <style>{'.home-title-co{color:rgba(237,240,247,0.86);border-bottom:1px solid rgba(237,240,247,0.25);transition:border-color 0.2s}.home-title-co:hover{border-color:rgba(237,240,247,0.8)}.home-grid{display:grid;grid-template-columns:1fr;gap:clamp(64px,9vw,136px)}.home-card:active .home-media{scale:0.992}.home-card:focus-visible,.home-tab:focus-visible{outline:2px solid rgba(180,210,255,0.9);outline-offset:4px}.home-tab:active{scale:0.97}@media(prefers-reduced-motion:reduce){.home-card{transform:none!important;translate:none!important;filter:none!important;transition:opacity 0.2s ease!important}}'}</style>
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
  const [hovered, setHovered] = useState(false)

  // bytedance has a full case study; everything else opens behind a password gate
  const href = `/work/${p.id}`

  const Wrapper = p.url ? 'a' : Link
  const wrapperProps = p.url ? { href: p.url, target: '_blank', rel: 'noopener noreferrer' } : { to: href }

  return (
    <Wrapper
      {...wrapperProps}
      className="home-card"
      data-project={p.id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      {/* image */}
      <div className="home-media" style={{
        position: 'relative', aspectRatio: '16/9',
        overflow: 'hidden', borderRadius: 10,
        background: '#0b0e18', transformOrigin: '50% 0%', willChange: 'transform',
        transition: `scale 160ms ${EASE_OUT}`,
      }}>
        {p.cover ? (
          <Cover id={p.id} hovered={hovered} />
        ) : p.thumb ? (
          <img
            src={p.thumb} alt={p.title}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: p.objectPos, display: 'block',
              filter: hovered ? 'brightness(1.0)' : 'brightness(0.82)',
              transition: `filter 0.2s ${EASE_OUT}`,
            }}
          />
        ) : null}
      </div>

      {/* info */}
      <div className="home-info" style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '8px 24px', padding: '22px 2px 0',
      }}>
        <h3 style={{
          fontFamily: SANS, fontWeight: 500,
          fontSize: 'clamp(20px, 2vw, 26px)', lineHeight: 1.2, letterSpacing: '-0.015em',
          color: hovered ? '#fff' : 'rgba(255,255,255,0.88)',
          margin: 0, transition: `color 0.2s ${EASE_OUT}`,
        }}>
          {p.title}
        </h3>
        <span style={{
          fontFamily: SANS, fontWeight: 400, fontSize: '14px', letterSpacing: '0.01em',
          color: hovered ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.46)',
          transition: `color 0.2s ${EASE_OUT}`,
        }}>
          {p.tags.join('  ·  ')}
        </span>
      </div>
    </Wrapper>
  )
}

/* ── Filter tabs ──────────────────────────────────────────── */

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
// The dot is drawn at the size it grows to and shrunk, so the grown circle stays crisp
const RING = 54
const DOT = 5 / RING

function SpotlightCursor() {
  const ref = useRef(null)
  const dotRef = useRef(null)
  const arrowRef = useRef(null)
  useGSAP((_, contextSafe) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const xTo = gsap.quickTo(ref.current, 'x', { duration: 0.18, ease: 'power3.out' })
    const yTo = gsap.quickTo(ref.current, 'y', { duration: 0.18, ease: 'power3.out' })
    gsap.set(dotRef.current, { scale: DOT })
    let first = true, over = null
    const move = contextSafe(e => {
      if (first) { first = false; gsap.set(ref.current, { x: e.clientX, y: e.clientY, opacity: 1 }) }
      xTo(e.clientX); yTo(e.clientY)
      const state = e.target.closest?.('a:not(.home-card), button') || document.body.dataset.sceneHot ? 'link' : e.target.closest?.('.home-card') ? 'project' : null
      if (state === over) return
      over = state
      // Over a project the dot swells into a circle that inverts what is under it, and an arrow is cut out of it
      const big = state === 'project'
      gsap.to(dotRef.current, {
        scale: big ? 1 : state === 'link' ? DOT * 3 : DOT,
        duration: big ? 0.55 : 0.35, ease: big ? 'expo.out' : 'power3.out', overwrite: 'auto',
      })
      gsap.to(arrowRef.current, big
        ? { scale: 1, rotation: 0, opacity: 1, duration: 0.5, delay: 0.06, ease: 'expo.out', overwrite: 'auto' }
        : { scale: 0.4, rotation: -45, opacity: 0, duration: 0.18, ease: 'power2.out', overwrite: 'auto' })
    })
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, { scope: ref })
  return (
    // Difference blending turns the circle into the negative of the card beneath; the arrow, drawn black, leaves the card as it is
    <div ref={ref} style={{ position: 'fixed', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: 50, willChange: 'transform', mixBlendMode: 'difference' }}>
      <div ref={dotRef} style={{
        position: 'absolute', left: -RING / 2, top: -RING / 2, width: RING, height: RING, borderRadius: '50%', background: '#fff',
      }} />
      <svg ref={arrowRef} width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden style={{
        position: 'absolute', left: -9.5, top: -9.5, opacity: 0, transform: 'scale(0.4) rotate(-45deg)',
      }}>
        <path d="M7 17L17 7M8.5 7H17V15.5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
