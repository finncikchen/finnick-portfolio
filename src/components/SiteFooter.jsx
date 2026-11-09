import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const FONT = '"Manrope", "Inter", sans-serif'

// The closing line lights up word by word as the page reaches its end.
export default function SiteFooter() {
  const footerRef = useRef(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lit = SplitText.create(footerRef.current.querySelector('p'), { type: 'words' })
    gsap.fromTo(lit.words, { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.5, scrollTrigger: { trigger: footerRef.current, start: 'top 95%', end: 'bottom bottom', scrub: 0.4 } })
  }, { scope: footerRef })

  return (
    <footer ref={footerRef} style={{ position: 'relative', overflowX: 'clip' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: 'clamp(96px, 14vh, 160px) clamp(20px, 8vw, 160px) 0', boxSizing: 'content-box', width: 'calc(100% - 2 * clamp(20px, 8vw, 160px))' }}>
        <p style={{ fontFamily: FONT, fontSize: 'clamp(26px, 3vw, 40px)', lineHeight: 1.2, color: 'rgba(237,240,247,0.6)', margin: 0, textAlign: 'center' }}>
          Systems thinking and visual craft, <span style={{ color: '#fff' }}>shaped in code.</span>
        </p>
      </div>
      <p style={{ fontFamily: FONT, fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, padding: 'clamp(96px, 14vh, 160px) 20px clamp(28px, 4vh, 44px)', textAlign: 'center' }}>
        © 2026 Finnick Chen
      </p>
    </footer>
  )
}
