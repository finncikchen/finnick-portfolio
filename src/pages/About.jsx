import { useRef, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import homeBg from '../assets/images/home-bg.png'
import profile from '../assets/images/profile-curtain.jpg'

const SERIF = '"Cormorant Garamond", serif'
const SANS  = 'Inter, sans-serif'

export default function About() {
  const stageRef      = useRef(null)
  const leftRef       = useRef(null)
  const rightRef      = useRef(null)
  const personRef     = useRef(null)
  const heroTextRef   = useRef(null)
  const scrollHintRef = useRef(null)
  const statsRef      = useRef(null)
  const cursorRef     = useRef(null)

  /* ── cursor ── */
  useEffect(() => {
    const move = e => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top  = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  /* ── scroll-driven curtain reveal ── */
  useEffect(() => {
    const handleScroll = () => {
      const section = stageRef.current
      if (!section) return
      const rect     = section.getBoundingClientRect()
      const scrolled = -rect.top                               // px scrolled past top
      const total    = section.offsetHeight - window.innerHeight
      const p        = Math.max(0, Math.min(1, scrolled / total)) // 0 → 1

      /* curtains slide apart */
      const open = p * 100
      if (leftRef.current)  leftRef.current.style.transform  = `translateX(-${open}%)`
      if (rightRef.current) rightRef.current.style.transform = `translateX(${open}%)`

      /* person fades/rises in during first 60% of scroll */
      const personP = Math.min(1, p / 0.6)
      if (personRef.current) {
        personRef.current.style.opacity   = personP
        personRef.current.style.transform = `translateY(${(1 - personP) * 30}px)`
      }

      /* hero text appears after curtains half open */
      const textP = Math.max(0, Math.min(1, (p - 0.35) / 0.4))
      if (heroTextRef.current) heroTextRef.current.style.opacity = textP

      /* scroll hint fades out as scroll starts */
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = Math.max(0, 1 - p * 8)
      }

      /* stats project onto stage after curtains mostly open */
      const statsP = Math.max(0, Math.min(1, (p - 0.55) / 0.35))
      if (statsRef.current) statsRef.current.style.opacity = statsP
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // run once on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ background: '#05070e', cursor: 'none', color: '#fff' }}>

      {/* cursor */}
      <div ref={cursorRef} style={{
        position: 'fixed', width: '5px', height: '5px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)',
        transform: 'translate(-50%,-50%)',
        boxShadow: '0 0 10px 5px rgba(140,170,255,0.28)',
        pointerEvents: 'none', zIndex: 100,
      }} />

      {/* ── STICKY CURTAIN STAGE (scroll container) ── */}
      <div ref={stageRef} style={{ height: '320vh', position: 'relative' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          {/* header floats above everything */}
          <div style={{ position: 'relative', zIndex: 20, flexShrink: 0 }}>
            <Header />
          </div>

          {/* stage interior */}
          <div style={{ position: 'relative', flex: 1 }}>

            {/* dark stage bg */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 50% 70% at 50% 60%, #0b1428 0%, #040609 100%)',
            }} />

            {/* stage floor reflection */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
              background: 'linear-gradient(to top, rgba(8,12,28,0.9), transparent)',
              pointerEvents: 'none',
            }} />

            {/* overhead stage light beam */}
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: '300px', height: '100%', pointerEvents: 'none',
              background: 'conic-gradient(from 0deg at 50% 0%, transparent 80deg, rgba(180,210,255,0.06) 87deg, rgba(200,225,255,0.12) 90deg, rgba(180,210,255,0.06) 93deg, transparent 100deg)',
            }} />

            {/* person — revealed by curtain opening */}
            <div ref={personRef} style={{
              position: 'absolute', inset: 0,
              opacity: 0,
              transition: 'none',
            }}>
              <img
                src={profile}
                alt="Finnick Chen"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 20%',
                  display: 'block',
                }}
              />
            </div>

            {/* hero text — bottom, below the figure */}
            <div ref={heroTextRef} style={{
              position: 'absolute', bottom: '40px', left: 0, right: 0,
              opacity: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '10px', pointerEvents: 'none',
            }}>
              <p style={{
                fontFamily: SANS, fontWeight: 400, fontSize: '11px',
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)', margin: 0,
              }}>
                Product / UX Designer
              </p>
              <h1 style={{
                fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                fontSize: 'clamp(52px, 6vw, 84px)', lineHeight: 1.0,
                color: '#fff', margin: 0, letterSpacing: '0.01em',
                textShadow: '0 4px 40px rgba(0,0,0,0.8)',
              }}>
                Finnick Chen.
              </h1>
              <p style={{
                fontFamily: SANS, fontWeight: 300, fontSize: '14px',
                color: 'rgba(255,255,255,0.5)', margin: 0, letterSpacing: '0.06em',
              }}>
                M.S. HCI @ University of Washington
              </p>
            </div>

            {/* ── LEFT CURTAIN ── */}
            <div ref={leftRef} style={{
              position: 'absolute', top: 0, left: 0,
              width: '50%', height: '100%',
              backgroundImage: `url(${homeBg})`,
              backgroundSize: '200% 100%',
              backgroundPosition: 'left center',
              transformOrigin: 'right center',
              zIndex: 10,
              boxShadow: 'inset -24px 0 48px rgba(0,0,0,0.6)',
            }} />

            {/* ── RIGHT CURTAIN ── */}
            <div ref={rightRef} style={{
              position: 'absolute', top: 0, right: 0,
              width: '50%', height: '100%',
              backgroundImage: `url(${homeBg})`,
              backgroundSize: '200% 100%',
              backgroundPosition: 'right center',
              transformOrigin: 'left center',
              zIndex: 10,
              boxShadow: 'inset 24px 0 48px rgba(0,0,0,0.6)',
            }} />

            {/* ── PROJECTED STATS ── */}
            <div ref={statsRef} style={{
              position: 'absolute', inset: 0, opacity: 0,
              pointerEvents: 'none', zIndex: 11,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              padding: '80px 60px 100px',
              gap: '0',
            }}>
              {[
                { num: '2+',   label: 'Years\nExperience',         pos: 'top-left' },
                { num: '2',    label: 'Fortune 500\nCompanies',    pos: 'top-right' },
                { num: '10K+', label: 'Daily Active\nUsers',       pos: 'bottom-left' },
                { num: '4',    label: 'End-to-End\nProjects',      pos: 'bottom-right' },
              ].map(({ num, label, pos }) => (
                <div key={num} style={{
                  display: 'flex', flexDirection: 'column', gap: '6px',
                  alignItems: pos.includes('right') ? 'flex-end' : 'flex-start',
                  justifyContent: pos.includes('bottom') ? 'flex-end' : 'flex-start',
                }}>
                  {/* projection glow behind number */}
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
                      fontSize: '52px', lineHeight: 1,
                      color: 'rgba(255,255,255,0.82)',
                      display: 'block',
                      textShadow: '0 0 40px rgba(180,210,255,0.5), 0 0 80px rgba(140,180,255,0.2)',
                    }}>
                      {num}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: SANS, fontWeight: 300, fontSize: '11px',
                    color: 'rgba(255,255,255,0.45)',
                    letterSpacing: '0.08em', lineHeight: 1.5,
                    textAlign: pos.includes('right') ? 'right' : 'left',
                    whiteSpace: 'pre-line',
                    textShadow: '0 0 20px rgba(140,180,255,0.3)',
                  }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* scroll hint */}
            <div ref={scrollHintRef} style={{
              position: 'absolute', bottom: '32px', left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 15, textAlign: 'center',
              transition: 'opacity 0.3s',
            }}>
              <div style={{
                fontFamily: SANS, fontWeight: 300, fontSize: '11px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}>
                Scroll
              </div>
              <div style={{
                marginTop: '8px',
                animation: 'float 1.6s ease-in-out infinite',
                fontSize: '16px', color: 'rgba(255,255,255,0.3)',
              }}>
                ↓
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BIO CONTENT ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 52px 80px' }}>

        {/* pull quote */}
        <div style={{ maxWidth: '700px', marginBottom: '72px' }}>
          <p style={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
            fontSize: 'clamp(28px, 3.5vw, 44px)', lineHeight: 1.4,
            color: '#e8edf5', margin: 0,
          }}>
            &ldquo;I&rsquo;m curious about how people experience things, and how small details shape those moments.&rdquo;
          </p>
        </div>

        {/* two-column bio */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '48px', marginBottom: '80px',
        }}>
          {[
            'I grew up in Chengdu — a city where different rhythms of life coexist naturally. Growing up there taught me to observe quietly and notice how environments shape the way people feel and behave.',
            'I\'m currently a Master\'s student in HCI at the University of Washington, exploring how design and technology come together to solve real-world problems. Before UW, I designed internal platforms at ByteDance and Bosch, working with cross-functional teams to improve how complex systems are experienced in everyday work.',
          ].map((text, i) => (
            <p key={i} style={{
              fontFamily: SANS, fontWeight: 300, fontSize: '14px',
              lineHeight: 1.85, color: 'rgba(255,255,255,0.6)', margin: 0,
            }}>
              {text}
            </p>
          ))}
        </div>

        {/* ── NOW ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '180px 1fr',
          gap: '40px', alignItems: 'start', marginBottom: '80px',
        }}>
          <p style={{
            fontFamily: SANS, fontWeight: 400, fontSize: '11px',
            letterSpacing: '0.24em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', margin: '8px 0 0',
          }}>
            Now
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              '🎓  HCI @ University of Washington',
              '🔍  Open to full-time roles in 2025',
              '📷  Photography on weekends',
              '🌏  Based in Seattle',
            ].map(item => (
              <span key={item} style={{
                fontFamily: SANS, fontWeight: 400, fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '100px', padding: '8px 18px',
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* ── FOOTER CTA ── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '80px 52px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '24px', textAlign: 'center',
      }}>
        <p style={{
          fontFamily: SANS, fontWeight: 400, fontSize: '11px',
          letterSpacing: '0.26em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)', margin: 0,
        }}>
          Let&rsquo;s connect
        </p>
        <h2 style={{
          fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
          fontSize: 'clamp(36px, 4vw, 56px)',
          color: '#fff', margin: 0, lineHeight: 1.1,
        }}>
          Let&rsquo;s make something great together.
        </h2>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
          {[
            { label: 'Email me', href: 'mailto:c4han@uw.edu', primary: true },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/finnick-chen' },
            { label: 'Resume', href: 'https://drive.google.com/file/d/18YmO4nCD5nnzxserhyF82_zqdPp9TSTd/view?usp=drive_link' },
          ].map(({ label, href, primary }) => (
            <a key={label} href={href} target={primary ? '_self' : '_blank'} rel="noreferrer"
              style={{
                fontFamily: SANS, fontWeight: 400, fontSize: '14px',
                color: primary ? '#fff' : 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                border: `1px solid ${primary ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '100px', padding: '11px 28px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = primary ? '#fff' : 'rgba(255,255,255,0.55)'
                e.currentTarget.style.borderColor = primary ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {label}
            </a>
          ))}
        </div>
        <p style={{
          fontFamily: SANS, fontWeight: 300, fontSize: '12px',
          color: 'rgba(255,255,255,0.2)', margin: '20px 0 0',
        }}>
          © 2026 Finnick Chen
        </p>
      </div>

      {/* float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
      `}</style>
    </div>
  )
}
