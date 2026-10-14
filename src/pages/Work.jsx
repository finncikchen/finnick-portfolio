import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import theaterSeats from '../assets/images/theater-seats.png'
import spotlight from '../assets/images/spotlight.png'

import thumbBytedance from '../assets/images/thumb-bytedance.png'
import thumbBosch from '../assets/images/thumb-bosch.png'
import thumbYhlo from '../assets/images/thumb-yhlo.png'
import thumbFlowerStar from '../assets/images/thumb-flower-star.png'

// ─── Data ────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 'bytedance',
    index: '01',
    title: 'ByteDance',
    subtitle: 'Internal Operations Platform',
    desc: 'Redesigned internal tools serving 10,000+ daily users across operations, logistics, and compliance teams — reducing task completion time by 40%.',
    tags: ['Enterprise', 'B2B', 'Data Platform', 'Dashboard'],
    year: '2022–23',
    role: 'Product Designer',
    category: 'software',
    thumb: thumbBytedance,
    objectPos: 'center top',
    accent: '#3b6fd4',        // blue
    accentDim: 'rgba(59,111,212,0.12)',
  },
  {
    id: 'bosch',
    index: '02',
    title: 'Bosch',
    subtitle: 'Finance Operations Dashboard',
    desc: "Down-payment & deposit platform streamlining financial reconciliation workflows for Bosch's cross-regional finance teams.",
    tags: ['Enterprise', 'FinTech', 'Dashboard'],
    year: '2023',
    role: 'UX Designer',
    category: 'software',
    thumb: thumbBosch,
    objectPos: 'center 30%',
    accent: '#c0392b',        // bosch red
    accentDim: 'rgba(192,57,43,0.1)',
  },
  {
    id: 'flower-star',
    index: '03',
    title: 'Flower Star',
    subtitle: 'Consumer Mobile Experience',
    desc: 'End-to-end design for an interactive consumer app blending game mechanics with e-commerce, from concept to launch.',
    tags: ['Consumer', 'Mobile', 'Game'],
    year: '2022',
    role: 'Product Designer',
    category: 'software',
    thumb: thumbFlowerStar,
    objectPos: 'center top',
    accent: '#7c3aed',        // violet
    accentDim: 'rgba(124,58,237,0.12)',
  },
  {
    id: 'yhlo',
    index: '04',
    title: 'YHLO',
    subtitle: 'Medical Device UX System',
    desc: 'UX system for a clinical-grade immunoassay analyzer — bridging hardware interface and software workflow for lab technicians.',
    tags: ['Healthcare', 'Hardware+SW', 'B2B'],
    year: '2023',
    role: 'UX Designer',
    category: 'hardware',
    thumb: thumbYhlo,
    objectPos: 'center center',
    accent: '#0d9488',        // teal
    accentDim: 'rgba(13,148,136,0.12)',
  },
]

const FILTERS = [
  { key: 'all', label: 'All Projects' },
  { key: 'software', label: 'Software' },
  { key: 'hardware', label: 'Hardware' },
]

// ─── Work page ────────────────────────────────────────────
export default function Work() {
  const [filter, setFilter] = useState('all')

  const visible = PROJECTS.filter(p => filter === 'all' || p.category === filter)
  const software = visible.filter(p => p.category === 'software')
  const hardware = visible.filter(p => p.category === 'hardware')

  return (
    <div style={{ minHeight: '100vh', background: '#07090f', display: 'flex', flexDirection: 'column' }}>

      {/* ── Theater hero ── */}
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden', flexShrink: 0 }}>
        {/* Backdrop */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, #000201 60%, #050b1b 100%)',
        }} />
        {/* Spotlight beam */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '580px', bottom: '-200px', pointerEvents: 'none',
        }}>
          <img src={spotlight} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        {/* Header */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Header />
        </div>
        {/* Hero text */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          paddingTop: '60px',
        }}>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>
            The Work
          </p>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: 'clamp(40px,4vw,60px)', color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Selected Projects
          </h1>
        </div>
        {/* Theater seats at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, pointerEvents: 'none' }}>
          <div style={{
            height: '40px',
            background: 'linear-gradient(89.6deg, rgb(178,194,213) 3.88%, rgb(59,81,132) 97.25%)',
            opacity: 0.08,
            borderTop: '1px solid rgba(255,255,255,0.2)',
          }} />
          <img src={theaterSeats} alt="" style={{ width: '100%', height: '130px', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '8px',
        padding: '36px 0 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              fontWeight: filter === f.key ? 500 : 400,
              color: filter === f.key ? '#fff' : 'rgba(255,255,255,0.35)',
              background: filter === f.key ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: `1px solid ${filter === f.key ? 'rgba(255,255,255,0.2)' : 'transparent'}`,
              borderRadius: '100px',
              padding: '8px 22px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Project sections ── */}
      <div style={{ flex: 1, padding: '48px 7% 80px' }}>

        {/* Software */}
        {software.length > 0 && (
          <ProjectSection
            label="Software"
            desc="Enterprise platforms · Consumer apps · Digital systems"
            projects={software}
          />
        )}

        {/* Hardware */}
        {hardware.length > 0 && (
          <ProjectSection
            label="Hardware"
            desc="Physical devices · Embedded UX · Human-machine interfaces"
            projects={hardware}
            style={{ marginTop: software.length > 0 ? '64px' : 0 }}
          />
        )}

      </div>

      <Footer />
    </div>
  )
}

// ─── Project section ──────────────────────────────────────
function ProjectSection({ label, desc, projects, style }) {
  return (
    <div style={style}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600, fontSize: '28px',
          color: 'rgba(255,255,255,0.9)', margin: 0,
        }}>
          {label}
        </h2>
        <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.08)', alignSelf: 'center' }} />
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
          {desc}
        </p>
      </div>

      {/* Cards grid — 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {projects.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </div>
  )
}

// ─── Project card ─────────────────────────────────────────
function ProjectCard({ project: p }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#0c0f1c',
        border: `1px solid ${hovered ? p.accent + '55' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered ? `0 0 0 1px ${p.accent}22, 0 24px 64px rgba(0,0,0,0.5)` : 'none',
        transition: 'border-color 0.35s, box-shadow 0.35s',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* ── Image area ── */}
      <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>

        {/* Tech viewfinder bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)',
        }}>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: '10px', color: p.accent, letterSpacing: '0.12em' }}>
            PROJ.{p.index}
          </span>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>
            {p.year}
          </span>
        </div>

        {/* Project image */}
        <img
          src={p.thumb}
          alt={p.title}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: p.objectPos,
            display: 'block',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />

        {/* Scan line on hover */}
        <div style={{
          position: 'absolute', left: 0, right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${p.accent}cc, transparent)`,
          top: hovered ? '100%' : '-4px',
          transition: hovered ? 'top 0.8s linear' : 'none',
          zIndex: 6,
          pointerEvents: 'none',
        }} />

        {/* Bottom gradient fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 50%, rgba(12,15,28,0.85) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Accent color bleed at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
          background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)`,
          opacity: hovered ? 0.8 : 0.25,
          transition: 'opacity 0.35s',
        }} />
      </div>

      {/* ── Info area ── */}
      <div style={{
        padding: '22px 24px 24px',
        flex: 1, display: 'flex', flexDirection: 'column',
        background: `linear-gradient(135deg, ${p.accentDim} 0%, transparent 60%)`,
        position: 'relative',
      }}>

        {/* Faded index number — large, behind content */}
        <span style={{
          position: 'absolute', right: '20px', top: '10px',
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700, fontSize: '72px',
          color: `${p.accent}18`,
          lineHeight: 1, userSelect: 'none',
          transition: 'color 0.35s',
          ...(hovered ? { color: `${p.accent}28` } : {}),
        }}>
          {p.index}
        </span>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <h3 style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600, fontSize: '22px',
              color: hovered ? '#fff' : '#c4cfe1',
              margin: 0, lineHeight: 1.2,
              transition: 'color 0.25s',
            }}>
              {p.title}
            </h3>
            <p style={{
              fontFamily: 'Poppins, sans-serif', fontSize: '12px',
              color: p.accent, margin: '4px 0 0',
              letterSpacing: '0.04em',
            }}>
              {p.subtitle}
            </p>
          </div>
          {/* Arrow indicator */}
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            border: `1px solid ${hovered ? p.accent : 'rgba(255,255,255,0.12)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: '2px',
            transition: 'border-color 0.25s, background 0.25s',
            background: hovered ? `${p.accent}22` : 'transparent',
          }}>
            <span style={{ color: hovered ? p.accent : 'rgba(255,255,255,0.3)', fontSize: '14px', transition: 'color 0.25s' }}>
              ↗
            </span>
          </div>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'Poppins, sans-serif', fontSize: '13px',
          color: 'rgba(255,255,255,0.45)', lineHeight: 1.65,
          margin: '0 0 16px', flex: 1,
        }}>
          {p.desc}
        </p>

        {/* Footer: tags + role */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {p.tags.map(t => (
              <span key={t} style={{
                fontFamily: 'Poppins, sans-serif', fontSize: '10px',
                color: hovered ? p.accent : 'rgba(255,255,255,0.3)',
                border: `1px solid ${hovered ? p.accent + '55' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '100px', padding: '3px 10px',
                transition: 'color 0.25s, border-color 0.25s',
              }}>
                {t}
              </span>
            ))}
          </div>
          <span style={{
            fontFamily: '"Courier New", monospace', fontSize: '10px',
            color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em',
          }}>
            {p.role}
          </span>
        </div>
      </div>
    </div>
  )
}
