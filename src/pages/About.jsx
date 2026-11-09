import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'
import PhotoBooth3D from '../components/PhotoBooth3D'
import { F } from '../components/caseTokens'
import homeBg from '../assets/images/home-bg.webp'
import booth1 from '../assets/images/about/booth1.webp'
import booth2 from '../assets/images/about/booth2.webp'
import booth3 from '../assets/images/about/booth3.webp'
import iconPen from '../assets/images/about/icon-pen.png'
import iconPin from '../assets/images/about/icon-pin.png'
import iconNote from '../assets/images/about/icon-note.png'

const INK = '#f2f4f8'
const SUB = 'rgba(255,255,255,0.55)'

const PHOTOS = [booth1, booth2, booth3]

// little objects rendered with the photo booth's own materials and lights (cobalt clay, the yellow
// button, warm key and blue rim), so they read as props from the same set. Each moves when its block is hovered.
const ICONS = { 'What I do': ['pen', iconPen], "Where I've been": ['pin', iconPin], 'Off the clock': ['note', iconNote] }

const BLOCKS = [
  { label: 'What I do', text: "I'm a product designer who loves figuring out how things work, questioning why they're the way they are, and imagining how they could be better." },
  { label: "Where I've been", tags: ['Cisco', 'ByteDance', 'Bosch', 'University of Washington'], text: "I've had the chance to work with some pretty interesting people at Cisco, ByteDance, and Bosch, tackling complex problems and learning something new along the way. I'm currently finishing my Master's at the University of Washington, where I've been exploring new ideas and experimenting with emerging technologies." },
  { label: 'Off the clock', tags: ['Chengdu', 'Fashion', 'Music'], text: "I grew up in Chengdu, China, and have always been the kind of person who gets curious about just about anything. Outside of work, I'm into fashion, music, and discovering things I didn't know I'd love. I tend to notice the little details, ask a lot of questions, and occasionally spend way too much time on something just because I think it could be better." },
]

export default function About() {
  return (
    <div style={{ position: 'relative', background: '#07090f', color: INK, fontFamily: F, minHeight: '100vh' }}>
      {/* same curtain backdrop and darkness as the home page */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: `url(${homeBg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.55, filter: 'brightness(1.3)' }} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'rgba(2,4,12,0.82)' }} />
      <div style={{ position: 'relative' }}>
      <Header />

      <style>{`
        .ab-row { display: flex; flex-direction: column; align-items: center; gap: 72px; overflow-x: clip }
        .ab-stage { width: min(calc(100vw - 40px), 520px); aspect-ratio: 6 / 7 }
        .ab-press { position: absolute; left: 0; top: 0; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 50%; background: transparent; cursor: pointer }
        .ab-press:focus-visible { outline: 2px solid #fff; outline-offset: 2px }
        @media (min-width: 960px) { .ab-stage { width: min(42vw, 74vh, 560px) } }
        @media (min-width: 960px) { .ab-row { overflow-x: visible } }
        .ab-label { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.42); transition: color 0.3s ease }
        .ab-label img { width: 28px; height: 28px; flex: none; margin: -6px 0; transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) }
        .ab-i-pen, .ab-i-pin { transform-origin: 50% 90% }
        .ab-i-note { transform-origin: 30% 90% }
        .ab-block:hover .ab-label { color: rgba(255,255,255,0.85) }
        .ab-block:hover .ab-i-pen { transform: rotate(-14deg) }
        .ab-block:hover .ab-i-pin { transform: translateY(-3px) }
        .ab-block:hover .ab-i-note { transform: rotate(-12deg) translateY(-1.5px) }
        @media (prefers-reduced-motion: reduce) { .ab-label img { transition: none } }
        @media (min-width: 960px) { .ab-row { flex-direction: row; align-items: flex-start; gap: clamp(56px, 7vw, 110px) } }
        /* the booth holds still, centred in the window, while the text scrolls past it;
           the greeting starts on the same line as the booth's sign so the two read as one */
        @media (min-width: 960px) {
          .ab-row { --H: calc(min(42vw, 74vh, 560px) * 7 / 6); --T: max(96px, calc(50vh - var(--H) / 2 + 28px)); max-width: 1320px !important; padding-top: 0 !important }
          .ab-booth { position: sticky; top: var(--T); margin-top: calc(var(--T) - 84px) }
          .ab-copy { padding-top: calc(var(--T) - 84px + var(--H) * 0.105) }
        }
      `}</style>
      <div className="ab-row" style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(32px, 5vw, 64px) clamp(20px, 5vw, 48px) 0' }}>
      <section className="ab-booth" style={{ flex: '0 0 auto' }}>
        <PhotoBooth3D photos={PHOTOS} />
      </section>

      <section className="ab-copy" style={{ flex: '1 1 0', minWidth: 0, maxWidth: 620, paddingBottom: 'clamp(48px, 10vh, 120px)' }}>
        <h1 style={{ fontFamily: F, fontWeight: 400, fontSize: 'clamp(28px, 3.4vw, 48px)', lineHeight: 1.16, letterSpacing: '-0.03em', color: '#edf0f7', margin: 0 }}>Hi, I'm Finnick.</h1>
        {BLOCKS.map(({ label, tags, text }, i) => (
          <div key={label} className="ab-block" style={{ marginTop: i === 0 ? 40 : 44 }}>
            <p className="ab-label" style={{ fontFamily: F, fontSize: 11.5, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 10px' }}><img className={`ab-i-${ICONS[label][0]}`} src={ICONS[label][1]} alt="" />{label}</p>
            {tags && <p style={{ fontFamily: F, fontSize: 16, color: INK, margin: '0 0 8px' }}>{tags.join('  ·  ')}</p>}
            <p style={{ fontFamily: F, fontSize: 17, lineHeight: '28px', color: SUB, margin: 0 }}>{text}</p>
          </div>
        ))}
      </section>
      </div>

      <SiteFooter />
      </div>
    </div>
  )
}
