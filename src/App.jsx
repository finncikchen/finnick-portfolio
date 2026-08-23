import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import ByteDance from './pages/ByteDance'
import Cisco from './pages/Cisco'
import Locked from './pages/Locked'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/work/cisco" element={<Cisco />} />
        <Route path="/work/bytedance" element={<ByteDance />} />
        <Route path="/work" element={<Navigate to="/" replace />} />
        <Route path="/work/:id" element={<Locked />} />
      </Routes>
    </BrowserRouter>
  )
}
