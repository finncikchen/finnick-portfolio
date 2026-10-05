import { Scaled } from './bosch/Dashboard'
import { TrackHome } from './yhlo/Track'
import cover from '../assets/images/yhlo/cover-dark.webp'

// Home-page card cover for YHLO: studio render (1672 x 941), always centered and covering the card,
// with the live Home UI on its display. Overlay boxes are in render pixels, converted to %.
const IW = 1672, IH = 941
const SCR = { x: 572, y: 249, w: 114, h: 71 }
const RUN = { x: 533, y: 287, w: 18, h: 18 }
const pct = r => ({ position: 'absolute', left: `${r.x / IW * 100}%`, top: `${r.y / IH * 100}%`, width: `${r.w / IW * 100}%`, height: `${r.h / IH * 100}%` })

export default function YhloCover({ hovered }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', containerType: 'size' }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: `max(100cqw, ${IW / IH * 100}cqh)`, aspectRatio: `${IW} / ${IH}`, transform: `translate(-50%, -50%)${hovered ? ' scale(1.03)' : ''}`, transition: 'transform .6s cubic-bezier(.2,.7,.2,1)' }}>
        <img src={cover} alt="YHLO iTLA track unit" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div style={{ ...pct(SCR), borderRadius: 2, overflow: 'hidden', background: '#fff' }}>
          <Scaled w={1280} h={800}><TrackHome /></Scaled>
        </div>
        <svg viewBox="0 0 18 18" style={pct(RUN)}><circle cx="9" cy="9" r="9" fill="#2bb7c4" /><text x="9" y="11" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">RUN</text></svg>
      </div>
    </div>
  )
}
