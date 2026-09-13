export default function Testimonials({ temoignages = [] }) {
  if (temoignages.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-bg-alt dark:bg-[#2A2A2A]">
      <div className="section-inner">
        <h2 className="section-title">Ce que disent nos clients</h2>
        <p className="section-subtitle">Les témoignages de ceux qui nous ont fait confiance</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {temoignages.map(t => (
            <div key={t.id} className="bg-white dark:bg-[#1A1A1A] rounded-xl p-6 shadow-sm border border-border dark:border-gray-600">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-text-light dark:text-gray-400 text-sm mb-4 italic">"{t.texte}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                  {t.photo ? (
                    <img src={t.photo} alt={t.nom} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{t.nom.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-secondary dark:text-white text-sm">{t.nom}</div>
                  <div className="text-xs text-text-light dark:text-gray-500">{t.poste} — {t.entreprise}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
