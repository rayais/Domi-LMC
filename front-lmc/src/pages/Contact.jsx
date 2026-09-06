import { useState, useEffect } from 'react'
import { sendMessage, getSite } from '../services/api'

export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', sujet: '', message: '' })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const [contact, setContact] = useState({})
  const [reseaux, setReseaux] = useState({})

  useEffect(() => {
    getSite().then(data => {
      if (data?.contact) setContact(data.contact)
      if (data?.reseauxSociaux) setReseaux(data.reseauxSociaux)
    }).catch(() => {})
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setStatus(null)
    try {
      await sendMessage(form)
      setStatus({ type: 'success', msg: 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.' })
      setForm({ nom: '', email: '', telephone: '', sujet: '', message: '' })
    } catch (err) {
      setStatus({ type: 'error', msg: err.message })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="pt-20">
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-bg dark:from-primary/10 dark:to-[#1A1A1A]">
        <div className="section-inner text-center">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-secondary dark:text-white mb-4">
            Contactez-<span className="text-primary">nous</span>
          </h1>
          <p className="text-lg text-text-light dark:text-gray-400 max-w-2xl mx-auto">
            Prêt à démarrer ? Parlons de votre projet de formation.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-bg dark:bg-[#1A1A1A]">
        <div className="section-inner">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h2 className="font-serif text-2xl font-bold text-secondary dark:text-white mb-6">
                Envoyez-nous un message
              </h2>

              {status && (
                <div className={`mb-6 p-4 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                  {status.msg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="nom" placeholder="Nom complet *" value={form.nom} onChange={handleChange} className="form-input" required />
                  <input type="email" name="email" placeholder="Email *" value={form.email} onChange={handleChange} className="form-input" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="tel" name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} className="form-input" />
                  <input type="text" name="sujet" placeholder="Sujet" value={form.sujet} onChange={handleChange} className="form-input" />
                </div>
                <textarea name="message" placeholder="Votre message *" value={form.message} onChange={handleChange} className="form-input form-textarea" rows="5" required />
                <button type="submit" disabled={sending} className="btn btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
                  {sending ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-secondary dark:text-white mb-6">
                Nos coordonnées
              </h2>
              <div className="space-y-6">
                {contact.adresse && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary dark:text-white text-sm mb-1">Adresse</h3>
                      <p className="text-text-light dark:text-gray-400 text-sm">{contact.adresse}</p>
                    </div>
                  </div>
                )}

                {contact.telephone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary dark:text-white text-sm mb-1">Téléphone</h3>
                      <p className="text-text-light dark:text-gray-400 text-sm">{contact.telephone}</p>
                    </div>
                  </div>
                )}

                {contact.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary dark:text-white text-sm mb-1">Email</h3>
                      <p className="text-text-light dark:text-gray-400 text-sm">{contact.email}</p>
                    </div>
                  </div>
                )}

                {contact.horaires && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary dark:text-white text-sm mb-1">Horaires</h3>
                      <p className="text-text-light dark:text-gray-400 text-sm">{contact.horaires}</p>
                    </div>
                  </div>
                )}
              </div>

              {(reseaux.facebook || reseaux.linkedin || reseaux.instagram) && (
                <div className="mt-8">
                  <h3 className="font-semibold text-secondary dark:text-white text-sm mb-3">Suivez-nous</h3>
                  <div className="flex gap-3">
                    {reseaux.facebook && (
                      <a href={reseaux.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-bg-alt dark:bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-colors no-underline">
                        <svg className="w-5 h-5 text-secondary dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    )}
                    {reseaux.linkedin && (
                      <a href={reseaux.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-bg-alt dark:bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-colors no-underline">
                        <svg className="w-5 h-5 text-secondary dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                    {reseaux.instagram && (
                      <a href={reseaux.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-bg-alt dark:bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-colors no-underline">
                        <svg className="w-5 h-5 text-secondary dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
