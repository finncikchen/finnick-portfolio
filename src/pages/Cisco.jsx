import { FooterNav } from '../components/CaseKit'
import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'

const ACCENT = '#00bceb'
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
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`
const MESH_HERO = 'radial-gradient(ellipse 60% 55% at 12% 8%, rgba(214,222,240,0.9) 0%, transparent 65%), radial-gradient(ellipse 55% 60% at 90% 20%, rgba(178,176,214,0.75) 0%, transparent 65%), radial-gradient(ellipse 80% 55% at 45% 100%, rgba(160,196,222,0.85) 0%, transparent 70%), linear-gradient(170deg, #8f9bbd 0%, #7d8db3 45%, #93a9c6 100%)'
const W = { maxWidth: 960, margin: '0 auto', padding: '0 clamp(24px, 12vw, 240px)', boxSizing: 'content-box' }

function P({ children, style }) {
  return (
    <p style={{ fontFamily: F, fontWeight: 400, fontSize: 17, lineHeight: '27px', color: SUB, margin: 0, ...style }}>
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

const WIDE = { maxWidth: 1080, margin: '0 auto', padding: '0 clamp(24px, 12vw, 240px)', boxSizing: 'content-box' }
const H2 = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(28px, 3.2vw, 44px)', lineHeight: 1.12, letterSpacing: '-0.035em', color: INK, margin: 0 }
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
    { n: '01', icon: 'signal', t: 'Rank the signals', d: 'I mapped which server signals earn a place in the header, and in what order, so critical issues always come first.',
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
    { n: '04', icon: 'spark', t: 'Shape the output', d: 'Gemini/Circuit writes the insight, and it lands in the card’s strict shape: a short title, two lines, one action.',
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

function Tile({ title, sub, span, children }) {
  return (
    <div className={span} style={{ borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 254, background: '#ffffff' }}>
      <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(22px, 2vw, 26px)', lineHeight: 1.2, letterSpacing: '-0.02em', color: INK, margin: 0, padding: '28px 28px 0', maxWidth: 380 }}>
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
      <span style={{ fontWeight: 500, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
      <span className="bento-loc" style={{ color: SUB, width: 70 }}>{loc}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: SUB, marginBottom: 4 }}><span>Servers</span><span>1,519 total</span></div>
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

const DISPLAY = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(28px, 3.2vw, 44px)', lineHeight: 1.12, letterSpacing: '-0.025em', margin: '0 auto', maxWidth: 1040, textWrap: 'balance' }

// Heading = gray context + one black key message. Pass `lead` (gray, before), `title` (black), `sub` (gray, after).
function ChapterHead({ eyebrow, lead, title, sub, body }) {
  const GRAY = '#a1a1a6'
  const n = t => (t ? t.split(' ').length : 0)
  return (
    <div style={{ ...WIDE, textAlign: 'center', marginBottom: HEAD }}>
      <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', color: SUB, margin: '0 0 20px' }}>{eyebrow}</p>
      <h2 style={{ ...DISPLAY, color: INK }}>
        {lead && <><span style={{ color: GRAY }}><Stream text={lead} /></span>{' '}</>}
        <Stream text={title} delay={n(lead) * 0.045} />
        {sub && <>{' '}<span style={{ color: GRAY }}><Stream text={sub} delay={(n(lead) + n(title)) * 0.045} /></span></>}
      </h2>
      {body && <p style={{ fontFamily: F, fontSize: 17, lineHeight: 1.5, color: SUB, maxWidth: 640, margin: '28px auto 0' }}>{body}</p>}
    </div>
  )
}

// Product screens scale up into place as they scroll into view (Apple-style), scrubbed by scroll.
function Lift({ children, from = 0.86, style }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect(), vh = innerHeight
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)))
      const e = 1 - Math.pow(1 - p, 3)
      el.style.transform = `scale(${from + (1 - from) * e})`
      el.style.opacity = String(0.35 + 0.65 * e)
    }) }
    on(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', on); removeEventListener('resize', on) }
  }, [from])
  return <div ref={ref} style={{ transformOrigin: '50% 0%', willChange: 'transform', ...style }}>{children}</div>
}

const SCREEN_SHADOW = '0 2px 6px rgba(0,0,0,0.06), 0 30px 80px rgba(0,0,0,0.14)'

function Stage({ children }) {
  return (
    <div style={WIDE}>
      <div>{children}</div>
    </div>
  )
}

function SolutionRow({ n, lines, body, src }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', color: SUB, margin: '0 0 16px' }}>{n.replace(/^\d+\s+/, '')}</p>
      <h3 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(22px, 2vw, 26px)', lineHeight: 1.15, letterSpacing: '-0.025em', color: INK, margin: '0 auto', maxWidth: 820, textWrap: 'balance' }}>
        {lines.join(' ')}
      </h3>
      <p style={{ fontFamily: F, fontSize: 17, lineHeight: 1.55, color: SUB, maxWidth: 600, margin: '20px auto ' + HEAD }}>{body}</p>
      <Lift>
        <video src={src} autoPlay loop muted playsInline
          style={{ width: '100%', maxWidth: 1120, height: 'auto', display: 'block', margin: '0 auto', borderRadius: 14, boxShadow: SCREEN_SHADOW }} />
      </Lift>
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

// ── Scroll story: one sticky screen, the copy steps through Understand → Act → Scale ──
function SolutionStory({ steps }) {
  const ref = useRef(null)
  const p = useProgress(ref, 1)
  const raw = Math.min(0.999, Math.max(0, (p - 0.18) / 0.62))
  const idx = Math.floor(raw * steps.length)
  return (
    <div ref={ref} className="story" style={{ height: `${steps.length * 90 + 40}vh`, position: 'relative' }}>
      <style>{`.story-in{position:sticky;top:0;height:100vh;display:grid;grid-template-columns:minmax(260px,0.8fr) minmax(0,1.7fr);gap:clamp(32px,5vw,80px);align-items:center}
        @media(max-width:900px){.story{height:auto!important}.story-in{position:static;height:auto;grid-template-columns:1fr}.story-desk{display:none}}
        @media(min-width:901px){.story-mob{display:none!important}}.story-mob{display:grid;gap:clamp(72px,10vw,120px)}`}</style>
      <div className="story-in" style={WIDE}>
        <div className="story-desk" style={{ position: 'relative', minHeight: 300 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
              opacity: i === idx ? 1 : 0, transform: `translateY(${(i - idx) * 18}px)`, transition: 'opacity .5s ease, transform .6s cubic-bezier(.2,.7,.2,1)' }}>
              <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: SUB, margin: '0 0 16px' }}>{s.n}</p>
              <h3 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(22px, 2vw, 26px)', lineHeight: 1.15, letterSpacing: '-0.025em', color: INK, margin: '0 0 20px', textWrap: 'balance' }}>{s.title}</h3>
              <p style={{ fontFamily: F, fontSize: 17, lineHeight: 1.55, color: SUB, margin: 0, maxWidth: 400 }}>{s.body}</p>
            </div>
          ))}
          <div style={{ position: 'absolute', left: 0, bottom: -56, display: 'flex', gap: 8 }}>
            {steps.map((s, i) => <span key={s.n} style={{ width: i === idx ? 28 : 8, height: 8, borderRadius: 8, background: i === idx ? INK : 'rgba(0,0,0,0.15)', transition: 'width .4s ease, background .4s ease' }} />)}
          </div>
        </div>
        <div className="story-desk" style={{ position: 'relative', aspectRatio: '16 / 10' }}>
          {steps.map((s, i) => (
            <video key={s.src} src={s.src} autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
              borderRadius: 14, boxShadow: SCREEN_SHADOW, background: '#fff',
              opacity: i === idx ? 1 : 0, transform: `scale(${i === idx ? 1 : 0.96})`, transition: 'opacity .6s ease, transform .8s cubic-bezier(.2,.7,.2,1)' }} />
          ))}
        </div>
        <div className="story-mob">
          {steps.map(s => <SolutionRow key={s.n} n={s.n} lines={[s.title]} body={s.body} src={s.src} />)}
        </div>
      </div>
    </div>
  )
}


/* ── Insight-to-action card: annotated anatomy + its four states ─────────── */
// Anchor boxes are measured from the rendered card (fractions of state-ready.webp).
const FEAT_H = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(22px, 2vw, 26px)', lineHeight: 1.2, letterSpacing: '-0.02em', color: INK, margin: '0 0 16px' }
function CardFeatures() {
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
      <CardDiagram rules={rules} />
      <div style={{ marginTop: BLOCK }}>
        <h3 style={{ ...FEAT_H, textAlign: 'center', margin: '0 auto ' + HEAD, maxWidth: 720 }}>It always shows what it's doing.</h3>
        <StateFlow states={states} />
      </div>
    </div>
  )
}

// ── Before / After: one frame, a toggle that auto-advances when each film ends, and results that resolve on view ──
const BA = [
  { k: 'Before', src: '/cisco-ui/before-hunt.mp4', line: 'Seven clicks across banners, alarms, tabs and nested menus.',
    alt: 'Before: reading a banner, opening alarms, switching tabs, then Actions, System and a long submenu to find Remove, seven clicks in all' },
  { k: 'After', src: '/cisco-ui/insight-to-action.mp4', line: 'One card explains the problem and offers the fix.',
    alt: 'After: switching to the Critical tab, zooming into the Power Supply 1 insight card, and running its Turn on Locator LED action' },
]
const RESULTS = [['6+', '0', 'clicks to reach the next step'], ['4', '1', 'places to look for context'], ['3–10 min', '<1 min', 'to find what matters']]
function BeforeAfter() {
  const MASK = 'linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 8%, #000 92%, transparent 100%)'
  const film = { width: '100%', display: 'block', aspectRatio: '16 / 9', WebkitMaskImage: MASK, maskImage: MASK, WebkitMaskComposite: 'source-in', maskComposite: 'intersect' }
  const tag = (txt, strong) => <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', color: strong ? INK : SUB, margin: '0 0 6px' }}>{txt}</p>
  const [before, after] = BA
  return (
    <div style={WIDE}>
      <style>{`.ba-low{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(32px,5vw,72px);align-items:center;margin-top:${BLOCK}}
        @media(max-width:860px){.ba-low{grid-template-columns:1fr}}`}</style>
      {/* After leads, full width */}
      <div style={{ textAlign: 'center' }}>
        {tag('After · Insight to Action', true)}
        <p style={{ fontFamily: F, fontSize: 17, color: SUB, margin: '0 0 8px' }}>{after.line}</p>
      </div>
      <Lift><video src={after.src} autoPlay muted loop playsInline preload="metadata" aria-label={after.alt} style={film} /></Lift>
      {/* Before as a smaller reference, beside the results */}
      <div className="ba-low">
        <div>
          {tag('Before · the original header')}
          <p style={{ fontFamily: F, fontSize: 17, color: SUB, margin: '0 0 4px' }}>{before.line}</p>
          <video src={before.src} autoPlay muted loop playsInline preload="metadata" aria-label={before.alt} style={{ ...film, opacity: 0.85, filter: 'saturate(0.6)' }} />
        </div>
        <div style={{ display: 'grid', gap: 'clamp(28px, 3vw, 40px)' }}>
          {RESULTS.map(([from, , t]) => (
            <div key={t}>
              <p style={{ fontFamily: F, fontSize: 'clamp(36px, 3.6vw, 48px)', fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 1, color: INK, margin: '0 0 8px' }}>{from}</p>
              <p style={{ fontFamily: F, fontSize: 17, color: SUB, margin: 0 }}>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// One card that steps through its four states; a rail below shows where it is and fills as each state plays.
function StateFlow({ states }) {
  const [i, setI] = useState(0)
  const [t, setT] = useState(0)
  const DUR = 3200
  useEffect(() => {
    let raf, start = performance.now()
    const tick = now => {
      const e = now - start
      if (e >= DUR) { start = now; setI(x => (x + 1) % states.length); setT(0) } else setT(e / DUR)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf)
  }, [i, states.length])
  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ position: 'relative', aspectRatio: '1294 / 456' }}>
        {states.map(([k, tt], j) => (
          <video key={k} src={`/cisco-ui/state-${k}.mp4`} poster={`/cisco-ui/state-${k}.webp`} autoPlay muted loop playsInline preload="metadata"
            aria-label={`Insight card, ${tt.toLowerCase()} state`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 18, boxShadow: SCREEN_SHADOW,
              opacity: j === i ? 1 : 0, transform: `translateY(${j === i ? 0 : 8}px) scale(${j === i ? 1 : 0.985})`, transition: 'opacity .5s ease, transform .7s cubic-bezier(.2,.7,.2,1)' }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${states.length}, minmax(0, 1fr))`, gap: 20, alignItems: 'start', marginTop: 'clamp(40px, 4vw, 56px)' }}>
        {states.map(([k, tt, d], j) => (
          <div key={k} role="button" tabIndex={0} onClick={() => setI(j)} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setI(j)} style={{ cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ display: 'block', height: 2, borderRadius: 2, background: 'rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: 16 }}>
              <span style={{ display: 'block', height: '100%', background: INK, transformOrigin: '0 50%', transform: `scaleX(${j < i ? 1 : j === i ? t : 0})` }} />
            </span>
            <span style={{ display: 'block', fontFamily: F, fontSize: 17, fontWeight: 500, color: j === i ? INK : SUB, marginBottom: 6, transition: 'color .3s' }}>{tt}</span>
            <span className="sf-d" style={{ display: 'block', fontFamily: F, fontSize: 15, lineHeight: 1.5, color: SUB, opacity: j === i ? 1 : 0.55, transition: 'opacity .3s' }}>{d}</span>
          </div>
        ))}
      </div>
      <style>{'@media(max-width:700px){.sf-d{display:none!important}}'}</style>
    </div>
  )
}

// Logic diagram: server signals merge into the AI, which writes the card; each part of the card is annotated;
// the action runs on the server and the result loops back into the same card.
function CardDiagram({ rules }) {
  const C = { x: 350, y: 150, w: 500, h: 176 }
  const at = (fx, fy) => [C.x + C.w * fx, C.y + C.h * fy]
  const cy = C.y + C.h / 2
  const LINE = '#b4bccb', ACC = '#2563eb'
  const inputs = [['Server telemetry', 'Power, thermals, links', 'M4 12h3l2-5 4 10 2-5h5'], ['Active alarms', 'Severity and age', 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20h4'], ['Priority rules', 'What earns a place', 'M5 7h14M5 12h10M5 17h6']]
  const ann = [{ p: at(0.64, 0.205), y: at(0, 0.205)[1] }, { p: at(0.93, 0.42), y: at(0, 0.42)[1] + 14 }, { p: at(0.28, 0.9), y: C.y + C.h + 56, down: true }]
  const node = { fill: '#fff', stroke: 'rgba(15,23,42,0.08)' }
  return (
    <div style={{ fontFamily: F }}>
      <style>{`.cd-svg{display:block}.cd-list{display:none}@media(max-width:760px){.cd-svg{display:none}.cd-list{display:grid}}
        @keyframes cdFlow{to{stroke-dashoffset:-20}}.cd-flow{stroke-dasharray:4 6;animation:cdFlow 1.2s linear infinite}
        @media(prefers-reduced-motion:reduce){.cd-flow{animation:none}}`}</style>
      <svg className="cd-svg" viewBox="0 0 1160 500" width="100%" role="img"
        aria-label="Server telemetry, active alarms and priority rules feed the AI, which writes the insight card. The card's title, explanation and next step are annotated. The action runs on the server and the result returns to the same card.">
        <defs>
          <pattern id="cd-dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(15,23,42,0.07)" /></pattern>
          <marker id="cd-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1 L8 5 L1 9" fill="none" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" /></marker>
          <filter id="cd-sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#0f172a" floodOpacity="0.08" /></filter>
        </defs>
        <rect x="0" y="0" width="1160" height="500" rx="24" fill="url(#cd-dots)" />

        {/* inputs */}
        <text x="40" y="106" fontSize="12" letterSpacing="0.06em" fill={SUB}>SIGNALS</text>
        {inputs.map(([t, d, icon], i) => {
          const y = cy - 104 + i * 74
          return (
            <g key={t}>
              <rect x="40" y={y} width="210" height="60" rx="12" {...node} filter="url(#cd-sh)" />
              <rect x="54" y={y + 16} width="28" height="28" rx="8" fill="#eef2f8" />
              <path d={icon} transform={`translate(${56} ${y + 18}) scale(1)`} fill="none" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <text x="94" y={y + 27} fontSize="14" fontWeight="600" fill={INK}>{t}</text>
              <text x="94" y={y + 45} fontSize="12" fill={SUB}>{d}</text>
              <path className="cd-flow" d={`M250 ${y + 30} C 282 ${y + 30}, 282 ${cy}, 300 ${cy}`} fill="none" stroke={LINE} strokeWidth="1.4" />
            </g>
          )
        })}
        {/* AI merge node */}
        <circle cx="312" cy={cy} r="13" fill="#fff" stroke="rgba(37,99,235,0.35)" />
        <circle cx="312" cy={cy} r="5" fill={ACC} />
        <text x="312" y={cy + 32} fontSize="11" fill={SUB} textAnchor="middle">AI</text>
        <path d={`M326 ${cy} H ${C.x - 6}`} fill="none" stroke={LINE} strokeWidth="1.4" markerEnd="url(#cd-ar)" />

        {/* the card */}
        <image href="/cisco-ui/state-ready.webp" x={C.x} y={C.y} width={C.w} height={C.h} filter="url(#cd-sh)" />

        {/* annotations */}
        <text x="872" y="106" fontSize="12" letterSpacing="0.06em" fill={SUB}>WHAT THE OPERATOR READS</text>
        {ann.map(({ p: [px, py], y, down }, i) => (
          <g key={i}>
            <path d={down ? `M${px} ${py} V ${y} H 870` : `M${px} ${py} H 852 ${y !== py ? `Q 860 ${py} 860 ${py + Math.sign(y - py) * 8} V ${y - Math.sign(y - py) * 8} Q 860 ${y} 868 ${y}` : ''} H 870`}
              fill="none" stroke={LINE} strokeWidth="1.2" strokeDasharray="2 4" strokeLinecap="round" />
            <circle cx={px} cy={py} r="4" fill="#fff" stroke={ACC} strokeWidth="2" />
            <circle cx="884" cy={y} r="11" fill={INK} />
            <text x="884" y={y + 4} fontSize="11" fontWeight="600" fill="#fff" textAnchor="middle">{i + 1}</text>
            <text x="904" y={y + 1} fontSize="15" fontWeight="600" fill={INK}>{rules[i][0]}</text>
            <text x="904" y={y + 20} fontSize="12.5" fill={SUB}>{rules[i][1]}</text>
          </g>
        ))}

        {/* action -> server -> result loop */}
        <path d={`M${at(0.04, 0)[0]} ${C.y + C.h + 6} V 438`} fill="none" stroke={LINE} strokeWidth="1.4" markerEnd="url(#cd-ar)" />
        <rect x={at(0.04, 0)[0] - 24} y="444" width="270" height="40" rx="20" {...node} filter="url(#cd-sh)" />
        <circle cx={at(0.04, 0)[0] - 4} cy="464" r="8" fill="#e8f7ee" />
        <path d={`M${at(0.04, 0)[0] - 8} 464 l3 3 l5 -6`} fill="none" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <text x={at(0.04, 0)[0] + 12} y="469" fontSize="13" fontWeight="500" fill={INK}>Runs on the server, result returns</text>
        <path className="cd-flow" d={`M${at(0.2, 0)[0]} 444 V ${C.y + C.h + 8}`} fill="none" stroke="rgba(37,99,235,0.45)" strokeWidth="1.4" markerEnd="url(#cd-ar)" />
      </svg>
      <div className="cd-list" style={{ gap: 24 }}>
        <img src="/cisco-ui/state-ready.webp" alt="An insight card: title, explanation and next step" style={{ width: '100%', borderRadius: 16, boxShadow: SCREEN_SHADOW }} />
        {rules.map(([t, d]) => <div key={t}><p style={{ fontSize: 18, fontWeight: 500, color: INK, margin: '0 0 4px' }}>{t}</p><p style={{ fontSize: 16, color: SUB, margin: 0 }}>{d}</p></div>)}
      </div>
    </div>
  )
}

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
      <section style={{ ...WIDE, paddingTop: GAP, paddingBottom: GAP }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ ...STATEMENT, fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.22, maxWidth: 1000, margin: '0 auto', textWrap: 'balance' }}>
            <span style={{ color: FADE }}>On Cisco's UCS Compute team, I led a project that turned the Intersight server header from static metadata into</span>{' '}
            an adaptive layer that surfaces priority signals, AI insights, and next actions{' '}
            <span style={{ color: FADE }}>in one place.</span>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '28px 32px', marginTop: HEAD, textAlign: 'left' }}>
            {[
              ['Project Type', 'Enterprise SaaS'],
              ['Company',      'Cisco'],
              ['Industry',     'Cloud Infrastructure'],
              ['Year',         '2026'],
              ['Role',         'Product Design Intern'],
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

      {/* ── PROBLEM ──────────────────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="The Problem" lead="Imagine you're responsible for hundreds of servers, and"
          title="one goes critical." sub="Where do you even start?" />
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
                  <P>{d}</P>
                </div>
              </div>
            ))}
          </div>
        </Stage>
      </section>

      {/* ── THE SOLUTION ─────────────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="The Solution"
          title="Understand the context."
          sub="Act on it. Then scale it across every server."
          body="Follow one server from the moment it goes critical. Each level builds on the last." />
      </section>

      {/* ── SOLUTION: scroll story ── */}
      <section style={{ paddingBottom: GAP }}>
        <SolutionStory steps={[
          { n: 'Understand', title: 'Generate contextual insights from what the server is doing', body: 'When a user opens a server, the system reads its context and current condition and writes an Overview of what is happening and what needs attention.', src: '/cisco-ui/solution-01.mov' },
          { n: 'Act', title: 'Turn every insight into a clear next step', body: 'Different conditions lead to different insights, and each one links to a relevant action through the Insight-to-Action card. The user always decides whether to run it.', src: '/cisco-ui/solution-02.mov' },
          { n: 'Scale', title: 'Resolve the same issue across many servers in one decision', body: 'Instead of inspecting servers one at a time, users find related servers that share a condition and act on them together.', src: '/cisco-ui/solution-03.mov' },
        ]} />
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

      {/* ── DESIGNING THE AI ─────────────────────────────── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Designing the AI" title="I designed what the AI says," sub="not just where it appears." />
        <Stage>
          <Pipeline />
        </Stage>
        <div style={WIDE}>
          <P style={{ maxWidth: 720, margin: `${HEAD} auto 0`, textAlign: 'center' }}>
            The model only writes the words. What it notices, how it ranks them and the shape its answer takes were all design decisions, tested against live Intersight data.{' '}
            <span>Once it worked on real servers, every stakeholder conversation after that was different.</span>
          </P>
        </div>
      </section>

      {/* ── VALIDATION (dark chapter) ───────────────────── */}
      <FluidPanel>
        <div style={{ ...WIDE, textAlign: 'center' }}>
          <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', color: SUB, margin: '0 0 20px' }}>Validation</p>
          <p style={{ ...DISPLAY, fontSize: 'clamp(24px, 2.6vw, 34px)', lineHeight: 1.15, color: '#a1a1a6' }}>
            “Intersight has many things going on.{' '}
            <span style={{ color: INK }}>This helps focus attention and makes issue-heavy moments more efficient.</span>”
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: 40, textAlign: 'left' }}>
            <img src="/cisco-ui/kevin.png" alt="Kevin Wollenweber" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
            <div>
              <p style={{ fontFamily: F, fontSize: 16, fontWeight: 500, color: INK, margin: 0 }}>Kevin Wollenweber</p>
              <p style={{ fontFamily: F, fontSize: 14, color: SUB, margin: '2px 0 0' }}>SVP, Cisco</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px 32px', marginTop: BLOCK }}>
            {[['3', 'focus groups', 'Team readout session'], ['94', 'power users', 'Tested across server states'], ['5', 'UX speed tests', 'Header vs. baseline navigation']].map(([n, t, sub]) => (
              <div key={t}>
                <p style={{ fontFamily: F, fontWeight: 400, fontSize: 'clamp(36px, 3.6vw, 48px)', letterSpacing: '-0.04em', lineHeight: 1, margin: '0 0 12px', color: INK }}>{n}</p>
                <p style={{ fontFamily: F, fontSize: 16, fontWeight: 500, color: INK, margin: '0 0 4px' }}>{t}</p>
                <p style={{ fontFamily: F, fontSize: 14, color: SUB, margin: 0 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </FluidPanel>

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

      {/* ── CONTACT CTA ──────────────────────────────────── */}
      <section style={{ ...W, paddingBottom: GAP, textAlign: 'center' }}>
        <p style={EYEBROW}>More to the story</p>
        <h2 style={{ ...H2, fontSize: 'clamp(28px, 3.2vw, 44px)', maxWidth: 820, margin: '0 auto 20px' }}>
          Curious about the design process?
        </h2>
        <P style={{ maxWidth: 560, margin: '0 auto 36px' }}>
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

      <FooterNav />

      </div>
    </div>
  )
}
