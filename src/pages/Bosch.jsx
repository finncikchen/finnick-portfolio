import { useEffect, useRef, useState } from 'react'
import { F, WIDE, GRAIN } from '../components/caseTokens'
import Header from '../components/Header'
import { ContactCTA, FooterNav } from '../components/CaseKit'
import Dashboard, { Scaled } from '../components/bosch/Dashboard'
import { FLOWS, FlowShot } from '../components/bosch/FlowDemo'
import imgComic from '../assets/images/bosch/v5/comic.webp'
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
//
// Frame, type scale and spacing are the Cisco case's (src/pages/Cisco.jsx), so the two read as one portfolio.
// Borrowed from the reference cases the user supplied: the hero monitor (public/bosch/monitor.webp, its screen
// carries the live dashboard), product UI on a soft wash, and figures drawn as ticks. This case's colour is violet.
const INK = '#1d1d1f', SUB = '#5f6370', FADE = '#a9adb6', LIGHT = '#f2f3f5', VIOLET = '#2a2a33'
const GAP = 'clamp(112px, 12vw, 168px)'
const HEAD = 'clamp(40px, 4.5vw, 64px)'
const BLOCK = 'clamp(72px, 7vw, 104px)'
const HERO_BG = 'linear-gradient(180deg, #b0a3b5 0%, #c3b7c8 16%, #ddd5df 32%, #eee9ef 50%, #f8f6f8 72%, #fcfbfc 100%)'
const wash = (n) => `#d9d2db url(/bosch/wash-${n}.webp) center / cover no-repeat`
const CARD = { background: '#ffffff', borderRadius: 24, padding: 'clamp(20px, 2.2vw, 28px)', boxSizing: 'border-box', boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 12px 32px rgba(40,30,90,0.06)' }
const UI_SHADOW = '0 1px 2px rgba(30,20,70,0.06), 0 24px 56px -24px rgba(30,20,70,0.3)'

const eyebrow = { fontFamily: F, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', color: SUB, margin: '0 0 20px' }
const display = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(26px, 2.8vw, 40px)', lineHeight: 1.16, letterSpacing: '-0.03em', color: INK, margin: 0, textWrap: 'pretty' }
const h3 = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(18px, 1.7vw, 22px)', lineHeight: 1.2, letterSpacing: '-0.02em', color: INK, margin: '0 0 10px' }
const text = { fontFamily: F, fontSize: 15, lineHeight: 1.55, color: SUB, margin: 0, textWrap: 'pretty' }
const num = { fontFamily: F, fontWeight: 400, fontSize: 'clamp(40px, 4.4vw, 64px)', letterSpacing: '-0.05em', lineHeight: 0.95, color: INK, margin: 0, fontVariantNumeric: 'tabular-nums' }
const img = { width: '100%', display: 'block' }
const W = ({ children, style }) => <div style={{ ...WIDE, ...style }}>{children}</div>

function Head({ label, title, sub }) {
  return (
    <W style={{ marginBottom: HEAD }}>
      <p style={eyebrow}>{label}</p>
      <h2 style={{ ...display, textWrap: 'pretty' }}>{title}{sub && <> <span style={{ color: FADE }}>{sub}</span></>}</h2>
    </W>
  )
}

function Window({ children }) {
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: UI_SHADOW }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: '#f6f7f9' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        <span style={{ marginLeft: 12, fontFamily: F, fontSize: 12, color: '#8a8f98' }}>dp-deposit.bosch.com</span>
      </div>
      {children}
    </div>
  )
}

// A share drawn as ticks
function Ticks({ value, name }) {
  const n = 36, on = Math.round(value / 100 * n)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
        <p style={{ ...num, fontSize: 'clamp(30px, 3vw, 44px)' }}>{value}%</p>
        <p style={text}>{name}</p>
      </div>
      <div aria-hidden style={{ display: 'flex', justifyContent: 'space-between', height: 28, marginTop: 14 }}>
        {Array.from({ length: n }, (_, i) => <span key={i} style={{ width: 4, borderRadius: 2, background: i < on ? VIOLET : '#e3e3ea' }} />)}
      </div>
    </div>
  )
}

// A solution step, set like the Cisco case: label, one line, a note, then the product on a wash, then what it does
function Step({ phase, name, title, sub, note, n, flush, bare, points, children }) {
  return (
    <div>
      <p style={{ ...eyebrow, margin: '0 0 16px', whiteSpace: 'pre' }}><span style={{ color: INK }}>{phase}</span>  {name}</p>
      <h3 style={{ ...display, fontSize: 'clamp(22px, 2vw, 26px)', lineHeight: 1.18, textWrap: 'pretty' }}>{title} <span style={{ color: FADE }}>{sub}</span></h3>
      {note && <p style={{ fontFamily: F, fontSize: 17, lineHeight: 1.55, color: SUB, margin: '20px 0 0' }}>{note}</p>}
      {bare ? <div style={{ marginTop: HEAD }}>{children}</div>
        : <div style={{ marginTop: HEAD, borderRadius: 28, overflow: 'hidden', padding: 'clamp(16px, min(4.5vw, 6vh), 64px)', paddingBottom: flush ? 0 : undefined, background: wash(n) }}>{children}</div>}
      <div className="c3" style={{ marginTop: 'clamp(28px, 3vw, 40px)', gap: '28px 40px' }}>
        {points.map(([t, d]) => <div key={t}><p style={{ ...h3, fontSize: 18 }}>{t}</p><p style={text}>{d}</p></div>)}
      </div>
    </div>
  )
}

// The three goals, each drawn as the product piece that delivers it.
// Material over flat colour: matte tiles lit from the top left, frosted glass with the product blurred behind it,
// pieces that bleed off the tile edge. Motion plays once when the row scrolls in (see .goals in the page CSS).
const GLASS = { background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px) saturate(1.3)', WebkitBackdropFilter: 'blur(12px) saturate(1.3)',
  border: '1px solid rgba(255,255,255,0.75)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 1px rgba(40,28,60,0.05), 0 6px 14px -8px rgba(40,28,60,0.16)' }
// The accent is the page's ink, lit from above, used only where each goal's point lands
const ACC_GRAD = 'linear-gradient(180deg, #4a4752 0%, #24232b 100%)'
const chip = { fontFamily: F, fontSize: 11, fontWeight: 500, color: INK, whiteSpace: 'nowrap' }
function GoalViz({ i }) {
  if (i === 0) {
    // See it: monthly overdue shrinking, this month lit; a glass reading floats over the bars
    const hs = [82, 94, 76, 70, 78, 60, 50, 40]
    return (
      <div aria-hidden style={{ position: 'relative', height: '100%', padding: '0 var(--pad)' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 7, height: '100%' }}>
          {hs.map((h, k) => {
            const last = k === hs.length - 1
            return <span key={k} className="bar" style={{ '--d': `${k * 60}ms`, flex: 1, height: `${h}%`, borderRadius: '6px 6px 0 0',
              background: last ? ACC_GRAD : 'linear-gradient(180deg, #ffffff 0%, #ece4ed 60%, #e2d8e3 100%)',
              boxShadow: last ? 'inset 0 1px 0 rgba(255,255,255,0.45)' : 'inset 0 1px 0 #fff' }} />
          })}
        </div>
        <div className="rise" style={{ '--d': '650ms', position: 'absolute', right: 'calc(var(--pad) + 22px)', top: 6, borderRadius: 12, padding: '9px 12px', ...GLASS }}>
          <p style={{ ...chip, fontSize: 10, color: SUB, margin: '0 0 3px' }}>Overdue this month</p>
          <p style={{ ...chip, fontSize: 13, fontWeight: 600, margin: 0 }}>↓ Trending down</p>
        </div>
      </div>
    )
  }
  if (i === 1) {
    // Own it: a glass ticket over a blurred owner, running off the right edge; its status turns to In progress
    return (
      <div aria-hidden style={{ position: 'relative', height: '100%' }}>
        <div style={{ position: 'absolute', left: 'calc(var(--pad) + 2px)', right: -60, top: 0, height: 64, borderRadius: 14, padding: '12px 14px', background: 'linear-gradient(180deg, #faf6fa, #efe8f0)', boxShadow: 'inset 0 1px 0 #fff, 0 1px 1px rgba(40,28,60,0.05)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ width: 44, height: 7, borderRadius: 4, background: '#e2d9e4' }} />
          <span style={{ width: 54, height: 14, borderRadius: 999, background: '#e2d9e4' }} />
        </div>
        <div className="rise" style={{ '--d': '100ms', position: 'absolute', left: 'calc(var(--pad) + 26px)', right: -24, top: 26, borderRadius: 16, padding: '14px 16px', display: 'grid', gap: 12, ...GLASS }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ ...chip, fontSize: 13, fontWeight: 600 }}>Ticket</span>
            <span style={{ position: 'relative', display: 'inline-grid' }}>
              <span className="st-a" style={{ ...chip, gridArea: '1 / 1', borderRadius: 999, padding: '3px 9px', border: '1px solid rgba(29,29,31,0.18)', color: SUB }}>Open</span>
              <span className="st-b" style={{ ...chip, gridArea: '1 / 1', borderRadius: 999, padding: '4px 10px', background: ACC_GRAD, color: '#fff'}}>In progress</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(160deg, #fff, #ece6ee)', boxShadow: 'inset 0 0 0 1px rgba(29,29,31,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...chip, fontSize: 10, fontWeight: 600 }}>UD</span>
            <span style={{ ...chip, fontWeight: 400, fontSize: 12, color: SUB }}>Owner</span>
          </div>
        </div>
      </div>
    )
  }
  // Act on it: the one track every role reads; the line fills to the current step, which keeps a soft pulse
  const steps = ['Created', 'Approved', 'Paid', 'Invoice', 'Cleared'], done = 3, col = 100 / steps.length
  return (
    <div aria-hidden style={{ position: 'relative', height: '100%', padding: '0 var(--pad)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div className="rise" style={{ '--d': '1250ms', alignSelf: 'center', marginBottom: 18, marginLeft: '6%', borderRadius: 10, padding: '6px 10px', ...GLASS }}>
        <span style={chip}>Reminder sent to UD</span>
      </div>
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`, rowGap: 10 }}>
        <span style={{ position: 'absolute', left: `${col / 2}%`, right: `${col / 2}%`, top: 5, height: 2, borderRadius: 1, background: 'rgba(29,29,31,0.12)' }} />
        <span className="fill" style={{ position: 'absolute', left: `${col / 2}%`, width: `${col * (done - 1)}%`, top: 5, height: 2, borderRadius: 1, background: VIOLET }} />
        {steps.map((t, k) => (
          <span key={t} className={k === done - 1 ? 'pulse' : undefined} style={{ position: 'relative', justifySelf: 'center', width: 12, height: 12, borderRadius: '50%', boxSizing: 'border-box', background: '#f6f3f7', border: '2px solid rgba(29,29,31,0.16)' }}>
            {k < done && <span className="dot" style={{ '--d': `${300 + k * 420}ms`, position: 'absolute', inset: -2, borderRadius: '50%', background: ACC_GRAD}} />}
          </span>
        ))}
        {steps.map((t, k) => <span key={t + 'l'} style={{ ...chip, fontWeight: 400, color: k < done ? INK : SUB, textAlign: 'center' }}>{t}</span>)}
      </div>
    </div>
  )
}

// The hero monitor with the live dashboard mapped onto its screen (corners measured on the 1168 x 627 image)
const MW = 1168, MH = 627
function Monitor() {
  const ref = useRef(null)
  const [k, setK] = useState(0)
  useEffect(() => {
    const el = ref.current
    const fit = () => setK(el.clientWidth / MW)
    fit()
    const ro = new ResizeObserver(fit); ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', aspectRatio: `${MW} / 575`, overflow: 'hidden',
      WebkitMaskImage: 'linear-gradient(180deg, #000 90%, transparent 100%)', maskImage: 'linear-gradient(180deg, #000 90%, transparent 100%)' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: MW, height: MH, transform: `scale(${k})`, transformOrigin: '0 0', visibility: k ? 'visible' : 'hidden' }}>
        <img src="/bosch/monitor.webp" alt="" width={MW} height={MH} style={{ position: 'absolute', inset: 0, display: 'block' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 900, overflow: 'hidden', background: '#fff', transformOrigin: '0 0', pointerEvents: 'none',
          transform: 'matrix3d(0.63911499,0.0057151543,0,1.5199878e-05,-0.12688558,0.32321323,0,-0.00024411376,0,0,1,0,122,2.5,0,1)' }}>
          <Scaled w={1440} h={900}><Dashboard /></Scaled>
        </div>
      </div>
    </div>
  )
}

export default function Bosch() {
  const goalsRef = useRef(null)
  useEffect(() => {
    // each tile plays its motion once, when it is mostly on screen (tiles stack on phones)
    const tiles = [...goalsRef.current.querySelectorAll('.goal')]
    const check = () => {
      tiles.forEach(t => { const r = t.getBoundingClientRect(); if (r.top < innerHeight * 0.8 && r.bottom > 0) t.classList.add('on') })
      if (tiles.every(t => t.classList.contains('on'))) off()
    }
    const off = () => { removeEventListener('scroll', check); removeEventListener('resize', check) }
    addEventListener('scroll', check, { passive: true }); addEventListener('resize', check)
    check()
    return off
  }, [])
  return (
    <div style={{ background: LIGHT, color: INK, fontFamily: F, minHeight: '100vh' }}>
      <style>{`.goal{--pad:clamp(20px,2.2vw,28px);position:relative;isolation:isolate;overflow:hidden;display:flex;flex-direction:column;border-radius:24px;padding:var(--pad);
          background:radial-gradient(120% 80% at 10% 0%,rgba(255,255,255,0.95) 0%,rgba(255,255,255,0) 60%),linear-gradient(160deg,#fbf8fb 0%,#f5eef5 50%,#eee0ee 100%);
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.9)}
        .goals .bar{transform:scaleY(0.04);transform-origin:bottom;transition:transform 1s cubic-bezier(.2,.8,.2,1) var(--d)}
        .goals .rise{opacity:0;transform:translateY(14px);transition:opacity .7s ease var(--d),transform 1s cubic-bezier(.2,.8,.2,1) var(--d)}
        .goals .fill{transform:scaleX(0);transform-origin:left;transition:transform 1.2s cubic-bezier(.45,0,.2,1) .3s}
        .goals .dot{transform:scale(0);transition:transform .45s cubic-bezier(.3,1.4,.5,1) var(--d)}
        .goals .st-b{opacity:0;transform:scale(.9);transition:opacity .4s ease 1.3s,transform .5s cubic-bezier(.3,1.4,.5,1) 1.3s}.goals .st-a{transition:opacity .3s ease 1.25s}
        .goal.on .bar,.goal.on .rise,.goal.on .fill,.goal.on .dot{opacity:1;transform:none}.goal.on .st-b{opacity:1;transform:none}.goal.on .st-a{opacity:0}
        .goals .pulse::after{content:'';position:absolute;inset:-2px;border-radius:50%;background:rgba(42,42,51,0.3);opacity:0}
        .goal.on .pulse::after{animation:gp 2.6s cubic-bezier(.2,.6,.3,1) 1.6s infinite}
        @keyframes gp{0%{transform:scale(1);opacity:.45}70%,100%{transform:scale(2.8);opacity:0}}
        @media(prefers-reduced-motion:reduce){.goals *,.goal{transition:none!important;animation:none!important}.goals .bar,.goals .rise,.goals .fill,.goals .dot,.goals .st-b{opacity:1;transform:none}.goals .st-a{opacity:0}}
        .bh{container-type:inline-size;position:relative;padding-top:17.4cqw}
        .bh-word{position:absolute;left:0;right:0;top:9.4cqw;margin:0;text-align:center;font-family:${F};font-weight:500;font-size:3.55cqw;line-height:1;letter-spacing:-0.035em;color:rgba(255,255,255,0.92);white-space:nowrap}
        .bh .shot{position:relative;width:86cqw;margin:0 auto}
        @media(max-width:700px){.bh{padding-top:0}.bh-word{position:static;padding:84px 20px 20px;font-size:34px;line-height:1.06;white-space:normal;text-align:left;color:rgba(255,255,255,0.8)}.bh .shot{width:96cqw}}
        .c3{display:grid;gap:12px;grid-template-columns:minmax(0,1fr)}.split{display:grid;gap:12px;grid-template-columns:minmax(0,1fr)}
        .info{display:grid;gap:28px 32px;grid-template-columns:repeat(auto-fit,minmax(140px,1fr))}.figs{display:grid;gap:32px 24px;grid-template-columns:repeat(2,minmax(0,1fr))}
        .val{display:grid;gap:14px;grid-template-columns:minmax(0,1fr)}.photos{display:grid;gap:12px;grid-template-columns:minmax(0,1fr)}
        @media(min-width:900px){.c3{grid-template-columns:repeat(3,minmax(0,1fr))}.split{grid-template-columns:repeat(2,minmax(0,1fr))}.split.wide{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr)}
          .figs{grid-template-columns:repeat(var(--cols),minmax(0,1fr))}.photos{grid-template-columns:0.5625fr 1.3333fr 0.5625fr}
          .val{grid-template-columns:repeat(12,minmax(0,1fr));grid-template-rows:minmax(0,0.8fr) minmax(0,1.2fr);height:clamp(420px,calc(100vh - 140px),600px)}
          .val-quote{grid-column:1 / span 6;grid-row:1 / span 2}.val-hero{grid-column:7 / span 3;grid-row:1 / span 2}.val-a{grid-column:10 / span 3;grid-row:1}.val-b{grid-column:10 / span 3;grid-row:2}}`}</style>

      {/* ── HERO ── */}
      <div style={{ padding: 12 }}>
        <div style={{ borderRadius: 28, overflow: 'hidden', background: HERO_BG }}>
          <div className="bh">
            <h1 className="bh-word">Down Payment and Deposit Platform</h1>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 3 }}><Header minimal logoColor="#ffffff" /></div>
            <div className="shot"><Monitor /></div>
          </div>
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      <section style={{ ...WIDE, paddingTop: GAP, paddingBottom: GAP }}>
        <p style={{ ...display, fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.25 }}>
          <span style={{ color: FADE }}>An internal platform that helps Bosch's finance teams</span> track overdue deposits and down payments <span style={{ color: FADE }}>and act before they turn into cashflow loss.</span>
        </p>
        <div className="info" style={{ marginTop: HEAD }}>
          {[['Company', 'Bosch'], ['Role', 'UX Designer'], ['Year', '2025'], ['Scope', 'Dashboard · Ticket workflow']].map(([k, v]) => (
            <div key={k}>
              <p style={{ fontFamily: F, fontSize: 11, color: SUB, margin: 0, paddingBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{k}</p>
              <p style={{ fontFamily: F, fontSize: 15, color: INK, margin: '12px 0 0' }}>{v}</p>
            </div>
          ))}
        </div>
        <div className="figs" style={{ ...CARD, padding: 'clamp(24px, 3vw, 40px)', marginTop: BLOCK, '--cols': 4 }}>
          {[['40%', 'less overdue'], ['€9M', 'cashflow risk avoided'], ['86', 'NPS after launch'], ['4.6/5', 'ease of use']].map(([n, t]) => (
            <div key={t}><p style={{ ...num, marginBottom: 12 }}>{n}</p><p style={text}>{t}</p></div>
          ))}
        </div>
      </section>

      {/* ── CONTEXT: one soft panel, heading inside, the story then its three causes ── */}
      <section style={{ background: '#ffffff', padding: `${GAP} 0`, marginBottom: GAP }}>
          <Head label="The Problem" title="One blocked payment," sub="and a loop nobody could close." />
          <W>
            <img src={imgComic} alt="Six-panel comic: AP emails UD to chase an invoice, types the same manual request again, a few days pass with no response, she asks once more, and finally collapses on her laptop because it is too late"
              style={img} />
            <div className="c3" style={{ marginTop: BLOCK, gap: '28px 40px' }}>
              {[['Lack of transparency', 'Status lived in individual inboxes, so AP, BP and UD each saw a different version of the truth.'], ['Manual, repetitive work', 'Every overdue item meant another spreadsheet export and another reminder email.'], ['Data that didn’t match', 'Several down payments could map to a single invoice, which made reconciliation slow.']].map(([t, d]) => (
                <div key={t}><p style={{ ...h3, fontSize: 18 }}>{t}</p><p style={text}>{d}</p></div>
              ))}
            </div>
          </W>
      </section>

      {/* ── SOLUTION: the question, its three goals, then one step per phase ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head label="The Solution" title="How might we help Bosch finance teams" sub="monitor and resolve overdue deposits and down payments more efficiently?" />
        <W>
          <div ref={goalsRef} className="c3 goals" style={{ gap: 14 }}>
            {[['See it', 'One dashboard shows what is overdue, what is about to be, and where the money sits.'], ['Own it', 'Every item becomes a ticket with a clear owner and a visible status.'], ['Act on it', 'Reminders, invoice upload and posting happen on the ticket, not in email.']].map(([t, d], i) => (
              <div key={t} className="goal">
                <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.1, mixBlendMode: 'multiply', backgroundImage: GRAIN, pointerEvents: 'none' }} />
                <p style={{ position: 'relative', fontFamily: F, fontSize: 14, fontWeight: 500, color: 'rgba(29,29,31,0.55)', margin: 0 }}>Goal {i + 1}</p>
                <div style={{ position: 'relative', height: 'clamp(128px, 11vw, 150px)', margin: 'clamp(18px, 1.8vw, 24px) calc(-1 * var(--pad)) clamp(22px, 2.2vw, 30px)' }}><GoalViz i={i} /></div>
                <p style={{ position: 'relative', fontFamily: F, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', color: INK, margin: '0 0 8px' }}>{t}</p>
                <p style={{ ...text, position: 'relative', color: 'rgba(29,29,31,0.72)' }}>{d}</p>
              </div>
            ))}
          </div>
        </W>
        <W style={{ display: 'grid', gap: GAP, marginTop: GAP }}>
          <Step phase="Phase 1" name="Dashboard" title="See it: a dashboard that shows what's overdue," sub="and what's about to be." note="Hi-fi, after 2 rounds of testing · live" n={1} flush
            points={[['Overview first', 'Open, total overdue and over-6-months totals, each compared with last month.'], ['Trend over time', 'A monthly trend shows whether overdue is shrinking, with a hover card for any month.'], ['Pre-warning', 'Deposits expiring next month are flagged in red, one click from the list.']]}>
            <div style={{ borderRadius: '12px 12px 0 0', overflow: 'hidden', boxShadow: UI_SHADOW }}><Window><Scaled><Dashboard /></Scaled></Window></div>
          </Step>
          <Step phase="Phase 2" name="Ticket workflow" title="Own it, act on it:" sub="a ticket workflow shared by AP, UD and admins." n={2} bare
            points={[['One progress bar', 'Created, approved, paid, invoice and cleared sit on one track that every role reads the same way.'], ['Everything on the ticket', 'Reminders, comments and the invoice number are logged where the next person will look.'], ['Rules, not follow-ups', 'Admins set reminder rules once, and due dates get chased automatically.']]}>
            {/* six flows, one container each, read top to bottom without waiting on a player */}
            <div style={{ display: 'grid', gap: BLOCK }}>
              {FLOWS.map((f, i) => (
                <div key={f.name}>
                  <p style={{ fontFamily: F, fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em', color: INK, margin: 0 }}>
                    <span style={{ color: FADE, fontWeight: 400, marginRight: 10, fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</span>{f.name}
                    <span style={{ fontSize: 13, fontWeight: 400, color: FADE, marginLeft: 10 }}>{f.who}</span>
                  </p>
                  <p style={{ ...text, fontSize: 16, margin: '8px 0 0' }}>{f.caption}</p>
                  <div style={{ marginTop: 24, borderRadius: 28, overflow: 'hidden', padding: 'clamp(16px, min(4.5vw, 6vh), 64px)', background: wash(i % 2 ? 1 : 2) }}><FlowShot i={i} /></div>
                </div>
              ))}
            </div>
          </Step>
        </W>
      </section>

      {/* ── DESIGN SYSTEM ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head label="Design system" title="Reusable patterns" sub="built from real usage." />
        <W>
          <div className="figs" style={{ marginBottom: HEAD, '--cols': 3 }}>
            {[['3', 'role-based views'], ['200+', 'reusable UI components'], ['30+', 'key screens']].map(([n, t]) => (
              <div key={t}><p style={{ ...num, marginBottom: 12 }}>{n}</p><p style={text}>{t}</p></div>
            ))}
          </div>
          <DesignSystem />
        </W>
      </section>

      {/* ── RESEARCH: its own white panel ── */}
      <section style={{ background: '#ffffff', padding: `${GAP} 0`, marginBottom: GAP }}>
          <Head label="Research" title="Mapping the journey end to end" sub="with AP, UD, BA and finance managers." />
          <W>
            <img src={imgUJM} alt="User journey map: submit receipt, schedule payment, issue invoice, confirm invoice, with pains and potential solutions" style={{ ...img, borderRadius: 12 }} />
            <div className="split wide" style={{ marginTop: BLOCK, alignItems: 'stretch' }}>
              <img src={imgWorkshop} alt="Co-design workshop with the finance team" style={{ ...img, borderRadius: 20, height: '100%', minHeight: 300, objectFit: 'cover' }} />
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ borderRadius: 20, padding: 'clamp(20px, 2.2vw, 28px)', background: '#f2eff3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 20 }}>
                  <p style={{ ...text, fontSize: 13 }}>4 co-design workshops · 12 finance participants</p>
                  <div>
                    <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(16px, 1.45vw, 19px)', lineHeight: 1.4, letterSpacing: '-0.01em', color: INK, margin: 0 }}>“It happened to me multiple times that UD told me they had closed this task. You'd better go back and check internally.”</p>
                    <p style={{ ...text, fontSize: 13, marginTop: 12 }}>AP team member</p>
                  </div>
                </div>
                <div style={{ borderRadius: 20, padding: 'clamp(20px, 2.2vw, 28px)', background: '#f2eff3' }}>
                  <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(16px, 1.45vw, 19px)', lineHeight: 1.4, letterSpacing: '-0.01em', color: INK, margin: 0 }}>“With telephone bills, there are multiple down payments in the system but only one invoice. It's hard to match the amounts.”</p>
                  <p style={{ ...text, fontSize: 13, marginTop: 12 }}>AP team member</p>
                </div>
              </div>
            </div>
            <div className="split wide" style={{ marginTop: BLOCK, alignItems: 'center', gap: 'clamp(32px, 5vw, 72px)' }}>
              <div style={{ borderRadius: 24, padding: 'clamp(16px, 2.6vw, 36px)', background: wash(2) }}>
                <div style={{ borderRadius: 12, overflow: 'hidden', background: '#fff', aspectRatio: '16 / 10', boxShadow: UI_SHADOW }}>
                  <img src={imgLofi} alt="Low-fidelity dashboard" style={{ ...img, height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                </div>
              </div>
              <div>
                <p style={{ ...eyebrow, margin: '0 0 16px' }}>Lo-fi 1.0</p>
                <p style={{ ...display, fontSize: 'clamp(22px, 2vw, 26px)', marginBottom: 16 }}>Priorities first, pixels later</p>
                <p style={{ ...text, fontSize: 17 }}>Workshop priorities became the layout: overview cards on top, a trend over time, then diagrams by aging period, legal entity, company code and vendor.</p>
              </div>
            </div>
          </W>
      </section>

      {/* ── TESTING: the session, the completion shares as ticks, the two fixes ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head label="User testing" title="7 rounds of remote usability tests" sub="with AP, UD and UX colleagues." />
        <W>
          <div className="split wide" style={{ alignItems: 'stretch' }}>
            <img src={imgTestA} alt="Usability test session" style={{ ...img, borderRadius: 24, height: '100%', minHeight: 300, objectFit: 'cover' }} />
            <div style={{ ...CARD, display: 'grid', gap: 'clamp(24px, 2.6vw, 36px)', alignContent: 'center', padding: 'clamp(24px, 2.6vw, 36px)' }}>
              <Ticks value={71.4} name="completed all tasks" />
              <Ticks value={28.6} name="needed help on one" />
              <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(16px, 1.45vw, 19px)', lineHeight: 1.4, letterSpacing: '-0.01em', color: INK, margin: 0 }}>“I like the Trend chart! It gives me a dynamic overview over time.”</p>
            </div>
          </div>
          <div className="split" style={{ marginTop: 14, gap: 14 }}>
            {[["Can't find the second-level page", 'Added a clear hover state to "View more diagrams" so it reads as interactive.'], ['Value and item together', 'Kept value as the default and show the item count on hover.']].map(([t, d]) => (
              <div key={t} style={CARD}><p style={{ ...h3, fontSize: 18 }}>{t}</p><p style={text}>{d}</p></div>
            ))}
          </div>
        </W>
      </section>

      {/* ── IMPACT: the quote, the headline number, then the proof ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head label="Impact" title="Less overdue, less risk." sub="Measured within 60 days of launch." />
        <W>
          <div className="val">
            <figure className="val-quote" style={{ ...CARD, margin: 0, padding: 'clamp(24px, 2.6vw, 40px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 }}>
              <svg aria-hidden width="30" height="24" viewBox="0 0 36 28" fill={FADE}><path d="M0 28V16.4C0 7.3 4.8 1.6 13.4 0l1.6 3.6C10.6 5 8.2 8 8 12h6.6v16zm20 0V16.4C20 7.3 24.8 1.6 33.4 0L35 3.6C30.6 5 28.2 8 28 12h6.6v16z" /></svg>
              <blockquote style={{ ...display, fontSize: 'clamp(20px, min(2.3vw, 3.9vh), 34px)', lineHeight: 1.18 }}>
                The new platform lets me monitor overdue items in real time. The dashboard shows items over 6 months, helping me focus on what needs attention.
              </blockquote>
              <figcaption style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src={imgPersona} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                <p style={{ fontFamily: F, fontSize: 15, fontWeight: 500, color: INK, margin: 0 }}>Lisa, finance team</p>
              </figcaption>
            </figure>
            {[['val-hero', '40%', 'Reduction of overdue', 'Through info transparency and real-time payment tracking.'], ['val-a', '€9M', 'Cashflow risk avoided', 'Cashflow loss avoided by resolving overdue deposits.'], ['val-b', 'Alerts', 'Data exception detection', 'Data mining surfaces exceptions and places to improve.']].map(([c, n, t, d], i) => (
              <div key={t} className={c} style={{ ...CARD, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24, ...(i ? {} : { background: '#24242c', boxShadow: 'none' }) }}>
                <p style={{ ...num, fontSize: i ? 'clamp(36px, 3.6vw, 56px)' : 'clamp(56px, min(6.6vw, 13vh), 104px)', color: i ? INK : '#fff' }}>{n}</p>
                <div>
                  <p style={{ fontFamily: F, fontSize: i ? 16 : 18, fontWeight: 500, letterSpacing: '-0.01em', color: i ? INK : '#fff', margin: '0 0 6px' }}>{t}</p>
                  <p style={{ ...text, fontSize: 14, color: i ? SUB : 'rgba(255,255,255,0.8)' }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </W>
        <W style={{ marginTop: 14 }}>
          <img src={imgExpo} alt="The platform presented at a Bosch internal expo" style={{ ...img, borderRadius: 24, aspectRatio: '21 / 9', objectFit: 'cover' }} />
        </W>
      </section>

      {/* ── BEHIND THE PROJECT ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head label="Behind the project" title="Designed with the people who use it," sub="in the room and on the ground." />
        <W>
          <div className="photos">
            <img src={imgMeBrain} alt="Finnick holding a Brainstorming sign during an ideation session" style={{ ...img, borderRadius: 20 }} />
            <img src={imgMeTeam} alt="Finnick with Bosch colleagues in Chengdu" style={{ ...img, borderRadius: 20 }} />
            <img src={imgMeUX} alt="UX@GS sign on the studio glass wall" style={{ ...img, borderRadius: 20 }} />
          </div>
        </W>
      </section>

      <ContactCTA />
      <FooterNav />
    </div>
  )
}
