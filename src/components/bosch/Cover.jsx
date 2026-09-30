import { C, FONT, Tag, KEYFRAMES } from './kit'
import Dashboard, { Scaled } from './Dashboard'

// Home-page card cover for Bosch. Fixed 1600 x 900 canvas, scaled to the card.
const T = ({ children, c = C.text, s = 13, w = 400 }) => <span style={{ fontFamily: FONT, fontSize: s, color: c, fontWeight: w }}>{children}</span>
const float = { position: 'absolute', background: '#fff', borderRadius: 18, boxShadow: '0 30px 70px rgba(40,50,110,0.22), 0 0 0 1px rgba(0,0,0,0.04)', fontFamily: FONT }

export default function BoschCover({ hovered }) {
  return (
    <Scaled w={1600} h={900} style={{ position: 'absolute', inset: 0, aspectRatio: 'auto', height: '100%' }}>
      <style>{KEYFRAMES + '@keyframes bcFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}'}</style>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 60% at 8% 5%, #f2dcf0 0%, rgba(242,220,240,0) 70%), radial-gradient(ellipse 60% 70% at 100% 100%, #cfe4f7 0%, rgba(207,228,247,0) 70%), radial-gradient(ellipse 50% 50% at 60% 40%, #ffffff 0%, rgba(255,255,255,0) 70%), #eef0f7' }} />
      <div style={{ position: 'absolute', left: 330, top: 150, width: 940, transition: 'transform .6s cubic-bezier(.2,.7,.2,1)', transform: hovered ? 'translateY(-10px) scale(1.015)' : 'none' }}>
        <div style={{ borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 50px 110px rgba(40,50,110,0.25), 0 0 0 1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '12px 16px', background: '#f4f5f8' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
          </div>
          <Scaled><Dashboard /></Scaled>
        </div>
      </div>

      <div style={{ ...float, right: 110, top: 100, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 12, animation: 'bcFloat 5s ease-in-out infinite' }}>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: C.green, color: '#fff', fontSize: 15, display: 'grid', placeItems: 'center' }}>✓</span>
        <div><div><T s={17} w={700} c={C.ink}>Reminder sent</T></div><T s={14} c={C.sub}>TicketCode 99 · Wei KANG</T></div>
      </div>

      <div style={{ ...float, left: 120, bottom: 110, width: 420, padding: '22px 26px', animation: 'bcFloat 6s ease-in-out .8s infinite' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><T s={19} w={700} c={C.ink}>TicketCode 99</T><Tag style={{ fontSize: 13 }}>Invoice received</Tag></div>
        <div style={{ display: 'flex', marginTop: 20 }}>
          {['Created', 'Approved', 'Paid', 'Invoice', 'Cleared'].map((t, i) => (
            <div key={t} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
              {i > 0 && <div style={{ position: 'absolute', top: 6, right: '50%', width: '100%', height: 3, background: i <= 3 ? C.blue : '#e0e2e5' }} />}
              <div style={{ position: 'relative', zIndex: 1, width: 15, height: 15, margin: '0 auto', borderRadius: '50%', background: i <= 3 ? C.blue : '#fff', border: `3px solid ${i <= 3 ? C.blue : '#c7cbd1'}`, boxShadow: i === 3 ? `0 0 0 5px ${C.blueSoft}` : 'none' }} />
              <div style={{ marginTop: 8 }}><T s={13} c={i <= 3 ? C.ink : C.faint} w={i === 3 ? 700 : 400}>{t}</T></div>
            </div>
          ))}
        </div>
      </div>
    </Scaled>
  )
}
