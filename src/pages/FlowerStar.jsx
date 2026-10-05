import { FooterNav } from '../components/CaseKit'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { F, W, WIDE, GRAIN } from '../components/caseTokens'
import cover from '../assets/images/flowerstar/cover.png'
import cast from '../assets/images/flowerstar/cast.png'
import boni from '../assets/images/flowerstar/boni.png'
import fish from '../assets/images/flowerstar/fish.png'
import starfish from '../assets/images/flowerstar/starfish.png'
import dui1 from '../assets/images/flowerstar/deliver/ui1.webp'
import dui2 from '../assets/images/flowerstar/deliver/ui2.webp'
import dui3 from '../assets/images/flowerstar/deliver/ui3.webp'
import dui4 from '../assets/images/flowerstar/deliver/ui4.webp'
import dui5 from '../assets/images/flowerstar/deliver/ui5.webp'
import dui6 from '../assets/images/flowerstar/deliver/ui6.webp'
import dtesting from '../assets/images/flowerstar/deliver/testing.webp'
import dinjury from '../assets/images/flowerstar/deliver/injury.webp'
import dphoto1 from '../assets/images/flowerstar/deliver/photo1.webp'
import dphoto2 from '../assets/images/flowerstar/deliver/photo2.webp'
import dphoto3 from '../assets/images/flowerstar/deliver/photo3.webp'
import dlevels from '../assets/images/flowerstar/deliver/levels.webp'
import ixProps from '../assets/images/flowerstar/ix-props.webp'
import ixControls from '../assets/images/flowerstar/ix-controls.webp'
import joe from '../assets/images/flowerstar/avatar-joe.png'
import ella from '../assets/images/flowerstar/avatar-ella.png'
import kate from '../assets/images/flowerstar/avatar-kate.png'
import l1 from '../assets/images/flowerstar/level1.png'
import l2 from '../assets/images/flowerstar/level2.png'
import l3 from '../assets/images/flowerstar/level3.png'
import l4 from '../assets/images/flowerstar/level4.png'
import s1 from '../assets/images/flowerstar/story1.png'
import s2 from '../assets/images/flowerstar/story2.png'
import s3 from '../assets/images/flowerstar/story3.png'
import s4 from '../assets/images/flowerstar/story4.png'
import s5 from '../assets/images/flowerstar/story5.png'
import s6 from '../assets/images/flowerstar/story6.png'
import s7 from '../assets/images/flowerstar/story7.png'
import s8 from '../assets/images/flowerstar/story8.png'
import s9 from '../assets/images/flowerstar/story9.png'

// Sprite exports carry this navy fill, so the page is built on the same color
const SEA = '#0e172e'
const TEXT = '#eef1fa'
const DIM = 'rgba(238,241,250,0.5)'
const SERIF = "'Instrument Serif', 'Times New Roman', serif"

const label = { fontFamily: F, fontSize: 12, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 20px' }
const statement = { fontFamily: F, fontWeight: 500, fontSize: 'clamp(28px, 3.6vw, 46px)', lineHeight: 1.14, letterSpacing: '-0.03em', color: TEXT, margin: 0 }
const body = { fontFamily: F, fontSize: 16, lineHeight: '26px', color: DIM, margin: 0 }
const card = { borderRadius: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: 28 }

function Head({ eyebrow, title, sub, children }) {
  return (
    <div style={{ ...WIDE, marginBottom: 56, display: 'flex', flexWrap: 'wrap', gap: '20px 48px' }}>
      <p style={{ ...label, flex: '0 0 220px', margin: '12px 0 0' }}>{eyebrow}</p>
      <div style={{ flex: '1 1 480px', minWidth: 0 }}>
        <h2 style={statement}>{title} <span style={{ color: DIM }}>{sub}</span></h2>
        {children && <p style={{ ...body, fontSize: 18, lineHeight: '29px', maxWidth: 620, marginTop: 24 }}>{children}</p>}
      </div>
    </div>
  )
}

function Float({ src, style, dur = 7, delay = 0 }) {
  return <img src={src} alt="" aria-hidden style={{ position: 'absolute', pointerEvents: 'none', animation: `fsFloat ${dur}s ease-in-out ${delay}s infinite`, ...style }} />
}

function Bubbles() {
  const dots = Array.from({ length: 28 }, (_, i) => ({ l: (i * 37) % 100, s: 2 + (i % 4), d: 9 + (i % 7) * 2, dl: -(i * 1.3) }))
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {dots.map((b, i) => (
        <span key={i} style={{ position: 'absolute', bottom: -10, left: `${b.l}%`, width: b.s, height: b.s, borderRadius: '50%', background: 'rgba(170,230,255,0.7)', boxShadow: '0 0 8px rgba(120,220,255,0.9)', animation: `fsRise ${b.d}s linear ${b.dl}s infinite` }} />
      ))}
    </div>
  )
}

const STORY = [s1, s2, s3, s4, s5, s6, s7, s8, s9]

const STAGES = [
  ['01', 'Romantic', 'Everything sparkles. The sea is bright and forgiving, teaching the player to move and explore.', l1],
  ['02', 'Power Struggle', 'Differences surface. Obstacles close in and the first real conflict with the octopus begins.', l2],
  ['03', 'Integration', 'Acceptance. The player learns to read the currents and work with them instead of against them.', l3],
  ['04', 'Commitment', 'Choosing each other in the dark. The deepest level asks for patience over speed.', l4],
]

const PERSONAS = [
  [joe, 'Joe', 'Male · 32', 'After several toxic relationships, he wants to understand what a healthy one actually looks like.'],
  [ella, 'Ella', 'Female · 24', 'Holds very high expectations of love and feels let down when reality does not match.'],
  [kate, 'Kate', 'Female · 28', 'Frequent business trips keep her apart from her partner, and distance tests their bond.'],
]

export default function FlowerStar() {
  return (
    <div style={{ background: SEA, color: TEXT, fontFamily: F, minHeight: '100vh', overflow: 'hidden' }}>
      <style>{`
        @keyframes fsFloat { 0%,100% { transform: translateY(0) rotate(-2deg) } 50% { transform: translateY(-18px) rotate(2deg) } }
        @keyframes fsRise { from { transform: translateY(0); opacity: 0 } 10% { opacity: 1 } to { transform: translateY(-110vh); opacity: 0 } }
        @keyframes fsPan { from { background-position: 0 50% } to { background-position: 100% 50% } }
        .fs-story { display: grid; grid-template-columns: 1fr; gap: 20px }
        .fs-3 { display: grid; grid-template-columns: 1fr; gap: 16px }
        .fs-4 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px }
        @media (min-width: 900px) {
          .fs-story { grid-template-columns: repeat(3, 1fr) }
          .fs-3 { grid-template-columns: repeat(3, 1fr) }
          .fs-4 { grid-template-columns: repeat(4, 1fr) }
        }
        @media (max-width: 899px) {
          .fs-photos { grid-template-columns: 1fr 1fr !important }
        }
      `}</style>

      {/* Hero */}
      <div style={{ padding: 12 }}>
        <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', aspectRatio: '2160 / 1268', background: `url(${cover}) center / cover no-repeat` }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(14,23,46,0.5) 0%, rgba(14,23,46,0) 22%)` }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'soft-light', backgroundImage: GRAIN }} />
          <Bubbles />
          <div style={{ position: 'relative' }}>
            <Header minimal />
          </div>
        </div>
      </div>

            <section style={{ ...W, paddingTop: 'clamp(56px, 7vw, 96px)', textAlign: 'center' }}>
              <p style={label}>Game Design · Service Design · UI Design</p>
              <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(64px, 11vw, 150px)', lineHeight: 0.9, letterSpacing: '-0.02em', margin: '0 0 28px', textShadow: '0 0 40px rgba(140,210,255,0.45)' }}>
                Flower Star
              </h1>
              <p style={{ ...body, fontSize: 19, lineHeight: '30px', color: 'rgba(238,241,250,0.8)', maxWidth: 560, margin: '0 auto' }}>
                A narrative game that turns the stages of an intimate relationship into a level-based journey under the sea.
              </p>
            </section>

      {/* Trailer */}
      <section style={{ ...WIDE, paddingTop: 'clamp(64px, 8vw, 112px)' }}>
        <div style={{ position: 'relative', aspectRatio: '16 / 9', borderRadius: 24, overflow: 'hidden', background: '#000', boxShadow: '0 40px 100px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)' }}>
          <iframe src="https://www.youtube-nocookie.com/embed/sfK28ISazx0?rel=0&modestbranding=1" title="Flower Star gameplay trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
        </div>
      </section>

      {/* Overview */}
      <section style={{ paddingTop: 'clamp(96px, 12vw, 160px)', position: 'relative' }}>
        <Float src={fish} style={{ width: 120, right: '6%', top: 40, mixBlendMode: 'lighten' }} />
        <Head eyebrow="Overview" title="Love is a skill, not luck." sub="Flower Star lets players practice it, one level at a time, through a story instead of a lecture." />
        <div style={{ ...WIDE }}>
          <div className="fs-3">
            {[['What', '2D side-scrolling narrative adventure'], ['Where', 'Computer and mobile'], ['Who', 'Young adults navigating relationships']].map(([k, v]) => (
              <div key={k} style={{ borderTop: '1px solid rgba(255,255,255,0.14)', paddingTop: 14 }}>
                <p style={{ ...label, fontSize: 11, margin: 0 }}>{k}</p>
                <p style={{ ...body, color: TEXT, fontSize: 17, marginTop: 10 }}>{v}</p>
              </div>
            ))}
          </div>
          <img src={cast} alt="Flower Star characters" style={{ width: '100%', display: 'block', marginTop: 80 }} />
        </div>
      </section>

      {/* Users */}
      <section style={{ paddingTop: 'clamp(96px, 12vw, 160px)' }}>
        <Head eyebrow="Target Users" title="Three people," sub="three different ways relationships have hurt or confused them." />
        <div style={{ ...WIDE }} className="fs-3">
          {PERSONAS.map(([img, n, m, q]) => (
            <div key={n} style={{ borderTop: '1px solid rgba(255,255,255,0.14)', paddingTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <img src={img} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                <p style={{ fontFamily: F, fontSize: 20, fontWeight: 500, margin: 0 }}>{n} <span style={{ fontSize: 14, color: DIM, fontWeight: 400 }}>{m}</span></p>
              </div>
              <p style={body}>{q}</p>
            </div>
          ))}
        </div>
        <div style={{ ...WIDE, marginTop: 'clamp(64px, 8vw, 104px)' }} className="fs-3">
          {[['Educational', 'Show what healthy love looks like at every stage.'], ['Emotional', 'Let players feel conflict and repair, not just read about it.'], ['Social', 'Give couples and friends something to talk about afterwards.']].map(([t, d]) => (
            <div key={t} style={{ borderTop: '1px solid rgba(255,255,255,0.14)', paddingTop: 24 }}>
              <p style={{ ...label, margin: '0 0 12px' }}>Goal</p>
              <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(34px, 3.4vw, 44px)', lineHeight: 1, margin: '0 0 12px' }}>{t}</p>
              <p style={body}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section style={{ paddingTop: 'clamp(96px, 12vw, 160px)', position: 'relative' }}>
        <Float src={boni} style={{ width: 150, left: '3%', top: 60, mixBlendMode: 'lighten' }} dur={8} />
        <Head eyebrow="Worldview" title="Once upon a tide." sub="The story sets up everything the levels later ask of the player.">
          Boni and Lumi share a flower star until an octopus steals it into the deep. Guided by a school of fish, Boni follows, and finds the octopus only wanted light for its babies.
        </Head>
        <div style={{ ...WIDE }} className="fs-story">
          {STORY.map((src, i) => (
            <figure key={i} style={{ margin: 0 }}>
              <img src={src} alt="" style={{ width: '100%', display: 'block', borderRadius: 16 }} />
            </figure>
          ))}
        </div>
      </section>

      {/* Levels */}
      <section style={{ paddingTop: 'clamp(96px, 12vw, 160px)' }}>
        <Head eyebrow="Level Design" title="Four levels, four stages of intimacy." sub="Built on Susan Campbell's model, each level's color and mechanics mirror what a couple goes through." />
        <div style={{ ...WIDE, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {STAGES.map(([n, t, d, img]) => (
            <div key={n} style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', minHeight: 240, background: `url(${img}) center / cover` }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(14,23,46,0.92) 0%, rgba(14,23,46,0.6) 40%, rgba(14,23,46,0) 75%)' }} />
              <div style={{ position: 'relative', padding: 'clamp(24px, 3.5vw, 44px)', maxWidth: 440 }}>
                <p style={{ ...label, margin: '0 0 8px' }}>Level {n}</p>
                <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(34px, 4vw, 48px)', margin: '0 0 10px', lineHeight: 1 }}>{t}</p>
                <p style={{ ...body, color: 'rgba(238,241,250,0.75)' }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Props & interaction (from Figma 55:2303) */}
      <section style={{ paddingTop: 'clamp(96px, 12vw, 160px)', position: 'relative' }}>
        <Float src={starfish} style={{ width: 70, right: '8%', top: 20, mixBlendMode: 'lighten' }} dur={6} />
        <Head eyebrow="Prop design" title="Every object tells you something." sub="Hazards and gifts are simple to read, so players can focus on the story." />
        <div style={{ ...WIDE }}>
          <img src={ixProps} alt="Interactable elements: Boni, sea anemones, the conch speed boost, the shell health item and the octopus" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      <section style={{ paddingTop: 'clamp(96px, 12vw, 160px)' }}>
        <Head eyebrow="Interaction design" title="Same journey on any screen." sub="WASD and Shift on PC, a joystick on the phone, both wired to the same movement code." />
        <div style={{ ...WIDE }}>
          <img src={ixControls} alt="Control programme: WASD and Shift on PC, joystick and boost on smartphone, with the Speed Up and Move scripts" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      {/* Deliver */}
      <section style={{ paddingTop: 'clamp(96px, 12vw, 160px)' }}>
        <Head eyebrow="Deliver" title="Shipped at a game jam." sub="Six core screens, four levels, and a room full of first-time players." />
        <div style={{ ...WIDE }}>
          <div className="fs-story">
            {[[dui1, 'Level up'], [dui2, 'Select level'], [dui3, 'Game over'], [dui4, 'Octopus encounter'], [dui5, 'Settings'], [dui6, 'Collecting the flower star']].map(([src, t]) => (
              <figure key={t} style={{ margin: 0 }}>
                <img src={src} alt={t} style={{ width: '100%', display: 'block', borderRadius: 14, boxShadow: '0 20px 50px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)' }} />
                <figcaption style={{ ...body, fontSize: 14, marginTop: 12 }}>{t}</figcaption>
              </figure>
            ))}
          </div>
          <img src={dlevels} alt="Level map: Shallow Sea Exploration, Abyssal Bloom, Jellyfish Labyrinth, Octopus Overlord's Lair" style={{ width: '100%', display: 'block', borderRadius: 20, marginTop: 'clamp(56px, 7vw, 96px)' }} />
        </div>
      </section>

      {/* Playtesting */}
      <section style={{ paddingTop: 'clamp(96px, 12vw, 160px)' }}>
        <Head eyebrow="Playtesting" title="Mostly positive," sub="with a few bugs we fixed after the jam." />
        <div style={{ ...WIDE }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(24px, 4vw, 56px)', alignItems: 'start' }}>
            <img src={dtesting} alt="Offline on-board testing with Game Jam comments" style={{ width: '100%', display: 'block', borderRadius: 16 }} />
            <div>
              <p style={{ ...body, fontSize: 18, lineHeight: '30px', color: 'rgba(238,241,250,0.8)' }}>
                Players loved the art. The watercolor, hand-painted sea felt both dreamy and real, and their emotional investment was high. Time constraints left a few bugs: the UI volume control didn't work and some interactive objects failed to respond. We fixed both after the game jam.
              </p>
              <div style={{ display: 'flex', gap: 40, marginTop: 32, borderTop: '1px solid rgba(255,255,255,0.14)', paddingTop: 20 }}>
                {[['Art style', 'Most praised'], ['Emotion', 'Strong investment'], ['Bugs', 'Fixed after jam']].map(([k, v]) => <div key={k}><p style={{ ...label, margin: '0 0 6px' }}>{k}</p><p style={{ ...body, color: TEXT, fontSize: 16 }}>{v}</p></div>)}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.8fr 1fr 1.5fr', gap: 16, marginTop: 'clamp(40px, 5vw, 64px)' }} className="fs-photos">
            {[[dphoto1, 'Players at the showcase'], [dphoto2, 'Demoing Flower Star'], [dphoto3, 'Playtest'], [dinjury, 'Debugging character injury']].map(([src, t]) => (
              <img key={t} src={src} alt={t} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 16 }} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section style={{ ...WIDE, paddingTop: 'clamp(120px, 14vw, 200px)', textAlign: 'center' }}>
        <p style={{ margin: 0, fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 1.05, textShadow: '0 0 40px rgba(140,210,255,0.35)' }}>Love is not kept.<br /><span style={{ color: DIM }}>It is shared.</span></p>
      </section>

      {/* CTA */}
      <section style={{ ...W, padding: 'clamp(96px, 12vw, 160px) 48px clamp(96px, 10vw, 140px)', textAlign: 'center' }}>
        <p style={label}>More to the story</p>
        <h2 style={{ ...statement, fontSize: 'clamp(30px, 4.4vw, 52px)', margin: '0 auto 20px' }}>Want to hear how the levels came together?</h2>
        <p style={{ ...body, fontSize: 18, maxWidth: 520, margin: '0 auto 36px' }}>I'd be happy to walk you through it over a call. Reach out at</p>
        <a href="mailto:c4han@uw.edu" style={{ fontFamily: F, fontSize: 15, fontWeight: 500, color: SEA, background: TEXT, textDecoration: 'none', display: 'inline-flex', padding: '14px 24px', borderRadius: 999 }}>c4han@uw.edu ↗</a>
      </section>

      <FooterNav dark />
    </div>
  )
}
