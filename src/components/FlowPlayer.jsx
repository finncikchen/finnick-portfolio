import { useEffect, useRef, useState } from 'react'

// Replays a Figma prototype path like a screen recording.
// Canvas is the 1512-wide Figma frame; `view` is the visible height in frame units.
// Script actions:
//   { show: src, h }            swap the page (h = frame height, for scrolling)
//   { move: [x, y] }            glide the cursor to frame coords (viewport-relative for overlays)
//   { click: true }             press + ripple
//   { overlay: src, w, h, pad } open a centered modal over a dimmed page (pad = shadow margin in the export)
//   { close: true }             dismiss the overlay
//   { scroll: y }               scroll the page to y
//   { wait: ms }
const FW = 1512

export default function FlowPlayer({ script, view = 900, label }) {
  const wrap = useRef(null)
  const [scale, setScale] = useState(0.5)
  const [page, setPage] = useState({ src: script[0].show, h: script[0].h, key: 0 })
  const [prev, setPrev] = useState(null)
  const [scrollY, setScrollY] = useState(0)
  const [cur, setCur] = useState([FW * 0.62, view * 0.72])
  const [press, setPress] = useState(0)
  const [overlay, setOverlay] = useState(null)
  const [inView, setInView] = useState(false)
  const pageRef = useRef(page)

  useEffect(() => {
    const el = wrap.current
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / FW))
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => { ro.disconnect(); io.disconnect() }
  }, [])

  useEffect(() => {
    if (!inView) return
    let alive = true
    const sleep = ms => new Promise(r => setTimeout(r, ms))
    ;(async () => {
      while (alive) {
        let k = 0
        for (const a of script) {
          if (!alive) return
          if (a.show) {
            setPrev(pageRef.current)
            pageRef.current = { src: a.show, h: a.h, key: ++k + Math.random() }
            setPage(pageRef.current)
            setOverlay(null)
            setScrollY(0)
            await sleep(a.hold ?? 900)
          } else if (a.move) { setCur(a.move); await sleep(a.dur ?? 950) }
          else if (a.click) { setPress(n => n + 1); await sleep(450) }
          else if (a.overlay) { setOverlay(a); await sleep(a.hold ?? 900) }
          else if (a.close) { setOverlay(null); await sleep(300) }
          else if (a.scroll !== undefined) { setScrollY(a.scroll); await sleep(a.dur ?? 1400) }
          else if (a.wait) await sleep(a.wait)
        }
        await sleep(1600)
        setCur([FW * 0.62, view * 0.72])
      }
    })()
    return () => { alive = false }
  }, [inView, script, view])

  const H = view
  const maxScroll = Math.max(0, (page.h || H) - H)
  const sy = Math.min(scrollY, maxScroll)

  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 30px 70px rgba(20,30,60,0.14)' }}>
      {/* window chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: '#f6f7f9', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        {label && <span style={{ marginLeft: 10, fontFamily: 'inherit', fontSize: 12, color: '#8a8f98' }}>{label}</span>}
      </div>
      <div ref={wrap} style={{ position: 'relative', width: '100%', aspectRatio: `${FW} / ${H}`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: FW, height: H, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
          {prev && prev.key !== page.key && (
            <img key={'p' + prev.key} src={prev.src} alt="" style={{ position: 'absolute', left: 0, top: 0, width: FW, display: 'block' }} />
          )}
          <img key={page.key} src={page.src} alt="" style={{ position: 'absolute', left: 0, top: 0, width: FW, display: 'block', transform: `translateY(${-sy}px)`, transition: 'transform 1.2s cubic-bezier(.45,0,.2,1)', animation: 'fpIn .45s ease both' }} />
          {/* overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,20,30,0.45)', opacity: overlay ? 1 : 0, transition: 'opacity .3s' }} />
          {overlay && (
            <img src={overlay.overlay} alt="" style={{ position: 'absolute', left: (FW - overlay.w) / 2 - overlay.pad, top: (H - overlay.h) / 2 - overlay.pad, width: overlay.w + overlay.pad * 2, animation: 'fpPop .3s cubic-bezier(.2,.8,.3,1.2) both' }} />
          )}
          {/* cursor */}
          <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${cur[0]}px, ${cur[1]}px)`, transition: 'transform .9s cubic-bezier(.6,0,.25,1)', pointerEvents: 'none', zIndex: 5 }}>
            <span key={press} style={{ position: 'absolute', left: -22, top: -22, width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,123,192,0.35)', animation: press ? 'fpRipple .5s ease-out both' : 'none', opacity: 0 }} />
            <svg width="30" height="30" viewBox="0 0 24 24" style={{ position: 'absolute', left: -4, top: -3, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.3))', animation: press ? 'fpPress .3s ease' : 'none' }} key={'c' + press}>
              <path d="M4 2l15 10.5-6.6 1.3 3.8 7.3-2.8 1.4-3.8-7.3L4 20z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <style>{'@keyframes fpIn{from{opacity:0}to{opacity:1}}@keyframes fpPop{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}@keyframes fpRipple{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.6)}}@keyframes fpPress{50%{transform:scale(.85)}}'}</style>
    </div>
  )
}
