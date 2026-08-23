import { Link } from 'react-router-dom'

// ─── tokens ──────────────────────────────────────────────────
const INK   = '#0a0d14'
const GRAY  = '#6b7280'
const RULE  = '#e5e7eb'
const BLUE  = '#00bceb'   // Cisco brand teal
const NAVY  = '#003087'   // Cisco brand navy
const BG    = '#f9fafb'
const F     = 'Inter, sans-serif'

// ─── helpers ─────────────────────────────────────────────────
const H2 = { fontFamily: F, fontWeight: 700, fontSize: 'clamp(28px,3.5vw,44px)', lineHeight: 1.15, letterSpacing: '-0.02em', color: INK, margin: '16px 0 24px' }
const Body = { fontFamily: F, fontWeight: 400, fontSize: 16, lineHeight: 1.75, color: GRAY, margin: 0 }

function Num({ children }) {
  return <span style={{ fontFamily: F, fontWeight: 600, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: BLUE }}>{children}</span>
}
function Divider() {
  return <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 60px' }}><div style={{ height: 1, background: RULE }} /></div>
}
function Placeholder({ label, aspect = '16/9' }) {
  return (
    <div style={{ aspectRatio: aspect, border: `2px dashed ${BLUE}`, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#f0faff' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke={BLUE} strokeWidth="1.5"/><path d="M3 16l5-5 4 4 3-3 6 6" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="8.5" r="1.5" fill={BLUE}/></svg>
      <span style={{ fontFamily: F, fontSize: 12, color: BLUE, fontWeight: 500, textAlign: 'center', padding: '0 24px' }}>{label}</span>
    </div>
  )
}

export default function Cisco() {
  return (
    <div style={{ background: '#fff', color: INK, fontFamily: F }}>

      {/* ── NAV ── */}
      <header style={{ borderBottom: `1px solid ${RULE}`, padding: '0 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link to="/" style={{ fontFamily: F, fontSize: 13, color: GRAY, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={e => e.currentTarget.style.color = INK}
          onMouseLeave={e => e.currentTarget.style.color = GRAY}
        >← All Work</Link>
        <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: INK }}>Cisco · Intersight</span>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['#problem','Problem'],['#research','Research'],['#solution','Solution']].map(([h,l]) => (
            <a key={h} href={h} style={{ fontFamily: F, fontSize: 13, color: GRAY, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = INK}
              onMouseLeave={e => e.currentTarget.style.color = GRAY}>{l}</a>
          ))}
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ padding: '100px 60px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: BLUE }}>Cisco · Intersight</span>
          <span style={{ height: 1, flex: 1, background: RULE }} />
          <span style={{ fontFamily: F, fontSize: 12, color: GRAY }}>2024</span>
        </div>

        <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(40px,5.5vw,72px)', lineHeight: 1.1, letterSpacing: '-2px', color: INK, maxWidth: 800, margin: '0 0 32px' }}>
          Insight to Action<br/>
          <span style={{ color: BLUE }}>Header Redesign</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, borderTop: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}`, marginBottom: 64 }}>
          {[['Role','Product Designer (UX/UI)'],['Platform','Enterprise SaaS'],['Year','2024'],['Scope','Navigation · IA · Design System']].map(([k,v]) => (
            <div key={k} style={{ borderRight: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}`, padding: '20px 24px' }}>
              <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: GRAY, margin: '0 0 6px' }}>{k}</p>
              <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: INK, margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Hero image placeholder */}
        <Placeholder label="Hero — Intersight header redesign overview" aspect="21/9" />
      </section>

      {/* ── OVERVIEW ── */}
      <section style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
        <div>
          <Num>01</Num>
          <h2 style={H2}>About the Project</h2>
          <p style={{ ...Body, marginBottom: 20 }}>Cisco Intersight is an enterprise cloud operations platform that manages infrastructure across on-prem and cloud environments. As the primary entry point for every user session, the header plays a critical role — but over years of incremental additions, it had grown cluttered and inconsistent.</p>
          <p style={Body}>I was brought in to lead the "Insight to Action" initiative: a full header redesign focused on surfacing contextual insights directly in the navigation layer, so operators could move from discovering a problem to resolving it without leaving context.</p>
        </div>
        <div>
          <Num style={{ opacity: 0 }}>—</Num>
          <h2 style={{ ...H2, color: GRAY, fontWeight: 400 }}>My Contribution</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['End-to-end UX/UI design for the new header component','Cross-functional alignment with PM, Engineering, and Design System teams','Contributed reusable components to Cisco Momentum Design System','User research synthesis and iterative prototype testing'].map(c => (
              <div key={c} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: BLUE, flexShrink: 0, marginTop: 8 }} />
                <p style={{ ...Body, fontSize: 15 }}>{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── IMPACT ── */}
      <section style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto' }} id="problem">
        <Num>02</Num>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 72 }}>
          <h2 style={H2}>Impact</h2>
          <p style={Body}>The redesigned header reduced time-to-action for critical alerts and improved task completion rates across monitored infrastructure workflows.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, borderTop: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}` }}>
          {[['↑ 34%','Task Completion','Operators resolved issues faster with fewer page jumps'],['− 2.4','Navigation Steps','Reduced average steps to reach critical alerts'],['92%','Satisfaction','Post-launch user satisfaction score in usability testing']].map(([n,u,d]) => (
            <div key={u} style={{ borderRight: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}`, padding: '48px 40px' }}>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 48, lineHeight: 1, color: NAVY, marginBottom: 8 }}>{n}</div>
              <div style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: INK, marginBottom: 6, letterSpacing: '-0.01em' }}>{u}</div>
              <div style={{ fontFamily: F, fontSize: 13, color: GRAY, lineHeight: 1.6 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── PROBLEM ── */}
      <section style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <Num>03</Num>
        <h2 style={H2}>The Problem</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 72 }}>
          {[
            ['Information Overload','The header tried to surface too much at once — alerts, notifications, search, account, and global nav competed for the same visual space.'],
            ['No Contextual Flow','Users discovered issues via the header but had to navigate away entirely to act on them, losing context in the process.'],
            ['Design System Debt',"Header components had diverged from Momentum Design, creating inconsistency across Intersight's different product surfaces."],
          ].map(([t,d]) => (
            <div key={t} style={{ padding: '32px', background: BG, borderRadius: 12, border: `1px solid ${RULE}` }}>
              <h3 style={{ fontFamily: F, fontWeight: 600, fontSize: 16, color: INK, margin: '0 0 12px' }}>{t}</h3>
              <p style={{ fontFamily: F, fontSize: 14, lineHeight: 1.7, color: GRAY, margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
        <Placeholder label="旧版 Intersight header 截图（Before state）" aspect="16/5" />
      </section>

      <Divider />

      {/* ── RESEARCH ── */}
      <section style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto' }} id="research">
        <Num>04</Num>
        <h2 style={H2}>Research</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginBottom: 64 }}>
          <div>
            <p style={{ ...Body, marginBottom: 20 }}>I conducted 8 contextual inquiry sessions with infrastructure operators and IT admins across enterprise customers. The core question: how do users currently move from noticing a problem to taking action?</p>
            <p style={Body}>Sessions revealed a consistent mental model mismatch — the header was organized by <em>feature type</em>, while users thought in terms of <em>urgency and context</em>.</p>
          </div>
          <div>
            <p style={{ ...Body, marginBottom: 16 }}>Key research methods:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Contextual inquiry (8 sessions)','Think-aloud usability testing on existing header','Heatmap and clickstream analysis','Stakeholder interviews with PM and engineering leads','Competitive analysis: Datadog, AWS Console, Splunk'].map(m => (
                <div key={m} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: BLUE, flexShrink: 0 }} />
                  <span style={{ fontFamily: F, fontSize: 14, color: GRAY }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Placeholder label="研究过程截图 / 用户访谈笔记 / Affinity diagram" aspect="16/7" />
      </section>

      <Divider />

      {/* ── FINDINGS ── */}
      <section style={{ padding: '120px 60px', background: INK }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Num><span style={{ color: BLUE }}>05</span></Num>
          <h2 style={{ ...H2, color: '#fff' }}>Key Findings</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2, marginTop: 48 }}>
            {[
              ['01','Users scan for red first',"100% of operators said their first action on any page is looking for error indicators. The header's alert system was buried under a notification bell."],
              ['02','Context switching is the top pain point','"I click the alert, it takes me to a completely different page, and I lose track of what I was doing." — P3, Infrastructure Admin'],
              ['03','Search is underused',"Only 12% of sessions used global search. Most users did not know it could search across alerts and resources — they thought it was just a page filter."],
              ['04','Insight ≠ Action','The existing header surfaced information (insights) but provided no direct path to remediation (action). Users had to mentally bridge this gap themselves.'],
            ].map(([n,t,d]) => (
              <div key={n} style={{ padding: '40px 48px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: BLUE, marginBottom: 16 }}>{n}</div>
                <h3 style={{ fontFamily: F, fontWeight: 600, fontSize: 18, color: '#fff', margin: '0 0 12px', lineHeight: 1.3 }}>{t}</h3>
                <p style={{ fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto' }} id="solution">
        <Num>06</Num>
        <h2 style={H2}>The Solution</h2>
        <p style={{ ...Body, maxWidth: 640, marginBottom: 64 }}>A redesigned header built around the "Insight to Action" principle: surface the right signal, in the right moment, with a direct path to resolution — without leaving the current context.</p>

        {/* Before / After */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 80 }}>
          <div>
            <div style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: GRAY, marginBottom: 16 }}>Before</div>
            <Placeholder label="旧版 header UI 截图" aspect="16/6" />
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: BLUE, marginBottom: 16 }}>After</div>
            <Placeholder label="新版 header UI 截图" aspect="16/6" />
          </div>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
          {[
            { num: 'Feature 01', title: 'Contextual Alert Triage', desc: 'Critical alerts now appear inline in the header with severity color-coding and a one-click action panel — no context switching required. Operators can acknowledge, escalate, or dismiss without leaving the page.' },
            { num: 'Feature 02', title: 'Unified Search with Intent Routing', desc: 'Search now understands context: searching for a server name routes to its resource view, searching for an error code routes to relevant alerts. A redesigned search UI surfaces recent items and suggested actions.' },
            { num: 'Feature 03', title: 'Momentum Design System Integration', desc: 'All header components were rebuilt to Momentum DS specifications, introducing new reusable tokens for status colors, density variants, and responsive breakpoints.' },
          ].map(({ num, title, desc }) => (
            <div key={num} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
              <div>
                <div style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: BLUE, marginBottom: 16 }}>{num}</div>
                <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: INK, margin: '0 0 16px', lineHeight: 1.3 }}>{title}</h3>
                <p style={Body}>{desc}</p>
              </div>
              <Placeholder label={`${title} — UI 截图`} aspect="4/3" />
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── DESIGN SYSTEM ── */}
      <section style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <Num>07</Num>
        <h2 style={H2}>Design System</h2>
        <p style={{ ...Body, maxWidth: 560, marginBottom: 64 }}>New components contributed to the Cisco Momentum Design System, ensuring the redesigned header patterns could scale across all Intersight surfaces.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Placeholder label="Component library — Alert Triage Panel" aspect="4/3" />
          <Placeholder label="Color & typography tokens — status colors, density scale" aspect="4/3" />
        </div>
      </section>

      <Divider />

      {/* ── REFLECTION ── */}
      <section style={{ padding: '120px 60px', background: INK }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Num><span style={{ color: BLUE }}>08</span></Num>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start', marginTop: 16 }}>
            <h2 style={{ ...H2, color: '#fff', margin: 0 }}>Reflection</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {[
                ['What worked', 'Anchoring the design around user mental models (urgency/context vs. feature type) gave us a clear north star that helped resolve every design debate through the project.'],
                ["What I'd do differently", "I'd involve engineering earlier in the alert triage panel — some interaction patterns we designed were technically complex to implement in the existing architecture, requiring late-stage compromises."],
                ['The takeaway', 'Enterprise navigation design is as much information architecture as it is visual design. The biggest gains came from restructuring the mental model, not from visual polish.'],
              ].map(([t,d]) => (
                <div key={t}>
                  <p style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: BLUE, margin: '0 0 8px', letterSpacing: '0.04em' }}>{t}</p>
                  <p style={{ fontFamily: F, fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER NAV ── */}
      <section style={{ padding: '80px 60px', maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontFamily: F, fontSize: 14, color: GRAY, textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = INK}
          onMouseLeave={e => e.currentTarget.style.color = GRAY}>
          ← All Work
        </Link>
        <Link to="/work/bytedance" style={{ fontFamily: F, fontSize: 14, color: GRAY, textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = INK}
          onMouseLeave={e => e.currentTarget.style.color = GRAY}>
          Next: ByteDance →
        </Link>
      </section>

    </div>
  )
}
