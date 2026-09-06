import { useState, useEffect, useCallback } from 'react'
import { getSite, getHeroSlides } from '../services/api'

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
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary font-serif">{display}{suffix}</div>
      <div className="text-sm text-secondary-light dark:text-gray-400 mt-1">{label}</div>
    </div>
  )
}

export default function Hero() {
  const [stats, setStats] = useState([])
  const [site, setSite] = useState(null)
  const [slides, setSlides] = useState([])
  const [heroInterval, setHeroInterval] = useState(5000)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    getSite().then(data => {
      setSite(data)
      if (data?.stats) setStats(data.stats)
    }).catch(() => {})
    getHeroSlides().then(data => {
      if (data?.slides) setSlides(data.slides)
      if (data?.interval) setHeroInterval(data.interval)
    }).catch(() => {})
  }, [])

  const sortedSlides = [...slides].sort((a, b) => (a.ordre || 0) - (b.ordre || 0))

  const nextSlide = useCallback(() => {
    if (sortedSlides.length <= 1) return
    setCurrentSlide(prev => (prev + 1) % sortedSlides.length)
  }, [sortedSlides.length])

  useEffect(() => {
    if (sortedSlides.length <= 1) return
    const timer = setInterval(nextSlide, heroInterval)
    return () => clearInterval(timer)
  }, [sortedSlides.length, heroInterval, nextSlide])

  const hasSlides = sortedSlides.length > 0

  return (
    <section id="hero" className={`relative min-h-screen flex items-center justify-center pt-20 overflow-hidden ${hasSlides ? 'bg-black' : 'bg-gradient-to-br from-bg via-bg-alt to-bg dark:from-[#1A1A1A] dark:via-[#2A2A2A] dark:to-[#1A1A1A]'}`}>
      {hasSlides && (
        <div className="absolute inset-0">
          {sortedSlides.map((slide, i) => (
            <div key={slide.id} className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <img src={slide.image} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
      )}

      {!hasSlides && (
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 border-4 border-primary rounded-3xl rotate-12" />
          <div className="absolute bottom-20 left-20 w-48 h-48 border-4 border-secondary rounded-3xl -rotate-12" />
        </div>
      )}

      <div className="section-inner text-center relative z-10 py-20">
        <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Centre de Formation Professionnelle
        </div>

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-secondary dark:text-white mb-4 leading-tight">
          LMC <span className="text-primary">Formation</span>
        </h1>

        <p className="text-xl md:text-2xl text-secondary-light dark:text-gray-400 mb-2 font-light">
          Conseil & Étude
        </p>

        <p className="text-base md:text-lg text-text-light dark:text-gray-400 max-w-2xl mx-auto mb-8">
          {site?.slogan || 'Formation, Conseil et Étude pour votre réussite professionnelle. Nous accompagnons les entreprises et les particuliers dans leur développement.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a href="#formations-section" className="btn btn-primary text-lg px-8 py-3">
            Nos formations
          </a>
          <a href="/contact" className="btn btn-outline text-lg px-8 py-3">
            Nous contacter
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {stats.map((s, i) => (
            <AnimatedStat key={i} target={s.nombre} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
