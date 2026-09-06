import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDarkMode } from '../hooks/useDarkMode'
import { getSite } from '../services/api'
import lmcLogo from '../assets/lmc.png'

function isLoggedIn() {
  const token = localStorage.getItem('lmc-token')
  const expiry = localStorage.getItem('lmc-tokenExpiry')
  return token && expiry && Date.now() <= Number(expiry)
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [intraOpen, setIntraOpen] = useState(false)
  const [extraOpen, setExtraOpen] = useState(false)
  const [intraFormations, setIntraFormations] = useState([])
  const [extraFormations, setExtraFormations] = useState([])
  const [siteName, setSiteName] = useState('LMC')
  const [loggedIn, setLoggedIn] = useState(isLoggedIn)
  const { dark, toggle } = useDarkMode()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/lmc/formations?type=intra')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setIntraFormations(data.sort((a, b) => (a.ordre || 0) - (b.ordre || 0))) })
      .catch(() => {})
    fetch('/lmc/formations?type=extra')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setExtraFormations(data.sort((a, b) => (a.ordre || 0) - (b.ordre || 0))) })
      .catch(() => {})
    getSite().then(data => {
      if (data?.nom) setSiteName(data.nom.split(' ')[0] || 'LMC')
    }).catch(() => {})
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setIntraOpen(false)
    setExtraOpen(false)
    setLoggedIn(isLoggedIn())
  }, [location])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-[#1A1A1A]/95 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img src={lmcLogo} alt="LMC Formation" className="h-10 w-auto" />
        </Link>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-secondary dark:bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-secondary dark:bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-secondary dark:bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        <div className={`md:flex md:items-center md:gap-6 ${menuOpen ? 'fixed inset-0 top-16 bg-white dark:bg-[#1A1A1A] flex flex-col items-start p-6 gap-4' : 'hidden'}`}>
          <Link to="/" className="text-secondary dark:text-gray-300 hover:text-primary no-underline font-medium transition-colors">
            Accueil
          </Link>

          <div className="relative">
            <button
              onClick={() => { setExtraOpen(v => !v); setIntraOpen(false) }}
              className="text-secondary dark:text-gray-300 hover:text-primary font-medium transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer"
            >
              Formation Société
              <svg className={`w-4 h-4 transition-transform ${extraOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {extraOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#2A2A2A] rounded-lg shadow-lg border border-border dark:border-gray-600 py-2 z-50">
                {extraFormations.length > 0 ? extraFormations.map(f => (
                  <Link key={f.id} to={`/formation/${f.slug}`} className="block px-4 py-2 text-sm text-secondary dark:text-gray-300 hover:bg-bg-alt dark:hover:bg-gray-700 no-underline transition-colors">
                    {f.nom}
                  </Link>
                )) : (
                  <span className="block px-4 py-2 text-sm text-text-light">Aucune formation</span>
                )}
                <Link to="/formation-societe" className="block px-4 py-2 text-sm text-primary font-medium border-t border-border dark:border-gray-600 mt-1 pt-2 no-underline">
                  Voir toutes →
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setIntraOpen(v => !v); setExtraOpen(false) }}
              className="text-secondary dark:text-gray-300 hover:text-primary font-medium transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer"
            >
              Formation Individuelle
              <svg className={`w-4 h-4 transition-transform ${intraOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {intraOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#2A2A2A] rounded-lg shadow-lg border border-border dark:border-gray-600 py-2 z-50">
                {intraFormations.length > 0 ? intraFormations.map(f => (
                  <Link key={f.id} to={`/formation/${f.slug}`} className="block px-4 py-2 text-sm text-secondary dark:text-gray-300 hover:bg-bg-alt dark:hover:bg-gray-700 no-underline transition-colors">
                    {f.nom}
                  </Link>
                )) : (
                  <span className="block px-4 py-2 text-sm text-text-light">Aucune formation</span>
                )}
                <Link to="/formation-individuelle" className="block px-4 py-2 text-sm text-primary font-medium border-t border-border dark:border-gray-600 mt-1 pt-2 no-underline">
                  Voir toutes →
                </Link>
              </div>
            )}
          </div>

          <Link to="/a-propos" className="text-secondary dark:text-gray-300 hover:text-primary no-underline font-medium transition-colors">
            À propos
          </Link>
          <Link to="/contact" className="text-secondary dark:text-gray-300 hover:text-primary no-underline font-medium transition-colors">
            Contact
          </Link>
          {loggedIn && (
            <a href="/admin" className="text-secondary dark:text-gray-300 hover:text-primary no-underline font-medium transition-colors">
              Dashboard
            </a>
          )}

          <button
            onClick={toggle}
            className="p-2 rounded-lg bg-bg-alt dark:bg-gray-700 hover:bg-border dark:hover:bg-gray-600 transition-colors border-none cursor-pointer"
            aria-label="Basculer le mode sombre"
          >
            {dark ? (
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
