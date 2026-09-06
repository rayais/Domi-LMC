import { useState, useEffect } from 'react'
import { getExtras } from '../services/api'

export default function Extras() {
  const [extras, setExtras] = useState([])

  useEffect(() => {
    getExtras()
      .then(data => setExtras(Array.isArray(data) ? data : []))
      .catch(() => setExtras([]))
  }, [])

  if (extras.length === 0) return null

  return (
    <section id="extras" className="extras">
      <div className="section__inner">
        <h2 className="section__title">Extras</h2>
        <p className="section__subtitle">
          Des options supplémentaires pour aller plus loin
        </p>
        <div className="extras__list">
          {extras.map(e => (
            <article key={e.id_extra} className="extra-card">
              <div className="extra-card__icon">
                {e.icone && /\.(jpe?g|png|gif|webp|svg|bmp|tiff?|heic|heif|avif)$/i.test(e.icone)
                  ? <img src={`/uploads/${e.icone}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  : e.icone || '⭐'}
              </div>
              <div className="extra-card__body">
                <h3 className="extra-card__title">{e.titre}</h3>
                {Array.isArray(e.description) && e.description.length > 0 && (
                  <ul className="extra-card__list">
                    {e.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
              {e.prix && <div className="extra-card__price">{e.prix}</div>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
