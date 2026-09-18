import { Link } from 'react-router-dom'
import Header from '../components/Header'

const SANS  = 'Inter, sans-serif'
const BLUE  = '#00bceb'
const NAVY  = '#003087'
const BG    = '#040c21'
const CARD  = 'rgba(255,255,255,0.04)'
const RULE  = 'rgba(255,255,255,0.08)'
const WHITE = '#edf0f7'
const MUTED = 'rgba(237,240,247,0.55)'

function Placeholder({ label, aspect = '16/9' }) {
  return (
    <div style={{
      aspectRatio: aspect,
      border: `1.5px dashed rgba(0,188,235,0.35)`,
      borderRadius: 16,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 10,
      background: 'rgba(0,188,235,0.04)',
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke={BLUE} strokeWidth="1.5"/>
        <path d="M3 16l5-5 4 4 3-3 6 6" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill={BLUE}/>
      </svg>
      <span style={{ fontFamily: SANS, fontSize: 12, color: BLUE, fontWeight: 500, textAlign: 'center', padding: '0 32px', opacity: 0.7 }}>{label}</span>
    </div>
  )
}

function Tag({ children }) {
  return (
    <span style={{
      fontFamily: SANS, fontSize: 11, fontWeight: 500,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: BLUE, background: 'rgba(0,188,235,0.1)',
      border: '1px solid rgba(0,188,235,0.2)',
      borderRadius: 100, padding: '4px 12px',
      display: 'inline-block',
    }}>{children}</span>
  )
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: SANS, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: MUTED, margin: '0 0 20px',
    }}>{children}</p>
  )
}

function H2({ children, style }) {
  return (
    <h2 style={{
      fontFamily: SANS, fontWeight: 700,
      fontSize: 'clamp(22px, 2.8vw, 34px)',
      lineHeight: 1.2, letterSpacing: '-0.02em',
      color: WHITE, margin: '0 0 20px',
      ...style,
    }}>{children}</h2>
  )
}

function Body({ children, style }) {
  return (
    <p style={{
      fontFamily: SANS, fontWeight: 300, fontSize: 16,
      lineHeight: 1.8, color: MUTED, margin: 0,
      ...style,
    }}>{children}</p>
  )
}

const W = { maxWidth: 720, margin: '0 auto', padding: '0 48px' }
const WFull = { maxWidth: 1080, margin: '0 auto', padding: '0 48px' }

export default function Cisco() {
  return (
    <div style={{ background: BG, color: WHITE, fontFamily: SANS, minHeight: '100vh' }}>

      <Header minimal />

      {/* ── BACK ── */}
      <div style={{ ...WFull, paddingTop: 0, paddingBottom: 0 }}>
        <Link to="/"
          style={{ fontFamily: SANS, fontSize: 13, color: MUTED, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = WHITE}
          onMouseLeave={e => e.currentTarget.style.color = MUTED}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </Link>
      </div>

      {/* ── HERO TEXT ── */}
      <section style={{ ...W, paddingTop: 48, paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          {/* Cisco wordmark — text stand-in */}
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 15, color: BLUE, letterSpacing: '-0.01em' }}>CISCO</span>
          <span style={{ width: 1, height: 14, background: RULE }} />
          <Tag>Enterprise SaaS · 2024</Tag>
        </div>

        <h1 style={{
          fontFamily: SANS, fontWeight: 700,
          fontSize: 'clamp(28px, 4vw, 52px)',
          lineHeight: 1.15, letterSpacing: '-0.03em',
          color: WHITE, margin: '0 0 24px',
        }}>
          Redesigned the Intersight header<br />
          <span style={{ color: MUTED, fontWeight: 300 }}>so operators go from alert to action without losing context</span>
        </h1>

        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', paddingTop: 32, borderTop: `1px solid ${RULE}` }}>
          {[['Role','Product Designer'],['Platform','Enterprise SaaS'],['Year','2024'],['Scope','Navigation · IA · Design System']].map(([k,v]) => (
            <div key={k}>
              <p style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, margin: '0 0 4px', opacity: 0.6 }}>{k}</p>
              <p style={{ fontFamily: SANS, fontSize: 14, fontWeight: 500, color: WHITE, margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HERO IMAGE ── */}
      <section style={{ ...WFull, paddingTop: 56, paddingBottom: 80 }}>
        <Placeholder label="Hero — Intersight header redesign overview" aspect="21/9" />
      </section>

      {/* ── OVERVIEW ── */}
      <section style={{ ...W, paddingTop: 0, paddingBottom: 80 }}>
        <SectionLabel>Overview</SectionLabel>
        <H2>About the project</H2>
        <Body style={{ marginBottom: 20 }}>
          Cisco Intersight is an enterprise cloud operations platform managing infrastructure across on-prem and cloud environments. The header is the primary entry point for every user session — but over years of incremental additions, it had grown cluttered and inconsistent.
        </Body>
        <Body>
          I led the "Insight to Action" initiative: a full header redesign focused on surfacing contextual insights directly in the navigation layer, so operators could move from discovering a problem to resolving it without leaving context.
        </Body>
      </section>

      {/* ── IMPACT ── */}
      <section style={{ ...WFull, paddingTop: 0, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: RULE, border: `1px solid ${RULE}`, borderRadius: 16, overflow: 'hidden' }}>
          {[['↑ 34%','Task Completion','Operators resolved issues faster with fewer page jumps'],['− 2.4','Navigation Steps','Reduced average steps to reach critical alerts'],['92%','Satisfaction','Post-launch usability satisfaction score']].map(([n,u,d]) => (
            <div key={u} style={{ padding: '40px 36px', background: CARD }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 42, lineHeight: 1, color: WHITE, marginBottom: 8 }}>{n}</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: BLUE, marginBottom: 8 }}>{u}</div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ ...W, paddingTop: 0, paddingBottom: 64 }}>
        <SectionLabel>Problem</SectionLabel>
        <H2>The header was working against operators</H2>
        <Body style={{ marginBottom: 20 }}>
          The header tried to surface too much at once — alerts, notifications, search, account, and global nav competed for the same visual space. Users discovered issues but had to navigate away entirely to act on them, losing context in the process.
        </Body>
        <Body>
          On top of that, header components had diverged from the Momentum Design System, creating visual inconsistency across different Intersight surfaces.
        </Body>
      </section>

      <section style={{ ...WFull, paddingBottom: 80 }}>
        <Placeholder label="旧版 Intersight header — Before state" aspect="16/5" />
      </section>

      {/* ── RESEARCH ── */}
      <section style={{ ...W, paddingBottom: 64 }}>
        <SectionLabel>Research</SectionLabel>
        <H2>8 contextual inquiry sessions with infrastructure operators</H2>
        <Body style={{ marginBottom: 20 }}>
          The core question: how do users currently move from noticing a problem to taking action? Sessions revealed a consistent mental model mismatch — the header was organized by <em>feature type</em>, while users thought in terms of <em>urgency and context</em>.
        </Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
          {['Contextual inquiry (8 sessions)','Think-aloud usability testing on existing header','Heatmap and clickstream analysis','Stakeholder interviews with PM and engineering leads','Competitive analysis: Datadog, AWS Console, Splunk'].map(m => (
            <div key={m} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: BLUE, flexShrink: 0, opacity: 0.7 }} />
              <span style={{ fontFamily: SANS, fontSize: 14, color: MUTED }}>{m}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...WFull, paddingBottom: 80 }}>
        <Placeholder label="研究过程 / 用户访谈笔记 / Affinity diagram" aspect="16/7" />
      </section>

      {/* ── KEY FINDINGS ── */}
      <section style={{ ...W, paddingBottom: 64 }}>
        <SectionLabel>Key Findings</SectionLabel>
        <H2>Four patterns that defined the redesign</H2>
      </section>

      <section style={{ ...WFull, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: RULE, border: `1px solid ${RULE}`, borderRadius: 16, overflow: 'hidden' }}>
          {[
            ['Users scan for red first',"100% of operators said their first action is looking for error indicators. The existing alert system was buried under a notification bell."],
            ['Context switching is the top pain point','"I click the alert, it takes me to a completely different page, and I lose track of what I was doing." — P3, Infrastructure Admin'],
            ['Search is underused',"Only 12% of sessions used global search. Most users didn't know it could search across alerts and resources."],
            ['Insight ≠ Action','The header surfaced information but provided no direct path to remediation. Users had to mentally bridge this gap themselves.'],
          ].map(([t,d]) => (
            <div key={t} style={{ padding: '36px 40px', background: CARD }}>
              <h3 style={{ fontFamily: SANS, fontWeight: 600, fontSize: 16, color: WHITE, margin: '0 0 12px', lineHeight: 1.3 }}>{t}</h3>
              <p style={{ fontFamily: SANS, fontSize: 14, color: MUTED, lineHeight: 1.7, margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section style={{ ...W, paddingBottom: 64 }}>
        <SectionLabel>Solution</SectionLabel>
        <H2>Insight to Action — a header built around urgency, not features</H2>
        <Body>
          A redesigned header that surfaces the right signal, in the right moment, with a direct path to resolution — without leaving the current context.
        </Body>
      </section>

      {/* Before / After */}
      <section style={{ ...WFull, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <p style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 12, opacity: 0.6 }}>Before</p>
            <Placeholder label="旧版 header UI 截图" aspect="16/6" />
          </div>
          <div>
            <p style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: BLUE, marginBottom: 12 }}>After</p>
            <Placeholder label="新版 header UI 截图" aspect="16/6" />
          </div>
        </div>
      </section>

      {/* Feature 01 */}
      <section style={{ ...W, paddingBottom: 64 }}>
        <SectionLabel>Feature 01</SectionLabel>
        <H2>Contextual Alert Triage</H2>
        <Body>
          Critical alerts now appear inline in the header with severity color-coding and a one-click action panel — no context switching required. Operators can acknowledge, escalate, or dismiss without leaving the page.
        </Body>
      </section>
      <section style={{ ...WFull, paddingBottom: 80 }}>
        <Placeholder label="Contextual Alert Triage — UI 截图" aspect="16/7" />
      </section>

      {/* Feature 02 */}
      <section style={{ ...W, paddingBottom: 64 }}>
        <SectionLabel>Feature 02</SectionLabel>
        <H2>Unified Search with Intent Routing</H2>
        <Body>
          Search now understands context: searching for a server name routes to its resource view, searching for an error code routes to relevant alerts. A redesigned search UI surfaces recent items and suggested actions.
        </Body>
      </section>
      <section style={{ ...WFull, paddingBottom: 80 }}>
        <Placeholder label="Unified Search — UI 截图" aspect="16/7" />
      </section>

      {/* Feature 03 */}
      <section style={{ ...W, paddingBottom: 64 }}>
        <SectionLabel>Feature 03</SectionLabel>
        <H2>Momentum Design System Integration</H2>
        <Body>
          All header components were rebuilt to Momentum DS specifications, introducing new reusable tokens for status colors, density variants, and responsive breakpoints.
        </Body>
      </section>
      <section style={{ ...WFull, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Placeholder label="Component library — Alert Triage Panel" aspect="4/3" />
          <Placeholder label="Color & typography tokens" aspect="4/3" />
        </div>
      </section>

      {/* ── REFLECTION ── */}
      <section style={{ ...W, paddingBottom: 120 }}>
        <SectionLabel>Reflection</SectionLabel>
        <H2>What I learned</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, marginTop: 8 }}>
          {[
            ['What worked', 'Anchoring the design around user mental models (urgency/context vs. feature type) gave us a clear north star that helped resolve every design debate through the project.'],
            ["What I'd do differently", "Involve engineering earlier in the alert triage panel — some interaction patterns we designed were technically complex to implement in the existing architecture, requiring late-stage compromises."],
            ['The takeaway', 'Enterprise navigation design is as much information architecture as it is visual design. The biggest gains came from restructuring the mental model, not from visual polish.'],
          ].map(([t,d]) => (
            <div key={t}>
              <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: BLUE, margin: '0 0 8px', letterSpacing: '0.04em' }}>{t}</p>
              <Body>{d}</Body>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER NAV ── */}
      <div style={{ borderTop: `1px solid ${RULE}` }}>
        <div style={{ ...WFull, paddingTop: 40, paddingBottom: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/"
            style={{ fontFamily: SANS, fontSize: 13, color: MUTED, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => e.currentTarget.style.color = WHITE}
            onMouseLeave={e => e.currentTarget.style.color = MUTED}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            All Work
          </Link>
          <Link to="/work/bytedance"
            style={{ fontFamily: SANS, fontSize: 13, color: MUTED, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
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
