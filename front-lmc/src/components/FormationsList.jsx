import { useState, useEffect } from 'react'
import Card from './Card'

function groupByModule(formations) {
  const groups = {}
  formations.forEach(f => {
    const mod = f.module || 'Autre'
    if (!groups[mod]) groups[mod] = []
    groups[mod].push(f)
  })
  return groups
}

export default function FormationsList({ type, title, subtitle, accueilOnly = false, grouped = false }) {
  const [formations, setFormations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/lmc/formations?type=${type}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          let list = data
          if (accueilOnly) {
            list = data.filter(f => f.afficherAccueil === true)
          }
          setFormations(list)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [type, accueilOnly])

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-bg dark:bg-[#1A1A1A]">
        <div className="section-inner">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  if (formations.length === 0) return null

  if (grouped) {
    const groups = groupByModule(formations)
    return (
      <section className="py-16 md:py-24 bg-bg dark:bg-[#1A1A1A]">
        <div className="section-inner">
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
          {Object.keys(groups).map(mod => (
            <div key={mod} className="mb-12">
              <h3 className="text-xl md:text-2xl font-bold text-secondary dark:text-white mb-6 pb-2 border-b-2 border-primary inline-block">
                {mod}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups[mod].map(f => (
                  <Card key={f.id} formation={f} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="formations" className="py-16 md:py-24 bg-bg dark:bg-[#1A1A1A]">
      <div className="section-inner">
        {title && <h2 className="section-title">{title}</h2>}
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map(f => (
            <Card key={f.id} formation={f} />
          ))}
        </div>
      </div>
    </section>
  )
}
