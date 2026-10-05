import { Scaled } from './bosch/Dashboard'
import { TrackHome } from './yhlo/Track'
import cover from '../assets/images/yhlo/cover-dark.webp'

// Home-page card cover for YHLO: studio render (1672 x 940) with the live Home UI on its display.
const SCR = { x: 486, y: 128, w: 155, h: 97 }
const RUN = { x: 437, y: 184, w: 22, h: 18 }

export default function YhloCover({ hovered }) {
  return (
    <Scaled w={1672} h={940} style={{ position: 'absolute', inset: 0, aspectRatio: 'auto', height: '100%' }}>
      <div style={{ position: 'absolute', inset: 0, transition: 'transform .6s cubic-bezier(.2,.7,.2,1)', transform: hovered ? 'scale(1.03)' : 'none', transformOrigin: '50% 60%' }}>
        <img src={cover} alt="YHLO iTLA track unit" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', left: SCR.x, top: SCR.y, width: SCR.w, height: SCR.h, borderRadius: 2, overflow: 'hidden', background: '#fff' }}>
          <div style={{ width: 1280, height: 800, transform: `scale(${SCR.w / 1280}, ${SCR.h / 800})`, transformOrigin: '0 0' }}><TrackHome /></div>
        </div>
        <div style={{ position: 'absolute', left: RUN.x, top: RUN.y, width: RUN.w, height: RUN.h, borderRadius: 4, background: '#2bb7c4', color: '#fff', fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 0.3 }}>RUN</div>
      </div>
    </Scaled>
  )
}
