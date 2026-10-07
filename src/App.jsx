import { useEffect, useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigationType } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import ByteDance from './pages/ByteDance'
import Cisco from './pages/Cisco'
import Bosch from './pages/Bosch'
import Yhlo from './pages/Yhlo'
import FlowerStar from './pages/FlowerStar'
import Locked from './pages/Locked'
import Admin from './pages/Admin'
import { initAnalytics, trackPageview } from './lib/analytics'

initAnalytics()

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="/work/cisco" element={<Cisco />} />
        <Route path="/work/bytedance" element={<ByteDance />} />
        <Route path="/work/bosch" element={<Bosch />} />
        <Route path="/work/yhlo" element={<Yhlo />} />
        <Route path="/work/flower-star" element={<FlowerStar />} />
        <Route path="/work" element={<Navigate to="/" replace />} />
        <Route path="/work/:id" element={<Locked />} />
      </Routes>
    </BrowserRouter>
  )
}
