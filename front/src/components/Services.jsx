import { useState, useEffect } from 'react'
import { getArticles, getContact } from '../services/api'

export default function Services() {
  const [articles, setArticles] = useState([])
  const [openContact, setOpenContact] = useState(null)
  const [contact, setContact] = useState(null)

  useEffect(() => {
    getArticles()
      .then(data => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setArticles([]))
    getContact().then(d => setContact(d)).catch(() => {})
  }, [])

  return (
    <section id="services" className="services">
      <div className="section__inner">
        <h2 className="section__title">Nos services</h2>
        <p className="section__subtitle">
          Des solutions sur mesure pour accompagner votre entreprise à chaque étape
        </p>
        <div className="services__grid">
          {articles.slice(0, 6).map(a => (
            <article key={a.id_article} className="service-card">
              <h3 className="service-card__title">{a.titre}</h3>
              <div className="service-card__media">
                <div className="service-card__bg">
                  {a.img
                    ? <img src={`/uploads/${a.img}`} alt={a.titre} loading="lazy" decoding="async" />
                    : <div className="service-card__placeholder" />}
                  <div className="service-card__overlay" />
                </div>
                <div className="service-card__body">
                  <div className="service-card__divider" />
                  {Array.isArray(a.description) && a.description.length > 0 && (
                    <ul className="service-card__list">
                      {a.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {a.prix && <div className="service-card__price">{a.prix} DT</div>}
                  <button
                    className="service-card__cta"
                    onClick={() => setOpenContact(openContact === a.id_article ? null : a.id_article)}
                  >
                    {openContact === a.id_article ? 'Fermer' : 'Appelez'}
                  </button>
                  {openContact === a.id_article && contact && (
                    <div className="service-card__contact">
                      <strong>Contactez-nous</strong>
                      <span>{contact.phone}</span>
                      <span>{contact.email}</span>
                      <span>{contact.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
          {articles.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888' }}>
              Aucun service pour le moment
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
