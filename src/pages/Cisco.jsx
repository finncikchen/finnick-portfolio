import { ContactCTA, FooterNav } from '../components/CaseKit'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { Insight } from '../components/cisco/InsightCover'

const ServersDemo = lazy(() => import('../components/cisco/ServersDemo'))

const F     = '"Manrope", "Inter", sans-serif'
if (typeof document !== 'undefined' && !document.getElementById('manrope-font')) {
  const l = document.createElement('link'); l.id = 'manrope-font'; l.rel = 'stylesheet'
  l.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@300..700&display=swap'; document.head.appendChild(l)
}
const INK   = '#1d1d1f'
const SUB   = '#5f6370'
const LIGHT = '#f2f3f5'
const FADE  = '#a9adb6'
const STATEMENT = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.18, letterSpacing: '-0.03em', color: INK, margin: 0 }
// Material: one soft blurred wash, toned down to a quiet blue-gray, under fine grain. Used sparingly.
function Wash({ name = 'wash-wide', pos = 'center', size = 'cover', sat = 0.42 }) {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none', backgroundColor: '#e9eef5' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(/cisco-ui/${name}.webp)`, backgroundSize: size, backgroundPosition: pos, filter: `saturate(${sat}) brightness(1.04)`, opacity: 0.9 }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.28, mixBlendMode: 'multiply', backgroundImage: NOISE }} />
    </div>
  )
}

function P({ children, style }) {
  return (
    <p style={{ fontFamily: F, fontWeight: 400, fontSize: 17, lineHeight: '27px', color: SUB, margin: 0, ...style }}>
      {children}
    </p>
  )
}

const mini = { background: '#fcfcfc', borderRadius: 10, boxShadow: '0 8px 24px rgba(30,50,90,0.14), 0 0 0 1px rgba(0,0,0,0.05)', fontFamily: F, color: '#1a1a1a' }

const WIDE = { maxWidth: 1080, margin: '0 auto', padding: '0 clamp(24px, 12vw, 240px)', boxSizing: 'content-box' }

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
    { n: '01', icon: 'signal', t: 'Rank the signals', d: 'I mapped which server signals earn a place in the header, and in what order, so critical issues always come first.',
      v: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[['Critical', '100%', '#d93025'], ['Warning', '68%', '#e8a200'], ['Info', '38%', '#d2d8f5']].map(([k, w, c]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: F, fontSize: 10, color: SUB, width: 44 }}>{k}</span>
              <span style={{ height: 8, width: w, maxWidth: 110, borderRadius: 4, background: c }} />
            </div>
          ))}
        </div>
      ) },
    { n: '02', icon: 'file', t: 'Write the rules', d: 'I turned that ranking into a plain-language rule set the model reads, so its output follows design intent.',
      v: (
        <div style={{ ...mono, color: '#4a4f63' }}>
          <div style={{ color: SUB }}>rules.md</div>
          <div><span style={{ color: '#7b6cf0' }}>#</span> Priority</div>
          <div>- Critical → show first</div>
          <div>- Offline → suggest reconnect</div>
        </div>
      ) },
    { n: '03', icon: 'plug', t: 'Ground it in real data', d: 'I wired the prototype to the live Intersight API, so every insight comes from a real server’s state.',
      v: (
        <div style={{ ...mono, color: '#4a4f63' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: SUB }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5ac08a' }} />GET /compute/servers
          </div>
          <div>{'{'} "name": "C220-M6",</div>
          <div>&nbsp;&nbsp;"health": "Critical" {'}'}</div>
        </div>
      ) },
    { n: '04', icon: 'spark', t: 'Shape the output', d: 'Circuit, Cisco’s own AI, writes the insight, and it lands in the card’s strict shape: a short title, two lines, one action.',
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
    </div>
  )
}

// The solution at a glance: three tiles on one continuous wash. Each carries a small frosted-glass diagram of its idea:
// signals becoming one summary, an insight carrying its action, and one decision reaching many servers.
function SolutionMap() {
  const BLUE = '#2f6fe0'
  const glass = { ...FROST, boxSizing: 'border-box' }
  const bar = (w, c = 'rgba(29,29,31,0.16)') => <span style={{ display: 'block', height: 6, width: w, borderRadius: 3, background: c }} />
  const pill = t => <span key={t} style={{ ...glass, borderRadius: 999, padding: '5px 10px', fontFamily: F, fontSize: 11, fontWeight: 500, color: INK, whiteSpace: 'nowrap' }}>{t}</span>
  const steps = [
    ['Understand', 'One server. The header reads its signals and writes what is happening.',
      <div key="v" style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'grid', gap: 6, justifyItems: 'start' }}>{['Health', 'Alarms', 'Power'].map(pill)}</div>
        <svg width="44" height="84" viewBox="0 0 44 84" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.3" style={{ flex: 'none' }}>
          <path d="M0 13 C 22 13, 22 42, 44 42" /><path d="M0 42 H 44" /><path d="M0 71 C 22 71, 22 42, 44 42" />
        </svg>
        <div style={{ ...glass, borderRadius: 14, padding: '12px 14px', display: 'grid', gap: 7, minWidth: 112 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 11, fontWeight: 600, color: INK }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: BLUE }} />Overview</span>
          {bar('100%')}{bar('72%')}
        </div>
      </div>],
    ['Act', 'One insight. It comes with its next step, and the user decides to run it.',
      <div key="v" style={{ ...glass, borderRadius: 14, padding: 14, display: 'grid', gap: 8, width: 200, maxWidth: '100%' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ flex: 'none', width: 8, height: 8, borderRadius: 2, background: '#d93025', transform: 'rotate(45deg)' }} />{bar('62%', 'rgba(29,29,31,0.5)')}</span>
        {bar('100%')}{bar('80%')}
        <span style={{ position: 'relative', justifySelf: 'start', marginTop: 4, borderRadius: 8, padding: '6px 12px', background: BLUE, color: '#fff', fontFamily: F, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', boxShadow: '0 0 0 4px rgba(47,111,224,0.16)' }}>
          Run next step
          <svg width="16" height="18" viewBox="0 0 16 18" style={{ position: 'absolute', right: -8, bottom: -12 }}><path d="M1 1v13l3.6-3.2 2.4 5.4 2.3-1-2.4-5.3H12z" fill="#1d1d1f" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></svg>
        </span>
      </div>],
    ['Scale', 'Many servers. The ones that share a condition are resolved in one decision.',
      <div key="v" style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 20px)', gap: 6 }}>
          {Array.from({ length: 24 }, (_, k) => {
            const on = [1, 4, 6, 10, 13, 15, 19, 22].includes(k)
            return <span key={k} style={on ? { height: 20, borderRadius: 6, background: BLUE, boxShadow: '0 0 0 3px rgba(47,111,224,0.14)' } : { ...glass, height: 20, borderRadius: 6, boxShadow: 'none' }} />
          })}
        </div>
        {pill('8 servers, 1 decision')}
      </div>],
  ]
  return (
    <div className="sol-map">
      <style>{'.sol-map{display:grid;gap:14px;grid-template-columns:repeat(3,minmax(0,1fr))}@media(max-width:760px){.sol-map{grid-template-columns:1fr}}'}</style>
      {steps.map(([t, d, v], i) => (
        <div key={t} style={{ position: 'relative', isolation: 'isolate', overflow: 'hidden', borderRadius: 24, padding: 'clamp(20px, 2.2vw, 28px)', display: 'flex', flexDirection: 'column', gap: 'clamp(20px, min(3vw, 4vh), 36px)' }}>
          <Wash name="wash-soft" size="312% 100%" pos={`${22 + i * 39}% center`} sat={0.55} />
          {i === 0 && <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'linear-gradient(90deg, rgba(255,255,255,0.42), rgba(255,255,255,0.12))' }} />}
          <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: 'rgba(29,29,31,0.55)', margin: 0, fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</p>
          <div style={{ flex: 1, minHeight: 104, display: 'flex', alignItems: 'center' }}>{v}</div>
          <div>
            <p style={{ fontFamily: F, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', color: INK, margin: '0 0 8px' }}>{t}</p>
            <p style={{ fontFamily: F, fontSize: 15, lineHeight: 1.5, color: 'rgba(29,29,31,0.72)', margin: 0, maxWidth: 300 }}>{d}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function Tile({ title, sub, span, children }) {
  return (
    <div className={`b-tile ${span || ''}`} style={{ borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
      <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(17px, min(1.7vw, 3.4vh), 22px)', lineHeight: 1.25, letterSpacing: '-0.02em', color: INK, margin: 0, padding: '22px 24px 0', maxWidth: 380 }}>
        {title} {sub}
      </p>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 24px 20px' }}>{children}</div>
    </div>
  )
}

function IntersightBento() {
  const row = (name, c, status, loc) => (
    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderTop: '1px solid #f0f0f2', fontSize: 12 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
      <span style={{ fontWeight: 500, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
      <span className="bento-loc" style={{ color: SUB, width: 70 }}>{loc}</span>
      <span style={{ color: c, width: 56, textAlign: 'right' }}>{status}</span>
    </div>
  )
  return (
    <>
      <style>{'.bento{display:grid;gap:12px;grid-template-columns:1fr}.b-photo{min-height:320px}.b-tile{min-height:230px}@media(min-width:900px){.bento{grid-template-columns:1fr 1fr;grid-template-rows:repeat(2,minmax(0,1fr));height:clamp(420px,calc(100vh - 120px),580px)}.b-photo{grid-row:span 2;min-height:0}.b-tile{min-height:0}}'}</style>
      <div className="bento">
        <div className="b-photo" style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', background: '#1d1f24' }}>
          <img src="/cisco-ui/datacenter.jpg" alt="Rows of server racks in a data center" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(0.5)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(120,140,210,0.55) 0%, rgba(90,105,180,0.55) 100%)', mixBlendMode: 'color' }} />
        </div>
        <Tile title="Every server" sub="across data centers and edge sites, in one console">
          <div style={{ ...mini, width: '100%', maxWidth: 440, padding: '10px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: SUB, marginBottom: 4 }}><span>Servers</span><span>1,519 total</span></div>
            {row('C220-WZP2203', '#d93025', 'Critical', 'San Jose')}
            {row('4G-IMM-1-2', '#2e9d5b', 'Healthy', 'RTP')}
            {row('CC7UCS-13-1-1', '#e8a200', 'Warning', 'Austin')}
          </div>
        </Tile>
        <Tile title="Live health" sub="for compute, storage, and network">
          <div style={{ ...mini, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 72, height: 72, flex: 'none', borderRadius: '50%', background: 'conic-gradient(#d93025 0 2%, #e8a200 2% 9%, #2e9d5b 9% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600 }}>1519</div>
            </div>
            <div style={{ fontSize: 12, lineHeight: '22px' }}>
              {[['#d93025', 'Critical 26'], ['#e8a200', 'Warning 108'], ['#2e9d5b', 'Healthy 1385']].map(([c, t]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{t}</div>
              ))}
            </div>
          </div>
        </Tile>
      </div>
    </>
  )
}

const DISPLAY = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(26px, 2.8vw, 40px)', lineHeight: 1.16, letterSpacing: '-0.03em', margin: 0 }

// Heading = gray context + one black key message. Pass `lead` (gray, before), `title` (black), `sub` (gray, after).
function ChapterHead({ eyebrow, lead, title, sub, body }) {
  const n = t => (t ? t.split(' ').length : 0)
  return (
    <div style={{ ...WIDE, marginBottom: HEAD }}>
      <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', color: SUB, margin: '0 0 20px' }}>{eyebrow}</p>
      <h2 style={{ ...DISPLAY, color: INK }}>
        {lead && <Stream text={lead} />}
        <Stream text={title} delay={n(lead) * 0.045} />
        {sub && <><Stream text={sub} delay={(n(lead) + n(title)) * 0.045} /></>}
      </h2>
      {body && <p style={{ fontFamily: F, fontSize: 17, lineHeight: 1.5, color: SUB, maxWidth: 760, margin: '28px 0 0' }}>{body}</p>}
    </div>
  )
}

const SCREEN_SHADOW = '0 2px 6px rgba(0,0,0,0.06), 0 30px 80px rgba(0,0,0,0.14)'

function Stage({ children }) {
  return (
    <div style={WIDE}>
      <div>{children}</div>
    </div>
  )
}

function SolutionRow({ n, lines, body, src, bg }) {
  return (
    <div>
      <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', color: SUB, margin: '0 0 16px' }}>{n}</p>
      <h3 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(22px, 2vw, 26px)', lineHeight: 1.15, letterSpacing: '-0.025em', color: INK, margin: 0 }}>
        {lines.join(' ')}
      </h3>
      <p style={{ fontFamily: F, fontSize: 17, lineHeight: 1.55, color: SUB, maxWidth: 760, margin: '20px 0 ' + HEAD }}>{body}</p>
      <div style={{ borderRadius: 28, padding: 'clamp(16px, min(4.5vw, 6vh), 64px)', background: `#c4daf0 url(/cisco-ui/${bg}.webp) center / cover no-repeat` }}>
        <video src={src} autoPlay loop muted playsInline preload="metadata"
          style={{ width: 'min(100%, calc((100vh - 220px) * 3024 / 1552))', aspectRatio: '3024 / 1552', height: 'auto', display: 'block', margin: '0 auto', borderRadius: 12, boxShadow: '0 1px 2px rgba(20,30,50,0.06), 0 24px 56px -24px rgba(20,30,50,0.28)' }} />
      </div>
    </div>
  )
}

const GAP = 'clamp(112px, 12vw, 168px)'
const HEAD = 'clamp(40px, 4.5vw, 64px)'
const BLOCK = 'clamp(72px, 7vw, 104px)'
// Frosted, diffuse fluid gradient: large heavily-blurred colour fields under a fine grain.
// AI-field backdrop: only the project's own colours (hero slate, Cisco cyan, AI-symbol blue),
// slowly drifting under heavy fine noise, with a soft light that follows the pointer.
const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`
// Calm surface: near-white with one soft, wide light wash in the hero's slate blue, and fine noise.
function FluidPanel({ children, style }) {
  return (
    <div style={{ padding: '0 clamp(12px, 5vw, 96px)', marginBottom: GAP }}>
      <section style={{ position: 'relative', borderRadius: 32, overflow: 'hidden', isolation: 'isolate', padding: `${GAP} 0`,
        background: 'radial-gradient(120% 70% at 50% 0%, #e6ebf4 0%, rgba(230,235,244,0) 60%), radial-gradient(90% 60% at 50% 110%, #edf0f5 0%, rgba(237,240,245,0) 70%), #f7f8fa', ...style }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, opacity: 0.18, mixBlendMode: 'multiply', backgroundImage: NOISE, pointerEvents: 'none' }} />
        {children}
      </section>
    </div>
  )
}

// Headings arrive the way the AI writes: words resolve out of blur, left to right, once in view.
function Stream({ text, delay = 0 }) {
  const ref = useRef(null)
  const [on, setOn] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const el = ref.current; if (!el || on) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold: 0.4 })
    io.observe(el); return () => io.disconnect()
  }, [on])
  return (
    <span ref={ref}>
      {String(text).split(' ').map((w, i) => (
        <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', opacity: on ? 1 : 0, filter: on ? 'blur(0)' : 'blur(8px)', transform: on ? 'none' : 'translateY(6px)',
          transition: `opacity .5s ease ${delay + i * 0.045}s, filter .6s ease ${delay + i * 0.045}s, transform .6s cubic-bezier(.2,.7,.2,1) ${delay + i * 0.045}s` }}>{w} </span>
      ))}
    </span>
  )
}

// ── Exploded view of the new header: four real layers that separate as you scroll ──
const LAYERS = [
  ['body', 'Server details', 'The page the header sits on.', 702],
  ['cards', 'Insight cards', 'Summary, live metadata and next actions.', 219],
  ['tabs', 'Status tabs', 'Overview, Critical, Requests, Advisories.', 72],
  ['identity', 'Identity', 'Which server, and its overall health.', 147],
]
function useProgress(ref, span = 1) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = ref.current; if (!el) return
    let raf = 0
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect(), vh = innerHeight
      setP(Math.min(1, Math.max(0, (vh - r.top) / ((r.height + vh) * span))))
    }) }
    on(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', on); removeEventListener('resize', on) }
  }, [ref, span])
  return p
}
function ExplodedHeader() {
  const ref = useRef(null)
  const p = useProgress(ref, 0.8)
  const order = [...LAYERS].reverse()                       // identity, tabs, cards, body (top to bottom)
  const active = Math.min(order.length - 1, Math.max(0, Math.floor((p - 0.2) / 0.5 * order.length)))
  const tops = order.reduce((acc, l, i) => [...acc, i ? acc[i - 1] + order[i - 1][3] : 0], [])
  const total = 1140
  return (
    <div ref={ref} style={WIDE}>
      <style>{`.ex-wrap{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:clamp(28px,4vw,64px);align-items:center}
        @media(max-width:900px){.ex-wrap{grid-template-columns:1fr}}`}</style>
      <div className="ex-wrap">
        <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: SCREEN_SHADOW }}>
          {order.map(([k], i) => (
            <img key={k} src={`/cisco-ui/layer-${k}.webp`} alt="" style={{ display: 'block', width: '100%',
              opacity: i === active ? 1 : 0.28, filter: i === active ? 'none' : 'grayscale(0.6)', transition: 'opacity .5s ease, filter .5s ease' }} />
          ))}
          <div aria-hidden style={{ position: 'absolute', left: 6, right: 6, borderRadius: 10, pointerEvents: 'none',
            top: `calc(${tops[active] / total * 100}% + 4px)`, height: `calc(${order[active][3] / total * 100}% - 8px)`,
            boxShadow: '0 0 0 2px rgba(0,120,200,0.55)', transition: 'top .5s cubic-bezier(.2,.7,.2,1), height .5s cubic-bezier(.2,.7,.2,1)' }} />
        </div>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 28 }}>
          {order.map(([k, t, d], i) => (
            <li key={k} style={{ opacity: i === active ? 1 : 0.4, transition: 'opacity .4s ease' }}>
              <p style={{ fontFamily: F, fontSize: 18, fontWeight: 500, color: INK, margin: '0 0 4px', letterSpacing: '-0.01em' }}>{t}</p>
              <p style={{ fontFamily: F, fontSize: 15, lineHeight: 1.5, color: SUB, margin: 0 }}>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ── Insight-to-action card: annotated anatomy + its four states ─────────── */
// Anchor boxes are measured from the rendered card (fractions of state-ready.webp).
function CardFeatures({ part }) {
  const rules = [['A clear title', 'Names the problem, in a few words.'], ['One short explanation', 'What it means for this server, in two lines.'], ['One next step', 'The fix is on the card. The user decides.']]
  const states = [['generating', 'Thinking', 'The card appears right away and fills in as the insight is written.'],
    ['ready', 'Ready', 'The insight and its action arrive together.'],
    ['running', 'Running', 'Progress stays in the card, so nobody leaves the page.'],
    ['done', 'Done', 'A clear confirmation, then the card steps back.']]
  return (
    <div style={WIDE}>
      <style>{`.feat{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:clamp(40px,6vw,96px);align-items:center}
        .feat-states{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(32px,4vw,56px) clamp(24px,3vw,40px)}
        @media(max-width:900px){.feat{grid-template-columns:1fr}.feat-states{grid-template-columns:1fr}}`}</style>
      {part === 'states' ? <StateFlow states={states} /> : <CardDiagram rules={rules} />}
    </div>
  )
}

// ── Before / After: the same moment in two matching cards, each film above its own numbers ──
const BA = [
  { k: 'Before', src: '/cisco-ui/before-hunt.mp4', line: 'Seven clicks across banners, alarms, tabs and nested menus.',
    alt: 'Before: reading a banner, opening alarms, switching tabs, then Actions, System and a long submenu to find Remove, seven clicks in all' },
  { k: 'After', src: '/cisco-ui/insight-to-action.mp4', line: 'One card explains the problem and offers the fix.',
    alt: 'After: switching to the Critical tab, zooming into the Power Supply 1 insight card, and running its Turn on Locator LED action' },
]
const RESULTS = [['6+', '0', 'Clicks to reach the next step'], ['4', '1', 'Places to look for context'], ['3–10 min', '<1 min', 'Time to find what matters']]
function BeforeAfter() {
  return (
    <div style={WIDE}>
      <style>{'.ba{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}@media(max-width:860px){.ba{grid-template-columns:1fr}}'}</style>
      <div className="ba">
        {BA.map(({ k, src, line, alt }, side) => (
          <div key={k} style={{ background: '#ffffff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 12px 32px rgba(30,50,90,0.06)', display: 'flex', flexDirection: 'column' }}>
            <video src={src} autoPlay muted loop playsInline preload="metadata" aria-label={alt}
              style={{ width: '100%', display: 'block', aspectRatio: '16 / 9', objectFit: 'cover', background: '#f3f5f8', filter: side ? 'none' : 'saturate(0.7)' }} />
            <div style={{ padding: '30px 30px 14px', flex: 1 }}>
              <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', color: SUB, margin: '0 0 12px' }}>{k}</p>
              <h3 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(22px, 2vw, 26px)', lineHeight: 1.15, letterSpacing: '-0.02em', color: INK, margin: 0, minHeight: '2.3em' }}>{line}</h3>
            </div>
            <dl style={{ margin: 0, padding: '0 30px 18px' }}>
              {RESULTS.map(r => (
                <div key={r[2]} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderTop: '1px solid #eef0f3' }}>
                  <dt style={{ fontFamily: F, fontSize: 15, color: SUB }}>{r[2]}</dt>
                  <dd style={{ fontFamily: F, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', color: INK, margin: 0, whiteSpace: 'nowrap' }}>{r[side]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}

// One card at its real size on a quiet tile, with the four states listed beside it. The list steps through on its own
// and each step can be picked by hand; only the current step shows its sentence.
const SF_FACE = { generating: 'load', ready: 'ready', running: 'run', done: 'done' }
function StateFlow({ states }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => setI(x => (x + 1) % states.length), 3600)
    return () => clearTimeout(id)
  }, [i, states.length])
  return (
    <div className="sf">
      <style>{`.sf{display:grid;grid-template-columns:minmax(0,1fr);gap:28px;align-items:center}
        @media(min-width:900px){.sf{grid-template-columns:minmax(220px,0.72fr) minmax(0,1.5fr);gap:clamp(32px,5vw,72px)}}
        .sf-item{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:14px;padding:14px 0;border-top:1px solid #eceef2;cursor:pointer;background:none;border-left:0;border-right:0;border-bottom:0;text-align:left;width:100%;font:inherit}
        .sf-item:first-child{border-top:0}
        .sf-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s cubic-bezier(.2,.7,.2,1)}.sf-item[aria-current=true] .sf-body{grid-template-rows:1fr}
        .sf-body>span{overflow:hidden}
        .sf-card{height:210px;--ic-shadow:0 1px 2px rgba(40,60,100,.06),0 16px 32px -12px rgba(40,60,100,.22)}
        .sf-card .ic-scene{overflow:visible}
        .sf-card .ic-insight{opacity:1!important;filter:none!important;transform:scale(1.3)!important;transition:none!important}
        @media(max-width:1100px){.sf-card .ic-insight{transform:scale(1.08)!important}}
        @media(max-width:640px){.sf-card{height:130px}.sf-card .ic-insight{transform:scale(.68)!important}}
        .sf-card .ic-plate{-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
        .sf-card [data-face='load'] .ic-plate{animation-name:sf-glass}
        @keyframes sf-glass{from{opacity:.4}to{opacity:.62}}
        .sf-card .ic-bar{background:rgba(110,135,175,.18)}
        .sf-card .ic-bar b{background:linear-gradient(90deg,transparent,rgba(90,140,220,.42) 70%,transparent)}
        .sf-card .ic-pulse b+b{background:#1a9fe0}`}</style>
      <div>
        {states.map(([k, tt, d], j) => (
          <button type="button" key={k} className="sf-item" aria-current={j === i} onClick={() => setI(j)}>
            <span style={{ fontFamily: F, fontSize: 14, lineHeight: '26px', color: FADE, fontVariantNumeric: 'tabular-nums' }}>0{j + 1}</span>
            <span>
              <span style={{ display: 'block', fontFamily: F, fontSize: 20, lineHeight: '26px', fontWeight: 500, letterSpacing: '-0.015em', color: j === i ? INK : FADE, transition: 'color .35s ease' }}>{tt}</span>
              <span className="sf-body"><span style={{ fontFamily: F, fontSize: 15, lineHeight: 1.5, color: SUB }}><span style={{ display: 'block', paddingTop: 6 }}>{d}</span></span></span>
            </span>
          </button>
        ))}
      </div>
      <div style={{ position: 'relative', isolation: 'isolate', overflow: 'hidden', borderRadius: 24, padding: 'clamp(20px, min(4.5vw, 8vh), 64px) clamp(16px, 4vw, 56px)' }}>
        {/* frosted glass: the wash, diffused under a milky pane with a lit edge, so the product's own card films stay true on it */}
        <Wash pos="right bottom" sat={0.85} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, borderRadius: 24, background: 'linear-gradient(160deg, rgba(255,255,255,0.5), rgba(255,255,255,0.3))',
          backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.85), inset 0 1px 0 rgba(255,255,255,1), inset 0 0 60px rgba(255,255,255,0.35)' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, opacity: 0.5, mixBlendMode: 'soft-light', backgroundImage: NOISE, backgroundSize: '160px 160px' }} />
        {/* the card itself, the same component as the home cover, set straight on the glass with nothing behind it */}
        <div className="ic sf-card" style={{ position: 'relative', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <div className="ic-scene" data-scene="ask" data-live>
            <Insight face={SF_FACE[states[i][0]]} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Logic diagram on frosted glass: signals flow into the AI, the AI writes the card, each part of the card is called out,
// and the action loops back into the same card. Laid out on a 1160 x 500 grid that scales with its container.
const FROST = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.46))',
  backdropFilter: 'blur(22px) saturate(180%)', WebkitBackdropFilter: 'blur(22px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.78)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 1px 2px rgba(20,30,50,0.04), 0 6px 18px rgba(20,30,50,0.06)',
}
function CardDiagram({ rules }) {
  const VW = 1160, VH = 500, BLUE = '#2f6fe0'
  const C = { x: 350, y: 150, w: 500, h: 176 }, cy = C.y + C.h / 2
  const box = (x, y, w, h) => ({ position: 'absolute', left: `${x / VW * 100}%`, top: `${y / VH * 100}%`, ...(w != null && { width: `${w / VW * 100}%` }), ...(h != null && { height: `${h / VH * 100}%` }) })
  const u = px => `${px / 11.6}cqw`
  const inputs = [['Server telemetry', 'Power, thermals, links', 'M4 12h3l2-5 4 10 2-5h5'], ['Active alarms', 'Severity and age', 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20h4'], ['Priority rules', 'What earns a place', 'M5 7h14M5 12h10M5 17h6']]
  const inY = i => cy - 104 + i * 74
  const inPath = i => `M250 ${inY(i) + 22} C 296 ${inY(i) + 22}, 292 ${cy}, 338 ${cy}`
  const ann = [{ px: 670, py: 186, y: 186 }, { px: 815, py: 224, y: 240 }, { px: 490, py: 308, y: 384, down: true }]
  const leader = ({ px, py, y, down }) => down ? `M${px} ${py} V ${y - 8} Q ${px} ${y} ${px + 8} ${y} H 866` : `M${px} ${py} C ${(px + 866) / 2} ${py}, ${(px + 866) / 2} ${y}, 866 ${y}`
  const SPL = { calcMode: 'spline', keyTimes: '0;1', keySplines: '0.45 0 0.2 1', repeatCount: 'indefinite' }
  return (
    <div style={{ fontFamily: F }}>
      <style>{`.cd-list{display:none}@media(max-width:760px){.cd-stage{display:none!important}.cd-list{display:grid}}
`}</style>
      <div className="cd-stage" role="img"
        aria-label="Server telemetry, active alarms and priority rules feed the AI, which writes the insight card. The card's title, explanation and next step are called out. The action runs on the server and the result returns to the same card."
        style={{ position: 'relative', isolation: 'isolate', overflow: 'hidden', borderRadius: 28, aspectRatio: `${VW} / ${VH}`, containerType: 'inline-size', backgroundColor: '#e3eaf4' }}>
        {/* frosted ground: a soft wash, two slow fields of light, fine grain */}
        <div aria-hidden style={{ position: 'absolute', inset: '-8%', zIndex: -1, backgroundImage: 'url(/cisco-ui/wash-wide.webp)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.62) blur(12px)' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, opacity: 0.34, mixBlendMode: 'multiply', backgroundImage: NOISE }} />

        {/* connections */}
        <svg viewBox={`0 0 ${VW} ${VH}`} aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {inputs.map((_, i) => (
            <g key={i}>
              <path d={inPath(i)} fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" />
              <circle r="3.4" fill={BLUE} opacity="0">
                <animateMotion dur="4.6s" begin={`${i * 1.5}s`} path={inPath(i)} {...SPL} />
                <animate attributeName="opacity" dur="4.6s" begin={`${i * 1.5}s`} values="0;1;1;0" keyTimes="0;0.18;0.8;1" repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          {ann.map((a, i) => (
            <g key={i}>
              <path d={leader(a)} fill="none" stroke="rgba(60,80,120,0.28)" strokeWidth="1" strokeLinecap="round" />
              <circle cx={a.px} cy={a.py} r="3.5" fill="#fff" stroke={BLUE} strokeWidth="1.6" />
            </g>
          ))}
          <path d={`M372 ${C.y + C.h + 12} V 440`} fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" />
          <path d={`M452 440 V ${C.y + C.h + 12}`} fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" />
          <circle r="3.4" fill={BLUE} opacity="0">
            <animateMotion dur="4.6s" begin="0.6s" path={`M372 ${C.y + C.h + 12} V 440`} {...SPL} />
            <animate attributeName="opacity" dur="4.6s" begin="0.6s" values="0;1;1;0" keyTimes="0;0.18;0.8;1" repeatCount="indefinite" />
          </circle>
          <circle r="3.4" fill={BLUE} opacity="0">
            <animateMotion dur="4.6s" begin="2.3s" path={`M452 440 V ${C.y + C.h + 12}`} {...SPL} />
            <animate attributeName="opacity" dur="4.6s" begin="2.3s" values="0;1;1;0" keyTimes="0;0.18;0.8;1" repeatCount="indefinite" />
          </circle>
        </svg>

        <p style={{ ...box(40, 88), margin: 0, fontSize: u(11.5), letterSpacing: '0.08em', color: 'rgba(29,29,31,0.55)' }}>SIGNALS</p>
        {inputs.map(([t, , icon], i) => (
          <div key={t} className="cd-chip" style={{ ...box(40, inY(i) + 8, 210, 44), ...FROST, borderRadius: u(16), boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: u(12), padding: `0 ${u(14)}` }}>
            <span style={{ flex: 'none', width: u(30), height: u(30), borderRadius: u(9), background: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="62%" height="62%" fill="none" stroke="#3b4658" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: u(14), fontWeight: 600, color: INK, whiteSpace: 'nowrap' }}>{t}</span>
            </span>
          </div>
        ))}

        {/* the card, held in a thick pane of glass */}
        <div style={{ ...box(C.x - 12, C.y - 12, C.w + 24, C.h + 24), ...FROST, boxSizing: 'border-box', borderRadius: u(24), display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 6px rgba(20,30,50,0.05), 0 18px 44px rgba(20,30,50,0.10)' }}>
          <img src="/cisco-ui/state-ready.webp" alt="" style={{ width: `${C.w / (C.w + 24) * 100}%`, display: 'block', borderRadius: u(13) }} />
        </div>

        <p style={{ ...box(872, 88), margin: 0, fontSize: u(11.5), letterSpacing: '0.08em', color: 'rgba(29,29,31,0.55)' }}>WHAT THE OPERATOR READS</p>
        {ann.map((a, i) => (
          <div key={i} style={{ ...box(872, a.y - 20), display: 'flex', alignItems: 'center', gap: u(10), height: `${40 / VH * 100}%`, whiteSpace: 'nowrap' }}>
            <span style={{ flex: 'none', width: u(22), height: u(22), borderRadius: '50%', background: INK, color: '#fff', fontSize: u(11), fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
            <span style={{ fontSize: u(15), fontWeight: 600, color: INK }}>{rules[i][0]}</span>
          </div>
        ))}

        <div style={{ ...box(346, 440, 276, 42), ...FROST, boxSizing: 'border-box', borderRadius: 999, display: 'flex', alignItems: 'center', gap: u(10), padding: `0 ${u(14)}`, whiteSpace: 'nowrap' }}>
          <span style={{ flex: 'none', width: u(18), height: u(18), borderRadius: '50%', background: '#e3f5ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 20 20" width="62%" height="62%" fill="none" stroke="#16a34a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 10.5l3.4 3.4L15 7" /></svg>
          </span>
          <span style={{ fontSize: u(13), fontWeight: 500, color: INK }}>Runs on the server, result returns</span>
        </div>
      </div>
      <div className="cd-list" style={{ gap: 24 }}>
        <img src="/cisco-ui/state-ready.webp" alt="An insight card: title, explanation and next step" style={{ width: '100%', borderRadius: 16, boxShadow: SCREEN_SHADOW }} />
        {rules.map(([t, d]) => <div key={t}><p style={{ fontSize: 18, fontWeight: 500, color: INK, margin: '0 0 4px' }}>{t}</p><p style={{ fontSize: 16, color: SUB, margin: 0 }}>{d}</p></div>)}
      </div>
    </div>
  )
}

const VAL_CARD = { background: '#ffffff', borderRadius: 24, padding: 'clamp(20px, 2vw, 28px)', minHeight: 0, boxSizing: 'border-box', boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 12px 32px rgba(30,50,90,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 }
const VAL_NUM = { fontFamily: F, fontWeight: 400, fontSize: 'clamp(56px, 6vw, 88px)', letterSpacing: '-0.05em', lineHeight: 0.95, color: INK, margin: 0 }
// Numbers count up once, the first time they are seen.
function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const [v, setV] = useState(() => (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches ? to : 0))
  useEffect(() => {
    const el = ref.current; if (!el || v === to) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = now => { const p = Math.min(1, (now - t0) / 1100); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick) }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    io.observe(el); return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>{v}{suffix}</span>
}

// The hero picture: a render of a monitor on a soft sky, with the live product page set into its screen.
// The screen's corners are measured on the 1536 x 1024 picture; a phone column shows the monitor closer.
function MonitorShot() {
  const ref = useRef(null)
  const [view, setView] = useState(null)
  useEffect(() => {
    const el = ref.current
    const fit = () => {
      const w = el.clientWidth, near = w < 640
      setView({ scale: w / (near ? 1040 : 1536), x: near ? -248 : 0, y: near ? 0 : -101 })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className="shot-img">
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1536, height: 1024, transformOrigin: '0 0', visibility: view ? 'visible' : 'hidden',
        transform: view ? `scale(${view.scale}) translate(${view.x}px, ${view.y}px)` : 'none' }}>
        <img src="/cisco-ui/hero-monitor.webp" alt="" width="1536" height="1024" style={{ display: 'block' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1512, height: 840, overflow: 'hidden', background: 'linear-gradient(90deg, #fbfbfb 15.34%, #f6f6f7 15.34%)', transformOrigin: '0 0',
          transform: 'matrix3d(0.54565761,-0.024282346,0,-3.3982258e-05,-0.0016167954,0.57044589,0,-1.3406263e-06,0,0,1,0,319,253,0,1)' }}>
          <div style={{ width: 1512, height: 738 }}>
            <Suspense fallback={null}><ServersDemo /></Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Cisco() {
  return (
    <div style={{ background: LIGHT, color: INK, fontFamily: F, minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div style={{ padding: 12 }}>
        <div className="hero-panel" style={{ position: 'relative', zIndex: 2, borderRadius: 28, overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#a1c2e4' }} />
          <Header minimal />
          {/* one picture: the copy down the left, the product on a monitor running off the right and the foot */}
          <div className="hero-stage">
            <section className="hero-copy">
              <p style={{ display: 'inline-flex', alignItems: 'center', gap: 17, fontFamily: F, fontSize: 17, fontWeight: 500, letterSpacing: '0.02em', margin: 0 }}>
                <span role="img" aria-label="Cisco" style={{ display: 'block', height: 40, aspectRatio: '114 / 72', background: 'currentColor', WebkitMask: 'url(/cisco-ui/cisco-logo.svg) center / contain no-repeat', mask: 'url(/cisco-ui/cisco-logo.svg) center / contain no-repeat' }} />
                <span aria-hidden style={{ width: 1, height: 25, background: 'currentColor', opacity: 0.4 }} />
                <a href="https://www.cisco.com/site/us/en/products/computing/hybrid-cloud-operations/intersight-platform/index.html" target="_blank" rel="noreferrer" className="hero-link"
                  style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Intersight
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                </a>
              </p>
              <h1 className="hero-title" style={{ fontFamily: F, fontWeight: 500, letterSpacing: '-0.04em', color: '#fff', margin: 0 }}>
                <span className="hero-l1">From a page title to an adaptive, </span><span className="hero-l2"><span style={{ whiteSpace: 'nowrap' }}>AI-powered</span> operational solution</span>
              </h1>
            </section>
            <div className="hero-shot" aria-hidden><MonitorShot /></div>
            <style>{`
              .hero-link{transition:opacity .2s}.hero-link:hover{opacity:.7}
              .hero-stage{position:relative;z-index:1}
              .hero-copy{position:relative;z-index:2;display:flex;flex-direction:column;gap:14px;padding:4px 20px 0}
              .hero-copy>p{color:rgba(255,255,255,.9)}
              .hero-title{font-size:clamp(30px,8.4vw,44px);line-height:1.06;text-wrap:balance}
              .shot-img{position:relative;aspect-ratio:1040 / 1000;margin-top:-17%;overflow:hidden}
              @media (min-width:640px){
                .hero-panel{container-type:inline-size}
                .hero-stage{--sw:clamp(60cqw,calc((100vh - 110px) * 1.7376),100cqw);--ox:calc((100cqw - var(--sw)) / 2);background:linear-gradient(180deg, #a1c2e4 0.0%, #abc9e8 12.5%, #b7d2ed 25.0%, #c3d9f1 37.5%, #cddff2 50.1%, #d8e6f5 62.5%, #e3ecf8 75.0%, #eaf0f8 87.5%, #eaf1f7 100.0%)}
                .hero-copy{position:absolute;inset:0;display:block;padding:0;pointer-events:none}
                .hero-copy>p{position:absolute;left:3.6cqw;bottom:calc(var(--sw) * .03);pointer-events:auto;color:#3b4658}
                .hero-title{position:absolute;inset:0;padding:0 0 0 3.6cqw;font-size:calc(var(--sw) * .044);line-height:1;text-wrap:nowrap;clip-path:polygon(evenodd, 0 0, 100cqw 0, 100cqw 100cqw, 0 100cqw, 0 0, calc(var(--ox) + var(--sw) * 0.19954) calc(var(--sw) * 0.24023), calc(var(--ox) + var(--sw) * 0.19954) calc(var(--sw) * 0.09115), calc(var(--ox) + var(--sw) * 0.20117) calc(var(--sw) * 0.08952), calc(var(--ox) + var(--sw) * 0.79102) calc(var(--sw) * 0.07227), calc(var(--ox) + var(--sw) * 0.80273) calc(var(--sw) * 0.07878), calc(var(--ox) + var(--sw) * 0.80273) calc(var(--sw) * 0.24023), calc(var(--ox) + var(--sw) * 0.19954) calc(var(--sw) * 0.24023))}
                .hero-l1,.hero-l2{display:block}
                .hero-l2{opacity:.74}
                .shot-img{width:var(--sw);margin:0 auto;aspect-ratio:1536 / 884;-webkit-mask:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
              }
            `}</style>
          </div>
        </div>
      </div>

      <div style={{ background: LIGHT, color: INK }}>
      {/* ── OVERVIEW ─────────────────────────────────────── */}
      <section style={{ ...WIDE, paddingTop: GAP, paddingBottom: GAP }}>
        <div>
          <p style={{ ...STATEMENT, fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.25, margin: 0 }}>
            On Cisco's UCS Compute team, I led UX for Intersight's AI-powered Object Header, turning static metadata into a reusable pattern that connects health signals, contextual insights, and recommended actions across compute objects.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '28px 32px', marginTop: HEAD }}>
            {[
              ['Project Type', 'Enterprise SaaS'],
              ['Company',      'Cisco'],
              ['Industry',     'Cloud Infrastructure'],
              ['Year',         '2026'],
              ['Role',         'UX Design Intern'],
              ['Focus',        'IA · AI Interaction'],
            ].map(([k, v]) => (
              <div key={k}>
                <p style={{ fontFamily: F, fontSize: 11, color: SUB, margin: 0, paddingBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{k}</p>
                <p style={{ fontFamily: F, fontSize: 15, color: INK, margin: '12px 0 0' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AT A GLANCE ──────────────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="At a glance" title="From scattered signals to one place to act."
          sub="The same critical moment, before and after." />
        <BeforeAfter />
      </section>

      {/* ── WHAT IS INTERSIGHT ──────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="What is Intersight?" lead="Cisco's cloud console for running infrastructure. One place for IT teams to manage, monitor, and update"
          title="hundreds of servers." />
        <div style={WIDE}>
          <IntersightBento />
        </div>
      </section>

      {/* ── PROBLEM: one soft grainy panel, heading inside, three white cards with real frames of the old flow ── */}
      <div style={{ padding: '0 12px', marginBottom: GAP }}>
        <section style={{ position: 'relative', isolation: 'isolate', overflow: 'hidden', borderRadius: 28, padding: 'clamp(28px, min(6vw, 5.5vh), 96px) 0',
          background: 'linear-gradient(180deg, #f7f9fc 0%, #e6edf7 52%, #d2e0f3 100%)' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, opacity: 0.3, mixBlendMode: 'multiply', backgroundImage: NOISE, pointerEvents: 'none' }} />
          <ChapterHead eyebrow="The Problem" lead="Imagine you're responsible for hundreds of servers, and"
            title="one goes critical." sub="Where do you even start?" />
          <div style={WIDE}>
            <style>{'.prob{display:grid;gap:12px;grid-template-columns:minmax(0,1fr)}@media(min-width:800px){.prob{grid-template-columns:repeat(3,minmax(0,1fr))}}'}</style>
            <div className="prob">
              {[
                { t: 'Context is scattered across pages.', d: 'Status sits in the header, context in Events, and actions in another tab. Users have to piece it together themselves.', alt: 'The old server page: banners at the top, an alarms popover, and events in a separate panel' },
                { t: 'The next step is hidden.', d: 'Actions like Remove or Run Diagnostics sit behind menus. Users only find them after they have figured out the problem on their own.', alt: 'The old Actions menu, opened to System and a long nested list where Remove sits' },
                { t: 'Every issue restarts the hunt.', d: 'For every similar issue, users navigate, cross-reference, and decide all over again, even though the system already has the answer.', alt: 'The old server page after seven clicks, back where it started' },
              ].map(({ t, d, alt }, k) => (
                <div key={t} style={{ background: '#ffffff', borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#f1f2f4' }}>
                    <img src={`/cisco-ui/problem-${k + 1}.webp`} alt={alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ padding: 'clamp(18px, 2vw, 28px)' }}>
                    <h3 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(18px, 1.7vw, 22px)', lineHeight: 1.2, letterSpacing: '-0.02em', color: INK, margin: '0 0 10px' }}>{t}</h3>
                    <p style={{ fontFamily: F, fontSize: 14, lineHeight: 1.55, color: SUB, margin: 0 }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── THE SOLUTION ─────────────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="The Solution"
          title="Understand the context."
          sub="Act on it. Then scale it across every server."
          body="Follow one server from the moment it goes critical. Each level builds on the last." />
        <div style={WIDE}><SolutionMap /></div>
        <div style={{ ...WIDE, display: 'grid', gap: GAP, marginTop: GAP }}>
          {[
            { n: 'Understand', title: 'Generate contextual insights from what the server is doing', body: 'When a user opens a server, the system reads its context and current condition and writes an Overview of what is happening and what needs attention.', src: '/cisco-ui/solution-01.mov' },
            { n: 'Act', title: 'Turn every insight into a clear next step', body: 'Different conditions lead to different insights, and each one links to a relevant action through the Insight-to-Action card. The user always decides whether to run it.', src: '/cisco-ui/solution-02.mov' },
            { n: 'Scale', title: 'Resolve the same issue across many servers in one decision', body: 'Instead of inspecting servers one at a time, users find related servers that share a condition and act on them together.', src: '/cisco-ui/solution-03.mov' },
          ].map((st, i) => <SolutionRow key={st.n} n={`0${i + 1}  ${st.n}`} lines={[st.title]} body={st.body} src={st.src} bg={`flow-${i + 1}`} />)}
        </div>
      </section>

      {/* ── ANATOMY: exploded header ── */}
      <FluidPanel>
        <ChapterHead eyebrow="How it's built" lead="One header, four parts." title="Each answers a question an operator asks." />
        <ExplodedHeader />
      </FluidPanel>

      {/* ── INSIDE THE CARD ───────────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Inside the card" lead="Every insight follows the same shape, so an operator can" title="read any card in seconds." />
        <CardFeatures />
      </section>

      {/* ── CARD STATES: its own white panel, so it reads as a separate chapter ── */}
      <FluidPanel style={{ background: '#ffffff' }}>
        <ChapterHead eyebrow="Card states" title="It always shows what it's doing." />
        <CardFeatures part="states" />
      </FluidPanel>

      {/* ── DESIGNING THE AI ─────────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Designing the AI" title="I designed what the AI says," sub="not just where it appears." />
        <Stage>
          <Pipeline />
        </Stage>
        <div style={WIDE}>
          <P style={{ maxWidth: 760, margin: `${HEAD} 0 0` }}>
            The model only writes the words. What it notices, how it ranks them and the shape its answer takes were all design decisions, tested against live Intersight data.{' '}
            <span>Once it worked on real servers, every stakeholder conversation after that was different.</span>
          </P>
        </div>
      </section>

      {/* ── VALIDATION: the quote, the headline number, then the proof ── */}
      <section style={{ paddingBottom: GAP }}>
        <div style={WIDE}>
          <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', color: SUB, margin: '0 0 20px' }}>Validation</p>
          <style>{`.val{display:grid;gap:14px;grid-template-columns:minmax(0,1fr)}
            @media(min-width:900px){.val{grid-template-columns:repeat(12,minmax(0,1fr));grid-template-rows:minmax(0,0.8fr) minmax(0,1.2fr);height:clamp(420px,calc(100vh - 140px),600px)}
              .val-quote{grid-column:1 / span 6;grid-row:1 / span 2}.val-hero{grid-column:7 / span 3;grid-row:1 / span 2}.val-a{grid-column:10 / span 3;grid-row:1}.val-b{grid-column:10 / span 3;grid-row:2}}`}</style>
          <div className="val">
            <figure className="val-quote" style={{ ...VAL_CARD, margin: 0, padding: 'clamp(24px, 2.6vw, 40px)' }}>
              <svg aria-hidden width="30" height="24" viewBox="0 0 36 28" fill={FADE}><path d="M0 28V16.4C0 7.3 4.8 1.6 13.4 0l1.6 3.6C10.6 5 8.2 8 8 12h6.6v16zm20 0V16.4C20 7.3 24.8 1.6 33.4 0L35 3.6C30.6 5 28.2 8 28 12h6.6v16z" /></svg>
              <blockquote style={{ ...DISPLAY, fontSize: 'clamp(20px, min(2.3vw, 3.9vh), 34px)', lineHeight: 1.18, color: INK, margin: 0 }}>
                Intersight has many things going on. This helps focus attention and makes issue-heavy moments more efficient.
              </blockquote>
              <figcaption style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src="/cisco-ui/kevin.png" alt="Kevin Wollenweber" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                <div>
                  <p style={{ fontFamily: F, fontSize: 15, fontWeight: 500, color: INK, margin: 0 }}>Kevin Wollenweber</p>
                  <p style={{ fontFamily: F, fontSize: 13, color: SUB, margin: '2px 0 0' }}>SVP, Cisco</p>
                </div>
              </figcaption>
            </figure>
            <div className="val-hero" style={{ ...VAL_CARD, position: 'relative', isolation: 'isolate', overflow: 'hidden', boxShadow: 'none', color: '#fff', backgroundColor: '#16233a' }}>
              <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, backgroundImage: 'url(/cisco-ui/wash-deep.webp)', backgroundSize: 'cover', backgroundPosition: 'center bottom', filter: 'saturate(0.8)' }} />
              <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, opacity: 0.35, mixBlendMode: 'overlay', backgroundImage: NOISE }} />
              <p style={{ ...VAL_NUM, fontSize: 'clamp(56px, min(6.6vw, 13vh), 104px)', color: '#fff' }}><CountUp to={58} suffix="%" /></p>
              <div>
                <p style={{ fontFamily: F, fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em', margin: '0 0 6px' }}>faster task completion</p>
                <p style={{ fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.72)', margin: 0 }}>Across 5 comparative usability tests</p>
              </div>
            </div>
            <div className="val-a" style={{ ...VAL_CARD, justifyContent: 'center', gap: 0, paddingTop: 0, paddingBottom: 0 }}>
              {[[94, 'power users'], [3, 'focus groups']].map(([n, t], k) => (
                <div key={t} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderTop: k ? '1px solid #eef0f3' : 'none' }}>
                  <p style={{ ...VAL_NUM, fontSize: 'clamp(32px, min(3.2vw, 6vh), 48px)', lineHeight: 1 }}><CountUp to={n} /></p>
                  <p style={{ fontFamily: F, fontSize: 15, fontWeight: 500, color: INK, margin: 0, whiteSpace: 'nowrap' }}>{t}</p>
                </div>
              ))}
            </div>
            <div className="val-b" style={VAL_CARD}>
              <p style={{ fontFamily: F, fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', color: SUB, margin: 0 }}>Outcome</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                {['Engineering-ready design', 'VP and SVP buy-in', 'On the product roadmap'].map(t => (
                  <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: F, fontSize: 14, lineHeight: 1.3, fontWeight: 500, letterSpacing: '-0.01em', color: INK }}>
                    <span aria-hidden style={{ flex: 'none', width: 18, height: 18, borderRadius: '50%', background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 10.5l3.4 3.4L15 7" /></svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── REFLECTION ───────────────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Reflection" lead="The hard part isn't adding AI." title="It's deciding what it should say, and when." />
        <div style={WIDE}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px 32px' }}>
            {[
              ['Make ambiguity testable', 'Prototypes turned open questions into things the team could react to.'],
              ['Collaborate across roles', 'PM and engineering surfaced problems design alone couldn\'t solve.'],
              ['Real data persuades', 'Live data moved the question from "could this work?" to "it works."'],
            ].map(([t, d]) => (
              <div key={t}>
                <p style={{ fontFamily: F, fontSize: 20, fontWeight: 500, color: INK, margin: '0 0 12px', letterSpacing: '-0.01em' }}>{t}</p>
                <P>{d}</P>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...WIDE, marginTop: BLOCK }}>
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

      <ContactCTA />

      <FooterNav />

      </div>
    </div>
  )
}
