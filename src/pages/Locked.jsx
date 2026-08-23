import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import homeBg from '../assets/images/home-bg.png'

const projectMeta = {
  bosch: { title: 'Bosch', subtitle: 'Finance Operations Dashboard' },
  yhlo: { title: 'YHLO', subtitle: 'Medical Device UX System' },
  'flower-star': { title: 'Flower Star', subtitle: 'Consumer Mobile Experience' },
  'coming-soon-1': { title: 'Coming Soon', subtitle: 'New Project In Progress' },
  'coming-soon-2': { title: 'Coming Soon', subtitle: 'New Project In Progress' },
}

export default function Locked() {
  const { id } = useParams()
  const meta = projectMeta[id] || { title: id, subtitle: '' }

  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError]       = useState(false)
  const [shake, setShake]       = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password.trim().length === 0) {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 420)
      return
    }
    // demo gate — any non-empty password "unlocks" the preview
    setError(false)
    setUnlocked(true)
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col overflow-hidden relative">
      <img
        src={homeBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
      />
      <div className="relative z-10 flex flex-col flex-1">
        <Header />

        {!unlocked ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-7 px-6 py-24">
            <div className="w-16 h-16 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center">
              <LockIcon />
            </div>

            <p className="font-poppins text-sm text-white/40 uppercase tracking-widest">Case Study · Locked</p>
            <h1 className="font-playfair font-semibold text-[48px] md:text-[64px] text-text-light text-center leading-[1.2]">
              {meta.title}
            </h1>
            <p className="font-poppins text-lg text-white/60 -mt-4">{meta.subtitle}</p>
            <p className="font-poppins text-sm text-white/35 max-w-[380px] text-center leading-relaxed">
              This project is under an active NDA. Enter the password to view a preview, or reach out for access.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-3 mt-2"
              style={shake ? { animation: 'shake 0.4s' } : undefined}
            >
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(false) }}
                  placeholder="Enter password"
                  className="font-poppins text-sm text-white bg-white/[0.06] border border-white/15 focus:border-white/40 rounded-full px-5 py-3 w-[240px] outline-none placeholder:text-white/30 transition-colors"
                />
                <button
                  type="submit"
                  className="font-poppins text-sm text-navy bg-white hover:bg-white/85 rounded-full px-5 py-3 transition-colors"
                >
                  Unlock
                </button>
              </div>
              {error && (
                <p className="font-poppins text-xs text-red-400">Please enter a password to continue.</p>
              )}
            </form>

            <Link
              to="/"
              className="mt-6 font-poppins text-base text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-full px-8 py-3 transition-all"
            >
              ← Back to Work
            </Link>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 px-16 py-24">
            <p className="font-poppins text-sm text-white/40 uppercase tracking-widest">Case Study</p>
            <h1 className="font-playfair font-semibold text-[64px] text-text-light text-center leading-[1.2]">
              {meta.title}
            </h1>
            <p className="font-poppins text-xl text-white/60">{meta.subtitle}</p>
            <p className="font-poppins text-sm text-white/30 mt-4">Full write-up is being finalized — check back soon.</p>
            <Link
              to="/"
              className="mt-8 font-poppins text-base text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-full px-8 py-3 transition-all"
            >
              ← Back to Work
            </Link>
          </div>
        )}

        <Footer />
      </div>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="white" strokeOpacity="0.7" strokeWidth="1.6" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="white" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.4" fill="white" fillOpacity="0.7" />
    </svg>
  )
}
