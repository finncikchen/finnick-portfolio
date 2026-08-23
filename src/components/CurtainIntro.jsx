import { useEffect, useState } from 'react'
import curtainImg from '../assets/images/home-bg.png'

export default function CurtainIntro({ onComplete }) {
  const [phase, setPhase] = useState('closed')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('opening'), 400)
    const t2 = setTimeout(() => {
      setPhase('done')
      onComplete?.()
    }, 400 + 2400)                                           // 2.4s 拉完
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])

  if (phase === 'done') return null

  const isOpening = phase === 'opening'

  const panel = (side) => ({
    position: 'absolute',
    top: 0, [side]: 0,
    width: '50%', height: '100%',
    transformOrigin: side === 'left' ? 'right center' : 'left center',
    transform: isOpening
      ? `translateX(${side === 'left' ? '-100%' : '100%'})`
      : 'translateX(0)',
    transition: isOpening
      ? `transform 2.4s cubic-bezier(0.4, 0, 0.2, 1)${side === 'right' ? ' 0.04s' : ''}`
      : 'none',
    backgroundImage: `url(${curtainImg})`,
    backgroundSize: '200% 100%',
    backgroundPosition: `${side} center`,
    willChange: 'transform',
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={panel('left')} />
      <div style={panel('right')} />
    </div>
  )
}
