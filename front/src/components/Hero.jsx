import { useState, useEffect, useCallback } from 'react'
import { getStats, getHeroSlides, getContact } from '../services/api'
import logonavFallback from '../assets/logonav.png'

const DEFAULT_STATS = [
  { id: 1, number: '50+', label: 'Entreprises accompagnées' },
  { id: 2, number: '15+', label: "Années d'expérience" },
  { id: 3, number: '4', label: "Pôles d'expertise" },
]

function AnimatedStat({ target, label }) {
  const [display, setDisplay] = useState(0)
  const match = target.match(/^(\d+)(.*)$/)
  const targetVal = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : target

  useEffect(() => {
    const duration = 1200
    const start = performance.now()
    let raf

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * targetVal))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [targetVal])

  return (
    <div className="hero__stat">
      <span className="hero__stat-number">{display}{suffix}</span>
      <span className="hero__stat-label">{label}</span>
    </div>
  )
}

export default function Hero() {
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [slides, setSlides] = useState([])
  const [interval, setIntervalMs] = useState(5000)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [logo, setLogo] = useState(logonavFallback)

  useEffect(() => {
    getStats()
      .then(data => { if (Array.isArray(data) && data.length > 0) setStats(data) })
      .catch(() => {})
    getHeroSlides()
      .then(data => {
        if (data?.slides) setSlides(data.slides)
        if (data?.interval) setIntervalMs(data.interval)
      })
      .catch(() => {})
    getContact().then(data => {
      if (data?.logo) setLogo(data.logo)
    }).catch(() => {})
  }, [])

  const sortedSlides = [...slides].sort((a, b) => (a.ordre || 0) - (b.ordre || 0))

  const nextSlide = useCallback(() => {
    if (sortedSlides.length <= 1) return
    setCurrentSlide(prev => (prev + 1) % sortedSlides.length)
  }, [sortedSlides.length])

  useEffect(() => {
    if (sortedSlides.length <= 1) return
    const timer = setInterval(nextSlide, interval)
    return () => clearInterval(timer)
  }, [sortedSlides.length, interval, nextSlide])

  const hasSlides = sortedSlides.length > 0

  return (
    <section id="hero" className={`hero${hasSlides ? ' hero--carousel' : ''}`}>
      {hasSlides && (
        <div className="hero__slides">
          {sortedSlides.map((slide, i) => (
            <div key={slide.id} className={`hero__slide${i === currentSlide ? ' hero__slide--active' : ''}`}>
              <img src={slide.image} alt="" />
            </div>
          ))}
          <div className="hero__slide-overlay" />
        </div>
      )}
      {!hasSlides && <div className="hero__overlay" />}
      <div className="hero__content">
        <img src={logo} alt="GOOD START DOMICILIATION" className="hero__logo" />
        <h1 className="hero__title">GOOD START</h1>
        <p className="hero__brand">DOMICILIATION</p>
        <p className="hero__brand-sub">GSD</p>
        <div className="hero__actions">
          <a href="#services" className="btn btn--primary">Nos services</a>
          <a href="#contact" className="btn btn--outline">Nous contacter</a>
        </div>
        <div className="hero__stats">
          {stats.map(s => (
            <AnimatedStat key={s.id} target={s.number} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
