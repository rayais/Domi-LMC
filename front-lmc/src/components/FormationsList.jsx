import { useState, useEffect } from 'react'
import Card from './Card'

export default function FormationsList({ type, title, subtitle, accueilOnly = false }) {
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

  return (
    <section id="formations" className="py-16 md:py-24 bg-bg dark:bg-[#1A1A1A]">
      <div className="section-inner">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map(f => (
            <Card key={f.id} formation={f} />
          ))}
        </div>
      </div>
    </section>
  )
}
