import { Link, useLocation } from 'react-router-dom'
import Header from './Header'
import { F, INK, SUB, LIGHT, FADE, W, WIDE, STATEMENT, EYEBROW, CARD_SHADOW, GRAIN, MESH_HERO, MESH_SOFT, PANEL_SOFT } from './caseTokens'

export function P({ children, large, style }) {
  return (
    <p style={{ fontFamily: F, fontWeight: 400, fontSize: large ? 19 : 16, lineHeight: large ? '30px' : '25px', color: SUB, margin: 0, ...style }}>
      {children}
    </p>
  )
}

export function Page({ children }) {
  return <div style={{ background: LIGHT, color: INK, fontFamily: F, minHeight: '100vh' }}>{children}</div>
}

export function Hero({ brand, title, sub, cta, bgImage, background, light, darkLogo = light, logoColor, children }) {
  const bg = background || (bgImage ? `url(${bgImage}) center / cover no-repeat` : MESH_HERO)
  return (
    <div style={{ padding: 12 }}>
      <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', background: bg }}>
        {!bgImage && !background && <div style={{ position: 'absolute', inset: 0, opacity: 0.45, mixBlendMode: 'soft-light', backgroundImage: GRAIN, pointerEvents: 'none' }} />}
        <div style={{ position: 'relative' }}>
          <Header minimal darkLogo={darkLogo} logoColor={logoColor} />
          <section style={{ ...W, paddingTop: 'clamp(24px, 4vw, 56px)', paddingBottom: 48 }}>
            {brand}
            <h1 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(34px, 4.8vw, 60px)', lineHeight: 1.06, letterSpacing: '-0.04em', color: light ? INK : '#ffffff', margin: '0 0 32px' }}>
              {title}{' '}<span style={{ color: light ? FADE : 'rgba(255,255,255,0.62)' }}>{sub}</span>
            </h1>
            {cta}
          </section>
          {children}
        </div>
      </div>
    </div>
  )
}

// Label sits above its content (reference: AI Finance OS)
export function SplitRow({ label, children }) {
  return (
    <div>
      <p style={EYEBROW}>{label}</p>
      <div style={{ maxWidth: 900 }}>{children}</div>
    </div>
  )
}

export function ChapterHead({ eyebrow, title, sub, body, center }) {
  return (
    <div style={{ ...WIDE, marginBottom: 'clamp(40px, 5vw, 64px)', textAlign: center ? 'center' : 'left' }}>
      <p style={EYEBROW}>{eyebrow}</p>
      <h2 style={{ ...STATEMENT, maxWidth: 900, margin: center ? '0 auto' : 0 }}>
        {title}{sub && <>{' '}<span style={{ color: FADE }}>{sub}</span></>}
      </h2>
      {body && <P large style={{ maxWidth: 640, marginTop: 24, marginLeft: center ? 'auto' : 0, marginRight: center ? 'auto' : 0 }}>{body}</P>}
    </div>
  )
}

// A large panel that spans almost the full page width and holds one idea
export function Panel({ children, soft, style }) {
  return (
    <div style={{ padding: '0 12px' }}>
      <div style={{ borderRadius: 24, background: soft ? PANEL_SOFT : '#ffffff', padding: 'clamp(40px, 5.5vw, 88px) 0', ...style }}>{children}</div>
    </div>
  )
}

export function Stage({ children, pad = 'clamp(16px, 3.5vw, 48px)' }) {
  return (
    <div style={WIDE}>
      <div style={{ borderRadius: 28, padding: pad, background: MESH_SOFT }}>{children}</div>
    </div>
  )
}

export function InfoTable({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '28px 32px', marginTop: 48 }}>
      {items.map(([k, v]) => (
        <div key={k}>
          <p style={{ fontFamily: F, fontSize: 11, color: SUB, margin: 0, paddingBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>{k}</p>
          <p style={{ fontFamily: F, fontSize: 15, color: INK, margin: '12px 0 0' }}>{v}</p>
        </div>
      ))}
    </div>
  )
}

const CHICLETS = {
  server: { bg: 'linear-gradient(145deg, #c9d6ff 0%, #8fa8f5 100%)', d: <><rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/><line x1="8" y1="7" x2="8.01" y2="7"/><line x1="8" y1="17" x2="8.01" y2="17"/></> },
  signal: { bg: 'linear-gradient(145deg, #d9ccff 0%, #a38cf5 100%)', d: <path d="M3 12h4l3-7 4 14 3-7h4"/> },
  spark:  { bg: 'linear-gradient(145deg, #e3d4ff 0%, #b48cf2 100%)', d: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/> },
  grid:   { bg: 'linear-gradient(145deg, #d6dcff 0%, #9aa6f3 100%)', d: <><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></> },
  map:    { bg: 'linear-gradient(145deg, #cfe3ff 0%, #86aef0 100%)', d: <><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></> },
  users:  { bg: 'linear-gradient(145deg, #e0d6ff 0%, #9d8cf2 100%)', d: <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/></> },
}

export function Chiclet({ kind }) {
  const { bg, d } = CHICLETS[kind]
  return (
    <span aria-hidden style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', verticalAlign: '-0.26em',
      width: '1.3em', height: '1.3em', borderRadius: '0.34em', background: bg, margin: '0 0.1em',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 12px rgba(110,120,220,0.25)',
    }}>
      <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
    </span>
  )
}

export function Shot({ src, alt }) {
  return <img src={src} alt={alt} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 14, boxShadow: '0 24px 60px rgba(30,50,90,0.14), 0 0 0 1px rgba(0,0,0,0.05)' }} />
}

export function SolutionRow({ n, lines, body, flip, bg = MESH_SOFT, children }) {
  const shades = [INK, '#86868b', '#b8b8bd']
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: flip ? 'row-reverse' : 'row', alignItems: 'center', gap: 'clamp(32px, 5vw, 72px)' }}>
      <div style={{ flex: '1.7 1 480px', minWidth: 0 }}>
        <div style={bg === 'transparent' ? {} : { borderRadius: 24, padding: 'clamp(12px, 2.4vw, 32px)', background: bg, boxShadow: bg === MESH_SOFT ? 'none' : CARD_SHADOW }}>{children}</div>
      </div>
      <div style={{ flex: '1 1 280px', minWidth: 0 }}>
        <p style={{ ...EYEBROW, whiteSpace: 'pre' }}>{n}</p>
        <h3 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(26px, 2.8vw, 36px)', lineHeight: 1.18, letterSpacing: '-0.03em', margin: '0 0 24px' }}>
          {lines.map((l, i) => <span key={l} style={{ display: 'block', color: shades[i] }}>{l}</span>)}
        </h3>
        <P style={{ maxWidth: 380 }}>{body}</P>
      </div>
    </div>
  )
}

export function Stats({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
      {items.map(([n, t, s]) => (
        <div key={t} style={{ padding: '44px 24px', borderRadius: 24, background: '#ffffff', textAlign: 'center', boxShadow: CARD_SHADOW }}>
          <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(56px, 7vw, 88px)', color: INK, margin: '0 0 8px', letterSpacing: '-0.05em', lineHeight: 1 }}>{n}</p>
          <p style={{ fontFamily: F, fontSize: 16, color: INK, margin: '0 0 4px', fontWeight: 500 }}>{t}</p>
          <p style={{ fontFamily: F, fontSize: 14, color: SUB, margin: 0, opacity: 0.7 }}>{s}</p>
        </div>
      ))}
    </div>
  )
}

export function ContactCTA() {
  return (
    <section style={{ ...W, paddingBottom: 'clamp(96px, 10vw, 140px)', textAlign: 'center' }}>
      <p style={EYEBROW}>More to the story</p>
      <h2 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(30px, 4.4vw, 52px)', lineHeight: 1.12, letterSpacing: '-0.035em', color: INK, maxWidth: 820, margin: '0 auto 20px' }}>
        Curious about the design process?
      </h2>
      <P large style={{ maxWidth: 560, margin: '0 auto 36px' }}>
        I'd be happy to walk you through the details over a call. Reach out at
      </P>
      <a href="mailto:c4han@uw.edu"
        style={{ fontFamily: F, fontSize: 15, fontWeight: 500, color: '#ffffff', background: INK, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 999, transition: 'opacity 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        c4han@uw.edu
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
      </a>
    </section>
  )
}

// Case-study order, matching the home page grid; the last one loops back to the first
export const CASE_ORDER = [
  ['/work/cisco', 'Cisco'], ['/work/bosch', 'Bosch'], ['/work/bytedance', 'ByteDance'],
  ['/work/yhlo', 'YHLO'], ['/work/flower-star', 'Flower Star'],
]

export function FooterNav({ dark }) {
  const { pathname } = useLocation()
  const i = CASE_ORDER.findIndex(([to]) => to === pathname)
  const next = CASE_ORDER[(i + 1) % CASE_ORDER.length]
  const base = dark ? 'rgba(238,241,250,0.55)' : SUB, hover = dark ? '#eef1fa' : INK
  const link = { fontFamily: F, fontSize: 14, color: base, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }
  const on = e => { e.currentTarget.style.color = hover }, off = e => { e.currentTarget.style.color = base }
  return (
    <div style={{ borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
      <div style={{ ...W, paddingTop: 36, paddingBottom: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={link} onMouseEnter={on} onMouseLeave={off}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          All Work
        </Link>
        <Link to={next[0]} style={link} onMouseEnter={on} onMouseLeave={off}>
          Next: {next[1]}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>
    </div>
  )
}
