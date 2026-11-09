import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'
import PhotoBooth3D from '../components/PhotoBooth3D'
import { F } from '../components/caseTokens'
import homeBg from '../assets/images/home-bg.webp'
import booth1 from '../assets/images/about/booth1.webp'
import booth2 from '../assets/images/about/booth2.webp'
import booth3 from '../assets/images/about/booth3.webp'

const INK = '#f2f4f8'
const SUB = 'rgba(255,255,255,0.55)'

const PHOTOS = [booth1, booth2, booth3]

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
        <h1 style={{ fontFamily: F, fontWeight: 400, fontSize: 'clamp(28px, 3.4vw, 48px)', lineHeight: 1.16, letterSpacing: '-0.03em', color: '#edf0f7', margin: '0 0 20px' }}>Hi, I'm Finnick.</h1>
        <p style={{ fontFamily: F, fontSize: 19, lineHeight: '31px', color: SUB, margin: '0 0 22px' }}>
          I'm a product designer who loves figuring out how things work, questioning why they're the way they are, and imagining how they could be better.
        </p>
        <p style={{ fontFamily: F, fontSize: 19, lineHeight: '31px', color: SUB, margin: '0 0 22px' }}>
          I've had the chance to work with some pretty interesting people at <span style={{ color: INK }}>Cisco</span>, <span style={{ color: INK }}>ByteDance</span>, and <span style={{ color: INK }}>Bosch</span>, tackling complex problems and learning something new along the way. I'm currently finishing my Master's at the <span style={{ color: INK }}>University of Washington</span>, where I've been exploring new ideas and experimenting with emerging technologies.
        </p>
        <p style={{ fontFamily: F, fontSize: 19, lineHeight: '31px', color: SUB, margin: 0 }}>
          I grew up in Chengdu, China, and have always been the kind of person who gets curious about just about anything. Outside of work, I'm into fashion, music, and discovering things I didn't know I'd love. I tend to notice the little details, ask a lot of questions, and occasionally spend way too much time on something just because I think it could be better.
        </p>

      </section>
      </div>

      <SiteFooter />
      </div>
    </div>
  )
}
