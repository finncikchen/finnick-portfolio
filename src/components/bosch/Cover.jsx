import { KEYFRAMES } from './kit'
import Dashboard, { Scaled } from './Dashboard'

// Home-page card cover for Bosch. Fixed 1600 x 900 canvas, scaled to the card.
export default function BoschCover({ hovered }) {
  return (
    <Scaled w={1600} h={900} style={{ position: 'absolute', inset: 0, aspectRatio: 'auto', height: '100%' }}>
      <style>{KEYFRAMES + '@keyframes bcFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}'}</style>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 60% at 8% 5%, #f2dcf0 0%, rgba(242,220,240,0) 70%), radial-gradient(ellipse 60% 70% at 100% 100%, #cfe4f7 0%, rgba(207,228,247,0) 70%), radial-gradient(ellipse 50% 50% at 60% 40%, #ffffff 0%, rgba(255,255,255,0) 70%), #eef0f7' }} />
      <div style={{ position: 'absolute', left: 250, top: 88, width: 1100, transition: 'transform .6s cubic-bezier(.2,.7,.2,1)', transform: hovered ? 'translateY(-10px) scale(1.015)' : 'none' }}>
        <div style={{ borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 50px 110px rgba(40,50,110,0.25), 0 0 0 1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '12px 16px', background: '#f4f5f8' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
          </div>
          <Scaled><Dashboard /></Scaled>
        </div>
      </div>

    </Scaled>
  )
}
