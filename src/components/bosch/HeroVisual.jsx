import { C, FONT, Tag, KEYFRAMES } from './kit'
import Dashboard, { Scaled } from './Dashboard'

// Hero composition: the live dashboard in perspective, with real UI pieces floating around it.
// Laid out on a fixed 1440 x 780 canvas and scaled to width.
const T = ({ children, c = C.text, s = 13, w = 400, style }) => <span style={{ fontFamily: FONT, fontSize: s, color: c, fontWeight: w, ...style }}>{children}</span>
const card = { position: 'absolute', background: 'rgba(255,255,255,0.98)', borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)', fontFamily: FONT }
const float = (d, delay) => ({ animation: `hvFloat ${d}s ease-in-out ${delay}s infinite` })

function MiniSteps() {
  return (
    <div style={{ display: 'flex', marginTop: 16 }}>
      {['Created', 'Approved', 'Paid', 'Invoice', 'Cleared'].map((t, i) => (
        <div key={t} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
          {i > 0 && <div style={{ position: 'absolute', top: 5, right: '50%', width: '100%', height: 2, background: i <= 3 ? C.blue : '#e0e2e5' }} />}
          <div style={{ position: 'relative', zIndex: 1, width: 12, height: 12, margin: '0 auto', borderRadius: '50%', background: i <= 3 ? C.blue : '#fff', border: `2px solid ${i <= 3 ? C.blue : '#c7cbd1'}`, boxShadow: i === 3 ? `0 0 0 4px ${C.blueSoft}` : 'none' }} />
          <div style={{ marginTop: 6 }}><T s={10.5} c={i <= 3 ? C.ink : C.faint} w={i === 3 ? 700 : 400}>{t}</T></div>
        </div>
      ))}
    </div>
  )
}

export default function HeroVisual() {
  return (
    <Scaled w={1440} h={780}>
      <style>{KEYFRAMES + '@keyframes hvFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes hvPulseB{0%{box-shadow:0 0 0 0 rgba(0,123,192,.5)}100%{box-shadow:0 0 0 8px rgba(0,123,192,0)}}@keyframes hvPulse{0%{box-shadow:0 0 0 0 rgba(234,0,22,.45)}100%{box-shadow:0 0 0 10px rgba(234,0,22,0)}}'}</style>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', perspective: 2600, perspectiveOrigin: '50% 0%' }}>
        {/* dashboard window */}
        <div style={{ position: 'absolute', left: 170, top: 36, width: 1100, transform: 'rotateX(16deg)', transformOrigin: '50% 0%', transformStyle: 'preserve-3d' }}>
          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 60px 140px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: '#f3f4f6' }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              <span style={{ margin: '0 auto', fontFamily: FONT, fontSize: 11.5, color: '#8a8f98', background: '#fff', borderRadius: 6, padding: '3px 60px' }}>dp-deposit.bosch.com</span>
            </div>
            <Scaled w={1440} h={900}><Dashboard /></Scaled>
          </div>
          {/* floating layers share the window's 3D plane, lifted toward the viewer */}
          <div style={{ position: 'absolute', left: -74, top: 190, transform: 'translateZ(90px)' }}>
      <div style={{ ...card, position: 'relative', width: 300, padding: '20px 22px', ...float(6, 0) }}>
        <T s={11} c={C.faint} w={600} style={{ letterSpacing: '0.08em' }}>OPERATIONAL LOG</T>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
          {[['Invoice number uploaded', 'Wei KANG · just now', true], ['Manual reminder sent', 'Cheng ZHANG · 10:45'], ['Payment posted', 'Cheng ZHANG · Mar 28']].map(([t, d, on]) => (
            <div key={t} style={{ display: 'flex', gap: 10 }}>
              <span style={{ width: 8, height: 8, marginTop: 5, flex: '0 0 auto', borderRadius: '50%', border: `2px solid ${on ? C.blue : '#c7cbd1'}`, animation: on ? 'hvPulseB 1.6s ease-out infinite' : 'none' }} />
              <div><div><T s={12.5} w={600} c={C.ink}>{t}</T></div><T s={11} c={C.faint}>{d}</T></div>
            </div>
          ))}
        </div>
      </div>
          </div>
          <div style={{ position: 'absolute', right: -74, top: 380, transform: 'translateZ(140px)' }}>
      <div style={{ ...card, position: 'relative', width: 300, padding: '20px 22px', ...float(6, 1.5) }}>
        <T s={11} c={C.faint} w={600} style={{ letterSpacing: '0.08em' }}>TICKET PROGRESS</T>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <T s={15} w={700} c={C.ink}>TicketCode 99</T><Tag>Invoice received</Tag>
        </div>
        <MiniSteps />
      </div>
          </div>
        </div>
      </div>
      {/* fade into the hero background */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, background: 'linear-gradient(180deg, rgba(12,20,38,0) 0%, rgba(12,20,38,0.85) 70%, #0c1426 100%)' }} />

    </Scaled>
  )
}
