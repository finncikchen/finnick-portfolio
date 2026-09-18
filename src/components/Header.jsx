import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.svg'
import avatar from '../assets/images/profile.png'

const SANS = 'Inter, sans-serif'
const EMAIL = 'finnick1106@gmail.com'

function IconMail() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
    </svg>
  )
}
function IconLinkedIn() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}
function IconFile() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
    </svg>
  )
}
function IconCopy({ done }) {
  return done ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}
function IconArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
    </svg>
  )
}

function EmailRow({ onClose }) {
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCopy}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
        background: hovered ? 'rgba(255,255,255,0.07)' : 'transparent',
        transition: 'background 0.15s', marginBottom: 2,
      }}
    >
      <div style={{ color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}><IconMail /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>Email</div>
        <div style={{ fontFamily: SANS, fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{EMAIL}</div>
      </div>
      <div style={{ color: copied ? '#4ade80' : 'rgba(255,255,255,0.35)', flexShrink: 0, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
        <IconCopy done={copied} />
      </div>
    </div>
  )
}

function LinkRow({ icon, label, sub, href, onClose }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href} target="_blank" rel="noreferrer"
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 8,
        textDecoration: 'none',
        background: hovered ? 'rgba(255,255,255,0.07)' : 'transparent',
        transition: 'background 0.15s', marginBottom: 2,
      }}
    >
      <div style={{ color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>{label}</div>
        <div style={{ fontFamily: SANS, fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 1 }}>{sub}</div>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
        <IconArrow />
      </div>
    </a>
  )
}

export default function Header({ minimal = false }) {
  const [open, setOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '28px 52px', width: '100%', position: 'relative', zIndex: 10,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
        <img src={logo} alt="FINNICK" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
      </Link>

      <nav style={{
        display: 'flex', gap: '36px', alignItems: 'center',
        fontFamily: SANS, fontSize: '13px', fontWeight: 400, letterSpacing: '0.04em',
        color: 'rgba(255,255,255,0.5)',
      }}>
        {!minimal && [{ label: 'Work', to: '/' }, { label: 'About', to: '/about' }].map(item => (
          <Link key={item.label} to={item.to}
            style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >{item.label}</Link>
        ))}

        {/* Contact me */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <button onClick={() => setOpen(v => !v)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: open ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${open ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 100, padding: '6px 14px 6px 6px',
            cursor: 'pointer', color: 'rgba(255,255,255,0.85)',
            fontFamily: SANS, fontSize: '13px', fontWeight: 400,
            transition: 'background 0.2s, border-color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
            onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' } }}
          >
            <img src={avatar} alt="Finnick" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top' }} />
            Contact me
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: 'rgba(14,18,30,0.96)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, padding: '6px',
              minWidth: 256,
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            }}>
              <EmailRow onClose={() => setOpen(false)} />
              <LinkRow icon={<IconLinkedIn />} label="LinkedIn" sub="linkedin.com/in/finnick-chen"
                href="https://www.linkedin.com/in/finnick-chen" onClose={() => setOpen(false)} />
              <LinkRow icon={<IconFile />} label="Resume" sub="View PDF"
                href="https://drive.google.com/file/d/18YmO4nCD5nnzxserhyF82_zqdPp9TSTd/view?usp=drive_link" onClose={() => setOpen(false)} />
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
