import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigationType } from 'react-router-dom'
import { MODEL_URL } from './three/modelUrl'
import { initAnalytics, trackPageview } from './lib/analytics'

initAnalytics()

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const ByteDance = lazy(() => import('./pages/ByteDance'))
const Cisco = lazy(() => import('./pages/Cisco'))
const Bosch = lazy(() => import('./pages/Bosch'))
const Yhlo = lazy(() => import('./pages/Yhlo'))
const FlowerStar = lazy(() => import('./pages/FlowerStar'))
const Wenhong = lazy(() => import('./pages/Wenhong'))
const Locked = lazy(() => import('./pages/Locked'))
const Admin = lazy(() => import('./pages/Admin'))

// A tab left open across a deploy asks for page files that no longer exist: reload once to pick up the new ones.
window.addEventListener('vite:preloadError', () => {
  if (sessionStorage.getItem('reloaded-for-deploy')) return
  sessionStorage.setItem('reloaded-for-deploy', '1')
  window.location.reload()
})

// The 3D figure opens both of these pages, so start fetching it before their code has even arrived.
if (['/', '/about'].includes(window.location.pathname)) {
  import('three')
  fetch(MODEL_URL).catch(() => {})
}

// New pages open at the top; back/forward keeps the browser's position.
function ScrollToTop() {
  const { pathname } = useLocation()
  const nav = useNavigationType()
  useLayoutEffect(() => {
    if (nav !== 'POP') window.scrollTo(0, 0)
  }, [pathname, nav])
  useEffect(() => { if (pathname !== '/admin') trackPageview(pathname) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="/work/cisco" element={<Cisco />} />
        <Route path="/work/bytedance" element={<ByteDance />} />
        <Route path="/work/bosch" element={<Bosch />} />
        <Route path="/work/yhlo" element={<Yhlo />} />
        <Route path="/work/flower-star" element={<FlowerStar />} />
        <Route path="/work/wenhong" element={<Wenhong />} />
        <Route path="/work" element={<Navigate to="/" replace />} />
        <Route path="/work/:id" element={<Locked />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
