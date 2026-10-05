import cover from '../assets/images/yhlo/device-front.webp'

// Home-page card cover for YHLO: the iTLA unit on a backdrop extended from the render itself.
export default function YhloCover({ hovered }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#eee' }}>
      <img src={cover} alt="YHLO iTLA track unit" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 55%', transition: 'transform .6s cubic-bezier(.2,.7,.2,1)', transform: hovered ? 'scale(1.03)' : 'none', transformOrigin: '50% 60%' }} />
    </div>
  )
}
