import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDarkMode } from '../hooks/useDarkMode'
import lmcLogo from '../assets/lmc.png'

function isLoggedIn() {
  const token = localStorage.getItem('lmc-token')
  const expiry = localStorage.getItem('lmc-tokenExpiry')
  return token && expiry && Date.now() <= Number(expiry)
}

function groupByModule(formations) {
  const groups = {}
  formations.forEach(f => {
    const mod = f.module || 'Autre'
    if (!groups[mod]) groups[mod] = []
    groups[mod].push(f)
  })
  return groups
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [openModule, setOpenModule] = useState(null)
  const [intraFormations, setIntraFormations] = useState([])
  const [extraFormations, setExtraFormations] = useState([])
  const [loggedIn, setLoggedIn] = useState(isLoggedIn)
  const { dark, toggle } = useDarkMode()
  const location = useLocation()
  const ref = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/lmc/formations?type=intra')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setIntraFormations(data.sort((a, b) => (a.ordre || 0) - (b.ordre || 0)))
      })
      .catch(() => {})
    fetch('/lmc/formations?type=extra')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setExtraFormations(data.sort((a, b) => (a.ordre || 0) - (b.ordre || 0)))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setOpenDropdown(null)
    setOpenModule(null)
    setLoggedIn(isLoggedIn())
  }, [location])

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenDropdown(null)
        setOpenModule(null)
      }
    }
    if (openDropdown) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [openDropdown])

  function toggleDropdown(name) {
    if (openDropdown === name) {
      setOpenDropdown(null)
      setOpenModule(null)
    } else {
      setOpenDropdown(name)
      setOpenModule(null)
    }
  }

  function toggleModule(name) {
    setOpenModule(prev => prev === name ? null : name)
  }

  function closeAll() {
    setOpenDropdown(null)
    setOpenModule(null)
    setMenuOpen(false)
  }

  const extraGroups = groupByModule(extraFormations)
  const intraGroups = groupByModule(intraFormations)

  function renderDropdown(groups, listPath, dropdownName) {
    const moduleNames = Object.keys(groups)
    return (
      <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-[#2A2A2A] rounded-lg shadow-lg border border-border dark:border-gray-600 py-2 z-50 max-h-[70vh] overflow-y-auto">
        {moduleNames.length > 0 ? moduleNames.map(mod => (
          <div key={mod}>
            <button
              onClick={() => toggleModule(mod)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold hover:bg-bg-alt dark:hover:bg-gray-700 cursor-pointer bg-transparent border-none transition-colors text-left"
            >
              <span className="text-secondary dark:text-gray-300">{mod}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-light dark:text-gray-500">{groups[mod].length}</span>
                <svg className={`w-4 h-4 text-text-light transition-transform ${openModule === mod ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {openModule === mod && (
              <div className="bg-bg-alt dark:bg-gray-700/30 pb-1">
                {groups[mod].map(f => (
                  <Link key={f.id} to={`/formation/${f.slug}`} onClick={closeAll} className="block px-6 py-2 text-sm text-secondary dark:text-gray-300 hover:text-primary no-underline transition-colors">
                    {f.nom}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )) : (
          <span className="block px-4 py-2 text-sm text-text-light">Aucune formation</span>
        )}
        <Link to={listPath} onClick={closeAll} className="block px-4 py-2 text-sm text-primary font-medium border-t border-border dark:border-gray-600 mt-1 pt-2 no-underline">
          Voir toutes les formations →
        </Link>
      </div>
    )
  }

  return (
    <nav ref={ref} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-[#1A1A1A]/95 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
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

        <div className={`md:flex md:items-center md:gap-6 ${menuOpen ? 'fixed inset-0 top-16 bg-white dark:bg-[#1A1A1A] flex flex-col items-start p-6 gap-4 overflow-y-auto' : 'hidden'}`}>
          <Link to="/" onClick={closeAll} className="text-secondary dark:text-gray-300 hover:text-primary no-underline font-medium transition-colors">
            Accueil
          </Link>

          {menuOpen ? (
            <>
              <span className="text-sm font-bold text-primary dark:text-orange-400 mt-2">Formation Société</span>
              <div className="flex flex-col gap-1 w-full">
                {Object.keys(extraGroups).map(mod => (
                  <div key={mod}>
                    <button
                      onClick={() => toggleModule(mod)}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-primary dark:text-orange-400 bg-transparent border-none cursor-pointer flex items-center justify-between"
                    >
                      {mod}
                      <svg className={`w-3 h-3 transition-transform ${openModule === mod ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {openModule === mod && extraGroups[mod].map(f => (
                      <Link key={f.id} to={`/formation/${f.slug}`} onClick={closeAll} className="block px-8 py-1.5 text-sm text-secondary dark:text-gray-300 hover:bg-bg-alt dark:hover:bg-gray-700 no-underline transition-colors">
                        {f.nom}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>

              <span className="text-sm font-bold text-primary dark:text-orange-400 mt-2">Formation Individuelle</span>
              <div className="flex flex-col gap-1 w-full">
                {Object.keys(intraGroups).map(mod => (
                  <div key={mod}>
                    <button
                      onClick={() => toggleModule(mod)}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-primary dark:text-orange-400 bg-transparent border-none cursor-pointer flex items-center justify-between"
                    >
                      {mod}
                      <svg className={`w-3 h-3 transition-transform ${openModule === mod ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {openModule === mod && intraGroups[mod].map(f => (
                      <Link key={f.id} to={`/formation/${f.slug}`} onClick={closeAll} className="block px-8 py-1.5 text-sm text-secondary dark:text-gray-300 hover:bg-bg-alt dark:hover:bg-gray-700 no-underline transition-colors">
                        {f.nom}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('extra')}
                  className="text-secondary dark:text-gray-300 hover:text-primary font-medium transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer"
                >
                  Formation Société
                  <svg className={`w-4 h-4 transition-transform ${openDropdown === 'extra' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'extra' && renderDropdown(extraGroups, '/formation-societe', 'extra')}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown('intra')}
                  className="text-secondary dark:text-gray-300 hover:text-primary font-medium transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer"
                >
                  Formation Individuelle
                  <svg className={`w-4 h-4 transition-transform ${openDropdown === 'intra' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'intra' && renderDropdown(intraGroups, '/formation-individuelle', 'intra')}
              </div>
            </>
          )}

          <Link to="/a-propos" onClick={closeAll} className="text-secondary dark:text-gray-300 hover:text-primary no-underline font-medium transition-colors">
            À propos
          </Link>
          <Link to="/contact" onClick={closeAll} className="text-secondary dark:text-gray-300 hover:text-primary no-underline font-medium transition-colors">
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
