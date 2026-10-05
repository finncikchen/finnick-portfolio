import cover from '../assets/images/yhlo/cover.webp'

// Home-page card cover for YHLO: the iTLA unit on a backdrop extended from the render itself.
export default function YhloCover({ hovered }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#f6f6f6' }}>
      <img src={cover} alt="YHLO iTLA track unit" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s cubic-bezier(.2,.7,.2,1)', transform: hovered ? 'scale(1.03)' : 'none', transformOrigin: '50% 60%' }} />
    </div>
  )
}
