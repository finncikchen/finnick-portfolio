import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import AsciiHorse from './AsciiHorse'
import ProjectorBeam from './ProjectorBeam'
import useSnapToEnd from '../hooks/useSnapToEnd'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const FONT = '"Manrope", "Inter", sans-serif'

// The closing screen: the projector opens over the page, the line lights up word by word, the horse gallops in.
export default function SiteFooter() {
  const snapRef = useSnapToEnd()
  const footerRef = useRef(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const footer = footerRef.current
    const lit = SplitText.create(footer.querySelector('p'), { type: 'words' })
    gsap.fromTo(lit.words, { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.5, scrollTrigger: { trigger: footer, start: 'top 80%', end: 'top 15%', scrub: 0.4 } })
    gsap.fromTo(footer.firstElementChild, { scaleX: 0.2, transformOrigin: '50% 0%' }, { scaleX: 1, ease: 'power2.out', scrollTrigger: { trigger: footer, start: 'top 92%', end: 'top 10%', scrub: 0.5 } })
    gsap.from(footer.lastElementChild, { autoAlpha: 0, y: 14, ease: 'none', scrollTrigger: { trigger: footer, start: 'top 30%', end: 'top 2%', scrub: 0.5 } })
  }, { scope: footerRef })

  return (
    <footer ref={(el) => { footerRef.current = el; snapRef.current = el }} style={{ position: 'relative', minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflowX: 'clip' }}>
      <ProjectorBeam />
      <div style={{ position: 'relative', maxWidth: '1120px', margin: '0 auto', padding: 'clamp(72px, 9vh, 112px) clamp(20px, 8vw, 160px) 0', boxSizing: 'content-box', width: 'calc(100% - 2 * clamp(20px, 8vw, 160px))', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
        <p style={{ fontFamily: FONT, fontSize: 'clamp(26px, 3vw, 40px)', lineHeight: 1.2, color: 'rgba(237,240,247,0.6)', margin: 0 }}>
          Systems thinking and visual craft, <span style={{ color: '#fff' }}>shaped in code.</span>
        </p>
      </div>
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
        <AsciiHorse />
      </div>
      <p style={{ position: 'relative', fontFamily: FONT, fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, padding: '0 20px clamp(28px, 4vh, 44px)', textAlign: 'center' }}>
        © 2026 Finnick Chen
      </p>
    </footer>
  )
}
