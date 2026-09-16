import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getContact, sendMessage } from '../services/api'

export default function Contact() {
  const [contact, setContact] = useState(null)
  const mapRef = useRef(null)
  const tileRef = useRef(null)

  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [status, setStatus] = useState('')

  useEffect(() => {
    getContact()
      .then(data => { if (data) setContact(data) })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('')
    try {
      await sendMessage(form)
      setStatus('success')
      setForm({ nom: '', email: '', sujet: '', message: '' })
    } catch (err) {
      setStatus('error')
    }
  }

  useEffect(() => {
    if (!contact || contact.latitude == null || contact.longitude == null) return
    const lat = Number(contact.latitude)
    const lng = Number(contact.longitude)
    if (isNaN(lat) || isNaN(lng)) return

    if (!mapRef.current) {
      mapRef.current = L.map('contact-map').setView([lat, lng], 15)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)
      L.marker([lat, lng]).addTo(mapRef.current)
    } else {
      mapRef.current.setView([lat, lng], 15)
    }
    tileRef.current = [lat, lng]

    const id = window.setTimeout(() => mapRef.current && mapRef.current.invalidateSize(), 300)
    return () => window.clearTimeout(id)
  }, [contact])

  return (
    <section id="contact" className="contact">
      <div className="section__inner">
        <h2 className="section__title">Contactez-nous</h2>
        <p className="section__subtitle">
          Prêt à démarrer ? Parlons de votre projet
        </p>
        <div className="contact__grid">
          <form className="contact__form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Nom complet" className="form__input" required
              value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
            <input type="email" placeholder="Email" className="form__input" required
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input type="text" placeholder="Sujet" className="form__input"
              value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })} />
            <textarea placeholder="Votre message..." className="form__input form__textarea" rows="5" required
              value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            <button type="submit" className="btn btn--primary">Envoyer</button>
            {status === 'success' && <p style={{ color: '#2e7d32', marginTop: '0.5rem' }}>Message envoyé avec succès</p>}
            {status === 'error' && <p style={{ color: '#d32f2f', marginTop: '0.5rem' }}>Erreur lors de l'envoi, réessayez.</p>}
          </form>
          <div className="contact__info">
            <div className="contact__item">
              <svg viewBox="0 0 24 24" className="contact__icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <strong>Adresse</strong>
                <p>{contact?.address || '...'}</p>
              </div>
            </div>
            <div className="contact__item">
              <svg viewBox="0 0 24 24" className="contact__icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <div>
                <strong>Téléphone</strong>
                <p>{contact?.phone || '...'}</p>
              </div>
            </div>
            <div className="contact__item">
              <svg viewBox="0 0 24 24" className="contact__icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <div>
                <strong>Email</strong>
                <p>{contact?.email || '...'}</p>
              </div>
            </div>
            <div className="contact__social">
              {contact?.facebook && (
                <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="contact__social-link" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              )}
              {contact?.tiktok && (
                <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" className="contact__social-link" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                  TikTok
                </a>
              )}
              {contact?.instagram && (
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="contact__social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </a>
              )}
            </div>
            <div id="contact-map" className="contact__map"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
