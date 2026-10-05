import { Scaled } from './bosch/Dashboard'
import { DeviceOnly } from './yhlo/Track'
import device from '../assets/images/yhlo/device-front.webp'

// Home-page card cover for YHLO: just the iTLA unit, centered, running its live screen.
// Fixed 1600 x 900 canvas, scaled to the card.
export default function YhloCover({ hovered }) {
  return (
    <Scaled w={1600} h={900} style={{ position: 'absolute', inset: 0, aspectRatio: 'auto', height: '100%' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 65% at 50% 42%, #f9f9f9 0%, #efefef 70%, #e9e9e9 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, transition: 'transform .6s cubic-bezier(.2,.7,.2,1)', transform: hovered ? 'scale(1.03)' : 'none', transformOrigin: '50% 60%' }}>
        <DeviceOnly device={device} x={330} y={150} w={940} shadow={false} />
      </div>
    </Scaled>
  )
}
