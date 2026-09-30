import { Link } from 'react-router-dom'
import Header from '../components/Header'

const ACCENT = '#00bceb'
const F     = 'Inter, sans-serif'
const INK   = '#1d1d1f'
const SUB   = '#6e6e73'
const LIGHT = '#f2f3f5'
const FADE  = '#a9adb6'
const STATEMENT = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(26px, 3.1vw, 40px)', lineHeight: 1.18, letterSpacing: '-0.03em', color: INK, margin: 0 }
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`
const MESH_HERO = 'radial-gradient(ellipse 60% 55% at 12% 8%, rgba(214,222,240,0.9) 0%, transparent 65%), radial-gradient(ellipse 55% 60% at 90% 20%, rgba(178,176,214,0.75) 0%, transparent 65%), radial-gradient(ellipse 80% 55% at 45% 100%, rgba(160,196,222,0.85) 0%, transparent 70%), linear-gradient(170deg, #8f9bbd 0%, #7d8db3 45%, #93a9c6 100%)'
const MESH_SOFT = 'radial-gradient(ellipse 60% 60% at 0% 0%, rgba(190,190,220,0.30) 0%, transparent 65%), radial-gradient(ellipse 60% 60% at 100% 100%, rgba(170,200,225,0.35) 0%, transparent 65%), linear-gradient(180deg, #eceef3 0%, #e7ebf1 100%)'
const W = { maxWidth: 1100, margin: '0 auto', padding: '0 48px' }

function P({ children, large, style }) {
  return (
    <p style={{ fontFamily: F, fontWeight: 400, fontSize: large ? 19 : 16, lineHeight: large ? '30px' : '25px', color: SUB, margin: 0, ...style }}>
      {children}
    </p>
  )
}

const mini = { background: '#fcfcfc', borderRadius: 10, boxShadow: '0 8px 24px rgba(30,50,90,0.14), 0 0 0 1px rgba(0,0,0,0.05)', fontFamily: F, color: '#1a1a1a' }
const tiny = { fontSize: 10, color: '#888' }

function ScatteredVisual() {
  const cards = [
    { tab: 'Header', line: 'Health: Critical', c: '#d93025', x: -70, y: -50, r: -4 },
    { tab: 'Events', line: 'DIMM fault · 2h ago', c: '#e8a200', x: 60, y: -20, r: 3 },
    { tab: 'Inventory', line: 'Slot B2 · 32 GB', c: '#1a73e8', x: -30, y: 50, r: 2 },
  ]
  return (
    <div style={{ position: 'relative', width: 260, height: 180 }}>
      {cards.map(({ tab, line, c, x, y, r }) => (
        <div key={tab} style={{ ...mini, position: 'absolute', left: '50%', top: '50%', width: 150, padding: '10px 12px',
          transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${r}deg)` }}>
          <div style={{ ...tiny, marginBottom: 6 }}>{tab}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />{line}
          </div>
        </div>
      ))}
    </div>
  )
}

function HiddenActionVisual() {
  return (
    <div style={{ ...mini, width: 240, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #eee' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>C220-WZP2203</div>
          <div style={{ fontSize: 10, color: '#d93025', marginTop: 2 }}>● Critical</div>
        </div>
        <span style={{ fontSize: 14, color: '#888', letterSpacing: 1 }}>•••</span>
      </div>
      <div style={{ marginTop: 10, marginLeft: 'auto', width: 140, border: '1px solid #eee', borderRadius: 6, padding: 4 }}>
        {['Edit tags', 'Power', 'Firmware', 'Remove'].map((a, i) => (
          <div key={a} style={{ fontSize: 11, padding: '5px 8px', borderRadius: 4, color: i === 3 ? '#1a1a1a' : '#999', background: i === 3 ? 'rgba(0,188,235,0.12)' : 'none', fontWeight: i === 3 ? 600 : 400 }}>{a}</div>
        ))}
      </div>
    </div>
  )
}

function RepeatVisual() {
  const steps = ['Open server', 'Check Events', 'Cross-ref HCL', 'Decide action']
  return (
    <div style={{ ...mini, width: 240, padding: 14 }}>
      <div style={{ ...tiny, marginBottom: 8 }}>Issue #1 · #2 · #3 …</div>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: i ? '1px solid #f0f0f0' : 'none' }}>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#f0f0f0', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>{i + 1}</span>
          <span style={{ fontSize: 12 }}>{s}</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#bbb' }}>×3</span>
        </div>
      ))}
      <div style={{ marginTop: 8, fontSize: 10, color: ACCENT }}>↻ Repeat for next issue</div>
    </div>
  )
}

const WIDE = { maxWidth: 1280, margin: '0 auto', padding: '0 32px' }
const H2 = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 1.12, letterSpacing: '-0.035em', color: INK, margin: 0 }
const EYEBROW = { fontFamily: F, fontSize: 12, fontWeight: 400, color: SUB, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 20px' }

const CHICLETS = {
  server: { bg: 'linear-gradient(145deg, #c9d6ff 0%, #8fa8f5 100%)', d: <><rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/><line x1="8" y1="7" x2="8.01" y2="7"/><line x1="8" y1="17" x2="8.01" y2="17"/></> },
  signal: { bg: 'linear-gradient(145deg, #d9ccff 0%, #a38cf5 100%)', d: <path d="M3 12h4l3-7 4 14 3-7h4"/> },
  spark:  { bg: 'linear-gradient(145deg, #e3d4ff 0%, #b48cf2 100%)', d: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/> },
  file:   { bg: 'linear-gradient(145deg, #d6dcff 0%, #9aa6f3 100%)', d: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><polyline points="14 3 14 8 19 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></> },
  plug:   { bg: 'linear-gradient(145deg, #cfe3ff 0%, #86aef0 100%)', d: <><path d="M9 7V3M15 7V3"/><path d="M6 7h12v4a6 6 0 0 1-12 0z"/><path d="M12 17v4"/></> },
  arrow:  { bg: 'linear-gradient(145deg, #c7e6ff 0%, #7fb3f2 100%)', d: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></> },
}

function Chiclet({ kind }) {
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

const mono = { fontFamily: '"SF Mono", Menlo, Consolas, monospace', fontSize: 11, lineHeight: '17px' }

function Pipeline() {
  const steps = [
    { n: '01', icon: 'signal', t: 'Prioritize', d: 'Decide which signals earn a place in the header, and in what order.',
      v: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[['Critical', '100%', '#8a7cf0'], ['Warning', '68%', '#a9b4f4'], ['Info', '38%', '#d2d8f5']].map(([k, w, c]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: F, fontSize: 10, color: SUB, width: 44 }}>{k}</span>
              <span style={{ height: 8, width: w, maxWidth: 110, borderRadius: 4, background: c }} />
            </div>
          ))}
        </div>
      ) },
    { n: '02', icon: 'file', t: 'Define rules', d: 'Turn the priority analysis into a rule set the model can read.',
      v: (
        <div style={{ ...mono, color: '#4a4f63' }}>
          <div style={{ color: SUB }}>rules.md</div>
          <div><span style={{ color: '#7b6cf0' }}>#</span> Priority</div>
          <div>- Critical → show first</div>
          <div>- Offline → suggest reconnect</div>
        </div>
      ) },
    { n: '03', icon: 'plug', t: 'Connect real data', d: 'Wire the prototype to the live Intersight API: real servers, real alerts.',
      v: (
        <div style={{ ...mono, color: '#4a4f63' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: SUB }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5ac08a' }} />GET /compute/servers
          </div>
          <div>{'{'} "name": "C220-M6",</div>
          <div>&nbsp;&nbsp;"health": "Critical" {'}'}</div>
        </div>
      ) },
    { n: '04', icon: 'spark', t: 'Generate & render', d: 'Gemini/Circuit writes a contextual summary that renders in the header.',
      v: (
        <video src="/cisco-ui/ai-generate.mov" autoPlay loop muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: 8 }} />
      ) },
  ]
  return (
    <div>
      <style>{'.pipe-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.pipe-arrow{display:none!important}@media(min-width:1000px){.pipe-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.pipe-arrow{display:flex!important}}@media(max-width:560px){.pipe-grid{grid-template-columns:1fr}}'}</style>
      <div className="pipe-grid" style={{ display: 'grid', gap: 20 }}>
        {steps.map((st, i) => (
          <div key={st.n} style={{ position: 'relative' }}>
            <div style={{ background: '#ffffff', borderRadius: 20, padding: 20, height: '100%', boxSizing: 'border-box', boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 12px 32px rgba(30,50,90,0.07)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, fontSize: 22 }}>
                <Chiclet kind={st.icon} />
                <span style={{ fontFamily: F, fontSize: 12, color: FADE }}>{st.n}</span>
              </div>
              <div style={{ background: '#f6f7fb', borderRadius: 12, padding: 14, height: 132, boxSizing: 'border-box', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 18 }}>
                {st.v}
              </div>
              <p style={{ fontFamily: F, fontSize: 17, fontWeight: 500, color: INK, margin: '0 0 6px' }}>{st.t}</p>
              <p style={{ fontFamily: F, fontSize: 14, lineHeight: '21px', color: SUB, margin: 0 }}>{st.d}</p>
            </div>
            {i < steps.length - 1 && (
              <span aria-hidden className="pipe-arrow" style={{ position: 'absolute', right: -16, top: 38, zIndex: 1, width: 24, height: 24, borderRadius: '50%', background: '#ffffff', boxShadow: '0 2px 8px rgba(30,50,90,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7b84a3" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 28, fontFamily: F, fontSize: 13, color: SUB }}>
        <span style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.7)' }}>Mock data</span>
        <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(120,130,170,0.15), rgba(120,130,170,0.6))' }} />
        <span style={{ padding: '6px 12px', borderRadius: 999, background: INK, color: '#fff' }}>Live Intersight API</span>
      </div>
    </div>
  )
}

function Tile({ title, sub, span, children }) {
  return (
    <div className={span} style={{ borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 254, background: '#ffffff' }}>
      <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(22px, 2.2vw, 28px)', lineHeight: 1.2, letterSpacing: '-0.02em', color: INK, margin: 0, padding: '28px 28px 0', maxWidth: 380 }}>
        {title} <span style={{ color: FADE }}>{sub}</span>
      </p>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>{children}</div>
    </div>
  )
}

function IntersightBento() {
  const row = (name, c, status, loc) => (
    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: '1px solid #f0f0f2', fontSize: 12 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
      <span style={{ fontWeight: 500, flex: 1 }}>{name}</span>
      <span style={{ color: '#8e8e93', width: 70 }}>{loc}</span>
      <span style={{ color: c, width: 56, textAlign: 'right' }}>{status}</span>
    </div>
  )
  return (
    <>
      <style>{'.bento{display:grid;gap:12px;grid-template-columns:1fr}@media(min-width:900px){.bento{grid-template-columns:1fr 1fr;grid-template-rows:auto auto}.b-photo{grid-row:span 2}}'}</style>
      <div className="bento">
        <div className="b-photo" style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', minHeight: 520, background: '#1d1f24' }}>
          <img src="/cisco-ui/datacenter.jpg" alt="Rows of server racks in a data center" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(0.5)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(120,140,210,0.55) 0%, rgba(90,105,180,0.55) 100%)', mixBlendMode: 'color' }} />
        </div>
        <Tile title="Every server" sub="across data centers and edge sites, in one console">
          <div style={{ ...mini, width: '100%', maxWidth: 440, padding: '14px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8e8e93', marginBottom: 4 }}><span>Servers</span><span>1,519 total</span></div>
            {row('C220-WZP2203', '#8a7cf0', 'Critical', 'San Jose')}
            {row('4G-IMM-1-2', '#7fb3f2', 'Healthy', 'RTP')}
            {row('CC7UCS-13-1-1', '#a9b4f4', 'Warning', 'Austin')}
          </div>
        </Tile>
        <Tile title="Live health" sub="for compute, storage, and network">
          <div style={{ ...mini, padding: 18, display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'conic-gradient(#8a7cf0 0 2%, #a9b4f4 2% 9%, #7fb3f2 9% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 62, height: 62, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600 }}>1519</div>
            </div>
            <div style={{ fontSize: 12, lineHeight: '22px' }}>
              {[['#8a7cf0', 'Critical 26'], ['#a9b4f4', 'Warning 108'], ['#7fb3f2', 'Healthy 1385']].map(([c, t]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{t}</div>
              ))}
            </div>
          </div>
        </Tile>
      </div>
    </>
  )
}

function SplitRow({ label, children }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px 48px' }}>
      <p style={{ flex: '0 0 220px', fontFamily: F, fontSize: 12, color: SUB, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '10px 0 0' }}>{label}</p>
      <div style={{ flex: '1 1 480px', minWidth: 0 }}>{children}</div>
    </div>
  )
}

function ChapterHead({ eyebrow, title, sub, body }) {
  return (
    <div style={{ ...WIDE, marginBottom: 56 }}>
      <SplitRow label={eyebrow}>
        <h2 style={STATEMENT}>
          {title}{sub && <>{' '}<span style={{ color: FADE }}>{sub}</span></>}
        </h2>
        {body && <P large style={{ maxWidth: 620, marginTop: 24 }}>{body}</P>}
      </SplitRow>
    </div>
  )
}

function Stage({ children }) {
  return (
    <div style={WIDE}>
      <div style={{
        borderRadius: 28, padding: 'clamp(16px, 3.5vw, 48px)',
        background: MESH_SOFT,
      }}>
        {children}
      </div>
    </div>
  )
}

function SolutionRow({ n, lines, body, src, flip }) {
  const shades = [INK, '#86868b', '#b8b8bd']
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: flip ? 'row-reverse' : 'row', alignItems: 'center', gap: 'clamp(32px, 5vw, 72px)' }}>
      <div style={{ flex: '1.7 1 480px', minWidth: 0 }}>
        <div style={{
          borderRadius: 24, padding: 'clamp(12px, 2.4vw, 32px)',
          background: MESH_SOFT,
        }}>
          <video src={src} autoPlay loop muted playsInline
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, boxShadow: '0 24px 60px rgba(30,50,90,0.16), 0 0 0 1px rgba(0,0,0,0.06)' }} />
        </div>
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

const GAP = 'clamp(120px, 14vw, 200px)'

export default function Cisco() {
  return (
    <div style={{ background: LIGHT, color: INK, fontFamily: F, minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div style={{ padding: 12 }}>
        <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', background: MESH_HERO }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.45, mixBlendMode: 'soft-light', backgroundImage: GRAIN, pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <Header minimal />
            <section style={{ ...W, paddingTop: 'clamp(24px, 4vw, 56px)', paddingBottom: 48 }}>
              <img src="/cisco-ui/cisco-logo.png" alt="Cisco" style={{ height: 30, display: 'block', marginBottom: 28 }} />
              <h1 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(34px, 4.8vw, 60px)', lineHeight: 1.06, letterSpacing: '-0.04em', color: '#ffffff', margin: '0 0 32px' }}>
                From a page title to{' '}
                <span style={{ color: 'rgba(255,255,255,0.62)' }}>an adaptive, AI-powered operational solution</span>
              </h1>
              <a href="https://www.figma.com/make/lY0KtrzfHANiVsrMk1ceOA/Header-design-prototype?fullscreen=1" target="_blank" rel="noreferrer"
                style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: INK, background: '#ffffff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 999, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Explore prototype
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </a>
            </section>
            <div style={W}>
              {/* monitor body spans x=106..1429 of 1536px image; widen so body edges match text edges */}
              <div style={{ position: 'relative', width: '116.1%', marginLeft: '-8.01%', aspectRatio: '1536/900', overflow: 'hidden' }}>
                <video src="/cisco-hero.mov" autoPlay loop muted playsInline
                  style={{ position: 'absolute', top: '9.22%', left: '8.72%', width: '82.49%', height: '68.67%', objectFit: 'fill', display: 'block', zIndex: 0 }}
                />
                <img src="/cisco-ui/monitor-frame-17.png" alt="Monitor"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '113.78%', zIndex: 1, pointerEvents: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: LIGHT, color: INK }}>
      {/* ── OVERVIEW ─────────────────────────────────────── */}
      <section style={{ ...WIDE, paddingTop: 'clamp(80px, 9vw, 128px)', paddingBottom: GAP }}>
        <SplitRow label="What is Insight to Action?">
          <p style={STATEMENT}>
            <span style={{ color: FADE }}>On Cisco's UCS Compute team, I led a project that turned the Intersight server header from static metadata into</span>{' '}
            an adaptive layer that surfaces priority signals, AI insights, and next actions{' '}
            <span style={{ color: FADE }}>in one place.</span>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '28px 32px', marginTop: 48 }}>
            {[
              ['Project Type', 'Enterprise SaaS'],
              ['Company',      'Cisco'],
              ['Industry',     'Cloud Infrastructure'],
              ['Year',         '2026'],
              ['Role',         'Product Design Intern'],
              ['Focus',        'IA · AI Interaction'],
            ].map(([k, v]) => (
              <div key={k}>
                <p style={{ fontFamily: F, fontSize: 11, color: SUB, margin: 0, paddingBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>{k}</p>
                <p style={{ fontFamily: F, fontSize: 15, color: INK, margin: '12px 0 0' }}>{v}</p>
              </div>
            ))}
          </div>
        </SplitRow>
      </section>

      {/* ── WHAT IS INTERSIGHT ──────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="What is Intersight?" title="Cisco's cloud console for running infrastructure."
          sub="One place for IT teams to manage, monitor, and update hundreds of servers." />
        <div style={WIDE}>
          <IntersightBento />
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="The Problem" title="Imagine you're responsible for hundreds of servers, and one goes critical."
          sub="Where do you even start?" />
        <Stage>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {[
              { t: 'Context is scattered across pages.', d: 'Status sits in the header, context in Events, and actions in another tab. Users have to piece it together themselves.', v: <ScatteredVisual /> },
              { t: 'The next step is hidden.', d: 'Actions like Remove or Run Diagnostics sit behind menus. Users only find them after they have figured out the problem on their own.', v: <HiddenActionVisual /> },
              { t: 'Every issue restarts the hunt.', d: 'For every similar issue, users navigate, cross-reference, and decide all over again, even though the system already has the answer.', v: <RepeatVisual /> },
            ].map(({ t, d, v }) => (
              <div key={t} style={{ background: '#ffffff', boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 12px 32px rgba(30,50,90,0.06)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
                  backgroundColor: '#f3f5f8',
                  backgroundImage: 'radial-gradient(rgba(0,0,0,0.09) 1px, transparent 1px)',
                  backgroundSize: '10px 10px',
                }}>
                  {v}
                </div>
                <div style={{ padding: '30px 30px 36px' }}>
                  <h3 style={{ fontFamily: F, fontWeight: 500, fontSize: 26, lineHeight: 1.15, letterSpacing: '-0.02em', color: INK, margin: '0 0 14px' }}>{t}</h3>
                  <P style={{ fontSize: 15, lineHeight: '23px' }}>{d}</P>
                </div>
              </div>
            ))}
          </div>
        </Stage>
      </section>

      {/* ── THE SOLUTION ─────────────────────────────────── */}
      <section style={{ paddingBottom: 'clamp(96px, 10vw, 140px)' }}>
        <ChapterHead eyebrow="The Solution"
          title={<>Understand <Chiclet kind="spark" /> the context.</>}
          sub={<>Act on it <Chiclet kind="arrow" /> Then scale it <Chiclet kind="server" /> across every server.</>}
          body="Three levels of the same system. Each one builds on the last." />
      </section>

      {/* ── SOLUTION ROWS ── */}
      <section style={{ paddingBottom: GAP }}>
        <div style={{ ...WIDE, display: 'flex', flexDirection: 'column', gap: 'clamp(80px, 10vw, 140px)' }}>
          <SolutionRow n="01  Understand" lines={['Generate contextual', 'insights from what', 'the server is doing']}
            body="When a user opens a server, the system reads its context and current condition and writes an Overview of what is happening and what needs attention."
            src="/cisco-ui/solution-01.mov" />
          <SolutionRow flip n="02  Act" lines={['Turn every insight', 'into a clear', 'next step']}
            body="Different conditions lead to different insights, and each one links to a relevant action through the Insight-to-Action card. The user always decides whether to run it."
            src="/cisco-ui/solution-02.mov" />
          <SolutionRow n="03  Scale" lines={['Resolve the same issue', 'across many servers', 'in one decision']}
            body="Instead of inspecting servers one at a time, users find related servers that share a condition and act on them together."
            src="/cisco-ui/solution-03.mov" />
        </div>
      </section>

      {/* ── TECHNICAL: REAL DATA ─────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Technical Validation" title="From mock data" sub="to real API in four steps." />
        <Stage>
          <Pipeline />
        </Stage>
        <div style={W}>
          <P large style={{ maxWidth: 720, margin: '56px auto 0', textAlign: 'center' }}>
            Moving to the real Intersight API turned the prototype from a picture of an ideal interface into a test of whether the system could generate the right experience from real data.{' '}
            <span style={{ color: INK }}>It could, and every stakeholder conversation after that was different.</span>
          </P>
        </div>
      </section>

      {/* ── STAKEHOLDER FEEDBACK ─────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <div style={{ ...W, textAlign: 'center' }}>
          <p style={EYEBROW}>Validation</p>
          <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(28px, 4.2vw, 52px)', lineHeight: 1.15, letterSpacing: '-0.03em', color: '#a1a1a6', margin: '0 auto 24px', maxWidth: 960 }}>
            “Intersight has many things going on.{' '}
            <span style={{ color: INK }}>This helps focus attention and makes issue-heavy moments more efficient.</span>”
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, margin: '8px 0 80px', textAlign: 'left' }}>
            <img src="/cisco-ui/kevin.png" alt="Kevin Wollenweber" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
            <div>
              <p style={{ fontFamily: F, fontSize: 16, fontWeight: 500, color: INK, margin: 0 }}>Kevin Wollenweber</p>
              <p style={{ fontFamily: F, fontSize: 14, color: SUB, margin: '2px 0 0' }}>SVP, Cisco</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {[
              ['3', 'Focus groups', 'Team readout session'],
              ['94', 'Power users', 'Tested across server states'],
              ['5', 'UX speed tests', 'Header vs. baseline navigation'],
            ].map(([n, t, sub]) => (
              <div key={t} style={{ padding: '44px 24px', borderRadius: 24, background: '#ffffff' }}>
                <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(56px, 7vw, 88px)', color: INK, margin: '0 0 8px', letterSpacing: '-0.05em', lineHeight: 1 }}>{n}</p>
                <p style={{ fontFamily: F, fontSize: 16, color: INK, margin: '0 0 4px', fontWeight: 500 }}>{t}</p>
                <p style={{ fontFamily: F, fontSize: 14, color: SUB, margin: 0, opacity: 0.7 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REFLECTION ───────────────────────────────────── */}
      <section style={{ paddingBottom: 'clamp(96px, 10vw, 140px)' }}>
        <ChapterHead eyebrow="Reflection" title="The hard part isn't adding AI." sub="It's deciding what it should say, and when." />
        <div style={WIDE}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px 32px' }}>
            {[
              ['Make ambiguity testable', 'Prototypes turned open questions into things the team could react to.'],
              ['Collaborate across roles', 'PM and engineering surfaced problems design alone couldn\'t solve.'],
              ['Real data persuades', 'Live data moved the question from "could this work?" to "it works."'],
            ].map(([t, d]) => (
              <div key={t}>
                <p style={{ fontFamily: F, fontSize: 20, fontWeight: 500, color: INK, margin: '0 0 12px', letterSpacing: '-0.01em' }}>{t}</p>
                <P style={{ fontSize: 15, lineHeight: '24px' }}>{d}</P>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...WIDE, marginTop: 96 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridAutoRows: 'clamp(200px, 30vw, 380px)', gap: 12 }}>
            {[
              ['/cisco-ui/team-photo.webp', 'Cisco intern cohort and team', 'span 3', 'center'],
              ['/cisco-ui/cisco-sign.webp', 'At the Cisco sign', 'span 2', '80% center'],
              ['/cisco-ui/img-9317.jpg', 'Cisco intern event', 'span 2', 'center 70%'],
              ['/cisco-ui/team-dinner.jpg', 'Team dinner', 'span 3', 'center'],
            ].map(([src, alt, span, pos]) => (
              <img key={src} src={src} alt={alt} style={{ gridColumn: span, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, borderRadius: 20, display: 'block' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────── */}
      <section style={{ ...W, paddingBottom: 'clamp(96px, 10vw, 140px)', textAlign: 'center' }}>
        <p style={EYEBROW}>More to the story</p>
        <h2 style={{ ...H2, fontSize: 'clamp(30px, 4.4vw, 52px)', maxWidth: 820, margin: '0 auto 20px' }}>
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

      {/* ── FOOTER NAV ───────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ ...W, paddingTop: 36, paddingBottom: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/"
            style={{ fontFamily: F, fontSize: 14, color: SUB, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => e.currentTarget.style.color = INK}
            onMouseLeave={e => e.currentTarget.style.color = SUB}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            All Work
          </Link>
          <Link to="/work/bytedance"
            style={{ fontFamily: F, fontSize: 14, color: SUB, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => e.currentTarget.style.color = INK}
            onMouseLeave={e => e.currentTarget.style.color = SUB}
          >
            Next: ByteDance
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>

      </div>
    </div>
  )
}
