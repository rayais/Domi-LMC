import { useState, useEffect } from 'react'
import { getSite } from '../services/api'
import Hero from '../components/Hero'
import FormationsList from '../components/FormationsList'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'

export default function Home() {
  const [temoignages, setTemoignages] = useState([])

  useEffect(() => {
    getSite().then(data => {
      if (data?.temoignages) setTemoignages(data.temoignages)
    }).catch(() => {})
  }, [])

  return (
    <>
      <Hero />
      <FormationsList
        type="extra"
        title="Formations Société"
        subtitle="Des programmes adaptés aux besoins de votre entreprise"
      />
      <FormationsList
        type="intra"
        title="Formations Individuelles"
        subtitle="Développez vos compétences à votre rythme"
      />
      <Testimonials temoignages={temoignages} />
      <CTA />
    </>
  )
}
