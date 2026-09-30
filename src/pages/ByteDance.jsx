import { useState, useEffect } from 'react'
import LiveRMS from '../components/LiveRMS'
import { ScaledWarehouse } from '../components/LiveWarehouse'
import ClientDashboard from '../components/ClientDashboards'
import { F, INK, SUB, FADE, WIDE, GAP, STATEMENT, EYEBROW } from '../components/caseTokens'
import {
  P, Page, Hero, SplitRow, ChapterHead, InfoTable, SolutionRow, Panel, ContactCTA, FooterNav,
} from '../components/CaseKit'

import imgHeroBg       from '../assets/images/bytedance/hero-bg.webp'
import imgTikTok       from '../assets/images/bytedance/tiktok-logo.png'
import resPicker       from '../assets/images/bytedance/research/r1.webp'
import resAisle        from '../assets/images/bytedance/research/r2.webp'
import resCart         from '../assets/images/bytedance/research/r3.webp'
import resFloor        from '../assets/images/bytedance/research/r4.webp'
import sol1Before      from '../assets/images/bytedance/sol1/before.webp'
import sol1After       from '../assets/images/bytedance/sol1/after.webp'
import sol1Custom      from '../assets/images/bytedance/sol1/custom.webp'
import sol2Flow1       from '../assets/images/bytedance/sol2/flow1.webp'
import sol2Flow2       from '../assets/images/bytedance/sol2/flow2.webp'
import sol2Flow3       from '../assets/images/bytedance/sol2/flow3.webp'
import sol3Switch      from '../assets/images/bytedance/sol3/switch.webp'
import sol3PhotoTT     from '../assets/images/bytedance/sol3/photo-tiktok.webp'
import sol3PhotoBD     from '../assets/images/bytedance/sol3/photo-bytedance.webp'
import sol3PhotoBYD    from '../assets/images/bytedance/sol3/photo-byd.webp'
import dsColors        from '../assets/images/bytedance/ds/colors.webp'
import dsIcons         from '../assets/images/bytedance/ds/icons.webp'
import fbRobot         from '../assets/images/bytedance/fb/robot.webp'
import fbJason         from '../assets/images/bytedance/fb/jason.webp'
import lifeOffice      from '../assets/images/bytedance/life/office.webp'
import lifeCity        from '../assets/images/bytedance/life/city.webp'
import lifeLunch       from '../assets/images/bytedance/life/lunch.webp'
import lifeBadge       from '../assets/images/bytedance/life/badge.webp'
import imgWarehouse    from '../assets/images/bytedance/warehouse-robot.webp'
import imgRmsDiagram   from '../assets/images/bytedance/rms-diagram.webp'
import imgLucas        from '../assets/images/bytedance/assets/persona-lucas.png'
import imgJason        from '../assets/images/bytedance/assets/persona-jason.png'
import imgMia          from '../assets/images/bytedance/assets/persona-mia.png'


// User journey map rebuilt from the Figma research board (8 stages, tasks, pain points, emotion curve)
const JOURNEY = [
  { stage: 'Administrator login', mood: 0.85, face: '😊', tasks: ['Basic information entry.', 'Assign user permissions.'], pains: ['Manually selecting business lines is troublesome.'] },
  { stage: 'Complex configuration', mood: 0.55, face: '😵‍💫', tasks: ['Gather the basic information for the complex, including foundational and floor data, and adjust existing complexes.'], pains: ['Different business lines are mixed together in the complex.', 'Search efficiency is low, with many steps.', 'The page entry is buried in a secondary menu.'] },
  { stage: 'Floor configuration', mood: 0.62, face: '😐', tasks: ['View all floors of the complex and the map in use on each.', 'Initialize floor information.'], pains: ['The information layout is not very reasonable.'] },
  { stage: 'Map uploading', mood: 0.05, face: '😵', tasks: ['Upload the floor map for the complex.', "Divide the robot's traversable areas with a grid editor."], pains: ['The layout is odd, colors are striking, and it clashes with norms.', 'Unsure whether the action succeeded.', 'Selecting grid cells one by one is very troublesome.'] },
  { stage: 'Fleet setup', mood: 0.5, face: '😞', tasks: ['Adjust the number of robots operating in the complex.'], pains: ["Have to check a robot's location and battery on another screen."] },
  { stage: 'Point configuration', mood: 0.3, face: '😖', tasks: ['Show the maps and points on each floor and edit point details.', 'Add point business labels by business line.'], pains: ['Important operations lack feedback and reminders.'] },
  { stage: 'Process configuration', mood: 0.55, face: '😦', tasks: ['Add a new assembly line.', 'Edit the assembly line.'], pains: ['The information is somewhat cumbersome.'] },
  { stage: 'Operations configuration', mood: 0.42, face: '😕', tasks: ['Add and edit the operational strategy.', 'Switch the robot mode.'], pains: ['The information is somewhat cumbersome.', 'Switches in the form are easy to hit by accident.'] },
]

// Interview findings: one big number per question, and the same 16-dot graphic (one dot per operator)
const FINDINGS = [
  ['Q1 · Priorities', 12, 'say finding information fast matters most.', [['Easy to operate', 11], ['Real-time status', 7]]],
  ['Q2 · Time cost', 11, 'lose time to too many clicks and page jumps.', [['Confusing structure', 6], ['Alerts easy to miss', 3]]],
  ['Q3 · Errors', 12, 'make five or more mistakes a day.', [['Fewer than five', 4]]],
  ['Q4 · Learning cost', 12, 'found the system complicated to learn.', [['Missing onboarding, inline help, feedback', null]]],
]

function Dots({ n }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 10px)', gap: 6 }}>
      {Array.from({ length: 16 }, (_, i) => <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < n ? INK : 'rgba(0,0,0,0.12)' }} />)}
    </div>
  )
}

function Survey() {
  return (
    <Panel style={{ marginTop: 'clamp(40px, 5vw, 64px)' }}>
      <div style={WIDE}>
        <p style={EYEBROW}>Interviews · 16 operators</p>
        <h3 style={{ ...STATEMENT, maxWidth: 820, margin: '0 0 clamp(40px, 5vw, 64px)' }}>
          Operators wanted speed, <span style={{ color: FADE }}>but the system slowed them down and was hard to learn.</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {FINDINGS.map(([q, n, t, more]) => (
            <div key={q} style={{ background: '#f2f2f2', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontFamily: F, fontSize: 13, color: SUB, textTransform: 'uppercase', letterSpacing: '0.02em', margin: '0 0 28px' }}>{q}</p>
              <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(56px, 5.4vw, 76px)', letterSpacing: '-0.05em', lineHeight: 0.95, color: INK, margin: '0 0 6px' }}>
                {n}<span style={{ fontSize: '0.4em', color: FADE, letterSpacing: '-0.02em' }}> / 16</span>
              </p>
              <p style={{ fontFamily: F, fontSize: 17, lineHeight: 1.35, color: INK, margin: '0 0 24px' }}>{t}</p>
              <Dots n={n} />
              <div style={{ marginTop: 'auto', paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {more.map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontFamily: F, fontSize: 13, color: SUB, borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 8 }}>
                    <span>{k}</span>{v != null && <span>{v} / 16</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

// Solution 03: one client switch in the header swaps the whole workspace
const CLIENTS = [
  { name: 'TikTok Warehouse', flow: 'Picking and sorting', photo: sol3PhotoTT, client: 'warehouse' },
  { name: 'ByteDance Workspace', flow: 'Delivery across the office building', photo: sol3PhotoBD, client: 'workspace' },
  { name: 'BYD Factory', flow: 'Material transport on the line', photo: sol3PhotoBYD, client: 'byd' },
]

function ClientSwitch() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = CLIENTS.length
  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setI(k => (k + 1) % n), 5000)
    return () => clearTimeout(t)
  }, [i, paused, n])
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ overflow: 'hidden', borderRadius: 20 }}>
        <div style={{ display: 'flex', transform: `translateX(-${i * 100}%)`, transition: 'transform 0.7s cubic-bezier(0.65, 0, 0.35, 1)' }}>
          {CLIENTS.map(c => (
            <div key={c.name} className="bd-s3" style={{ flex: '0 0 100%', display: 'grid', gap: 14, alignItems: 'stretch' }}>
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', minHeight: 260 }}>
                <img src={c.photo} alt={`${c.name} robot on site`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', borderRadius: 12, boxShadow: '0 12px 30px rgba(30,50,90,0.10)' }}><ClientDashboard client={c.client} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, marginTop: 28, textAlign: 'center' }}>
        <div>
          <p style={{ fontFamily: F, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', color: INK, margin: 0 }}>{CLIENTS[i].name}</p>
          <p style={{ fontFamily: F, fontSize: 14, color: SUB, margin: '4px 0 0' }}>{CLIENTS[i].flow}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {CLIENTS.map((c, k) => (
              <button key={c.name} onClick={() => setI(k)} aria-label={c.name} style={{ position: 'relative', width: k === i ? 40 : 8, height: 8, borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer', background: 'rgba(0,0,0,0.15)', overflow: 'hidden', transition: 'width 0.3s' }}>
                {k === i && <span key={`${i}-${paused}`} style={{ position: 'absolute', inset: 0, background: INK, transformOrigin: 'left', animation: paused ? 'none' : 'bdProgress 5s linear forwards' }} />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{'.bd-s3{grid-template-columns:1fr}@media(min-width:900px){.bd-s3{grid-template-columns:1fr 2fr}}@keyframes bdProgress{from{transform:scaleX(0)}to{transform:scaleX(1)}}'}</style>
    </div>
  )
}


// Design process as a rising staircase of hairlines (after the AI Finance OS reference)
const PROCESS = [
  ['Scope', ['Problem scope', 'Key objectives']],
  ['Field research', ['Site visits', 'Interviews']],
  ['Synthesis', ['Personas', 'Journey map']],
  ['Design', ['Information architecture', 'Hi-fi prototype']],
  ['Validation', ['Design review', 'Usability tests']],
  ['Delivery', ['RMS V2.0 launch', 'Impact tracking']],
]

function ProcessStairs() {
  const n = PROCESS.length
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 760, display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 14, alignItems: 'end', height: 380 }}>
        {PROCESS.map(([t, tags], i) => (
          <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: `${40 + (i / (n - 1)) * 60}%` }}>
            <p style={{ fontFamily: F, fontSize: 13, color: SUB, textTransform: 'uppercase', letterSpacing: '0.02em', margin: '0 0 12px', textAlign: 'center' }}>{t}</p>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#8a8a8e' }} />
            <div style={{ flex: 1, width: 1, background: 'linear-gradient(180deg, #9a9aa0 0%, rgba(154,154,160,0) 100%)' }} />
            <span style={{ alignSelf: 'stretch', marginTop: 12, fontFamily: F, fontSize: 13, color: SUB, textAlign: 'center', padding: '10px 6px', borderRadius: 999, background: '#f2f2f2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tags[0]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function JourneyMap() {
  const n = JOURNEY.length, CH = 150
  const pts = JOURNEY.map((j, i) => [(i + 0.5) / n * 100, 12 + (1 - j.mood) * (CH - 24)])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')
  const label = { fontFamily: F, fontSize: 11, color: SUB, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }
  const cols = { display: 'grid', gridTemplateColumns: `96px repeat(${n}, minmax(0, 1fr))`, columnGap: 10 }
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 980 }}>
        {/* stages */}
        <div style={cols}>
          <p style={{ ...label, alignSelf: 'center' }}>Stage</p>
          {JOURNEY.map((j, i) => (
            <div key={j.stage} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: '#f2f2f2' }}>
              <span style={{ flex: '0 0 auto', width: 18, height: 18, borderRadius: 5, background: INK, color: '#fff', fontFamily: F, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: INK, lineHeight: 1.25 }}>{j.stage}</span>
            </div>
          ))}
        </div>
        {/* tasks */}
        <div style={{ ...cols, marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <p style={label}>Tasks</p>
          {JOURNEY.map(j => (
            <div key={j.stage}>{j.tasks.map(t => <p key={t} style={{ fontFamily: F, fontSize: 12, lineHeight: 1.45, color: SUB, margin: '0 0 8px' }}>{t}</p>)}</div>
          ))}
        </div>
        {/* pain points */}
        <div style={{ ...cols, marginTop: 14, paddingTop: 18, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <p style={label}>Pain points</p>
          {JOURNEY.map(j => (
            <div key={j.stage} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {j.pains.map(t => <p key={t} style={{ fontFamily: F, fontSize: 12, lineHeight: 1.4, color: INK, margin: 0, padding: '9px 10px', borderRadius: 8, background: '#f5f6f8', border: '1px solid rgba(0,0,0,0.05)' }}>{t}</p>)}
            </div>
          ))}
        </div>
        {/* emotion curve */}
        <div style={{ ...cols, marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <p style={label}>Feeling</p>
          <div style={{ gridColumn: `2 / span ${n}`, position: 'relative', height: CH }}>
            <svg viewBox={`0 0 100 ${CH}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="jm-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d1d1f" stopOpacity="0.07" /><stop offset="1" stopColor="#1d1d1f" stopOpacity="0" /></linearGradient>
              </defs>
              <path d={`${line} L100,${pts[n - 1][1]} L100,${CH} L0,${CH} L0,${pts[0][1]} Z`} fill="url(#jm-fill)" />
              <path d={line} fill="none" stroke="#1d1d1f" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
            {JOURNEY.map((j, i) => (
              <span key={j.stage} style={{ position: 'absolute', left: `${pts[i][0]}%`, top: pts[i][1], transform: 'translate(-50%, -50%)', ...(j.face ? { fontSize: 24, lineHeight: 1 } : { width: 10, height: 10, borderRadius: '50%', background: '#fff', border: '2px solid #1d1d1f' }) }}>{j.face}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ByteDance() {
  return (
    <Page>

      {/* ── HERO ── */}
      <Hero
        bgImage={imgHeroBg}
        light
        logoColor="#1d1d1f"
        brand={<img src={imgTikTok} alt="TikTok" style={{ height: 30, display: 'block', marginBottom: 28 }} />}
        title="Smarter dispatching"
        sub="for 100+ warehouse robots"
      >
        <div style={{ ...WIDE, paddingBottom: 'clamp(24px, 4vw, 48px)' }}>
          <div style={{ width: '88%', margin: '0 auto', borderRadius: 14, boxShadow: '0 30px 80px rgba(40,70,140,0.22), 0 0 0 1px rgba(255,255,255,0.6)' }}>
            <LiveRMS />
          </div>
        </div>
      </Hero>

      {/* ── OVERVIEW ── */}
      <section style={{ ...WIDE, paddingTop: 'clamp(80px, 9vw, 128px)', paddingBottom: GAP }}>
        <SplitRow label="What is RMS?">
          <p style={STATEMENT}>
            <span style={{ color: FADE }}>The Robot Management System is ByteDance AI Lab's platform for</span>{' '}
            monitoring and dispatching warehouse robots{' '}
            <span style={{ color: FADE }}>across buildings, floors, and business lines. I led its UX and UI redesign.</span>
          </p>
          <InfoTable items={[
            ['Project Type', 'Enterprise B2B'],
            ['Company',      'ByteDance'],
            ['Industry',     'Robotics & Logistics'],
            ['Year',         '2024'],
            ['Role',         'Product Designer (UX/UI)'],
            ['Focus',        'Dashboard · Design System'],
          ]} />
        </SplitRow>
      </section>

      {/* ── PROCESS ── */}
      <section style={{ paddingBottom: GAP }}>
        <Panel>
          <ChapterHead eyebrow="Design Process" title="The work moved from the warehouse floor" sub="to a shipped product, one validated step at a time." />
          <div style={WIDE}><ProcessStairs /></div>
        </Panel>
      </section>

      {/* ── IMPACT ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Impact" title="Operators got a system they liked using." sub="NPS rose to 86 after launch." />
        <div style={WIDE}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px 48px' }}>
            {[['86', 'NPS score', 'User satisfaction after launch'], ['100+', 'Robots', 'Monitored in real time'], ['−40%', 'Task time', 'Less time to complete tasks']].map(([n, t, d]) => (
              <div key={t} style={{ borderTop: '1px solid rgba(0,0,0,0.12)', paddingTop: 20 }}>
                <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(48px, 6vw, 80px)', letterSpacing: '-0.05em', lineHeight: 1, color: INK, margin: '0 0 12px' }}>{n}</p>
                <p style={{ fontFamily: F, fontSize: 16, fontWeight: 500, color: INK, margin: '0 0 2px' }}>{t}</p>
                <p style={{ fontFamily: F, fontSize: 14, color: SUB, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ padding: '0 12px 12px' }}>
        <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', height: 'min(86vh, 820px)', minHeight: 520 }}>
          <img src={imgWarehouse} alt="Robot working in a TikTok warehouse aisle" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,14,24,0.72) 0%, rgba(10,14,24,0.35) 38%, rgba(10,14,24,0.05) 62%, rgba(10,14,24,0.35) 100%)' }} />
          <div style={{ ...WIDE, position: 'relative', paddingTop: 'clamp(48px, 7vw, 96px)' }}>
            <p style={{ ...EYEBROW, color: 'rgba(255,255,255,0.7)' }}>The Problem</p>
            <h2 style={{ ...STATEMENT, color: '#fff', maxWidth: 900, fontSize: 'clamp(32px, 4.4vw, 60px)' }}>
              Imagine running 100+ robots across floors and buildings, <span style={{ color: 'rgba(255,255,255,0.62)' }}>with no homepage, no roles, and no dashboard.</span>
            </h2>
          </div>
        </div>
      </section>
      <section style={{ paddingBottom: GAP }}>
        <Panel>
        <div style={WIDE}>
          <figure style={{ margin: '0 0 56px' }}>
            <img src={imgRmsDiagram} alt="RMS connects robots, forklifts and workers across multiple warehouses into one central system" style={{ width: '100%', height: 'auto', display: 'block' }} />
            <figcaption style={{ fontFamily: F, fontSize: 14, color: SUB, textAlign: 'center', marginTop: 16 }}>Robots, forklifts and workers spread across many warehouses, all needing one place to be coordinated.</figcaption>
          </figure>
          <style>{'.bd-bento{display:grid;gap:40px 48px;grid-template-columns:1fr}@media(min-width:900px){.bd-bento{grid-template-columns:1fr 1fr}}'}</style>
          <div className="bd-bento">
            {[
              ['No starting point', 'for operators', 'The system had no homepage, no role separation, and no dashboard. Critical robot data was hard to find.'],
              ['One rigid flow', 'for every warehouse', 'Different sites and roles needed different workflows, but the system could not adapt to them.'],
            ].map(([t, s, d]) => (
              <div key={t} style={{ borderTop: '1px solid rgba(0,0,0,0.12)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(22px, 2.2vw, 28px)', lineHeight: 1.2, letterSpacing: '-0.02em', color: INK, margin: '0 0 12px' }}>
                    {t} <span style={{ color: FADE }}>{s}</span>
                  </p>
                  <P style={{ fontSize: 15 }}>{d}</P>
                </div>
              </div>
            ))}
          </div>
          <p style={{ ...STATEMENT, fontSize: 'clamp(22px, 2.4vw, 30px)', textAlign: 'center', maxWidth: 860, margin: '72px auto 0' }}>
            <span style={{ color: FADE }}>How might we build</span> a clear, scalable RMS <span style={{ color: FADE }}>that lets operators find information, monitor many robots, and finish tasks fast?</span>
          </p>
        </div>
        </Panel>
      </section>

      {/* ── RESEARCH ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Research" title="I went to the warehouses." sub="Three sites, 16 on-site operators, one week of contextual inquiry." />
        <div style={WIDE}>
          <style>{'.bd-field{display:grid;gap:12px;grid-template-columns:1fr 1fr}.bd-field img{width:100%;height:100%;object-fit:cover;display:block;border-radius:20px}@media(min-width:900px){.bd-field{grid-template-columns:1fr 1fr 1.35fr;grid-template-rows:260px 260px}.bd-field .tall{grid-row:span 2}}'}</style>
          <div className="bd-field">
            <img className="tall" src={resPicker} alt="Operator loading a picking robot between shelves" />
            <img className="tall" src={resAisle} alt="Picking robot waiting in a narrow warehouse aisle" />
            <img src={resCart} alt="Robot basket filled with picked orders" />
            <img src={resFloor} alt="Robot travelling down the main warehouse floor" />
          </div>
        </div>
        <Survey />
      </section>

      {/* ── PERSONAS ── */}
      <section style={{ paddingBottom: GAP }}>
        <Panel>
          <ChapterHead eyebrow="Personas" title="Three operators," sub="three ways of getting stuck." />
          <div style={WIDE}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {[
                { img: imgLucas, name: 'Lucas', role: 'TikTok Warehouse', quote: 'I want to see robot performance and status on one clear dashboard.', pains: ['Too many steps to find data', 'Robot status lags behind', 'Inconsistent interface styles'] },
                { img: imgJason, name: 'Jason', role: 'BYD Factory', quote: 'I want the system to flag robot anomalies right away.', pains: ['Feedback is not intuitive', 'Alert levels are weak', 'Information is out of sync'] },
                { img: imgMia, name: 'Mia', role: 'ByteDance Workspace', quote: 'I want critical data without digging through menus.', pains: ['Robot status is hard to check', 'Faults are hard to locate across floors', 'Permissions are messy'] },
              ].map(p => (
                <div key={p.name} style={{ background: '#f2f2f2', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: 300, backgroundImage: 'radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)', backgroundSize: '10px 10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: '12%' }}>
                    <img src={p.img} alt={p.name} style={{ height: '88%', objectFit: 'contain', marginBottom: 20 }} />
                    <div style={{ position: 'absolute', left: 20, top: 20 }}>
                      <p style={{ fontFamily: F, fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', color: INK, margin: 0 }}>{p.name}</p>
                      <p style={{ fontFamily: F, fontSize: 13, color: SUB, textTransform: 'uppercase', letterSpacing: '0.02em', margin: '4px 0 0' }}>{p.role}</p>
                    </div>
                  </div>
                  <div style={{ background: '#fff', margin: 8, borderRadius: 12, padding: '24px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontFamily: F, fontSize: 20, fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.02em', color: INK, margin: '0 0 24px' }}>“{p.quote}”</p>
                    <div style={{ marginTop: 'auto' }}>
                      {p.pains.map(x => <p key={x} style={{ fontFamily: F, fontSize: 14, color: SUB, margin: 0, padding: '10px 0', borderTop: '1px solid rgba(0,0,0,0.08)' }}>{x}</p>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height: 'clamp(56px, 7vw, 96px)' }} />
            <JourneyMap />
          </div>
        </Panel>
      </section>

      {/* ── INSIGHT ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead center eyebrow="Insight & Strategy" title="Separate where robots are" sub="from what they are doing."
          body="Splitting physical data (floors, maps, zones) from operational data (tasks, status, alerts) became the backbone of the redesign." />
      </section>

      {/* ── SOLUTION ── */}
      <section style={{ paddingBottom: 'clamp(96px, 10vw, 140px)' }}>
        <Panel soft>
        <ChapterHead eyebrow="The Solution" title="Faster daily work, clearer management," sub="and a system that grows with every client."
          body="Working closely with key users, I separated physical data (floors, maps, facilities) from business workflows, giving the system a logical, scalable foundation. On top of it sits one dashboard for robot status, alerts, and quick actions, customizable for each client and robot type." />
        <div style={WIDE}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {[
                [[<LiveRMS key="a" />, 1470 / 919], 'Critical data, one click away.', 'Data access used to take multiple filters and steps. A simplified information flow and dashboard layout fixed that.'],
                [[<div key="b" style={{ position: 'relative', width: '100%', height: '100%' }}><ScaledWarehouse /></div>, 1267 / 618], 'Every robot in one view.', 'There was no central place to monitor robots. One dashboard now shows status, alerts, and quick actions together.'],
                [[<ClientDashboard key="c" client="workspace" />, 450 / 216], 'Tailored to every client.', 'The system could not adapt to different clients. Customizable modules let each one shape its own workflows.'],
              ].map(([img, t, d]) => (
                <div key={t} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ background: '#f2f2f2', backgroundImage: 'radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)', backgroundSize: '10px 10px', aspectRatio: '4 / 3', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: '11%', top: '15%', height: '100%', aspectRatio: img[1], borderRadius: '10px 0 0 0', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.7)', borderRight: 'none', borderBottom: 'none', boxShadow: '0 12px 36px rgba(30,50,90,0.16)' }}>{img[0]}</div>
                  </div>
                  <div style={{ padding: '28px 24px 30px' }}>
                    <p style={{ fontFamily: F, fontSize: 24, fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.02em', color: INK, margin: '0 0 10px' }}>{t}</p>
                    <P style={{ fontSize: 14, lineHeight: '22px' }}>{d}</P>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </Panel>
      </section>
      <section style={{ paddingBottom: GAP }}>
        <div style={{ ...WIDE, display: 'flex', flexDirection: 'column', gap: 'clamp(80px, 10vw, 140px)' }}>
          <div>
            <div style={{ maxWidth: 640, marginBottom: 40 }}>
              <p style={EYEBROW}>01  Homepage</p>
              <h3 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(26px, 2.8vw, 36px)', lineHeight: 1.18, letterSpacing: '-0.03em', color: INK, margin: '0 0 16px' }}>
                From complexity <span style={{ color: FADE }}>to efficiency</span>
              </h3>
              <P>Simplified the information flow and dashboard layout, so critical data is one step away.</P>
            </div>
            <div className="bd-ba" style={{ display: 'grid', gap: '40px 32px' }}>
              <style>{'.bd-ba{grid-template-columns:1fr}@media(min-width:900px){.bd-ba{grid-template-columns:1.196fr 1fr}}'}</style>
              {[
                ['Before', 'Fragmented, hidden, and hard to operate', 'The original RMS had no homepage and no central monitoring. Operators jumped between pages for basic information, which slowed every decision.', sol1Before, false],
                ['After', 'A clearer, faster, smarter dashboard', 'A real homepage and dashboard let operators read key data, watch many robots at once, and finish tasks faster.', sol1After, true],
              ].map(([tag, t, d, img, good]) => (
                <div key={tag} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ alignSelf: 'flex-start', fontFamily: F, fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', padding: '5px 12px', borderRadius: 999, color: good ? '#fff' : SUB, background: good ? INK : 'rgba(0,0,0,0.05)', marginBottom: 16 }}>{tag}</span>
                  <p style={{ fontFamily: F, fontSize: 19, fontWeight: 500, letterSpacing: '-0.01em', color: INK, margin: '0 0 8px' }}>{t}</p>
                  <P style={{ fontSize: 15, marginBottom: 24 }}>{d}</P>
                  {good
                    ? <div style={{ marginTop: 'auto', borderRadius: 10, overflow: 'hidden', boxShadow: '0 12px 30px rgba(30,50,90,0.12), 0 0 0 1px rgba(0,0,0,0.05)' }}><LiveRMS /></div>
                    : <img src={img} alt={`${tag}: RMS homepage`} style={{ marginTop: 'auto', width: '100%', display: 'block', borderRadius: 10, background: '#fff', boxShadow: '0 12px 30px rgba(30,50,90,0.12), 0 0 0 1px rgba(0,0,0,0.05)' }} />}
                </div>
              ))}
            </div>
            <div style={{ height: 'clamp(56px, 7vw, 96px)' }} />
            <SolutionRow flip bg="transparent" n="Personalized setup" lines={['Quick access', 'to the pages', 'you use most']}
              body="Each operator picks their frequent pages from a drawer and reorders them, so the homepage fits their role and cuts clicks and page jumps for daily work.">
              <div style={{ borderRadius: 14, overflow: 'hidden', border: '2px solid #cfd5de' }}><img src={sol1Custom} alt="Drawer for choosing and ordering frequently used pages" style={{ width: '100%', display: 'block' }} /></div>
            </SolutionRow>
          </div>
          <div>
            <div style={{ maxWidth: 640, marginBottom: 40 }}>
              <p style={EYEBROW}>02  Dashboard</p>
              <h3 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(26px, 2.8vw, 36px)', lineHeight: 1.18, letterSpacing: '-0.03em', color: INK, margin: '0 0 16px' }}>
                See, act, and control <span style={{ color: FADE }}>in one place</span>
              </h3>
              <P>A unified dashboard gives clear visibility into robot status, alerts, and quick actions.</P>
            </div>
            <div>
            <div style={{ position: 'relative', aspectRatio: '1267 / 618', borderRadius: 16, overflow: 'hidden', boxShadow: '0 30px 80px rgba(30,50,90,0.14), 0 0 0 1px rgba(0,0,0,0.04)' }}><ScaledWarehouse /></div>
            <div className="bd-s2" style={{ display: 'grid', gap: '40px 64px', marginTop: 'clamp(40px, 5vw, 64px)' }}>
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)', paddingTop: 22 }}>
                <p style={{ fontFamily: F, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', color: INK, margin: '0 0 10px' }}>Global monitoring</p>
                <P style={{ maxWidth: 440 }}>A live map shows where every robot is, which way it is heading, and how it is running, floor by floor.</P>
              </div>
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)', paddingTop: 22 }}>
                <p style={{ fontFamily: F, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', color: INK, margin: '0 0 10px' }}>Robot status at a glance</p>
                <P style={{ maxWidth: 440, marginBottom: 24 }}>Each status has one color, shared by map pins and dashboard cards, so operators never have to decode it.</P>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 28px' }}>
                  {[['Running', '#23c343'], ['Charging', '#4080ff'], ['Idle', '#ffb65d'], ['Error', '#f76560']].map(([t, c]) => (
                    <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: 14, color: INK }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, boxShadow: `0 0 0 4px ${c}33` }} />{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <style>{'.bd-s2{grid-template-columns:1fr}@media(min-width:900px){.bd-s2{grid-template-columns:1fr 1fr}}.bd-flow{display:grid;gap:clamp(20px,4vw,56px);align-items:center;grid-template-columns:1fr}@media(min-width:900px){.bd-flow{grid-template-columns:1.5fr 1fr}.bd-flow.flip>img{order:2}}'}</style>

            <div style={{ marginTop: 'clamp(72px, 9vw, 120px)', paddingTop: 'clamp(40px, 5vw, 64px)', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 4vw, 48px)' }}>
              <p style={{ fontFamily: F, fontSize: 12, color: SUB, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0, textAlign: 'center' }}>How RMS runs the warehouse floor</p>
              {[
                [sol2Flow1, '1', 'Inventory registration', 'Inventory is scanned into RMS and mapped to zones and storage locations.'],
                [sol2Flow2, '2', 'Robots pick on assignment', 'Robots navigate the shelves, locate items, and pick based on real-time tasks sent by RMS.'],
                [sol2Flow3, '3', 'Outbound logistics', 'Picked items are moved, sorted, and prepared for outbound delivery.'],
              ].map(([img, n, t, d], i) => (
                <div key={n} className={`bd-flow${i % 2 ? ' flip' : ''}`}>
                  <img src={img} alt={t} style={{ width: '100%', display: 'block', mixBlendMode: 'multiply' }} />
                  <div>
                    <span style={{ display: 'inline-flex', width: 28, height: 28, borderRadius: 8, background: INK, color: '#fff', fontFamily: F, fontSize: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{n}</span>
                    <p style={{ fontFamily: F, fontSize: 'clamp(20px, 2vw, 24px)', fontWeight: 500, letterSpacing: '-0.02em', color: INK, margin: '0 0 8px' }}>{t}</p>
                    <P style={{ fontSize: 15, maxWidth: 340 }}>{d}</P>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
          <div>
            <div style={{ maxWidth: 640, marginBottom: 40 }}>
              <p style={EYEBROW}>03  Customization</p>
              <h3 style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(26px, 2.8vw, 36px)', lineHeight: 1.18, letterSpacing: '-0.03em', color: INK, margin: '0 0 16px' }}>
                Tailored workflows <span style={{ color: FADE }}>for diverse clients</span>
              </h3>
              <P>Customizable modules let each client shape its own workflows and views. One switch in the header changes the whole workspace.</P>
            </div>
            <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'center' }}>
              <img src={sol3Switch} alt="Client switcher in the RMS header" style={{ width: '100%', maxWidth: 760, display: 'block', filter: 'drop-shadow(0 16px 30px rgba(30,50,90,0.14))' }} />
            </div>
            <ClientSwitch />
          </div>
        </div>
      </section>

      {/* ── DESIGN SYSTEM ── */}
      <section style={{ paddingBottom: GAP }}>
        <Panel>
        <ChapterHead eyebrow="Design System" title="A design system" sub="that helps operators finish tasks faster." />
        <div style={{ ...WIDE, display: 'flex', flexDirection: 'column', gap: 'clamp(56px, 7vw, 96px)' }}>
          {[
            ['Color palette', "Blue is RMS's main color. It carries the brand's identity and marks primary buttons, search bars, icons, and other key touchpoints, while a neutral gray scale keeps dense data calm.", dsColors, 'RMS color palette with brand blues and neutral grays'],
            ['Icon design', 'Line icons turn into filled, blue-gradient icons when selected, so the active page stays obvious and navigation feels continuous.', dsIcons, 'RMS icon set with default and selected states'],
          ].map(([t, d, img, alt]) => (
            <div key={t}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 48px', alignItems: 'baseline', marginBottom: 28 }}>
                <h3 style={{ flex: '0 0 220px', fontFamily: F, fontWeight: 500, fontSize: 'clamp(22px, 2.2vw, 28px)', letterSpacing: '-0.02em', color: INK, margin: 0 }}>{t}</h3>
                <P style={{ flex: '1 1 420px', maxWidth: 620 }}>{d}</P>
              </div>
              <div>
                <img src={img} alt={alt} style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
          ))}
        </div>
        </Panel>
      </section>

      {/* ── FEEDBACK ── */}
      <section style={{ paddingBottom: GAP }}>
        <div style={WIDE}>
          <div>
            <div style={{ marginBottom: 32 }}>
              <p style={EYEBROW}>User feedback</p>
              <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(26px, 3.4vw, 44px)', lineHeight: 1.2, letterSpacing: '-0.03em', color: INK, margin: '0 0 32px', maxWidth: 900 }}>
                “Now we can manage different robots from one platform. <span style={{ color: FADE }}>Much faster and easier than before.”</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src={fbJason} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <p style={{ fontFamily: F, fontSize: 16, fontWeight: 500, color: INK, margin: 0 }}>Jason Lee</p>
                  <p style={{ fontFamily: F, fontSize: 14, color: SUB, margin: 0 }}>Robot Operator</p>
                </div>
              </div>
            </div>
            <div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto' }}>
              <div style={{ position: 'relative', aspectRatio: '1536 / 1024' }}>
                <div style={{ position: 'absolute', top: '8.1%', left: '8.72%', width: '82.49%', height: '60.35%' }}>
                  <ScaledWarehouse />
                </div>
                <img src="/cisco-ui/monitor-frame-17.png" alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
              </div>
              <img src={fbRobot} alt="" aria-hidden style={{ position: 'absolute', right: '-2%', bottom: '4%', width: '15%', filter: 'drop-shadow(0 24px 24px rgba(0,0,0,0.18))' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── REFLECTION ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Reflection" title="What RMS taught me" sub="about designing internal tools." />
        <div style={WIDE}>
          <div className="bd-life" style={{ display: 'grid', gap: 12, marginBottom: 12 }}>
            {[[lifeOffice, 'Finnick at the ByteDance office', 'wide'], [lifeCity, 'View from the ByteDance office'], [lifeLunch, 'Lunch with a view at ByteDance'], [lifeBadge, 'ByteDance employee badge']].map(([src, alt, cls]) => (
              <div key={alt} className={cls} style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', minHeight: 240 }}>
                <img src={src} alt={alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px 48px', marginTop: 24 }}>
            {[
              ['Business knowledge is key', 'Internal products run on complex business logic, with many branches and permissions. Understanding each business line and how they connect was crucial, and flowcharts and diagrams made it clear for everyone.'],
              ['Standardized workflows matter', 'Skipping process led to review disagreements and slowed us down. A defined flow of self-check, design review, and development review kept decisions objective and reduced rework.'],
              ['Talk deeply with users', 'Internal tools shape how employees work every day. Talking with many different operators pointed the direction and surfaced problems nobody had written down.'],
            ].map(([t, d], k) => (
              <div key={t} style={{ borderTop: '1px solid rgba(0,0,0,0.12)', paddingTop: 20 }}>
                <p style={{ fontFamily: F, fontSize: 13, color: SUB, margin: '0 0 10px' }}>0{k + 1}</p>
                <p style={{ fontFamily: F, fontSize: 19, fontWeight: 500, letterSpacing: '-0.01em', color: INK, margin: '0 0 8px' }}>{t}</p>
                <P style={{ fontSize: 15 }}>{d}</P>
              </div>
            ))}
          </div>
          <style>{'.bd-life{grid-template-columns:1fr 1fr 1fr}.bd-life .wide{grid-column:span 3;min-height:300px}@media(min-width:900px){.bd-life{grid-template-columns:2fr 1fr 1fr 1fr;grid-auto-rows:380px}.bd-life .wide{grid-column:auto}}'}</style>
        </div>
      </section>

      <ContactCTA />
      <FooterNav />
    </Page>
  )
}
