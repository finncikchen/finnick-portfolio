import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.svg'

export default function Header() {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '28px 52px', width: '100%', position: 'relative', zIndex: 10,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
        <img src={logo} alt="FINNICK" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
      </Link>
      <nav style={{
        display: 'flex', gap: '36px', alignItems: 'center',
        fontFamily: 'Inter, sans-serif', fontSize: '13px',
        fontWeight: 400, letterSpacing: '0.04em',
        color: 'rgba(255,255,255,0.5)',
      }}>
        {[
          { label: 'Work', to: '/#work', internal: true },
          { label: 'About', to: '/about', internal: true },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/finnick-chen' },
          { label: 'Resume', href: 'https://drive.google.com/file/d/18YmO4nCD5nnzxserhyF82_zqdPp9TSTd/view?usp=drive_link' },
        ].map(item => item.internal ? (
          <Link
            key={item.label}
            to={item.to}
            style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            {item.label}
          </Link>
        ) : (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
