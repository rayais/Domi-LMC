import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Lightbox from '../components/Lightbox'

export default function FormationDetail() {
  const { slug } = useParams()
  const [formation, setFormation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/lmc/formation/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Formation non trouvée')
        return r.json()
      })
      .then(data => setFormation(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !formation) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="font-serif text-2xl text-secondary dark:text-white">Formation non trouvée</h1>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    )
  }

  const allImages = [formation.imageVitrine, ...(formation.galerie || [])].filter(Boolean)

  return (
    <div className="pt-20">
      <section className="relative h-64 md:h-96 bg-gradient-to-br from-primary/10 to-bg-alt dark:from-primary/20 dark:to-[#2A2A2A]">
        {formation.imageVitrine && (
          <img
            src={formation.imageVitrine}
            alt={formation.nom}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="section-inner">
            <div className="flex items-center gap-3 mb-3">
              {formation.module && (
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                  {formation.module}
                </span>
              )}
              <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                {formation.duree}
              </span>
              <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                {formation.publicCible}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
              {formation.nom}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-bg dark:bg-[#1A1A1A]">
        <div className="section-inner">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl font-bold text-secondary dark:text-white mb-4">
                Description
              </h2>
              <p className="text-text-light dark:text-gray-400 leading-relaxed mb-8 whitespace-pre-line">
                {formation.descriptionLongue || formation.description}
              </p>

              {formation.objectifs && formation.objectifs.length > 0 && (
                <>
                  <h2 className="font-serif text-2xl font-bold text-secondary dark:text-white mb-4">
                    Objectifs
                  </h2>
                  <ul className="space-y-3 mb-8">
                    {formation.objectifs.map((obj, i) => (
                      <li key={i} className="flex items-start gap-3 text-text-light dark:text-gray-400">
                        <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {allImages.length > 0 && (
                <>
                  <h2 className="font-serif text-2xl font-bold text-secondary dark:text-white mb-4">
                    Galerie
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
                        className="relative h-32 md:h-40 rounded-lg overflow-hidden group cursor-pointer border-none bg-bg-alt dark:bg-gray-700"
                      >
                        <img
                          src={img}
                          alt={`${formation.nom} - Image ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-bg-alt dark:bg-[#2A2A2A] rounded-xl p-6 border border-border dark:border-gray-600 sticky top-24">
                <h3 className="font-serif text-lg font-bold text-secondary dark:text-white mb-4">
                  Informations
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-text-light dark:text-gray-500">Durée</div>
                      <div className="font-medium text-secondary dark:text-white text-sm">{formation.duree}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-text-light dark:text-gray-500">Public cible</div>
                      <div className="font-medium text-secondary dark:text-white text-sm">{formation.publicCible}</div>
                    </div>
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="btn btn-primary w-full mt-6 text-center"
                >
                  S'inscrire / Demander un devis
                </Link>
                <Link
                  to="/"
                  className="btn btn-outline w-full mt-3 text-center"
                >
                  ← Retour aux formations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {lightboxOpen && allImages.length > 0 && (
        <Lightbox
          images={allImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}
