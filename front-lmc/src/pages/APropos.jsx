import { useState, useEffect } from 'react'
import CTA from '../components/CTA'

export default function APropos() {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/lmc/about')
      .then(r => r.json())
      .then(data => setAbout(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-20">
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-bg dark:from-primary/10 dark:to-[#1A1A1A]">
        <div className="section-inner text-center">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-secondary dark:text-white mb-4">
            À propos de <span className="text-primary">LMC</span>
          </h1>
          <p className="text-lg text-text-light dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez notre histoire, notre mission et nos valeurs qui guident chacune de nos actions.
          </p>
        </div>
      </section>

      {about && (
        <>
          <section className="py-12 md:py-16 bg-bg dark:bg-[#1A1A1A]">
            <div className="section-inner">
              <div className="max-w-3xl mx-auto">
                <p className="text-text-light dark:text-gray-400 leading-relaxed text-lg">
                  {about.description}
                </p>
              </div>
            </div>
          </section>

          <section className="py-12 md:py-16 bg-bg-alt dark:bg-[#2A2A2A]">
            <div className="section-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-secondary dark:text-white mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    Notre Mission
                  </h2>
                  <p className="text-text-light dark:text-gray-400 leading-relaxed">
                    {about.mission}
                  </p>
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-secondary dark:text-white mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </span>
                    Notre Vision
                  </h2>
                  <p className="text-text-light dark:text-gray-400 leading-relaxed">
                    {about.vision}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 md:py-16 bg-bg dark:bg-[#1A1A1A]">
            <div className="section-inner">
              <h2 className="font-serif text-2xl font-bold text-secondary dark:text-white mb-8 text-center">
                Nos Valeurs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {about.valeurs && about.valeurs.map((valeur, i) => (
                  <div key={i} className="flex items-center gap-3 bg-bg-alt dark:bg-[#2A2A2A] rounded-lg p-4 border border-border dark:border-gray-600">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-sm">{i + 1}</span>
                    </div>
                    <span className="text-secondary dark:text-gray-300 text-sm font-medium">{valeur}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <CTA />
    </div>
  )
}
