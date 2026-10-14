import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import { F, W } from '../components/caseTokens'
import homeBg from '../assets/images/home-bg.png'
import booth1 from '../assets/images/about/booth1.webp'
import booth2 from '../assets/images/about/booth2.webp'
import booth3 from '../assets/images/about/booth3.webp'

const INK = '#f2f4f8'
const SUB = 'rgba(255,255,255,0.55)'
const EYEBROW = { fontFamily: F, fontSize: 12, color: SUB, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 16px' }

// Swap in real photo-booth shots here (portrait, roughly 3:4). null shows a placeholder frame.
const PHOTOS = [booth1, booth2, booth3]

const SERIF = "'Instrument Serif', 'Times New Roman', serif"
const EJECT_MS = 2400

function Frame({ src, i, developing }) {
  return (
    <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', background: '#2a2724' }}>
      {src
        ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'none' }} />
        : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(80% 70% at 50% 40%, #6b6862 0%, #33312e 70%)', fontFamily: F, fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)' }}>PHOTO {i + 1}</div>}
      {/* develops from milky paper, frame by frame */}
      <div style={{ position: 'absolute', inset: 0, background: '#ece7dc', opacity: developing ? 1 : 0, transition: developing ? 'none' : `opacity 1.8s ease ${0.3 + i * 0.4}s` }} />
    </div>
  )
}

// A dark arcade-style booth: press SNAP, count down, flash, and a strip drops out of the slot below.
function PhotoBooth() {
  // phase: ready → count → flash → eject → done
  const [phase, setPhase] = useState('ready')
  const [count, setCount] = useState(3)
  const busy = phase !== 'done'

  const snap = useCallback(() => {
    if (busy) return
    setCount(3)
    setPhase('count')
  }, [busy])

  useEffect(() => {
    let t
    if (phase === 'ready') t = setTimeout(() => setPhase('eject'), 500)
    else if (phase === 'count') t = setTimeout(() => (count > 1 ? setCount(c => c - 1) : setPhase('flash')), 650)
    else if (phase === 'flash') t = setTimeout(() => setPhase('eject'), 380)
    else if (phase === 'eject') t = setTimeout(() => setPhase('done'), EJECT_MS)
    return () => clearTimeout(t)
  }, [phase, count])

  const stripOut = phase === 'eject' || phase === 'done'
  const lcd = phase === 'count' ? `${count}…` : phase === 'flash' ? 'Smile!' : phase === 'eject' ? 'Printing' : 'Press'

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        @keyframes pbPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(240,90,70,0.45), inset 0 -3px 4px rgba(0,0,0,0.35), inset 0 2px 2px rgba(255,255,255,0.5) } 50% { box-shadow: 0 0 0 10px rgba(255,80,80,0), inset 0 -3px 4px rgba(0,0,0,0.35), inset 0 2px 2px rgba(255,255,255,0.5) } }
        .pb-snap:active { transform: translateY(2px) }
      `}</style>

      {/* full-screen flash */}
      <div style={{ position: 'fixed', inset: 0, background: '#fff', pointerEvents: 'none', zIndex: 300, opacity: phase === 'flash' ? 0.85 : 0, transition: phase === 'flash' ? 'opacity 60ms' : 'opacity 700ms ease-out' }} />

      {/* soft spotlight on the booth */}
      <div style={{ position: 'absolute', top: -90, left: '50%', width: 560, height: 760, marginLeft: -280, background: 'radial-gradient(ellipse at 50% 40%, rgba(255,226,180,0.07) 0%, rgba(255,226,180,0) 62%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', width: 400 }}>
        {/* lightbox sign */}
        <div style={{ height: 70, borderRadius: '14px 14px 0 0', background: 'linear-gradient(180deg, #232429, #16171a)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)', padding: '9px 12px', boxSizing: 'border-box' }}>
          <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(180deg, #f3ead6, #dccfb2)', boxShadow: '0 0 24px rgba(255,220,160,0.35), inset 0 0 8px rgba(160,120,60,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', lineHeight: 1 }}>
              <span style={{ display: 'block', fontFamily: SERIF, fontSize: 24, letterSpacing: '0.42em', paddingLeft: '0.42em', color: '#2b2118' }}>PHOTOS</span>
              <span style={{ display: 'block', marginTop: 5, fontFamily: F, fontSize: 8, letterSpacing: '0.32em', paddingLeft: '0.32em', color: 'rgba(43,33,24,0.6)' }}>3 POSES · 1 STRIP</span>
            </div>
          </div>
        </div>

        {/* cabinet */}
        <div style={{ display: 'flex', height: 560, background: 'linear-gradient(90deg, #121316 0%, #1d1e22 40%, #18191c 100%)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 60px 90px rgba(0,0,0,0.55)' }}>
          {/* doorway with velvet curtain and warm light inside */}
          <div style={{ position: 'relative', flex: '0 0 176px', margin: '16px 0 0 16px', overflow: 'hidden', borderRadius: '3px 3px 0 0', background: 'linear-gradient(180deg, #3a2a1c, #1b140e)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.6)' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 60, background: 'linear-gradient(180deg, rgba(255,210,150,0) 0%, rgba(255,200,140,0.35) 100%)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 6, background: '#2a2b30', boxShadow: '0 2px 3px rgba(0,0,0,0.6)', zIndex: 1 }} />
            <div style={{ position: 'absolute', left: '58%', bottom: 0, width: 54, height: 70 }}>
              <div style={{ height: 8, borderRadius: 4, background: '#0e0b08' }} />
              <div style={{ position: 'absolute', left: 8, top: 6, width: 4, bottom: 0, background: '#0e0b08' }} />
              <div style={{ position: 'absolute', right: 8, top: 6, width: 4, bottom: 0, background: '#0e0b08' }} />
            </div>
            {/* curtain pulled slightly open: flash leaks through the gap */}
            <div style={{ position: 'absolute', left: 0, top: 4, bottom: 44, width: phase === 'count' || phase === 'flash' ? '100%' : '66%', transition: 'width 0.5s ease', background: 'repeating-linear-gradient(90deg, #1c1d22 0px, #2e2f36 9px, #3a3b43 13px, #24252b 20px, #1c1d22 26px)', boxShadow: '6px 0 14px rgba(0,0,0,0.55)', borderBottomRightRadius: 8 }} />
            <div style={{ position: 'absolute', inset: 0, background: '#fffaf0', opacity: phase === 'flash' ? 0.9 : 0, transition: phase === 'flash' ? 'opacity 60ms' : 'opacity 600ms' }} />
          </div>

          {/* side panel: the strip prints into a lit window, then the button below */}
          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 16px 0' }}>
            <div style={{ position: 'relative', width: 152, height: 476, borderRadius: 5, overflow: 'hidden', background: 'linear-gradient(180deg, #0b0c0e, #16171a)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 10px 18px rgba(0,0,0,0.8)' }}>
              {/* print head slot */}
              <div style={{ position: 'absolute', left: 8, right: 8, top: 0, height: 6, background: '#000', borderRadius: '0 0 3px 3px', boxShadow: '0 2px 4px rgba(0,0,0,0.9)', zIndex: 1 }} />
              <div style={{ position: 'absolute', left: 15, right: 15, top: 6, display: 'flex', flexDirection: 'column', gap: 5, padding: 6, background: '#f7f4ee', boxShadow: '0 8px 16px rgba(0,0,0,0.5)', transform: stripOut ? 'translateY(0)' : 'translateY(-104%)', transition: phase === 'eject' ? `transform ${EJECT_MS}ms cubic-bezier(0.5, 0, 0.25, 1)` : 'none' }}>
                {PHOTOS.map((src, i) => <Frame key={i} src={src} i={i} developing={phase !== 'done'} />)}
              </div>
              {/* glass sheen */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 40%)', pointerEvents: 'none', zIndex: 2 }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
              <button className="pb-snap" onClick={snap} aria-label="Take photos" style={{ width: 42, height: 42, borderRadius: '50%', border: '4px solid #0c0d0f', cursor: busy ? 'default' : 'pointer', background: 'radial-gradient(circle at 35% 30%, #ff9b8c 0%, #c8372a 55%, #8e1d14 100%)', animation: busy ? 'none' : 'pbPulse 2.2s ease-in-out infinite', transition: 'transform 0.08s' }} />
              <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 14, color: '#e6d7b9', minWidth: 52 }}>{lcd}</span>
            </div>
          </div>
        </div>
        {/* plinth */}
        <div style={{ height: 14, margin: '0 -6px', borderRadius: 3, background: 'linear-gradient(180deg, #2a2b30, #0e0f11)' }} />

      </div>
    </div>
  )
}

const NOW = ['HCI @ University of Washington', 'Open to full-time roles', 'Photography on weekends', 'Based in Seattle']

export default function About() {
  const btn = (primary) => ({ fontFamily: F, fontSize: 15, fontWeight: 500, textDecoration: 'none', padding: '13px 24px', borderRadius: 999, color: primary ? '#0b0d12' : INK, background: primary ? INK : 'transparent', border: primary ? 'none' : '1px solid rgba(255,255,255,0.2)' })
  return (
    <div style={{ position: 'relative', background: '#07090f', color: INK, fontFamily: F, minHeight: '100vh' }}>
      {/* same curtain backdrop as the home page, with a warm pool of light on the booth */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: `url(${homeBg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.55, filter: 'brightness(1.3)' }} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 520px 620px at 32% 38%, rgba(255,190,120,0.07) 0%, rgba(2,4,12,0.55) 60%, rgba(2,4,12,0.85) 100%)' }} />
      <div style={{ position: 'relative' }}>
      <Header />

      <style>{`
        .ab-row { display: flex; flex-direction: column; align-items: center; gap: 72px }
        @media (min-width: 960px) { .ab-row { flex-direction: row; align-items: center; gap: clamp(56px, 7vw, 110px) } }
      `}</style>
      <div className="ab-row" style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(32px, 5vw, 64px) 48px 0' }}>
      <section style={{ flex: '0 0 auto' }}>
        <PhotoBooth />
      </section>

      <section style={{ flex: '1 1 0', minWidth: 0, maxWidth: 620 }}>
        <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(44px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em', margin: '0 0 32px' }}>Hi, I'm Finnick.</h1>
        <p style={{ fontFamily: F, fontSize: 19, lineHeight: '31px', color: SUB, margin: '0 0 22px' }}>
          I'm a product designer who's curious about how people experience things, and how small details shape those moments. Most recently I worked on <span style={{ color: INK }}>Cisco</span> Intersight, and before that designed internal platforms at <span style={{ color: INK }}>ByteDance</span> and <span style={{ color: INK }}>Bosch</span>.
        </p>
        <p style={{ fontFamily: F, fontSize: 19, lineHeight: '31px', color: SUB, margin: 0 }}>
          I grew up in Chengdu, a city where different rhythms of life coexist naturally. It taught me to observe quietly and notice how environments shape the way people feel. Today I'm finishing my Master's in HCI at the <span style={{ color: INK }}>University of Washington</span>.
        </p>

        <div style={{ marginTop: 56, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={EYEBROW}>Now</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {NOW.map(t => <span key={t} style={{ fontSize: 14, padding: '8px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', boxShadow: '0 0 0 1px rgba(255,255,255,0.1)' }}>{t}</span>)}
          </div>
        </div>
      </section>
      </div>

      <section style={{ ...W, textAlign: 'center', padding: 'clamp(96px, 11vw, 150px) 48px clamp(80px, 9vw, 120px)' }}>
        <h2 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(30px, 4.4vw, 52px)', letterSpacing: '-0.035em', lineHeight: 1.12, margin: '0 0 32px' }}>Let's make something great together.</h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:c4han@uw.edu" style={btn(true)}>c4han@uw.edu</a>
          <a href="https://www.linkedin.com/in/finnick-chen" target="_blank" rel="noreferrer" style={btn(false)}>LinkedIn</a>
          <a href="/Finnick_Chen_Resume.pdf" target="_blank" rel="noreferrer" style={btn(false)}>Resume</a>
        </div>
        <p style={{ fontSize: 12, color: SUB, opacity: 0.6, marginTop: 56 }}>© 2026 Finnick Chen</p>
      </section>
      </div>
    </div>
  )
}
