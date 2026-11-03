import { useEffect, useRef } from 'react'

const SETTLE = 120   // ms without scrolling before the page counts as at rest
const REACH = 0.9    // how far down the viewport the section's top must have come

// Scrolling down into the last section carries the page the rest of the way.
// Scrolling back up is left alone, so the section never traps the visitor.
export default function useSnapToEnd() {
  const ref = useRef(null)

  useEffect(() => {
    let last = window.scrollY, down = false, timer = 0
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

    const settle = () => {
      const top = ref.current?.getBoundingClientRect().top
      if (!down || top == null || top < 1 || top > window.innerHeight * REACH) return
      window.scrollTo({ top: window.scrollY + top, behavior })
    }
    const onScroll = () => {
      if (window.scrollY !== last) down = window.scrollY > last
      last = window.scrollY
      clearTimeout(timer)
      timer = setTimeout(settle, SETTLE)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll) }
  }, [])

  return ref
}
