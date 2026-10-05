import { useRef, useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import CurtainIntro from '../components/CurtainIntro'
import homeBg from '../assets/images/home-bg.png'

import thumbBytedance  from '../assets/images/thumb-bytedance.webp'
import thumbBosch      from '../assets/images/thumb-bosch.png'
import thumbYhlo       from '../assets/images/thumb-yhlo.png'
import thumbFlowerStar from '../assets/images/thumb-flower-star.png'
import BoschDashboard, { Scaled } from '../components/bosch/Dashboard'
import YhloCover from '../components/YhloCover'
import LiveRMS from '../components/LiveRMS'
import glassBg from '../assets/images/bytedance/hero-bg.webp'
import fsCover from '../assets/images/flowerstar/cover.png'
import thumbColorDiary from '../assets/images/thumb-colordiary.webp'
// Cisco thumbnail not yet available — card uses gradient placeholder

const SERIF   = '"Cormorant Garamond", serif'
const DISPLAY = '"Playfair Display", serif'
const SANS    = 'Inter, sans-serif'

const PROJECTS = [
  {
    id: 'cisco', title: 'Cisco Intersight',
    subtitle: 'Insight to Action — Header Design',
    tags: ['Enterprise', 'SaaS'], year: '2026',
    category: 'products', thumb: null, objectPos: 'center center',
    gradient: 'radial-gradient(ellipse 70% 80% at 8% 10%, rgba(150,225,250,0.85) 0%, transparent 65%), radial-gradient(ellipse 60% 70% at 95% 95%, rgba(140,165,245,0.7) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 70% 25%, rgba(255,255,255,0.9) 0%, transparent 70%), linear-gradient(160deg, #e3f1fb 0%, #c9dcf5 55%, #d9e2f8 100%)',
  },
  {
    id: 'bosch', title: 'Bosch',
    subtitle: 'Finance Operations Dashboard',
    tags: ['Enterprise', 'FinTech'], year: '2025',
    category: 'products', thumb: thumbBosch, cover: true, objectPos: 'center 30%',
  },
  {
    id: 'bytedance', title: 'ByteDance',
    subtitle: 'Internal Operations Platform',
    tags: ['Enterprise', 'B2B'], year: '2024',
    category: 'products', thumb: thumbBytedance, cover: true, objectPos: 'center center',
  },
  {
    id: 'yhlo', title: 'YHLO',
    subtitle: 'Medical Device UX System',
    tags: ['Healthcare', 'Hardware'], year: '2024',
    category: 'products', thumb: thumbYhlo, cover: true, objectPos: 'center center',
  },
  {
    id: 'flower-star', title: 'Flower Star',
    subtitle: 'Consumer Mobile Experience',
    tags: ['Consumer', 'Mobile'], year: '2024',
    category: 'visuals', thumb: thumbFlowerStar, cover: true, objectPos: 'center top',
  },
  {
    id: 'color-diary', title: 'Color Diary',
    subtitle: 'Vibe-Coded Cover Generator',
    tags: ['Vibe Coding', 'Web App'], year: '2026',
    category: 'visuals', thumb: thumbColorDiary, objectPos: 'center center',
    url: 'https://colordiary.finnickchen.site/',
  },
]

const FILTERS = [
  { key: 'all',      label: 'All' },
  { key: 'products', label: 'Products' },
  { key: 'visuals',  label: 'Visuals' },
]

export default function Home() {
  const overlayRef = useRef(null)
  const glowRef    = useRef(null)   // small div moved by transform — GPU composited
  const [curtainDone, setCurtainDone] = useState(false)
  const [visible, setVisible]         = useState(false)
  const [filter, setFilter]           = useState('all')

  const handleMouseMove = useCallback((e) => {
    // spotlight mask position
    if (overlayRef.current) {
      overlayRef.current.style.setProperty('--mx', `${e.clientX}px`)
      overlayRef.current.style.setProperty('--my', `${e.clientY}px`)
    }
    // glow: move a fixed-gradient div via transform (no repaint, GPU only)
    if (glowRef.current) {
      glowRef.current.style.transform = `translate(${e.clientX - 90}px, ${e.clientY - 100}px)`
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
        transition: 'opacity 1.2s ease-in',
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
          transition: 'opacity 1.3s ease-in',
        }} />
      )}

      {/* glow dot — GPU-composited, no repaint on move */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '180px', height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(180,210,255,0.2) 0%, transparent 70%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none', zIndex: 200,
          willChange: 'transform',
          transform: 'translate(-999px, -999px)', // hidden off-screen initially
        }}
      />

      {curtainDone && <SpotlightCursor />}

      {/* page */}
      <div style={{
        position: 'relative', zIndex: 10,
        opacity: visible ? 1 : 0,
        transition: 'opacity 1.6s ease-in',
      }}>
        <Header />

        {/* ── HERO ── */}
        <section style={{ padding: '60px 48px 48px', maxWidth: '1160px', margin: '0 auto' }}>
          {/* verified badge */}
          <div style={{ marginBottom: 20 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2L21.5 6.5L27.5 5.5L28.5 11.5L34 14L31.5 19.5L34 25L28.5 27.5L27.5 33.5L21.5 32.5L18 37L14.5 32.5L8.5 33.5L7.5 27.5L2 25L4.5 19.5L2 14L7.5 11.5L8.5 5.5L14.5 6.5L18 2Z" fill="#1D9BF0"/>
              <path d="M12 18.5L16 22.5L24 14.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: DISPLAY, fontWeight: 400,
            fontSize: 'clamp(26px, 3.2vw, 46px)',
            lineHeight: 1.2, letterSpacing: '0em',
            color: '#edf0f7', margin: '0 0 16px',
          }}>
            Finnick is a Product Designer based in Seattle. Worked at Cisco, TikTok, and Bosch.
          </h1>
          <p style={{
            fontFamily: SANS, fontWeight: 300,
            color: 'rgba(228,228,228,0.9)', margin: 0, lineHeight: 1.5, fontSize: '18px',
          }}>
            Experience across AI, B2B SaaS, and enterprise platforms.
          </p>
        </section>

        {/* ── FILTER + GRID ── */}
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 48px 96px' }}>

          {/* filter row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '24px',
          }}>
            <FilterTabs filter={filter} onChange={setFilter} />
            <span style={{ fontFamily: SANS, fontSize: '15px', color: 'rgba(255,255,255,0.45)' }}>
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* 2 × 2 grid — fixed, no layout changes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} visible={visible} />
            ))}
          </div>

        </div>
      </div>

      {!alreadyPlayed && <CurtainIntro onComplete={handleCurtainDone} />}
    </div>
  )
}

/* ── Card ─────────────────────────────────────────────────── */

// Covers follow the ByteDance thumb: diffuse glass background + one hero screen in a frosted frame
function Cover({ id, hovered }) {
  const lift = { transition: 'transform 0.5s ease', transform: hovered ? 'translate(-50%, -50%) scale(1.03)' : 'translate(-50%, -50%)' }
  const frame = { position: 'absolute', left: '50%', top: '56%', width: '80%', padding: '1.2%', borderRadius: 10, background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(8px)', boxShadow: '0 1px 2px rgba(30,50,90,0.06), 0 8px 20px rgba(30,50,90,0.08), 0 28px 56px rgba(30,50,90,0.10)', ...lift }
  const bg = (filter) => <div style={{ position: 'absolute', inset: 0, background: `url(${glassBg}) center / cover`, filter }} />
  if (id === 'bosch') return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 45% 60% at 18% 8%, rgba(47,107,255,0.55) 0%, rgba(47,107,255,0) 70%), radial-gradient(ellipse 40% 55% at 88% 18%, rgba(0,200,215,0.40) 0%, rgba(0,200,215,0) 70%), radial-gradient(ellipse 50% 50% at 72% 95%, rgba(123,63,228,0.45) 0%, rgba(123,63,228,0) 70%), radial-gradient(ellipse 30% 35% at 4% 85%, rgba(226,0,21,0.25) 0%, rgba(226,0,21,0) 70%), linear-gradient(180deg, #0a1124 0%, #070b18 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(120,190,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(120,190,255,0.10) 1px, transparent 1px)', backgroundSize: '22px 22px', maskImage: 'radial-gradient(ellipse 60% 55% at 50% 30%, #000 0%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 30%, #000 0%, transparent 80%)' }} />
      <div style={{ position: 'absolute', left: '20%', right: '20%', top: '10%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(140,210,255,0.9), transparent)' }} />
      <div style={{ position: 'absolute', left: '14%', right: '14%', top: '14%', borderRadius: '8px 8px 0 0', overflow: 'hidden', background: '#fff', boxShadow: '0 0 0 1px rgba(140,200,255,0.35), 0 0 40px rgba(60,140,255,0.35), 0 20px 50px rgba(0,0,0,0.5)', transition: 'transform 0.5s ease', transform: hovered ? 'translateY(-4%)' : 'none' }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #e20015, #9e2896, #0062a3, #00a8b0, #78be20)' }} />
        <Scaled><BoschDashboard /></Scaled>
      </div>
    </div>
  )
  if (id === 'bytedance') return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {bg()}
      <div style={{ ...frame, width: '70%', top: '54%' }}><div style={{ borderRadius: 6, overflow: 'hidden' }}><LiveRMS /></div></div>
    </div>
  )
  if (id === 'yhlo') return <YhloCover hovered={hovered} />
  if (id === 'flower-star') return (
    <img src={fsCover} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.04)' : 'none' }} />
  )
  return null
}

function ProjectCard({ project: p, index, visible }) {
  const cardRef  = useRef(null)
  const glowRef  = useRef(null)
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left   // 0 → rect.width
    const y = e.clientY - rect.top    // 0 → rect.height
    const cx = rect.width  / 2
    const cy = rect.height / 2
    // tilt: max ±3deg — subtle
    const rotateX = ((y - cy) / cy) * -3
    const rotateY = ((x - cx) / cx) *  3
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(3px)`
    // specular glow follows cursor
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(280px circle at ${x}px ${y}px, rgba(255,255,255,0.07), transparent 70%)`
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    if (cardRef.current)
      cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)'
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
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'block', textDecoration: 'none',
        borderRadius: '14px', overflow: 'hidden',
        background: 'rgba(8,11,22,0.82)',
        backdropFilter: 'blur(2px)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered
          ? '0 24px 52px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)'
          : '0 2px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
        opacity: visible ? 1 : 0,
        willChange: 'transform',
        transition: [
          `opacity 0.6s ease ${0.07 * index}s`,
          'border-color 0.28s',
          'box-shadow 0.36s',
        ].join(', '),
        // smooth return when mouse leaves
        ...(hovered ? {} : { transition: [
          `opacity 0.6s ease ${0.07 * index}s`,
          'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
          'border-color 0.28s',
          'box-shadow 0.36s',
        ].join(', ') }),
      }}
    >
      {/* specular surface glow layer */}
      <div ref={glowRef} style={{
        position: 'absolute', inset: 0, zIndex: 10,
        pointerEvents: 'none', borderRadius: '14px',
        transition: 'background 0.1s',
      }} />

      {/* image */}
      <div style={{
        position: 'relative', aspectRatio: '16/9',
        overflow: 'hidden',
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
              transition: 'filter 0.4s ease',
            }}
          />
        ) : p.gradient ? (
          <>
            <div style={{
              width: '100%', height: '100%',
              background: p.gradient,
              opacity: hovered ? 1 : 0.9,
              transition: 'opacity 0.4s ease',
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
            {p.id === 'cisco' && (
              <div style={{
                position: 'absolute', left: '50%', top: '10%', width: '86%', aspectRatio: '1536/1024',
                transform: `translateX(-50%) ${hovered ? 'translateY(-4px) scale(1.02)' : ''}`,
                transition: 'transform 0.5s ease',
              }}>
                <video src="/cisco-hero.mov" autoPlay loop muted playsInline
                  style={{ position: 'absolute', top: '8.1%', left: '8.72%', width: '82.49%', height: '60.35%', objectFit: 'fill' }} />
                <img src="/cisco-ui/monitor-frame-17.png" alt=""
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              </div>
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
      <div style={{ padding: '18px 20px 22px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: '12px', marginBottom: '12px',
        }}>
          <div>
            <h3 style={{
              fontFamily: SANS, fontWeight: 600,
              fontSize: '17px', lineHeight: 1.2, letterSpacing: '-0.01em',
              color: '#fff',
              margin: '0 0 4px', transition: 'color 0.22s',
            }}>
              {p.title}
            </h3>
            <p style={{
              fontFamily: SANS, fontWeight: 400, fontSize: '12px',
              color: 'rgba(255,255,255,0.65)', margin: 0, letterSpacing: '0.02em',
            }}>
              {p.subtitle}
            </p>
          </div>
          <span style={{
            fontFamily: SANS, fontWeight: 400, fontSize: '11px',
            color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em',
            flexShrink: 0, paddingTop: '2px',
          }}>
            {p.year}
          </span>
        </div>

        <div style={{
          height: '1px', marginBottom: '12px',
          background: `rgba(255,255,255,${hovered ? 0.09 : 0.05})`,
          transition: 'background 0.28s',
        }} />

        <div style={{ display: 'flex', gap: '6px' }}>
          {p.tags.map(t => (
            <span key={t} style={{
              fontFamily: SANS, fontWeight: 400, fontSize: '10px',
              letterSpacing: '0.05em',
              color: hovered ? '#fff' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${hovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.22)'}`,
              borderRadius: '100px', padding: '3px 11px',
              transition: 'color 0.22s, border-color 0.22s',
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
  const [pill, setPill] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const el = refs.current[filter]
    if (el && barRef.current) {
      const br = barRef.current.getBoundingClientRect()
      const er = el.getBoundingClientRect()
      setPill({ left: er.left - br.left, width: er.width })
    }
  }, [filter])

  return (
    <div ref={barRef} style={{ position: 'relative', display: 'flex', gap: '24px', paddingBottom: 8 }}>
      {/* sliding underline under the active tab */}
      <div style={{
        position: 'absolute', bottom: 0, height: 2, borderRadius: 1,
        left: pill.left, width: pill.width, background: '#fff',
        transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: 'none',
      }} />
      {FILTERS.map(f => (
        <button key={f.key}
          ref={el => { refs.current[f.key] = el }}
          onClick={() => onChange(f.key)}
          onMouseEnter={e => { if (filter !== f.key) e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
          onMouseLeave={e => { if (filter !== f.key) e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
          style={{
            fontFamily: SANS, fontWeight: 400, fontSize: '18px', letterSpacing: '-0.01em',
            color: filter === f.key ? '#fff' : 'rgba(255,255,255,0.45)',
            background: 'transparent', border: 'none', padding: 0,
            cursor: 'pointer', transition: 'color 0.2s',
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
  useEffect(() => {
    const move = e => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 'px'
        ref.current.style.top  = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <div ref={ref} style={{
      position: 'fixed', width: '5px', height: '5px', borderRadius: '50%',
      background: 'rgba(255,255,255,0.9)',
      transform: 'translate(-50%,-50%)',
      boxShadow: '0 0 10px 5px rgba(140,170,255,0.28)',
      pointerEvents: 'none', zIndex: 50,
    }} />
  )
}
