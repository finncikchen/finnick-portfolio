import { Link } from 'react-router-dom'
import Header from '../components/Header'

// ── tokens ───────────────────────────────────────────────────
const BG    = '#141414'
const WHITE = '#fcfcfc'
const MUTED = '#a3a3a3'
const ACCENT = '#00bceb'
const F     = 'Inter, sans-serif'

// ── layout ───────────────────────────────────────────────────
// Content container matches mauriciocornejo.com: ~48px side padding, max ~1100px
const W = { maxWidth: 1100, margin: '0 auto', padding: '0 48px' }

// ── primitives ───────────────────────────────────────────────
function H3({ children }) {
  return (
    <h3 style={{ fontFamily: F, fontWeight: 500, fontSize: 20, lineHeight: '26px', color: WHITE, margin: '0 0 18px' }}>
      {children}
    </h3>
  )
}
function P({ children, large, style }) {
  return (
    <p style={{
      fontFamily: F, fontWeight: 400,
      fontSize: large ? 20 : 16,
      lineHeight: large ? '26px' : '22px',
      color: MUTED, margin: 0,
      ...style,
    }}>{children}</p>
  )
}
function Placeholder({ label, aspect = '4/3' }) {
  return (
    <div style={{
      aspectRatio: aspect,
      background: '#1e1e1e',
      borderRadius: 12,
      border: '1.5px dashed rgba(0,188,235,0.2)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke={ACCENT} strokeWidth="1.5"/>
        <path d="M3 16l5-5 4 4 3-3 6 6" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill={ACCENT}/>
      </svg>
      <span style={{ fontFamily: F, fontSize: 11, color: ACCENT, opacity: 0.55, textAlign: 'center', padding: '0 20px' }}>{label}</span>
    </div>
  )
}

// ── 2-col feature block (alternates text/image order) ────────
// reverse=true → image LEFT, text RIGHT
function Feature({ title, body, placeholder, aspect = '4/3', reverse = false, extra }) {
  const textCol = (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <H3>{title}</H3>
      <P>{body}</P>
      {extra && <div style={{ marginTop: 20 }}>{extra}</div>}
    </div>
  )
  const imgCol = <Placeholder label={placeholder} aspect={aspect} />

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: reverse ? '1.5fr 1fr' : '1fr 1.5fr',
      gap: 40,
      alignItems: 'center',
    }}>
      {reverse ? <>{imgCol}{textCol}</> : <>{textCol}{imgCol}</>}
    </div>
  )
}

export default function Cisco() {
  return (
    <div style={{ background: BG, color: WHITE, fontFamily: F, minHeight: '100vh' }}>

      <Header minimal />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ ...W, paddingTop: 20 }}>

        {/* Back */}
        <Link to="/"
          style={{ fontFamily: F, fontSize: 14, color: WHITE, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24, opacity: 0.9 }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.5'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.9'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </Link>

        {/* Client logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', color: WHITE }}>CISCO</span>
          <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ fontFamily: F, fontSize: 13, color: MUTED }}>Intersight</span>
        </div>

        {/* H1 — grey lead-in + white outcome */}
        <h1 style={{
          fontFamily: F, fontWeight: 500,
          fontSize: 'clamp(32px, 5vw, 56px)',
          lineHeight: 1.1, letterSpacing: '-1px',
          color: WHITE, margin: '0 0 40px', maxWidth: 760,
        }}>
          <span style={{ color: MUTED }}>Redesigned the Intersight header </span>
          so operators go from alert to action without losing context
        </h1>

        {/* Hero image — full content width */}
        <Placeholder label="Hero — Intersight header redesign overview" aspect="16/7" />

        {/* "Open live site" style link */}
        <a
          href="#"
          style={{ fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 14 }}
          onMouseEnter={e => e.currentTarget.style.color = WHITE}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          View Intersight
        </a>
      </section>

      {/* ── INTRO ────────────────────────────────────────── */}
      <section style={{ ...W, paddingTop: 48, paddingBottom: 64 }}>
        <P large>
          Cisco Intersight is an enterprise cloud operations platform managing infrastructure across on-prem and cloud environments. I led the{' '}
          <span style={{ color: WHITE, fontWeight: 500 }}>"Insight to Action"</span>
          {' '}initiative — a full header redesign to surface contextual insights in the navigation layer, so operators could move from discovering a problem to resolving it without leaving context.
        </P>

        {/* Metadata row */}
        <div style={{ display: 'flex', gap: 48, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[['Role','Product Designer'],['Platform','Enterprise SaaS'],['Year','2024'],['Scope','Navigation · IA · Design System']].map(([k,v]) => (
            <div key={k}>
              <p style={{ fontFamily: F, fontSize: 11, color: MUTED, margin: '0 0 4px', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.55 }}>{k}</p>
              <p style={{ fontFamily: F, fontSize: 13, color: WHITE, margin: 0, fontWeight: 500 }}>{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section style={{ ...W, paddingBottom: 96 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 72 }}>

          {/* Feature 1 — text LEFT, image RIGHT */}
          <Feature
            title="The header was working against operators"
            body="The header tried to surface too much at once — alerts, notifications, search, account, and global nav all competed for the same visual space. Users discovered issues but had to navigate away entirely to act on them, losing context in the process. Header components had also diverged from the Momentum Design System, creating inconsistency across surfaces."
            placeholder="旧版 Intersight header — Before state"
            aspect="3/2"
          />

          {/* Feature 2 — image LEFT, text RIGHT */}
          <Feature
            reverse
            title="8 sessions revealed a critical mental model mismatch"
            body="The header was organized by feature type, while users thought in terms of urgency and context. 100% of operators said their first action on any page is scanning for error indicators — but the alert system was buried under a notification bell. Only 12% used global search because they didn't know it could search across alerts and resources."
            placeholder="研究过程 / Affinity diagram / 用户访谈笔记"
            aspect="3/2"
          />

          {/* Feature 3 — text LEFT, image RIGHT */}
          <Feature
            title="Contextual Alert Triage — no context switch required"
            body="Critical alerts now appear inline in the header with severity color-coding and a one-click action panel. Operators can acknowledge, escalate, or dismiss without leaving the page. The redesigned search understands intent: a server name routes to its resource view, an error code routes to relevant alerts."
            placeholder="新版 header UI — Alert Triage Panel"
            aspect="3/2"
          />

        </div>
      </section>

      {/* ── FULL-WIDTH IMAGE GALLERY ──────────────────────── */}
      <section style={{ ...W, paddingBottom: 96 }}>
        <p style={{ fontFamily: F, fontSize: 16, fontStyle: 'italic', color: MUTED, margin: '0 0 24px' }}>
          A redesigned header built around urgency, not features
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['Before — old header UI', '16/9'],
            ['After — new header UI', '16/9'],
            ['Alert Triage Panel — expanded state', '16/9'],
            ['Unified Search with intent routing', '16/9'],
          ].map(([label, aspect]) => (
            <div key={label}>
              <Placeholder label={label} aspect={aspect} />
              <p style={{ fontFamily: F, fontSize: 13, color: MUTED, margin: '10px 0 0', opacity: 0.7 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── IMPACT ───────────────────────────────────────── */}
      <section style={{ ...W, paddingBottom: 96 }}>
        <h2 style={{ fontFamily: F, fontWeight: 500, fontSize: 20, lineHeight: '26px', color: WHITE, margin: '0 0 18px' }}>Impact</h2>
        <P style={{ marginBottom: 32 }}>
          The redesigned header reduced time-to-action for critical alerts and improved task completion across monitored infrastructure workflows.
        </P>

        {/* Quote block like their Results section */}
        <div style={{ borderLeft: '2px solid rgba(255,255,255,0.12)', paddingLeft: 24 }}>
          <p style={{ fontFamily: F, fontSize: 16, lineHeight: '22px', color: MUTED, margin: '0 0 6px' }}>
            "Finally, the header works the way{' '}
            <span style={{ color: WHITE, fontWeight: 500 }}>I think about my infrastructure</span>
            {' '}— by what's on fire, not by feature category."
          </p>
          <p style={{ fontFamily: F, fontSize: 13, color: MUTED, margin: 0, opacity: 0.6 }}>Infrastructure Admin, enterprise customer</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 0, marginTop: 48, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[['↑ 34%','Task Completion'],['− 2.4','Navigation Steps'],['92%','Satisfaction Score']].map(([n, u]) => (
            <div key={u} style={{ flex: 1, padding: '28px 0', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontFamily: F, fontWeight: 500, fontSize: 36, color: WHITE, margin: '0 0 4px', letterSpacing: '-0.04em' }}>{n}</p>
              <p style={{ fontFamily: F, fontSize: 13, color: MUTED, margin: 0 }}>{u}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REFLECTION (2-col — text left, image/quote right) */}
      <section style={{ ...W, paddingBottom: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 40, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontFamily: F, fontWeight: 500, fontSize: 20, lineHeight: '26px', color: WHITE, margin: '0 0 18px' }}>Reflection</h2>
            <P>Enterprise navigation design is as much information architecture as it is visual design. The biggest gains came from restructuring the mental model — organizing by urgency and context instead of feature type — not from visual polish.</P>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              ['What worked', 'Anchoring every design decision around user mental models gave us a clear north star that helped resolve design debates throughout the project.'],
              ["What I'd do differently", "Involve engineering earlier in the alert triage panel — some interaction patterns required late-stage compromises due to architectural constraints."],
            ].map(([t, d]) => (
              <div key={t} style={{ padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: WHITE, margin: '0 0 6px' }}>{t}</p>
                <P style={{ fontSize: 14, lineHeight: '20px' }}>{d}</P>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER NAV ───────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ ...W, paddingTop: 36, paddingBottom: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/"
            style={{ fontFamily: F, fontSize: 14, color: MUTED, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => e.currentTarget.style.color = WHITE}
            onMouseLeave={e => e.currentTarget.style.color = MUTED}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            All Work
          </Link>
          <Link to="/work/bytedance"
            style={{ fontFamily: F, fontSize: 14, color: MUTED, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => e.currentTarget.style.color = WHITE}
            onMouseLeave={e => e.currentTarget.style.color = MUTED}
          >
            Next: ByteDance
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>

    </div>
  )
}
