import { F, INK, SUB, FADE, WIDE, GAP, STATEMENT } from '../components/caseTokens'
import { P, Page, Hero, SplitRow, ChapterHead, InfoTable, ContactCTA, FooterNav } from '../components/CaseKit'

// every image below is an original layer exported from the YHLO Figma file
import imgDevice      from '../assets/images/yhlo/device-cover.webp'
import { Workbench } from '../components/yhlo/ITLA'
import { TrackHome, TrackEvents, TrackUnits, TrackTasks, DeviceZoom } from '../components/yhlo/Track'
import { Scaled } from '../components/bosch/Dashboard'
import imgSystem      from '../assets/images/yhlo/system.png'
import imgExpo        from '../assets/images/yhlo/expo.png'
import imgMuse        from '../assets/images/yhlo/muse-award.png'
import imgLab1        from '../assets/images/yhlo/lab1.jpg'
import imgLab2        from '../assets/images/yhlo/lab2.jpg'
import imgLab3        from '../assets/images/yhlo/lab3.jpg'
import imgAtomic      from '../assets/images/yhlo/atomic.png'
import imgGloves      from '../assets/images/yhlo/gloves.png'
import imgLibrary     from '../assets/images/yhlo/component-library.jpg'

const CY = '#0BC5D1'
const RULE = { borderTop: '1px solid rgba(0,0,0,0.12)', paddingTop: 20 }
const h3 = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(19px, 1.8vw, 22px)', lineHeight: 1.25, letterSpacing: '-0.02em', color: INK, margin: '0 0 10px' }
const tag = { fontFamily: F, fontSize: 13, color: SUB, textTransform: 'uppercase', letterSpacing: '0.02em', margin: '0 0 14px' }
const num = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(44px, 5vw, 68px)', letterSpacing: '-0.045em', lineHeight: 1, color: INK, margin: '0 0 12px' }
const img = { width: '100%', display: 'block' }
const photo = { ...img, borderRadius: 20, objectFit: 'cover', height: '100%' }
const W = ({ children, style }) => <div style={{ ...WIDE, ...style }}>{children}</div>
const Block = ({ children, style }) => <div style={{ marginTop: 'clamp(56px, 7vw, 96px)', ...style }}>{children}</div>

// A large, quiet stage for the live screens
function Stage({ children }) {
  return (
    <div style={{ borderRadius: 28, padding: 'clamp(16px, 4.5vw, 72px)', background: 'radial-gradient(ellipse 70% 80% at 85% 0%, rgba(102,223,231,0.20) 0%, rgba(102,223,231,0) 65%), linear-gradient(180deg, #f6fbfc 0%, #eef6f7 100%)' }}>
      <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 30px 70px rgba(15,70,80,0.12)' }}>{children}</div>
    </div>
  )
}

function Feature({ n, title, sub, body, children }) {
  return (
    <div>
      <div className="yh-f" style={{ marginBottom: 'clamp(28px, 3.5vw, 44px)' }}>
        <p style={{ ...tag, color: CY, margin: 0, paddingTop: 12 }}>{n}</p>
        <p style={{ ...STATEMENT, fontSize: 'clamp(26px, 2.8vw, 36px)' }}>{title} <span style={{ color: FADE }}>{sub}</span></p>
        <P style={{ fontSize: 15 }}>{body}</P>
      </div>
      <Stage>{children}</Stage>
    </div>
  )
}

const PALETTE = [['#0BC5D1', 'Primary'], ['#66DFE7', 'Primary outline'], ['#07090A', 'Titles'], ['#434343', 'Body'], ['#838484', 'Secondary'], ['#B5B5B6', 'Dividers'], ['#FA8C16', 'Alert'], ['#FB4D51', 'Warning']]

export default function Yhlo() {
  return (
    <Page>
      <style>{'.yh-2,.yh-3,.yh-4,.yh-f,.yh-p{display:grid;gap:40px 48px;grid-template-columns:1fr}.yh-sw{display:grid;gap:10px;grid-template-columns:repeat(4,1fr)}@media(min-width:900px){.yh-2{grid-template-columns:1fr 1fr}.yh-3{grid-template-columns:repeat(3,1fr)}.yh-4{grid-template-columns:repeat(4,1fr)}.yh-f{grid-template-columns:160px 1.3fr 1fr;align-items:start}.yh-p{grid-template-columns:1.6fr 1fr}.yh-sw{grid-template-columns:repeat(8,1fr)}}'}</style>

      {/* ── HERO ── */}
      <Hero
        light
        background="radial-gradient(ellipse 60% 60% at 85% 100%, rgba(102,223,231,0.22) 0%, rgba(102,223,231,0) 70%), linear-gradient(180deg, #f3fafb 0%, #ffffff 60%)"
        brand={<p style={{ fontFamily: F, fontSize: 14, color: SUB, letterSpacing: '0.02em', margin: '0 0 24px' }}>YHLO · iTLA track unit</p>}
        title="A clearer touchscreen"
        sub="for automated lab sample processing."
      >
        <W style={{ paddingBottom: 'clamp(16px, 3vw, 40px)' }}>
          <Scaled w={1600} h={900}><DeviceZoom device={imgDevice} /></Scaled>
        </W>
      </Hero>

      {/* ── OVERVIEW ── */}
      <section style={{ ...WIDE, paddingTop: 'clamp(80px, 9vw, 128px)', paddingBottom: GAP }}>
        <SplitRow label="What is iTLA?">
          <p style={STATEMENT}>
            <span style={{ color: FADE }}>YHLO's iTLA is a fully automated lab system of five machines, each with its own screen. I redesigned</span>{' '}
            the track unit interface{' '}
            <span style={{ color: FADE }}>that lab staff use to load, move and pair test tubes.</span>
          </p>
          <InfoTable items={[['Company', 'YHLO'], ['Industry', 'Clinical diagnostics'], ['Role', 'UX / UI Designer'], ['Year', '2024'], ['Scope', 'Track unit UI, component library'], ['Recognition', 'MUSE Design Awards']]} />
        </SplitRow>
        <Block>
          <img src={imgSystem} alt="The five iTLA units connected by the track" style={img} />
          <div className="yh-3" style={{ marginTop: 'clamp(40px, 5vw, 64px)' }}>
            {[['User', 'Frontline lab staff analyzing test tubes.'], ['Function', 'Moves tubes so they load, unload and pair with detection equipment correctly.'], ['Role in the line', 'The transfer station between every other unit.']].map(([t, d]) => (
              <div key={t} style={RULE}><p style={h3}>{t}</p><P style={{ fontSize: 15 }}>{d}</P></div>
            ))}
          </div>
        </Block>
      </section>

      {/* ── RESEARCH ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="User interviews" title="I went into the lab." sub="Four technicians and nurses who use the terminal every day." />
        <W>
          <div className="yh-p" style={{ alignItems: 'stretch' }}>
            <img src={imgLab1} alt="Lab visit" style={{ ...photo, aspectRatio: '4 / 3' }} />
            <div style={{ display: 'grid', gap: 16 }}>
              <img src={imgLab2} alt="Lab visit" style={photo} />
              <img src={imgLab3} alt="Lab visit" style={photo} />
            </div>
          </div>
          <div className="yh-2" style={{ marginTop: 'clamp(48px, 6vw, 80px)' }}>
            {['The information structure and layout are confusing, making it tough to find key information and complete tasks.', "I feel that the information isn't conveyed clearly, which makes it hard to understand.", 'There are too many pop-ups, disrupting my workflow.', 'The design lacks coherence, making it easy to accidentally click on the wrong elements.'].map(q => (
              <p key={q} style={{ ...RULE, fontFamily: F, fontSize: 'clamp(18px, 1.7vw, 21px)', lineHeight: 1.45, letterSpacing: '-0.01em', color: INK, margin: 0 }}>“{q}”</p>
            ))}
          </div>
        </W>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Problem definition" title="Four dimensions," sub="from as-is to to-be." />
        <W>
          <div className="yh-4">
            {[['Navigation', 'Incoherent hierarchy', 'Architecture that follows user logic'], ['Content', 'Poor communication', 'Clear, plain descriptions'], ['Interaction', 'Controls misused', 'Controls that match expectations'], ['Presentation', 'Chaotic layout', 'A rational information layout']].map(([dim, a, b], i) => (
              <div key={dim} style={RULE}>
                <p style={{ ...tag, marginBottom: 24 }}>0{i + 1}</p>
                <p style={h3}>{dim}</p>
                <p style={{ fontFamily: F, fontSize: 15, color: FADE, margin: '0 0 6px', textDecoration: 'line-through', textDecorationColor: 'rgba(0,0,0,0.2)' }}>{a}</p>
                <p style={{ fontFamily: F, fontSize: 15, color: INK, margin: 0 }}>{b}</p>
              </div>
            ))}
          </div>
          <div className="yh-2" style={{ marginTop: 'clamp(64px, 8vw, 112px)' }}>
            <div>
              <p style={tag}>Design goals</p>
              {[['Reduce cost, raise efficiency', 'Platform-based data management.'], ['Precision management', 'Interconnected devices with complete data.'], ['Business convenience', 'Live equipment status on screen.'], ['Information management', 'Medical data visualized clearly.']].map(([t, d]) => (
                <div key={t} style={{ ...RULE, paddingBottom: 18 }}><p style={{ ...h3, fontSize: 18, margin: '0 0 4px' }}>{t}</p><P style={{ fontSize: 15 }}>{d}</P></div>
              ))}
            </div>
            <div>
              <p style={tag}>Competitive analysis</p>
              {[['Mindray', 'Vertical layout and device visualization lower cognitive load, but the page layout is disorganized and feedback unclear.'], ['Beckman', 'Clear architecture with the whole process on one page, but heavy animation interrupts actions.'], ['The gap', 'Competitors invest in hardware. There was room to lead on the interface and the YHLO brand.']].map(([t, d]) => (
                <div key={t} style={{ ...RULE, paddingBottom: 18 }}><p style={{ ...h3, fontSize: 18, margin: '0 0 4px' }}>{t}</p><P style={{ fontSize: 15 }}>{d}</P></div>
              ))}
            </div>
          </div>
        </W>
      </section>

      {/* ── METHODOLOGY ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Design methodology" title="Consistency everywhere," sub="built up from a single pipette." />
        <W>
          <div style={{ background: '#fff', borderRadius: 28, padding: 'clamp(20px, 5vw, 72px)' }}>
            <img src={imgAtomic} alt="Atoms, molecules, organisms, pages: pipette to page" style={img} />
          </div>
          <div className="yh-3" style={{ marginTop: 'clamp(40px, 5vw, 64px)' }}>
            {[['Philosophy and identity', 'One design language gives the product a consistent image.'], ['Cognition', 'Screens follow what lab staff already know from the bench.'], ['Operation and structure', 'The same action works the same way in every module.']].map(([t, d]) => (
              <div key={t} style={RULE}><p style={h3}>{t}</p><P style={{ fontSize: 15 }}>{d}</P></div>
            ))}
          </div>
        </W>
      </section>

      {/* ── GLOVES ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Designed for gloves" title="Doctors tap this screen wearing gloves." sub="So everything touchable got bigger." />
        <W>
          <div className="yh-3">
            {[['120%', 'icons and tap areas, compared with ordinary touch UIs'], ['44px', 'minimum tap target for gloved hands'], ['+20–30%', 'font size above the usual 10px minimum']].map(([n, t]) => (
              <div key={n} style={RULE}><p style={num}>{n}</p><P style={{ fontSize: 15 }}>{t}</P></div>
            ))}
          </div>
          <div className="yh-p" style={{ marginTop: 'clamp(48px, 6vw, 80px)', gridTemplateColumns: undefined }}>
            <Stage><Scaled w={1280} h={800}><TrackHome empty /></Scaled></Stage>
            <img src={imgGloves} alt="Gloved hand holding a blood sample tube" style={{ ...photo, borderRadius: 28 }} />
          </div>
        </W>
      </section>

      {/* ── SOLUTION ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="The solution" title="Fewer pop-ups, fewer clicks," sub="and clearer information." />
        <W style={{ display: 'grid', gap: 'clamp(96px, 11vw, 160px)' }}>
          <Feature n="01" title="Sample display." sub="All 28 racks on one screen." body="A message and event drawer keeps recent timed-out samples in view, so operators no longer dig through pop-ups.">
            <Scaled w={1280} h={800}><TrackHome popover /></Scaled>
          </Feature>
          <Feature n="02" title="Event list." sub="Filterable, with fewer steps." body="A standardized layout makes long lists easy to scan, with search and a new Clear all action.">
            <Scaled w={1280} h={800}><TrackEvents /></Scaled>
          </Feature>
          <Feature n="03" title="Unit control." sub="Bare buttons became cards." body="Each action gets a graphic and a short description, so operators know what it does before pressing it.">
            <Scaled w={1280} h={800}><TrackUnits /></Scaled>
          </Feature>
          <Feature n="04" title="Pipette info." sub="A drawer instead of pop-ups." body="Details open beside the racks, read top to bottom and left to right.">
            <Scaled w={1173} h={660}><Workbench right="tube" tube /></Scaled>
          </Feature>
          <Feature n="05" title="Maintenance tasks." sub="Status at a glance." body="Scheduled and overdue tasks are separated by color, so nothing slips past its due date.">
            <Scaled w={1280} h={800}><TrackTasks /></Scaled>
          </Feature>
        </W>
      </section>

      {/* ── BRAND + LIBRARY ── */}
      <section style={{ paddingBottom: GAP }}>
        <ChapterHead eyebrow="Visual language" title="Light, bright tones feel lighter," sub="and suggest speed." />
        <W>
          <div className="yh-sw">
            {PALETTE.map(([hex, use]) => (
              <div key={hex}>
                <div style={{ aspectRatio: '1 / 1.2', borderRadius: 16, background: hex, boxShadow: '0 0 0 1px rgba(0,0,0,0.05)' }} />
                <p style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: INK, margin: '12px 0 2px' }}>{hex}</p>
                <p style={{ fontFamily: F, fontSize: 12, color: SUB, margin: 0 }}>{use}</p>
              </div>
            ))}
          </div>
          <Block>
            <img src={imgLibrary} alt="YHLO component library" style={{ ...img, borderRadius: 28 }} />
          </Block>
        </W>
      </section>

      {/* ── RECOGNITION ── */}
      <section style={{ paddingBottom: GAP }}>
        <W>
          <div className="yh-p" style={{ alignItems: 'center' }}>
            <img src={imgExpo} alt="YHLO at a medical expo" style={{ ...photo, borderRadius: 28 }} />
            <div>
              <img src={imgMuse} alt="MUSE Design Awards" style={{ width: 160, display: 'block', marginBottom: 28 }} />
              <p style={{ ...STATEMENT, fontSize: 'clamp(24px, 2.4vw, 30px)' }}>Recognized by the MUSE Design Awards, <span style={{ color: FADE }}>and shown at medical expos across China.</span></p>
            </div>
          </div>
        </W>
      </section>

      <ContactCTA />
      <FooterNav />
    </Page>
  )
}
