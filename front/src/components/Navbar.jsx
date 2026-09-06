import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logonav from '../assets/logonav.png'

const navLinks = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'À propos', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

function isAuthed() {
  const token = localStorage.getItem('token')
  const expiry = localStorage.getItem('tokenExpiry')
  return !!(token && expiry && Date.now() < Number(expiry))
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authed, setAuthed] = useState(isAuthed)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onFocus = () => setAuthed(isAuthed())
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#hero" className="navbar__logo">
          <img src={logonav} alt="GSD" className="navbar__logo-img" />
          <div className="navbar__logo-text">
            <span className="navbar__logo-gsd">GSD</span>
            <span className="navbar__logo-full">GOOD START DOMICILIATION</span>
          </div>
        </a>

        <button
          className={`navbar__toggle${menuOpen ? ' is-active' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`navbar__links${menuOpen ? ' is-open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
          {authed && (
            <li>
              <Link to="/admin" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
