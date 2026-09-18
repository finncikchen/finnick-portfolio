import { Link } from 'react-router-dom'
import Header from '../components/Header'

// ── tokens (from mauriciocornejo.com measurements) ───────────
const BG      = '#141414'
const WHITE   = '#fcfcfc'
const MUTED   = '#a3a3a3'
const ACCENT  = '#00bceb'   // Cisco teal
const F       = 'Inter, sans-serif'

// ── layout constants ─────────────────────────────────────────
const CONTENT = { maxWidth: 680, margin: '0 auto', padding: '0 32px' }

// ── reusable primitives ───────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontFamily: F, fontWeight: 500, fontSize: 20,
      lineHeight: '26px', color: WHITE, margin: '0 0 18px',
    }}>{children}</h2>
  )
}
function BodyP({ children, style }) {
  return (
    <p style={{
      fontFamily: F, fontWeight: 400, fontSize: 16,
      lineHeight: '20px', color: MUTED, margin: 0,
      ...style,
    }}>{children}</p>
  )
}
function Placeholder({ label, aspect = '16/9' }) {
  return (
    <div style={{
      aspectRatio: aspect,
      background: '#1f1f1f',
      borderRadius: 12,
      border: '1.5px dashed rgba(0,188,235,0.25)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke={ACCENT} strokeWidth="1.5"/>
        <path d="M3 16l5-5 4 4 3-3 6 6" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill={ACCENT}/>
      </svg>
      <span style={{ fontFamily: F, fontSize: 11, color: ACCENT, opacity: 0.6, textAlign: 'center', padding: '0 24px' }}>{label}</span>
    </div>
  )
}

// ── feature block: copy on top, image below (40px gap) ───────
function Feature({ label, title, body, placeholder, aspect = '16/9', extra }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        {label && (
          <p style={{ fontFamily: F, fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, margin: '0 0 12px', opacity: 0.6 }}>{label}</p>
        )}
        <SectionTitle>{title}</SectionTitle>
        <BodyP>{body}</BodyP>
        {extra}
      </div>
      <Placeholder label={placeholder} aspect={aspect} />
    </div>
  )
}

export default function Cisco() {
  return (
    <div style={{ background: BG, color: WHITE, fontFamily: F, minHeight: '100vh' }}>

      <Header minimal />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ ...CONTENT, paddingTop: 34, paddingBottom: 0 }}>

        {/* Back */}
        <Link to="/"
          style={{ fontFamily: F, fontSize: 14, color: WHITE, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </Link>

        {/* Client logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, letterSpacing: '0.06em', color: WHITE }}>CISCO</span>
          <span style={{ fontFamily: F, fontSize: 12, color: MUTED }}>Intersight</span>
        </div>

        {/* H1 — grey first clause, white action clause */}
        <h1 style={{
          fontFamily: F, fontWeight: 500, fontSize: 40,
          lineHeight: '44px', letterSpacing: '-0.8px',
          color: WHITE, margin: '0 0 40px',
        }}>
          <span style={{ color: MUTED }}>Redesigned the Intersight header </span>
          so operators go from alert to action without losing context
        </h1>

        {/* Hero image */}
        <Placeholder label="Hero — Intersight header redesign overview" aspect="16/8" />

        {/* Meta row below image */}
        <div style={{ display: 'flex', gap: 40, marginTop: 20 }}>
          {[['Role','Product Designer'],['Platform','Enterprise SaaS'],['Year','2024'],['Scope','Navigation · Design System']].map(([k,v]) => (
            <div key={k}>
              <p style={{ fontFamily: F, fontSize: 11, color: MUTED, margin: '0 4px 0 0', opacity: 0.5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{k}</p>
              <p style={{ fontFamily: F, fontSize: 13, color: WHITE, margin: 0, fontWeight: 500 }}>{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTRO ────────────────────────────────────────── */}
      <section style={{ ...CONTENT, paddingTop: 56, paddingBottom: 50 }}>
        <p style={{ fontFamily: F, fontWeight: 400, fontSize: 20, lineHeight: '26px', color: MUTED, margin: 0 }}>
          Cisco Intersight is an enterprise cloud operations platform managing infrastructure across on-prem and cloud environments. I led the{' '}
          <span style={{ color: WHITE, fontWeight: 500 }}>"Insight to Action"</span>
          {' '}initiative — a full header redesign focused on surfacing contextual insights in the navigation layer, so operators could move from discovering a problem to resolving it without losing context.
        </p>
      </section>

      {/* ── IMPACT ───────────────────────────────────────── */}
      <section style={{ ...CONTENT, paddingTop: 0, paddingBottom: 96 }}>
        <SectionTitle>Impact</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            ['↑ 34%', 'task completion', '— operators resolved issues faster with fewer page jumps'],
            ['− 2.4', 'navigation steps', '— reduced average steps to reach critical alerts'],
            ['92%', 'satisfaction score', '— post-launch usability testing'],
          ].map(([n, u, d]) => (
            <div key={u} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontFamily: F, fontWeight: 500, fontSize: 32, color: WHITE, letterSpacing: '-0.04em', minWidth: 80 }}>{n}</span>
              <span style={{ fontFamily: F, fontSize: 16, color: WHITE, fontWeight: 500 }}>{u}</span>
              <span style={{ fontFamily: F, fontSize: 16, color: MUTED }}>{d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION: PROBLEM ─────────────────────────────── */}
      <section style={{ ...CONTENT, paddingTop: 56, paddingBottom: 96 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 72 }}>

          <Feature
            title="The header was working against operators"
            body="The header tried to surface too much at once — alerts, notifications, search, account, and global nav competed for the same visual space. Users discovered issues but had to navigate entirely away to act on them, losing context in the process. Header components had also diverged from the Momentum Design System, creating inconsistency across surfaces."
            placeholder="旧版 Intersight header — Before state"
            aspect="16/5"
          />

        </div>
      </section>

      {/* ── SECTION: RESEARCH ────────────────────────────── */}
      <section style={{ ...CONTENT, paddingTop: 56, paddingBottom: 96 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 72 }}>

          <Feature
            title="8 contextual inquiry sessions revealed a mental model mismatch"
            body="The core question: how do users move from noticing a problem to taking action? Sessions revealed the header was organized by feature type, while users thought in terms of urgency and context. I also ran heatmap analysis, think-aloud testing, and competitive analysis across Datadog, AWS Console, and Splunk."
            placeholder="研究过程 / 用户访谈笔记 / Affinity diagram"
            aspect="16/7"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div>
              <SectionTitle>Four patterns that defined the redesign</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  ['Users scan for red first', '100% of operators said their first action is checking for error indicators. The existing alert system was buried under a notification bell.'],
                  ['Context switching is the top pain point', '"I click the alert, it takes me to a completely different page, and I lose track of what I was doing." — P3, Infrastructure Admin'],
                  ['Search is underused', 'Only 12% of sessions used global search. Most users didn\'t know it could search across alerts and resources — they thought it was just a page filter.'],
                  ['Insight ≠ Action', 'The header surfaced information but provided no direct path to remediation. Users had to mentally bridge this gap themselves.'],
                ].map(([t, d], i) => (
                  <div key={t} style={{ padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontFamily: F, fontSize: 16, fontWeight: 500, color: WHITE, margin: '0 0 6px' }}>{t}</p>
                    <BodyP>{d}</BodyP>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION: SOLUTION ────────────────────────────── */}
      <section style={{ ...CONTENT, paddingTop: 56, paddingBottom: 96 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 72 }}>

          {/* Before / After */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div>
              <SectionTitle>Insight to Action — a header built around urgency, not features</SectionTitle>
              <BodyP>
                A redesigned header that surfaces the right signal, in the right moment, with a direct path to resolution — without leaving the current context.
              </BodyP>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontFamily: F, fontSize: 11, color: MUTED, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.5 }}>Before</p>
                <Placeholder label="旧版 header UI 截图" aspect="3/2" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontFamily: F, fontSize: 11, color: ACCENT, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>After</p>
                <Placeholder label="新版 header UI 截图" aspect="3/2" />
              </div>
            </div>
          </div>

          <Feature
            label="Feature 01"
            title="Contextual Alert Triage"
            body="Critical alerts now appear inline in the header with severity color-coding and a one-click action panel. Operators can acknowledge, escalate, or dismiss without leaving the page — no context switch required."
            placeholder="Contextual Alert Triage — UI 截图"
            aspect="16/7"
          />

          <Feature
            label="Feature 02"
            title="Unified Search with Intent Routing"
            body="Search now understands context: a server name routes to its resource view, an error code routes to relevant alerts. A redesigned search UI surfaces recent items and suggested actions based on current page context."
            placeholder="Unified Search — UI 截图"
            aspect="16/7"
          />

          <Feature
            label="Feature 03"
            title="Momentum Design System Integration"
            body="All header components were rebuilt to Momentum DS specifications, introducing new reusable tokens for status colors, density variants, and responsive breakpoints — enabling the patterns to scale across all Intersight surfaces."
            placeholder="Design System components — tokens & variants"
            aspect="16/7"
          />

        </div>
      </section>

      {/* ── REFLECTION ───────────────────────────────────── */}
      <section style={{ ...CONTENT, paddingTop: 32, paddingBottom: 96 }}>
        <SectionTitle>Reflection</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            ['What worked', 'Anchoring the design around user mental models (urgency/context vs. feature type) gave us a clear north star that helped resolve every design debate through the project.'],
            ["What I'd do differently", "Involve engineering earlier in the alert triage panel — some interaction patterns we designed were technically complex to implement in the existing architecture, requiring late-stage compromises."],
            ['The takeaway', 'Enterprise navigation design is as much information architecture as it is visual design. The biggest gains came from restructuring the mental model, not from visual polish.'],
          ].map(([t, d]) => (
            <div key={t} style={{ padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontFamily: F, fontSize: 16, fontWeight: 500, color: WHITE, margin: '0 0 6px' }}>{t}</p>
              <BodyP>{d}</BodyP>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER NAV ───────────────────────────────────── */}
      <section style={{ ...CONTENT, paddingTop: 40, paddingBottom: 64, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      </section>

    </div>
  )
}
