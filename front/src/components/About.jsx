import { useState, useEffect } from 'react'
import { getAbout } from '../services/api'

export default function About() {
  const [content, setContent] = useState('')

  useEffect(() => {
    getAbout()
      .then(data => { if (data?.content) setContent(data.content) })
      .catch(() => {})
  }, [])

  return (
    <section id="about" className="about">
      <div className="section__inner">
        <h2 className="section__title">Pourquoi GOOD START ?</h2>
        <p className="section__subtitle">
          Votre partenaire de confiance pour le développement de votre activité
        </p>
        <div className="about__content">
          <div className="about__text about__text--rich" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </section>
  )
}
