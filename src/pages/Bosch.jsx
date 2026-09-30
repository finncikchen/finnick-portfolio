import { F, INK, SUB, FADE, WIDE, GAP, STATEMENT } from '../components/caseTokens'
import { P, Page, Hero, SplitRow, ChapterHead, InfoTable, Panel, ContactCTA, FooterNav } from '../components/CaseKit'
import Dashboard, { Scaled } from '../components/bosch/Dashboard'
import FlowDemo from '../components/bosch/FlowDemo'
import HeroVisual from '../components/bosch/HeroVisual'
import imgComic from '../assets/images/bosch/v4/comic.webp'
import imgUJM from '../assets/images/bosch/v4/ujm.webp'
import imgLofi from '../assets/images/bosch/v4/lofi.webp'
import imgWorkshop from '../assets/images/bosch/v3/workshop.webp'
import imgTestA from '../assets/images/bosch/v3/test-a.webp'
import DesignSystem from '../components/bosch/DesignSystem'
import imgExpo from '../assets/images/bosch/v3/expo.webp'
import imgPersona from '../assets/images/bosch/v3/persona.webp'
import imgMeBrain from '../assets/images/bosch/v4/me-brainstorm.webp'
import imgMeTeam from '../assets/images/bosch/v4/me-team.webp'
import imgMeUX from '../assets/images/bosch/v4/me-uxgs.webp'

// Bosch · Down Payment & Deposit Platform. Source: Figma file WMkPuAo09jgzUWUbzFlhvF.
// The product UI on this page is rebuilt live (components/bosch), not screenshots.
const RULE = { borderTop: '1px solid rgba(0,0,0,0.12)', paddingTop: 20 }
const h3 = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(20px, 2vw, 24px)', lineHeight: 1.25, letterSpacing: '-0.02em', color: INK, margin: '0 0 10px' }
const tag = { fontFamily: F, fontSize: 13, color: SUB, textTransform: 'uppercase', letterSpacing: '0.02em', margin: '0 0 14px' }
const num = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(40px, 4.4vw, 60px)', letterSpacing: '-0.045em', lineHeight: 1, color: INK, margin: '0 0 12px' }
const img = { width: '100%', display: 'block' }
const photo = { ...img, borderRadius: 16, objectFit: 'cover', height: '100%' }
const W = ({ children, style }) => <div style={{ ...WIDE, ...style }}>{children}</div>
const Block = ({ children, style }) => <div style={{ marginTop: 'clamp(56px, 7vw, 96px)', ...style }}>{children}</div>

function Quote({ children, who }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', boxShadow: '0 12px 30px rgba(30,50,90,0.08)' }}>
      <p style={{ fontFamily: F, fontSize: 15, lineHeight: 1.5, color: INK, margin: 0 }}>“{children}”</p>
      {who && <p style={{ fontFamily: F, fontSize: 13, color: SUB, margin: '10px 0 0' }}>{who}</p>}
    </div>
  )
}

function Window({ children, label = 'dp-deposit.bosch.com', shadow = '0 40px 100px rgba(20,40,80,0.18)' }) {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: `0 1px 2px rgba(0,0,0,0.06), ${shadow}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: '#f6f7f9', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        <span style={{ marginLeft: 12, fontFamily: F, fontSize: 12, color: '#8a8f98' }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

function PhaseHead({ phase, year, title, sub }) {
  return (
    <W style={{ paddingBottom: 'clamp(32px, 4vw, 56px)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderTop: `1px solid ${INK}`, paddingTop: 20, marginBottom: 'clamp(28px, 4vw, 48px)' }}>
        <span style={{ fontFamily: F, fontSize: 14, color: INK }}>{phase}</span>
        <span style={{ fontFamily: F, fontSize: 14, color: SUB }}>{year}</span>
      </div>
      <p style={STATEMENT}>{title} <span style={{ color: FADE }}>{sub}</span></p>
    </W>
  )
}

export default function Bosch() {
  return (
    <Page>
      <style>{'.b2{display:grid;gap:40px 48px;grid-template-columns:1fr}.b3{display:grid;gap:32px;grid-template-columns:1fr}.b4{display:grid;gap:32px 24px;grid-template-columns:1fr 1fr}@media(min-width:900px){.b2{grid-template-columns:1fr 1fr}.b3{grid-template-columns:repeat(3,1fr)}.b4{grid-template-columns:repeat(4,1fr)}.bw{grid-template-columns:1.4fr 1fr}.bme{grid-template-columns:0.5625fr 1.3333fr 0.5625fr}}'}</style>

      {/* ── HERO ── */}
      <Hero
        logoColor="#ffffff"
        background="radial-gradient(ellipse 60% 55% at 50% 100%, rgba(0,123,192,0.45) 0%, rgba(0,123,192,0) 70%), radial-gradient(ellipse 35% 40% at 8% 70%, rgba(158,40,150,0.28) 0%, rgba(158,40,150,0) 70%), radial-gradient(ellipse 30% 35% at 95% 30%, rgba(24,131,126,0.25) 0%, rgba(24,131,126,0) 70%), linear-gradient(180deg, #0a0e1a 0%, #0c1426 100%)"
        brand={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '0 0 28px' }}>
            {['Bosch', 'Internal finance platform', 'UX Designer'].map(t => <span key={t} style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.78)', padding: '6px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.04)' }}>{t}</span>)}
          </div>}
        title="Down Payment and Deposit Tracking Platform."
        sub="Turning financial blind spots into actionable decisions."
      >
        <HeroVisual />
      </Hero>

      {/* ── OVERVIEW ── */}
      <section style={{ ...WIDE, paddingTop: 'clamp(80px, 9vw, 128px)', paddingBottom: GAP }}>
        <SplitRow label="What it is">
          <p style={STATEMENT}>
            <span style={{ color: FADE }}>An internal platform that helps Bosch's finance teams</span> track overdue deposits and down payments <span style={{ color: FADE }}>and act before they turn into cashflow loss.</span>
          </p>
          <InfoTable items={[['Company', 'Bosch'], ['Role', 'UX Designer'], ['Year', '2025'], ['Scope', 'Dashboard · Ticket workflow'], ['Team', '2 designers, 2 engineers, finance'], ['Tools', 'Figma, Mural, Power BI']]} />
        </SplitRow>
        <div className="b4" style={{ marginTop: 'clamp(56px, 7vw, 96px)' }}>
          {[['40%', 'less overdue'], ['€9M', 'cashflow risk avoided'], ['86', 'NPS after launch'], ['4.6/5', 'ease of use']].map(([n, t]) => (
            <div key={t} style={RULE}><p style={num}>{n}</p><P style={{ fontSize: 15 }}>{t}</P></div>
          ))}
        </div>
      </section>

      {/* ── CONTEXT ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="How it started" title="One blocked payment," sub="and a loop nobody could close." />
        <W>
          <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(20px, 5vw, 72px)' }}>
            <img src={imgComic} alt="Comic: AP emails UD to chase an invoice, gets no response for days, and by the time it arrives it is too late" style={{ ...img, maxWidth: 1100, margin: '0 auto' }} />
          </div>
          <div className="b3" style={{ marginTop: 'clamp(40px, 5vw, 64px)' }}>
            {[['Lack of transparency', 'Status lived in individual inboxes, so AP, BP and UD each saw a different version of the truth.'], ['Manual, repetitive work', 'Every overdue item meant another spreadsheet export and another reminder email.'], ['Data that didn’t match', 'Several down payments could map to a single invoice, which made reconciliation slow.']].map(([t, d], i) => (
              <div key={t} style={RULE}><p style={{ ...tag, marginBottom: 24 }}>0{i + 1}</p><p style={h3}>{t}</p><P style={{ fontSize: 15 }}>{d}</P></div>
            ))}
          </div>
        </W>
      </section>

      {/* ── RESEARCH ── */}
      <section style={{ paddingBottom: GAP }}>
        <Panel>
          <ChapterHead eyebrow="Research" title="Mapping the journey end to end" sub="with AP, UD, BA and finance managers." />
          <W>
            <img src={imgUJM} alt="User journey map: submit receipt, schedule payment, issue invoice, confirm invoice, with pains and potential solutions" style={{ ...img, borderRadius: 12 }} />
            <div className="b2 bw" style={{ marginTop: 'clamp(40px, 5vw, 64px)', alignItems: 'stretch' }}>
              <img src={imgWorkshop} alt="Co-design workshop with the finance team" style={photo} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
                <p style={tag}>4 co-design workshops · 12 finance participants</p>
                <Quote who="AP team member">It happened to me multiple times that UD told me they had closed this task. You'd better go back and check internally.</Quote>
                <Quote who="AP team member">With telephone bills, there are multiple down payments in the system but only one invoice. It's hard to match the amounts.</Quote>
              </div>
            </div>
          </W>
        </Panel>
      </section>

      {/* ── HMW ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Challenge" title="How might we help Bosch finance teams" sub="monitor and resolve overdue deposits and down payments more efficiently?" />
        <W>
          <div className="b3">
            {[['See it', 'One dashboard shows what is overdue, what is about to be, and where the money sits.'], ['Own it', 'Every item becomes a ticket with a clear owner and a visible status.'], ['Act on it', 'Reminders, invoice upload and posting happen on the ticket, not in email.']].map(([t, d], i) => (
              <div key={t} style={RULE}><p style={{ ...tag, marginBottom: 24 }}>Goal {i + 1}</p><p style={h3}>{t}</p><P style={{ fontSize: 15 }}>{d}</P></div>
            ))}
          </div>
        </W>
      </section>

      {/* ── PHASE 1 ── */}
      <section style={{ paddingBottom: GAP }}>
        <PhaseHead phase="Phase 1" year="Dashboard" title="See it: a dashboard that shows what's overdue," sub="and what's about to be." />
        <W>
          <div className="b2 bw" style={{ alignItems: 'center' }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', aspectRatio: '16 / 10', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
              <img src={imgLofi} alt="Low-fidelity dashboard" style={{ ...img, height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <div>
              <p style={tag}>Lo-fi 1.0</p>
              <p style={h3}>Priorities first, pixels later</p>
              <P>Workshop priorities became the layout: overview cards on top, a trend over time, then diagrams by aging period, legal entity, company code and vendor.</P>
            </div>
          </div>
        </W>
        <Block>
          <Panel soft>
            <W>
              <p style={tag}>Hi-fi, after 2 rounds of testing · live</p>
              <Window><Scaled><Dashboard /></Scaled></Window>
              <div className="b3" style={{ marginTop: 40 }}>
                {[['Overview first', 'Open, total overdue and over-6-months totals, each compared with last month.'], ['Trend over time', 'A monthly trend shows whether overdue is shrinking, with a hover card for any month.'], ['Pre-warning', 'Deposits expiring next month are flagged in red, one click from the list.']].map(([t, d]) => (
                  <div key={t} style={RULE}><p style={h3}>{t}</p><P style={{ fontSize: 15 }}>{d}</P></div>
                ))}
              </div>
            </W>
          </Panel>
        </Block>
      </section>

      {/* ── TESTING ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="User testing" title="7 rounds of remote usability tests" sub="with AP, UD and UX colleagues." />
        <W>
          <div className="b2 bw" style={{ alignItems: 'center' }}>
            <img src={imgTestA} alt="Usability test session" style={photo} />
            <div>
              <div style={{ display: 'flex', gap: 40, marginBottom: 28 }}>
                {[['71.4%', 'completed all tasks'], ['28.6%', 'needed help on one']].map(([n, t]) => (
                  <div key={t}><p style={{ ...num, fontSize: 44 }}>{n}</p><P style={{ fontSize: 14 }}>{t}</P></div>
                ))}
              </div>
              {[["Can't find the second-level page", 'Added a clear hover state to "View more diagrams" so it reads as interactive.'], ['Value and item together', 'Kept value as the default and show the item count on hover.']].map(([t, d]) => (
                <div key={t} style={{ ...RULE, marginBottom: 20 }}><p style={{ ...h3, fontSize: 18 }}>{t}</p><P style={{ fontSize: 15 }}>{d}</P></div>
              ))}
              <Quote>I like the Trend chart! It gives me a dynamic overview over time.</Quote>
            </div>
          </div>
        </W>
      </section>

      {/* ── PHASE 2 ── */}
      <section style={{ paddingBottom: GAP }}>
        <PhaseHead phase="Phase 2" year="Ticket workflow" title="Own it, act on it:" sub="a ticket workflow shared by AP, UD and admins." />
        <Panel>
          <W><FlowDemo /></W>
        </Panel>
        <W style={{ marginTop: 'clamp(40px, 5vw, 64px)' }}>
          <div className="b3">
            {[['One progress bar', 'Created, approved, paid, invoice and cleared sit on one track that every role reads the same way.'], ['Everything on the ticket', 'Reminders, comments and the invoice number are logged where the next person will look.'], ['Rules, not follow-ups', 'Admins set reminder rules once, and due dates get chased automatically.']].map(([t, d]) => (
              <div key={t} style={RULE}><p style={h3}>{t}</p><P style={{ fontSize: 15 }}>{d}</P></div>
            ))}
          </div>
        </W>
      </section>

      {/* ── DESIGN SYSTEM ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Design system" title="Reusable patterns" sub="built from real usage." />
        <W>
          <div className="b3" style={{ marginBottom: 48 }}>
            {[['3', 'role-based views'], ['200+', 'reusable UI components'], ['30+', 'key screens']].map(([n, t]) => (
              <div key={t} style={RULE}><p style={num}>{n}</p><P style={{ fontSize: 15 }}>{t}</P></div>
            ))}
          </div>
          <DesignSystem />
        </W>
      </section>

      {/* ── IMPACT ── */}
      <section style={{ paddingBottom: GAP }}>
        <Panel>
          <ChapterHead eyebrow="Impact" title="Less overdue, less risk." sub="Measured within 60 days of launch." />
          <W>
            <div className="b3">
              {[['40%', 'Reduction of overdue', 'Through info transparency and real-time payment tracking.'], ['€9M', 'Cashflow risk avoided', 'Cashflow loss avoided by resolving overdue deposits.'], ['Alerts', 'Data exception detection', 'Data mining surfaces exceptions and places to improve.']].map(([n, t, d]) => (
                <div key={t} style={RULE}><p style={num}>{n}</p><p style={h3}>{t}</p><P style={{ fontSize: 15 }}>{d}</P></div>
              ))}
            </div>
            <Block>
              <div className="b2 bw" style={{ alignItems: 'center' }}>
                <img src={imgExpo} alt="The platform presented at a Bosch internal expo" style={photo} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <img src={imgPersona} alt="" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover' }} />
                  <Quote who="Lisa, finance team">The new platform lets me monitor overdue items in real time. The dashboard shows items over 6 months, helping me focus on what needs attention.</Quote>
                </div>
              </div>
            </Block>
          </W>
        </Panel>
      </section>

      {/* ── BEHIND THE PROJECT ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Behind the project" title="Designed with the people who use it," sub="in the room and on the ground." />
        <W>
          <div className="bme" style={{ display: 'grid', gap: 16 }}>
            <img src={imgMeBrain} alt="Finnick holding a Brainstorming sign during an ideation session" style={{ ...img, borderRadius: 16 }} />
            <img src={imgMeTeam} alt="Finnick with Bosch colleagues in Chengdu" style={{ ...img, borderRadius: 16 }} />
            <img src={imgMeUX} alt="UX@GS sign on the studio glass wall" style={{ ...img, borderRadius: 16 }} />
          </div>
        </W>
      </section>

      <ContactCTA />
      <FooterNav next={{ to: '/work/yhlo', label: 'YHLO' }} />
    </Page>
  )
}
