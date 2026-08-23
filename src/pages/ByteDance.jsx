import { Link } from 'react-router-dom'

import imgWarehouse    from '../assets/images/bytedance/warehouse-hero.png'
import imgFinnick      from '../assets/images/bytedance/finnick-photo.png'
import imgChallengeBg  from '../assets/images/bytedance/assets/challenge-card2-bg.png'
import imgLucas        from '../assets/images/bytedance/assets/persona-lucas.png'
import imgJason        from '../assets/images/bytedance/assets/persona-jason.png'
import imgMia          from '../assets/images/bytedance/assets/persona-mia.png'
import imgColors       from '../assets/images/bytedance/sections/s21-design-system.png'
import imgIconSystem   from '../assets/images/bytedance/sections/s22-design-system2.png'
import imgFeedback     from '../assets/images/bytedance/sections/s24-final.png'

// Precisely-extracted, native-resolution slide exports pulled directly from the
// original Figma frames (one frame = one export, no manual pixel-cropping)
import slideContext    from '../assets/images/bytedance/slides/slide2_context_timeline_research.png'
import slideUxMap      from '../assets/images/bytedance/slides/slide3_persona_uxmap.png'
import slideInsight    from '../assets/images/bytedance/slides/slide4_needs_insight_okr.png'
import slideTask3      from '../assets/images/bytedance/slides/slide7_task3_management.png'
import slideFactory    from '../assets/images/bytedance/slides/slide8_impact_factory.png'

// Individually-extracted elements (single Figma component per export, not a flattened slide)
import task1Hero        from '../assets/images/bytedance/elements/task1-macbook-hero.png'
import task1Colors      from '../assets/images/bytedance/elements/task1-color-palette.png'
import task1Icons       from '../assets/images/bytedance/elements/task1-icon-design.png'
import task2Before      from '../assets/images/bytedance/elements/task2-before-list.png'
import task2After       from '../assets/images/bytedance/elements/task2-after-dashboard.png'
import task2Solution1   from '../assets/images/bytedance/elements/task2-solution1.png'
import task2Solution2   from '../assets/images/bytedance/elements/task2-solution2.png'

// ─── tokens ──────────────────────────────────────────────
const INK   = '#0a0d14'
const GRAY  = '#6b7280'
const RULE  = '#e5e7eb'
const BLUE  = '#2563eb'
const BG    = '#f9fafb'
const F     = 'Inter, sans-serif'

export default function ByteDance() {
  return (
    <div style={{ background: '#fff', color: INK, fontFamily: F }}>

      {/* ── NAV ── */}
      <header style={{ borderBottom: `1px solid ${RULE}`, padding: '0 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link to="/" style={{ fontFamily: F, fontSize: 13, color: GRAY, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={e => e.currentTarget.style.color = INK}
          onMouseLeave={e => e.currentTarget.style.color = GRAY}
        >← All Work</Link>
        <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: INK }}>ByteDance · RMS</span>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['#challenge','Challenge'],['#research','Research'],['#solution','Solution']].map(([h,l]) => (
            <a key={h} href={h} style={{ fontFamily: F, fontSize: 13, color: GRAY, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = INK}
              onMouseLeave={e => e.currentTarget.style.color = GRAY}>{l}</a>
          ))}
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ padding: '100px 60px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: BLUE }}>ByteDance · AI Lab</span>
          <span style={{ height: 1, flex: 1, background: RULE }} />
          <span style={{ fontFamily: F, fontSize: 12, color: GRAY }}>2022–2023</span>
        </div>

        <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(40px,5.5vw,72px)', lineHeight: 1.1, letterSpacing: '-2px', color: INK, maxWidth: 760, margin: '0 0 32px' }}>
          Smarter Dispatching<br/>for 100+ Warehouse<br/>
          <span style={{ color: BLUE }}>Robots</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, borderTop: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}`, marginBottom: 64 }}>
          {[['Role','Product Designer (UX/UI)'],['Industry','Enterprise · B2B'],['Year','2022 – 2023'],['Outcome','NPS Score 86']].map(([k,v]) => (
            <div key={k} style={{ borderRight: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}`, padding: '20px 24px' }}>
              <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: GRAY, margin: '0 0 6px' }}>{k}</p>
              <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: INK, margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${RULE}` }}>
          <img src={imgWarehouse} alt="TikTok warehouse with AGV robots" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <Num>01</Num>
          <h2 style={H2}>Robot Management System</h2>
          <p style={{ ...Body, marginBottom: 20 }}>The Robot Management System (RMS) at ByteDance is a next-generation solution for improving AGV/AMR management across logistics and manufacturing, offering customizable, scalable workflows for warehouse operations at scale.</p>
          <p style={Body}>I led UX/UI design for RMS within ByteDance's AI Lab, enhancing visibility, monitoring, and control across multi-robot operations in TikTok's warehouses. I built reusable design components and laid the foundation for a cohesive design system.</p>
        </div>
        <div style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${RULE}` }}>
          <img src={imgFinnick} alt="Finnick at ByteDance office" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      <Divider />

      {/* ── IMPACT ── */}
      <section style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <Num>02</Num>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 72 }}>
          <h2 style={H2}>Impact</h2>
          <p style={Body}>Achieved an NPS score of 86. The redesigned RMS interface transformed the user experience, powering real-time monitoring for 100+ warehouse robots and dramatically reducing task completion time.</p>
        </div>

        {/* Big stat */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, borderTop: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}`, marginBottom: 48 }}>
          {[['86','NPS Score','User satisfaction post-launch'],['100+','Robots','Monitored in real time per operator'],['−40%','Task Time','Reduction in task completion time']].map(([n,u,d]) => (
            <div key={u} style={{ borderRight: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}`, padding: '48px 40px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: 64, color: BLUE, letterSpacing: '-2px', lineHeight: 1 }}>{n}</span>
                <span style={{ fontFamily: F, fontWeight: 600, fontSize: 16, color: INK }}>{u}</span>
              </div>
              <p style={{ fontFamily: F, fontSize: 13, color: GRAY, margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { neg: '−40%', negLabel: 'Multiple redirects.', pos: '+18%', posLabel: 'Overall Task Efficiency', dot: 0.32 },
            { neg: '−30%', negLabel: 'Non-standard designs',  pos: '+60',  posLabel: 'Reusable components',    dot: 0.5 },
            { neg: '−25%', negLabel: 'Navigation time',       pos: '+80%', posLabel: 'Information clarity',    dot: 0.72 },
          ].map(c => <ImpactTrendCard key={c.negLabel} {...c} />)}
        </div>
      </section>

      <Divider />

      {/* ── CHALLENGE ── */}
      <section id="challenge" style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <Num>03</Num>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 64 }}>
          <h2 style={H2}>The Challenge</h2>
          <p style={Body}>As RMS expanded into smart manufacturing and delivery, operations multiplied and information fragmented, creating an urgent need for a unified, adaptable system.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          <div style={{ border: `1px solid ${RULE}`, borderRadius: 14, padding: '36px 32px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 16 }}>⊘</span>
            </div>
            <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 17, color: INK, margin: '0 0 12px', lineHeight: 1.4 }}>No foundational structure for operators</h3>
            <p style={{ fontFamily: F, fontSize: 14, color: GRAY, lineHeight: 1.75, margin: 0 }}>The system lacked a homepage, user-role separation, and a dashboard. Operators had no starting point and struggled to locate critical robot data.</p>
          </div>
          <div style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', minHeight: 280 }}>
            <img src={imgChallengeBg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.86) 0%, transparent 60%)' }} />
            <p style={{ position: 'absolute', bottom: 24, left: 24, right: 24, fontFamily: F, fontWeight: 600, fontSize: 16, color: '#fff', margin: 0, lineHeight: 1.5 }}>No centralized way to monitor or coordinate robots across floors and buildings.</p>
          </div>
          <div style={{ border: `1px solid ${RULE}`, borderRadius: 14, padding: '36px 32px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 16 }}>⊞</span>
            </div>
            <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 17, color: INK, margin: '0 0 12px', lineHeight: 1.4 }}>System logic wasn't adaptable across users</h3>
            <p style={{ fontFamily: F, fontSize: 14, color: GRAY, lineHeight: 1.75, margin: 0 }}>Different warehouses and user roles required different workflows, but the system was too rigid to accommodate variation.</p>
          </div>
        </div>

        {/* HMW */}
        <div style={{ marginTop: 48, border: `1px solid ${RULE}`, borderRadius: 14, padding: '48px 56px', background: BG }}>
          <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: BLUE, margin: '0 0 20px' }}>Design Question</p>
          <p style={{ fontFamily: F, fontWeight: 600, fontSize: 'clamp(18px,2.2vw,26px)', color: INK, lineHeight: 1.6, margin: 0, maxWidth: 760 }}>
            "How might we build a clear and scalable RMS structure that allows operators to easily access information, monitor multiple robots, and complete tasks efficiently?"
          </p>
        </div>
      </section>

      <Divider />

      {/* ── RESEARCH ── */}
      <section id="research" style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <Num>04</Num>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 56 }}>
          <h2 style={H2}>Context & Research</h2>
          <p style={Body}>Visited three warehouse contexts: TikTok E-Commerce, BYD Factory, and the ByteDance Workspace. Mapped the project timeline and observed how operators interacted with robots to understand their core needs.</p>
        </div>
        <Img src={slideContext} alt="Project context, timeline, and research across three warehouses" />
      </section>

      {/* ── PERSONA ── */}
      <section style={{ background: INK, padding: '120px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Num light>05</Num>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 56 }}>
            <h2 style={{ ...H2, color: '#fff' }}>Persona</h2>
            <p style={{ ...Body, color: 'rgba(255,255,255,0.5)' }}>Three operator archetypes emerged from field research, each with distinct workflows and pain points.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { img: imgLucas, name: 'Lucas', role: 'TT Robot Operator',
                quote: '"I hope to monitor robot performance and status through an intuitive data dashboard."',
                pains: ['Many steps, hard to pinpoint data','Robot monitoring is lagging','Interface styles are inconsistent'] },
              { img: imgJason, name: 'Jason', role: 'BYD Robot Operator',
                quote: '"I want the system to highlight anomalies in robot operations immediately."',
                pains: ['Feedback is not intuitive','Alert levels are weak','Information is not synchronized'] },
              { img: imgMia,   name: 'MIA', role: 'BD Robot Operator',
                quote: '"RMS should let me access critical data without navigating multiple menus."',
                pains: ['Robot status is hard to check','Hard to locate faults across floors','Permission allocation is chaotic'] },
            ].map(({ img, name, role, quote, pains }) => (
              <div key={name} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ height: 200, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 24px', position: 'relative', overflow: 'hidden' }}>
                  <img src={img} alt={name} style={{ height: '92%', objectFit: 'contain', objectPosition: 'center bottom' }} />
                  <div style={{ position: 'absolute', top: 20, left: 20 }}>
                    <p style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: '#fff', margin: '0 0 2px' }}>{name}</p>
                    <p style={{ fontFamily: F, fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{role}</p>
                  </div>
                </div>
                <div style={{ padding: '20px 22px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontFamily: F, fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, margin: '0 0 20px' }}>{quote}</p>
                  <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: BLUE, margin: '0 0 10px' }}>Pain Points</p>
                  {pains.map(p => (
                    <p key={p} style={{ fontFamily: F, fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '0 0 6px', paddingLeft: 14, position: 'relative', lineHeight: 1.5 }}>
                      <span style={{ position: 'absolute', left: 0, color: BLUE }}>·</span>{p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 64 }}>
            <FeatureLabel light num="05.1">User Experience Map</FeatureLabel>
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <img src={slideUxMap} alt="Persona and user experience map across the operator journey" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINDINGS / IA ── */}
      <section style={{ background: BG, padding: '120px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Num>06</Num>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 56 }}>
            <h2 style={H2}>Insight & Strategy</h2>
            <p style={Body}>Broke the needs down into a clear insight, then translated it into three concrete OKRs. This structure separated physical data (floors, maps, zones) from operational data (tasks, robot status, alerts) and set the direction for the redesign.</p>
          </div>
          <Img src={slideInsight} alt="Needs analysis, core insight, and task OKRs" />
        </div>
      </section>

      <Divider />

      {/* ── SOLUTION ── */}
      <section id="solution" style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <Num>07</Num>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 80 }}>
          <h2 style={H2}>Solution</h2>
          <p style={Body}>Three focused workstreams, each pairing a concrete problem with a shipped fix: a stronger brand presence, faster day-to-day operation, and clearer management tools.</p>
        </div>

        {/* Task 1 */}
        <div style={{ marginBottom: 96 }}>
          <FeatureLabel num="07.1">Task 1 · Enhance the Brand Image</FeatureLabel>

          <SubFeature
            title="Home Dashboard"
            body="V1.0's homepage was rudimentary. Redesigned with ARCO's guidelines, it now surfaces core operational data, quick buttons, system announcements, and personal info in one place, covering the needs of internal operations, external management, product managers, and customers alike. Every module on the homepage is customizable and configurable."
            img={task1Hero}
            alt="Redesigned RMS homepage dashboard, shown on a laptop mockup"
            imgFirst
          />
          <SubFeature
            title="Color Palette"
            body="RMS's main color is blue, representing the brand's image and VI identity. It's used for main buttons, search bars, icons, and other places that highlight brand features."
            img={task1Colors}
            alt="RMS color palette with hex values"
          />
          <SubFeature
            title="Icon Design"
            body="Icons are key UI elements, frequently used throughout the design. I built a public icon library to standardize the graphics and style of all basic B2B icons, solving reuse issues across platforms and unifying brand experience and recognition."
            img={task1Icons}
            alt="Public icon library grid for the RMS design system"
          />
        </div>

        {/* Task 2 */}
        <div style={{ marginBottom: 96 }}>
          <FeatureLabel num="07.2">Task 2 · Improve Work Efficiency</FeatureLabel>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
            <div>
              <BeforeAfterTag kind="before" />
              <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${RULE}`, marginTop: 12 }}>
                <img src={task2Before} alt="Old fragmented RMS homepage, before redesign" style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
            <div>
              <BeforeAfterTag kind="after" />
              <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${RULE}`, marginTop: 12 }}>
                <img src={task2After} alt="Redesigned RMS homepage with quick access panel" style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
          </div>

          <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: GRAY, margin: '0 0 16px' }}>Problems we found</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 48 }}>
            {[
              'V1.0 homepage is rudimentary with limited information, leading to low efficiency for operational staff in viewing information.',
              'Lacking quick access, operators need multiple steps to find abnormal robots.',
              'The form has high information density, making it difficult to find needed details.',
              'The switch placement is unreasonable, and users often accidentally touch it without a second confirmation.',
            ].map((text, i) => (
              <div key={i} style={{ border: `1px solid ${RULE}`, borderRadius: 12, padding: '18px 16px' }}>
                <p style={{ fontFamily: F, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#dc2626', margin: '0 0 8px' }}>Problem {i + 1}</p>
                <p style={{ fontFamily: F, fontSize: 13, color: GRAY, lineHeight: 1.6, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: GRAY, margin: '0 0 16px' }}>How we solved it</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 14 }}>
            <SolutionCard
              num={1}
              text="Cover various roles' use of information and functions, and display key field data based on business needs."
              img={task2Solution1}
              alt="Solution 1 screenshot"
            />
            <SolutionCard
              num={2}
              text="Include more information and feature entries on the homepage to avoid multiple clicks and transitions, reducing learning and usage costs for high-frequency users."
              img={task2Solution2}
              alt="Solution 2 quick-access panel screenshot"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <SolutionCard
              num={3}
              text="Isolate different businesses and automatically match buildings based on user roles, eliminating the need to search for the required building in a long list."
            />
            <SolutionCard
              num={4}
              text="Moved the original switch location and added modal and drawer components. Editing operations now require a second confirmation to prevent user errors."
            />
          </div>
        </div>

        {/* Task 3 */}
        <div style={{ marginBottom: 0 }}>
          <FeatureLabel num="07.3">Task 3 · Enhance Management Capabilities</FeatureLabel>
          <p style={{ fontFamily: F, fontSize: 14, color: GRAY, lineHeight: 1.75, margin: '0 0 24px', maxWidth: 640 }}>Gave managers building-level visibility and permission controls, so different warehouses and roles could run their own configurations without breaking the shared system.</p>
          <Img src={slideTask3} alt="Task 3 solutions: building management view and role-based permissions" />
        </div>
      </section>

      {/* ── WORKFLOW ── */}
      <section style={{ background: BG, padding: '120px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Num>08</Num>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 56 }}>
            <h2 style={H2}>Tailored Across Clients</h2>
            <p style={Body}>Customizable modules let clients adapt workflows and views to different warehouse layouts, robot types, and user roles, without breaking the overall information structure. Deployed across the BYD factory floor and the ByteDance workspace.</p>
          </div>
          <Img src={slideFactory} alt="RMS deployed on the BYD factory floor and across ByteDance's workspace" />
        </div>
      </section>

      {/* ── DESIGN SYSTEM ── */}
      <section id="system" style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <Num>09</Num>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 56 }}>
          <h2 style={H2}>Design System</h2>
          <p style={Body}>Established a cohesive design system: a unified color palette and icon library that reflects RMS's brand identity and improves visual consistency across the platform.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Img src={imgColors} alt="Color palette" />
          <Img src={imgIconSystem} alt="Icon system" />
        </div>
      </section>

      {/* ── FEEDBACK ── */}
      <section style={{ background: INK, padding: '120px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Num light>10</Num>
          <h2 style={{ ...H2, color: '#fff', marginBottom: 56 }}>User's Feedback</h2>
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <img src={imgFeedback} alt="Jason Lee feedback" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: `1px solid ${RULE}`, padding: '40px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
        <Link to="/" style={{ fontFamily: F, fontSize: 13, color: GRAY, textDecoration: 'none' }}
          onMouseEnter={e=>e.currentTarget.style.color=INK} onMouseLeave={e=>e.currentTarget.style.color=GRAY}>← All Work</Link>
        <p style={{ fontFamily: F, fontSize: 12, color: GRAY, margin: 0 }}>© 2026 Finnick Chen</p>
      </div>
    </div>
  )
}

// ── Design helpers ─────────────────────────────────────────
const H2   = { fontFamily:'Inter,sans-serif', fontWeight:800, fontSize:'clamp(32px,3.5vw,48px)', letterSpacing:'-1px', lineHeight:1.1, color:'#0a0d14', margin:'0 0 24px' }
const Body = { fontFamily:'Inter,sans-serif', fontSize:15, color:'#6b7280', lineHeight:1.8, margin:0 }

function Num({ children, light }) {
  return <p style={{ fontFamily:'Inter,sans-serif', fontWeight:800, fontSize:11, letterSpacing:'0.16em', color: light ? 'rgba(255,255,255,0.2)' : '#e5e7eb', margin:'0 0 20px' }}>{children}</p>
}

function Divider() {
  return <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 60px' }}><div style={{ height:1, background:'#e5e7eb' }}/></div>
}

function Img({ src, alt }) {
  return (
    <div style={{ borderRadius:14, overflow:'hidden', border:`1px solid #e5e7eb` }}>
      <img src={src} alt={alt} style={{ width:'100%', display:'block' }}/>
    </div>
  )
}

function FeatureLabel({ num, children, light }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
      <span style={{ fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'#60a5fa' }}>{num}</span>
      <span style={{ fontFamily:'Inter,sans-serif', fontWeight:600, fontSize:15, color: light ? '#fff' : '#0a0d14' }}>{children}</span>
      <div style={{ flex:1, height:1, background: light ? 'rgba(255,255,255,0.12)' : '#e5e7eb' }}/>
    </div>
  )
}

function SubFeature({ title, body, img, alt, imgFirst }) {
  const text = (
    <div>
      <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 17, color: '#0a0d14', margin: '0 0 10px' }}>{title}</h3>
      <p style={{ fontFamily: F, fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>{body}</p>
    </div>
  )
  const image = (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <img src={img} alt={alt} style={{ width: '100%', display: 'block' }} />
    </div>
  )
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 48, alignItems: 'center', marginBottom: 56 }}>
      {imgFirst ? <>{text}{image}</> : <>{text}{image}</>}
    </div>
  )
}

function BeforeAfterTag({ kind }) {
  const isAfter = kind === 'after'
  return (
    <span style={{
      fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
      color: isAfter ? '#16a34a' : '#dc2626',
      padding: '4px 12px',
      background: isAfter ? '#f0fdf4' : '#fef2f2',
      borderRadius: 100,
    }}>
      {isAfter ? '✓ After' : '✕ Before'}
    </span>
  )
}

function SolutionCard({ num, text, img, alt }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 14, padding: img ? 20 : '24px 24px' }}>
      <p style={{ fontFamily: F, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2563eb', margin: '0 0 10px' }}>Solution {num}</p>
      <p style={{ fontFamily: F, fontSize: 13, color: '#4b5563', lineHeight: 1.65, margin: img ? '0 0 16px' : 0 }}>{text}</p>
      {img && (
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          <img src={img} alt={alt} style={{ width: '100%', display: 'block' }} />
        </div>
      )}
    </div>
  )
}

function ImpactTrendCard({ neg, negLabel, pos, posLabel, dot }) {
  // dot travels along the diagonal, 0 = bottom-left, 1 = top-right
  const x = 8 + dot * 84
  const y = 92 - dot * 84
  return (
    <div style={{
      position: 'relative', borderRadius: 14, overflow: 'hidden', padding: '28px 28px 26px',
      minHeight: 200,
      background: 'linear-gradient(135deg, #eef1ff 0%, #cfd9ff 55%, #a9bcff 100%)',
    }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <line x1="8" y1="92" x2="92" y2="8" stroke="#2563eb" strokeWidth="1.4" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        <circle cx={x} cy={y} r="4.2" fill="#2563eb" opacity="0.18" />
        <circle cx={x} cy={y} r="2.4" fill="#2563eb" />
      </svg>
      <div style={{ position: 'relative' }}>
        <p style={{ fontFamily: F, fontWeight: 800, fontSize: 30, color: '#0a0d14', letterSpacing: '-1px', margin: '0 0 6px' }}>{neg}</p>
        <p style={{ fontFamily: F, fontSize: 13, color: '#1f2937', margin: 0 }}>{negLabel}</p>
      </div>
      <div style={{ position: 'relative', textAlign: 'right', marginTop: 78 }}>
        <p style={{ fontFamily: F, fontWeight: 800, fontSize: 26, color: '#1d4ed8', letterSpacing: '-0.5px', margin: '0 0 4px' }}>{pos}</p>
        <p style={{ fontFamily: F, fontSize: 13, color: '#1d4ed8', margin: 0 }}>{posLabel}</p>
      </div>
    </div>
  )
}

function Placeholder({ label, height=320 }) {
  return (
    <div style={{ height, borderRadius:14, border:'2px dashed #dbeafe', background:'#eff6ff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
      <div style={{ width:44, height:44, borderRadius:'50%', background:'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:20, color:'#2563eb' }}>+</span>
      </div>
      <p style={{ fontFamily:'Inter,sans-serif', fontWeight:600, fontSize:14, color:'#2563eb', margin:0 }}>{label}</p>
      <p style={{ fontFamily:'Inter,sans-serif', fontSize:12, color:'#93c5fd', margin:0 }}>素材到位后替换</p>
    </div>
  )
}
