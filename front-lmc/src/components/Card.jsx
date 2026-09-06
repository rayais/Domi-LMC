import { Link } from 'react-router-dom'

export default function Card({ formation }) {
  return (
    <Link
      to={`/formation/${formation.slug}`}
      className="group block bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border dark:border-gray-600 no-underline"
    >
      <div className="relative h-48 overflow-hidden bg-bg-alt dark:bg-gray-700">
        {formation.imageVitrine ? (
          <img
            src={formation.imageVitrine}
            alt={formation.nom}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {formation.duree}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg font-bold text-secondary dark:text-white mb-2 group-hover:text-primary transition-colors">
          {formation.nom}
        </h3>
        <p className="text-sm text-text-light dark:text-gray-400 line-clamp-2 mb-3">
          {formation.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-light dark:text-gray-500">{formation.publicCible}</span>
          <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Découvrir
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
