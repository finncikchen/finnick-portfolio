// Shared primitives for the live Bosch Down Payment & Deposit Platform replica.
// Rebuilt from the Figma file (WMkPuAo09jgzUWUbzFlhvF); all copy in English.
export const C = {
  blue: '#007bc0', blueDark: '#00629a', blueSoft: '#e6f2fa', red: '#ea0016', green: '#00884a', greenSoft: '#e2f5ea',
  amber: '#ffcf00', amberText: '#9a6b00', amberSoft: '#fff6d6', redSoft: '#ffe9e9', purple: '#9e2896', teal: '#18837e',
  ink: '#1a1c1d', text: 'rgba(0,0,0,0.85)', sub: '#71767c', faint: '#a4abb3', line: '#e0e2e5', bg: '#f4f5f7', white: '#fff',
}
export const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif'

export function BoschLogo({ size = 22, color = C.red }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10.4" stroke={C.ink} strokeWidth="1.6" />
        <path d="M7.4 5.6v12.8M16.6 5.6v12.8M7.4 12h9.2M9.8 7.6c1.3-.9 3.1-.9 4.4 0M9.8 16.4c1.3.9 3.1.9 4.4 0" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.95, letterSpacing: '0.02em', color }}>BOSCH</span>
    </div>
  )
}

export function Btn({ children, primary, ghost, hot, small, active, style }) {
  const base = { fontFamily: FONT, fontSize: small ? 12 : 13, height: small ? 26 : 32, padding: small ? '0 10px' : '0 14px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', cursor: 'default', transition: 'all .2s' }
  const look = primary
    ? { background: active ? C.blueDark : C.blue, color: '#fff', border: `1px solid ${active ? C.blueDark : C.blue}` }
    : ghost ? { background: 'transparent', color: C.blue, border: '1px solid transparent' }
      : { background: active ? C.blueSoft : '#fff', color: active ? C.blue : C.text, border: `1px solid ${active ? C.blue : '#d9d9d9'}` }
  return <span data-hot={hot} style={{ ...base, ...look, ...style }}>{children}</span>
}

const TAGS = {
  'Pending approval': [C.amberSoft, C.amberText], Approved: [C.blueSoft, C.blue], Paid: ['#eef0ff', '#4a4fc4'],
  'Invoice received': ['#f5e9f5', C.purple], Cleared: [C.greenSoft, C.green], Overdue: [C.redSoft, C.red], Open: ['#eef1f4', C.sub],
  Critical: [C.redSoft, C.red], Serious: ['#fff0e0', '#c05a00'], Medium: [C.amberSoft, C.amberText], Low: [C.greenSoft, C.green],
}
export function Tag({ children, style }) {
  const [bg, fg] = TAGS[children] || ['#eef1f4', C.sub]
  return <span style={{ fontFamily: FONT, fontSize: 11.5, padding: '2px 8px', borderRadius: 10, background: bg, color: fg, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 5, ...style }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: fg }} />{children}</span>
}

export function Field({ label, value, placeholder, hot, focus, area, w, select, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: w, ...style }}>
      {label && <span style={{ fontFamily: FONT, fontSize: 12, color: C.sub }}>{label}</span>}
      <div data-hot={hot} style={{ fontFamily: FONT, fontSize: 13, minHeight: area ? 64 : 32, padding: area ? '8px 10px' : '0 10px', display: 'flex', alignItems: area ? 'flex-start' : 'center', justifyContent: 'space-between', border: `1px solid ${focus ? C.blue : '#d9d9d9'}`, boxShadow: focus ? `0 0 0 3px ${C.blueSoft}` : 'none', borderRadius: 4, background: '#fff', color: value ? C.text : C.faint, transition: 'all .2s', lineHeight: 1.45 }}>
        <span>{value || placeholder}{focus && <span style={{ display: 'inline-block', width: 1, height: 14, background: C.ink, marginLeft: 1, verticalAlign: -2, animation: 'bkBlink 1s step-end infinite' }} />}</span>
        {select && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 3.5l3 3 3-3" stroke={C.sub} fill="none" strokeWidth="1.3" /></svg>}
      </div>
    </div>
  )
}

export function Toggle({ on, hot }) {
  return (
    <span data-hot={hot} style={{ width: 36, height: 20, borderRadius: 10, background: on ? C.blue : '#c7cbd1', position: 'relative', display: 'inline-block', transition: 'background .25s' }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.25)', transition: 'left .25s' }} />
    </span>
  )
}

export function Card({ title, extra, children, style, pad = 20 }) {
  return (
    <div style={{ background: '#fff', borderRadius: 6, border: `1px solid ${C.line}`, ...style }}>
      {title && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `14px ${pad}px`, borderBottom: `1px solid ${C.line}` }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: C.ink }}>{title}</span>{extra}</div>}
      <div style={{ padding: pad }}>{children}</div>
    </div>
  )
}

export function Modal({ title, children, footer, width = 560 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,20,30,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, animation: 'bkFade .25s ease both' }}>
      <div style={{ width, background: '#fff', borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,.25)', animation: 'bkPop .3s cubic-bezier(.2,.8,.3,1.15) both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: `1px solid ${C.line}` }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: C.ink }}>{title}</span>
          <span style={{ color: C.faint, fontSize: 16 }}>✕</span>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 24px', borderTop: `1px solid ${C.line}` }}>{footer}</div>
      </div>
    </div>
  )
}

export function Toast({ children }) {
  return (
    <div style={{ position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 30, animation: 'bkDrop .35s cubic-bezier(.2,.8,.3,1.2) both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#fff', borderRadius: 6, boxShadow: '0 8px 28px rgba(0,0,0,.16)', fontFamily: FONT, fontSize: 13, color: C.text }}>
        <span style={{ width: 16, height: 16, borderRadius: '50%', background: C.green, color: '#fff', fontSize: 10, display: 'grid', placeItems: 'center' }}>✓</span>{children}
      </div>
    </div>
  )
}

export const KEYFRAMES = '@keyframes bkBlink{50%{opacity:0}}@keyframes bkFade{from{opacity:0}}@keyframes bkPop{from{opacity:0;transform:scale(.95)}}@keyframes bkDrop{from{opacity:0;transform:translate(-50%,-12px)}}@keyframes bkIn{from{opacity:0;transform:translateY(8px)}}@keyframes bkRow{from{background:#e6f2fa}}'

const NAV = [
  ['Dashboard', 'dashboard'], ['Posting', 'posting'], ['Ticket list', null], ['Downpay', 'downpay', 1], ['Deposit', 'deposit', 1], ['Setting', null], ['Reminder setting', 'reminder', 1],
]
const Icon = ({ k }) => {
  const d = { Dashboard: 'M3 3h7v7H3zM14 3h7v4h-7zM14 11h7v10h-7zM3 14h7v7H3z', Posting: 'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5', 'Ticket list': 'M4 5h16v14H4zM4 10h16M9 5v14', Setting: 'M12 9a3 3 0 100 6 3 3 0 000-6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1' }[k]
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d={d} /></svg>
}

export function Shell({ active, crumbs, title, sub, actions, children, bell = 11 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 56, flex: '0 0 auto', background: '#fff', borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 28 }}>
        <BoschLogo />
        <span style={{ fontWeight: 700, fontSize: 15, color: C.ink, letterSpacing: '0.01em' }}>DOWN PAYMENT AND DEPOSIT PLATFORM</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18 }}>
          <span data-hot="bell" style={{ position: 'relative', color: C.sub }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 16V11a6 6 0 1112 0v5l2 2H4zM10 20a2 2 0 004 0" /></svg>
            {bell > 0 && <span style={{ position: 'absolute', top: -7, left: 10, background: C.red, color: '#fff', fontSize: 10, borderRadius: 8, padding: '0 5px', lineHeight: '15px' }}>{bell}</span>}
          </span>
          <span style={{ fontSize: 13, color: C.text }}>Cheng ZHANG</span>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: C.blueSoft, color: C.blue, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>CZ</span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ width: 200, flex: '0 0 auto', background: '#fff', borderRight: `1px solid ${C.line}`, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(([label, key, child]) => {
            const on = key && key === active
            return (
              <div key={label} data-hot={key ? 'nav-' + key : undefined} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: child ? '8px 12px 8px 35px' : '8px 12px', borderRadius: 4, fontSize: 13, color: on ? C.blue : C.text, background: on ? C.blueSoft : 'transparent', fontWeight: on ? 600 : 400, transition: 'all .2s' }}>
                {!child && <Icon k={label} />}{label}
              </div>
            )
          })}
        </div>
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {(title || crumbs) && (
            <div style={{ background: '#fff', padding: '14px 28px 18px', borderBottom: `1px solid ${C.line}` }}>
              {crumbs && <div style={{ fontSize: 12, color: C.sub, marginBottom: 8 }}>{crumbs.join('  /  ')}</div>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 20, color: C.ink }}>{title}</span>
                <div style={{ display: 'flex', gap: 8 }}>{actions}</div>
              </div>
              {sub}
            </div>
          )}
          <div style={{ padding: '20px 28px', flex: 1, minHeight: 0, overflow: 'hidden' }}>{children}</div>
        </div>
      </div>
    </div>
  )
}
