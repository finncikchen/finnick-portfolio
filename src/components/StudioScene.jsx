import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import plate from '../assets/images/studio-plate.webp'
import mug from '../assets/images/studio-mug.webp'
import steam from '../assets/images/studio-steam.webp'
import laptop from '../assets/images/studio-laptop.webp'

// Homepage opening: the set the follow-spots find in the dark. Finnick works, stops for a sip of coffee,
// and it rains outside at the real Seattle hour. All coordinates are pixels of the source illustration.
const seattleTime = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' })
const hash = (n) => { const s = Math.sin(n * 91.7) * 43758.5453; return s - Math.floor(s) }
const DROPS = Array.from({ length: 40 }, (_, i) => ({ x: 712 + hash(i) * 600, y: 65 + hash(i + 50) * 680, l: 20 + hash(i + 90) * 22 }))
const SKIN = '#fed0c2'
const SHOULDER = [452, 626]
const TYPING = { x: 520, y: 650, ex: 415, ey: 650 }
const AT_MUG = { x: 392, y: 644 }        // hand closes on the mug
const AT_LIPS = { x: 664, y: 420, ex: 438, ey: 600 }

export default function StudioScene() {
  const ref = useRef(null)
  const [time, setTime] = useState(seattleTime)

  useEffect(() => {
    const clock = setInterval(() => setTime(seattleTime()), 15000)
    const svg = ref.current
    const arm = svg.querySelector('.studio-arm')
    const hand = svg.querySelector('.studio-hand')
    const cup = svg.querySelector('.studio-mug')
    const H = { ...TYPING, carry: 0 }
    const draw = () => {
      arm.setAttribute('d', `M${SHOULDER}L${H.ex} ${H.ey}L${H.x} ${H.y}`)
      hand.setAttribute('transform', `translate(${H.x} ${H.y})`)
      gsap.set(hand, { opacity: H.carry })
      gsap.set(cup, { x: H.carry ? H.x - AT_MUG.x : 0, y: H.carry ? H.y - AT_MUG.y : 0 })
    }
    draw()
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.to('.studio-rain', { y: 680, x: -68, duration: 0.85, ease: 'none', repeat: -1 })
      gsap.fromTo('.studio-steam', { y: 6, opacity: 0.25 }, { y: -10, opacity: 0.9, duration: 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true })
      gsap.to('.studio-lid', { scaleY: 1, duration: 0.07, repeat: 1, yoyo: true, repeatDelay: 0.04, ease: 'none', delay: 2, repeatRefresh: true, onComplete() { this.delay(gsap.utils.random(2.5, 5)).restart(true) } })
      gsap.timeline({ repeat: -1, repeatDelay: 6, delay: 3, onUpdate: draw })
        .to(H, { ...AT_MUG, duration: 0.7, ease: 'power2.inOut' })
        .set(H, { carry: 1 })
        .to('.studio-steam-wrap', { autoAlpha: 0, duration: 0.25 }, '<')
        .to(H, { ...AT_LIPS, duration: 0.95, ease: 'power3.inOut' }, '+=0.1')
        .to('.studio-head', { rotation: -4, y: -3, svgOrigin: '632 450', duration: 0.5, ease: 'sine.inOut' }, '-=0.35')
        .to({}, { duration: 1.2 })
        .to('.studio-head', { rotation: 0, y: 0, duration: 0.5, ease: 'sine.inOut' })
        .to(H, { ...AT_MUG, ex: TYPING.ex, ey: TYPING.ey, duration: 0.95, ease: 'power3.inOut' }, '<')
        .set(H, { carry: 0 })
        .to('.studio-steam-wrap', { autoAlpha: 1, duration: 0.6 })
        .to(H, { x: TYPING.x, y: TYPING.y, duration: 0.7, ease: 'power2.inOut' }, '<')
    }, svg)
    return () => { clearInterval(clock); ctx.revert() }
  }, [])

  return (
    <div className="home-hero studio-scene" style={{ position: 'absolute', left: '50%', top: 'clamp(84px, 11vh, 110px)', width: 'min(92vw, 72vh)', transform: 'translateX(-50%)' }}>
      <style>{'.studio-scene{--mask:radial-gradient(ellipse var(--r,0) var(--r,0) at var(--kx,-999px) var(--ky,-999px),#000 42%,rgba(0,0,0,.06) 100%),radial-gradient(ellipse var(--r,0) var(--r,0) at var(--gx,-999px) var(--gy,-999px),#000 42%,rgba(0,0,0,.06) 100%);-webkit-mask-image:var(--mask);mask-image:var(--mask);-webkit-mask-composite:source-over;mask-composite:add}.studio-art{-webkit-mask-image:radial-gradient(ellipse 58% 62% at 50% 50%,#000 78%,transparent 100%);mask-image:radial-gradient(ellipse 58% 62% at 50% 50%,#000 78%,transparent 100%)}'}</style>
      <svg ref={ref} className="studio-art" viewBox="0 0 1448 1086" role="img" aria-label="Finnick working at a laptop and sipping coffee at night while it rains over Seattle" style={{ display: 'block', width: '100%', height: 'auto' }}>
        <defs>
          <clipPath id="studio-glass"><rect x="712" y="65" width="548" height="680" /></clipPath>
          <clipPath id="studio-head-clip"><path d="M570 290h130v160q-20 18-65 18t-65-18z" /></clipPath>
        </defs>
        <image href={plate} width="1448" height="1086" />
        <g clipPath="url(#studio-glass)">
          {[0, -680].map((offset) => (
            <g key={offset} className="studio-rain" transform={`translate(0 ${offset})`}>
              {DROPS.map((d, i) => <line key={i} x1={d.x} y1={d.y} x2={d.x - d.l * 0.1} y2={d.y + d.l} stroke="#dfe6ff" strokeOpacity=".7" strokeWidth="2.4" strokeLinecap="round" />)}
            </g>
          ))}
        </g>
        <text x="738" y="150" fill="#fff" style={{ font: '500 50px Manrope, sans-serif', letterSpacing: '-0.02em' }}>Seattle</text>
        <text x="738" y="202" fill="rgba(255,255,255,.78)" style={{ font: '400 31px Manrope, sans-serif' }}>{time}</text>

        <g className="studio-head">
          <image href={plate} width="1448" height="1086" clipPath="url(#studio-head-clip)" />
          <g fill={SKIN}>
            <ellipse className="studio-lid" cx="614" cy="376" rx="9" ry="10" style={{ transform: 'scaleY(0)', transformBox: 'fill-box', transformOrigin: 'center' }} />
            <ellipse className="studio-lid" cx="654" cy="376" rx="9" ry="10" style={{ transform: 'scaleY(0)', transformBox: 'fill-box', transformOrigin: 'center' }} />
          </g>
        </g>

        <g className="studio-steam-wrap"><image className="studio-steam" href={steam} x="330" y="520" width="58" height="90" /></g>
        <path className="studio-arm" fill="none" stroke={SKIN} strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" />
        <image href={laptop} x="512" y="522" width="250" height="157" />
        <image className="studio-mug" href={mug} x="318" y="606" width="74" height="72" />
        <g className="studio-hand" style={{ opacity: 0 }}>
          <rect x="-22" y="-24" width="46" height="46" rx="20" fill={SKIN} />
          <path d="M-20-8h22M-20 4h22" stroke="#eeb3a3" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <circle cx="636" cy="580" r="1" data-spot="key" fill="none" />
        <circle cx="985" cy="362" r="1" data-spot="gel" fill="none" />
      </svg>
    </div>
  )
}
