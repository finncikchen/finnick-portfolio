import Header from '../components/Header'
import { F, INK, SUB, FADE, WIDE, GAP, STATEMENT, EYEBROW } from '../components/caseTokens'
import { P, ContactCTA, FooterNav } from '../components/CaseKit'

// every image below is an original layer exported from the Wenhong Figma file
const files = import.meta.glob('../assets/images/wenhong/*.webp', { eager: true, import: 'default' })
const I = Object.fromEntries(Object.entries(files).map(([k, v]) => [k.split('/').pop().replace('.webp', ''), v]))

// The page is white edge to edge so the white-ground renders sit straight on it: no cards, no rules.
const RED = '#E0282E'
const h3 = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(19px, 1.8vw, 22px)', lineHeight: 1.25, letterSpacing: '-0.02em', color: INK, margin: '0 0 8px' }
const tag = { fontFamily: F, fontSize: 13, color: SUB, textTransform: 'uppercase', letterSpacing: '0.02em', margin: '0 0 14px' }
const img = { width: '100%', display: 'block' }
const photo = { ...img, borderRadius: 12, objectFit: 'cover' }
const small = { fontSize: 15 }
// the renders end in a soft grey floor: fade that last strip into the page instead of showing an edge
const fade = { WebkitMaskImage: 'linear-gradient(#000 88%, transparent)', maskImage: 'linear-gradient(#000 88%, transparent)' }
const W = ({ children, style }) => <div style={{ ...WIDE, ...style }}>{children}</div>
const Bleed = ({ children, style }) => <div style={{ maxWidth: 1680, margin: '0 auto', ...style }}>{children}</div>
const Block = ({ children, style }) => <div style={{ marginTop: 'clamp(72px, 9vw, 128px)', ...style }}>{children}</div>

function Head({ eyebrow, title, sub }) {
  return (
    <div style={{ ...WIDE, marginBottom: 'clamp(40px, 5vw, 72px)' }}>
      {eyebrow && <p style={EYEBROW}>{eyebrow}</p>}
      <h2 style={{ ...STATEMENT, maxWidth: 900, margin: 0 }}>{title}{sub && <>{' '}<span style={{ color: FADE }}>{sub}</span></>}</h2>
    </div>
  )
}

const VOCAB = ['Sense of speed, cool, intelligent', 'Simplicity, humanization, functionality', 'Sense of strength, geometric cutting', 'Sense of heaviness, solid', 'Sense of technology, intelligence', 'Modularity']
const TECHNIQUES = [['Utilize coating type division and evolution'], ['Geometric form stretching and contraction'], ['Cut to form multi-uneven shapes']]
const IDEAS = [
  ['speed', 'Most of the cost is wasted on space.'],
  ['Concise', 'Meets corporate expectations.', true],
  ['strength', 'High cost and messy'],
  ['heaviness', 'High cost'],
  ['technology', 'Waste of some space'],
  ['Modularity', 'Waste of some space'],
]
const STAGES = [
  ['Modeling docking', 'The modeling is too plain and lacks undulations.'],
  ['Coating modification', 'The bottom vision is too heavy.'],
  ['Process docking', 'The vision should be focused on the machine.'],
  ['Further model modification', 'Too plain.'],
  ['Sample production', 'Meet enterprise expectations.'],
]

export default function Wenhong() {
  return (
    <div style={{ background: '#fff', color: INK, fontFamily: F, minHeight: '100vh' }}>
      <style>{'.wh-2,.wh-3,.wh-4,.wh-d,.wh-s,.wh-pr,.wh-m{display:grid;gap:48px 40px;grid-template-columns:1fr}.wh-s{justify-items:center;gap:28px}.wh-c{width:min(100%,280px);aspect-ratio:1;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:32px;box-sizing:border-box}.wh-f{display:flex;gap:28px}.wh-ar{display:none}.wh-dh{display:none}.wh-hero-img{margin-top:-2vw}@media(min-width:900px){.wh-2{grid-template-columns:1fr 1fr}.wh-3{grid-template-columns:repeat(3,1fr)}.wh-4{grid-template-columns:repeat(4,1fr)}.wh-m{grid-template-columns:repeat(3,auto);justify-content:start;gap:0 72px}.wh-d,.wh-dh{display:grid;grid-template-columns:220px 1fr 1fr;gap:16px 56px;align-items:center}.wh-s{grid-template-columns:auto 1fr auto;align-items:center;justify-items:stretch;gap:36px}.wh-c{width:clamp(240px,24vw,320px)}.wh-f{flex-direction:column;gap:56px}.wh-g{display:none}.wh-ar{display:block;height:1.5px;background:#E0282E;position:relative;margin-top:12px}.wh-ar::after{content:"";position:absolute;right:-1px;top:-4px;width:9px;height:10px;background:#E0282E;clip-path:polygon(0 0,100% 50%,0 100%)}.wh-ar.l::after{right:auto;left:-1px;clip-path:polygon(100% 0,0 50%,100% 100%)}.wh-pr{grid-template-columns:2fr 1fr;align-items:center;gap:40px}.wh-hero-img{margin-top:-9vw}}'}</style>

      {/* ── HERO: the name set as large as the page allows, the machine running edge to edge under it ── */}
      <Header minimal darkLogo />
      <section style={{ overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(24px, 4vw, 56px) clamp(20px, 4vw, 64px) 0' }}>
          <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: 'clamp(56px, 17.2vw, 300px)', lineHeight: 0.86, letterSpacing: '-0.065em', color: INK, margin: 0, marginLeft: '-0.04em', whiteSpace: 'nowrap' }}>WENHONG</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px 48px', marginTop: 'clamp(16px, 2vw, 28px)' }}>
            <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(22px, 2.4vw, 34px)', letterSpacing: '-0.03em', lineHeight: 1.1, color: RED, margin: 0 }}>Machinery Design</p>
            <p style={{ fontFamily: F, fontSize: 'clamp(15px, 1.2vw, 17px)', lineHeight: 1.5, color: SUB, maxWidth: 420, margin: 0 }}>Brand-driven innovation: industrial design for packaging machinery based on the study of brand gene extraction method</p>
          </div>
        </div>
        <Bleed><img className="wh-hero-img" src={I['final-34']} alt="The Wenhong die-cutting machine, three-quarter view" style={{ ...img, ...fade }} /></Bleed>
      </section>

      {/* ── OVERVIEW ── */}
      <section style={{ ...WIDE, paddingTop: 'clamp(64px, 8vw, 120px)', paddingBottom: GAP }}>
        <p style={EYEBROW}>Overview</p>
        <p style={{ ...STATEMENT, maxWidth: 900 }}>
          An industrial design for the die-cutting machine of Jiangsu Wenhong Machinery,{' '}
          <span style={{ color: FADE }}>using a brand gene extraction method to give its packaging equipment a recognizable family design language.</span>
        </p>
        <P large style={{ maxWidth: 760, marginTop: 28 }}>The machine has been implemented and showcased at exhibitions like China Print and drupa in Germany.</P>
        <div className="wh-m" style={{ marginTop: 'clamp(40px, 5vw, 64px)', gap: undefined }}>
          {[['My Role', 'Industrial designer'], ['Duration', '30 weeks, 2022.03-2022.09']].map(([k, v]) => (
            <div key={k}><p style={{ ...tag, marginBottom: 6 }}>{k}</p><p style={{ ...h3, margin: 0 }}>{v}</p></div>
          ))}
        </div>
      </section>

      {/* ── DESIGN CONTEXT ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head eyebrow="Design context" title="Background" sub="Surviving in the crevices" />
        <W>
          <div className="wh-2" style={{ alignItems: 'end' }}>
            {[['old-machine', 'Company status', 'Traditional mechanical equipment, no design.'], ['competitor-family', 'Market status', 'Familial design language, recognizable.']].map(([k, t, d]) => (
              <div key={k}>
                <img src={I[k]} alt={t} style={img} />
                <p style={{ ...h3, marginTop: 28 }}>{t}</p><P style={small}>{d}</P>
              </div>
            ))}
          </div>
          <Block>
            <p style={tag}>Goals</p>
            {['Building a brand family language', 'Unify product visual identity', 'Moving from the low-end market to mid-to-high-end markets'].map((g, i) => (
              <p key={g} style={{ ...STATEMENT, fontSize: 'clamp(24px, 2.8vw, 38px)', color: i === 2 ? INK : FADE, margin: '0 0 6px' }}>{g}</p>
            ))}
          </Block>
        </W>
      </section>

      {/* ── RESEARCH ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head eyebrow="Research" title="Existing issues" />
        <W><img src={I.issues} alt="Wenhong Fully Automatic Die-Cutting and Hot Foil Stamping Machine WH-1180SF (Five-Axis), annotated with its existing issues" style={img} /></W>
      </section>

      {/* ── DESIGN STRATEGY ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head eyebrow="Design strategy" title="Brand gene extraction strategy" />
        <W>
          {/* implicit is a dashed outline, explicit is solid: one generates the other, which reflects back */}
          <div className="wh-s">
            <div className="wh-c" style={{ border: `1.5px dashed ${FADE}` }}>
              <p style={{ ...tag, marginBottom: 10 }}>Implicit brand DNA</p>
              <p style={{ ...h3, fontSize: 'clamp(20px, 2vw, 26px)', margin: 0 }}>Core brand vocabulary</p>
            </div>
            <div className="wh-f">
              <div><p style={{ ...tag, margin: 0 }}>Generate <span className="wh-g" style={{ color: RED }}>↓</span></p><i className="wh-ar" /></div>
              <div><p style={{ ...tag, margin: 0 }}><span className="wh-g" style={{ color: RED }}>↑</span> Reflect</p><i className="wh-ar l" /></div>
            </div>
            <div className="wh-c" style={{ background: INK }}>
              <p style={{ ...tag, color: FADE, marginBottom: 10 }}>Explicit brand DNA</p>
              <p style={{ ...h3, fontSize: 'clamp(20px, 2vw, 26px)', color: '#fff', margin: 0 }}>Design elements</p>
            </div>
          </div>
          <Block>
            <p style={{ ...tag, marginBottom: 28 }}>Refine brand vocabulary</p>
            {VOCAB.map((v, i) => (
              <div key={v} style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(16px, 3vw, 40px)', marginBottom: 6 }}>
                <span style={{ ...tag, margin: 0, width: 24, flex: 'none', color: i === 1 ? RED : FADE }}>0{i + 1}</span>
                <p style={{ ...STATEMENT, fontSize: 'clamp(24px, 2.8vw, 38px)', color: i === 1 ? INK : FADE, margin: 0 }}>{v}</p>
              </div>
            ))}
          </Block>
        </W>
      </section>

      {/* ── TECHNIQUES ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head eyebrow="Design process" title="Design techniques" />
        <W>
          <div className="wh-3">
            {TECHNIQUES.map(([title], i) => (
              <div key={title}>
                <div style={{ aspectRatio: '3 / 2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={I[`tech-${i + 1}`]} alt={title} style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }} />
                </div>
                <p style={{ ...tag, color: RED, margin: '28px 0 10px' }}>0{i + 1}</p>
                <p style={{ ...h3, margin: 0 }}>{title}</p>
              </div>
            ))}
          </div>
        </W>
      </section>

      {/* ── PRIMITIVE FORM ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head eyebrow="Design process" title="Primitive form extraction" />
        <W>
          <P large style={{ maxWidth: 760, marginBottom: 'clamp(40px, 5vw, 72px)' }}>Analyze paper output bending effects and extract mechanical form from paper pasting machines, using bending elements as dominant genes for feature extraction.</P>
          <div className="wh-pr">
            <img src={I['primitive-1']} alt="Line drawing of a paper pasting machine" style={img} />
            <img src={I['primitive-2']} alt="A sheet of paper bending as it leaves the machine" style={photo} />
          </div>
        </W>
      </section>

      {/* ── IDEATION ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head title="Ideation" />
        <W>
          <div className="wh-2" style={{ gap: 'clamp(56px, 7vw, 96px) 64px' }}>
            {IDEAS.map(([name, reason, selected], i) => (
              <div key={name}>
                <div style={{ aspectRatio: '2 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={I[`idea-${i + 1}a`]} alt={`Concept ${i + 1}, perspective sketch`} style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }} /></div>
                <div style={{ aspectRatio: '3 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}><img src={I[`idea-${i + 1}b`]} alt={`Concept ${i + 1}, front sketch`} style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }} /></div>
                <p style={{ ...tag, color: selected ? RED : SUB, margin: '24px 0 8px' }}>0{i + 1}{selected && ' · Selected'}</p>
                <p style={{ ...h3, textTransform: 'capitalize' }}>{name}</p>
                <p style={{ fontFamily: F, fontSize: 15, lineHeight: 1.55, color: SUB, margin: 0 }}>{reason}</p>
              </div>
            ))}
          </div>
        </W>
      </section>

      {/* ── DEVELOPMENT ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head title="Development" />
        <W>
          <div className="wh-dh" style={{ paddingBottom: 8 }}>
            <span />
            <p style={{ ...tag, margin: 0 }}>Front side</p>
            <p style={{ ...tag, margin: 0 }}>Frontal-lateral</p>
          </div>
          {STAGES.map(([stage, feedback], i) => (
            <div key={stage} className="wh-d" style={{ paddingTop: 'clamp(28px, 4vw, 48px)' }}>
              <div>
                <p style={{ ...tag, color: i === STAGES.length - 1 ? RED : SUB }}>0{i + 1}</p>
                <p style={h3}>{stage}</p>
                <p style={{ fontFamily: F, fontSize: 15, lineHeight: 1.55, color: SUB, margin: 0 }}><span style={{ color: FADE }}>Feedback:</span> {feedback}</p>
              </div>
              <img src={I[`dev-${i + 1}a`]} alt={`${stage}, front side`} style={img} />
              <img src={I[`dev-${i + 1}b`]} alt={`${stage}, frontal-lateral`} style={img} />
            </div>
          ))}
        </W>
      </section>

      {/* ── FINAL OUTCOME ── */}
      <section style={{ paddingBottom: GAP }}>
        <Head title="Final outcome" />
        <Bleed><img src={I['final-front']} alt="Final design, front view" style={{ ...img, ...fade }} /></Bleed>
        <W>
          <div className="wh-4" style={{ marginTop: 'clamp(40px, 5vw, 72px)' }}>
            {['The “broken line” runs through the entire equipment.', 'Built-in operation console.', 'Spherical concave-convex treatment of stairs.', 'Pipeline handrail treatment.'].map((c, i) => (
              <div key={c}><p style={{ ...tag, color: RED }}>0{i + 1}</p><p style={{ ...h3, margin: 0 }}>{c}</p></div>
            ))}
          </div>
        </W>
        <Bleed style={{ marginTop: 'clamp(72px, 9vw, 128px)' }}><img src={I['final-dark']} alt="Final design, three-quarter view" style={{ ...img, ...fade }} /></Bleed>
        <Bleed style={{ marginTop: 'clamp(72px, 9vw, 128px)', padding: '0 clamp(12px, 2vw, 32px)' }}>
          <div className="wh-2" style={{ gap: 'clamp(8px, 1vw, 16px)' }}>
            <img src={I['photo-2']} alt="The machine on the Wenhong stand at drupa" style={photo} />
            <img src={I['photo-3']} alt="drupa, Germany" style={photo} />
          </div>
        </Bleed>
      </section>

      {/* ── REFLECTION ── */}
      <section style={{ ...WIDE, paddingBottom: GAP }}>
        <p style={EYEBROW}>Reflection</p>
        <p style={{ ...STATEMENT, maxWidth: 900 }}>
          This project, completed during the summer of 2022, was my first school-enterprise collaboration.{' '}
          <span style={{ color: FADE }}>Key challenges included understanding components for design regularization and using styling and coating to create brand identity within sheet metal constraints.</span>
        </p>
      </section>

      <ContactCTA />
      <FooterNav />
    </div>
  )
}
