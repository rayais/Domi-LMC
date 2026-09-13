import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import {
  getArticles, createArticle, updateArticle, deleteArticle,
  login, getContact, updateContact, getAbout, updateAbout,
  getExtras, createExtra, updateExtra, deleteExtra,
  getStats, updateStats, changePassword,
  getTheme, updateTheme,
  getHeroSlides, updateHeroSlides, uploadHeroSlide, deleteHeroSlide,
} from '../services/api'

function getToken() {
  const token = localStorage.getItem('token')
  const expiry = localStorage.getItem('tokenExpiry')
  if (!token || !expiry || Date.now() > Number(expiry)) {
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpiry')
    return null
  }
  return token
}

function LoginForm({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await login(password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('tokenExpiry', Date.now() + data.expiresIn * 1000)
      onLogin()
    } catch (err) {
      setError(err.message || 'Mot de passe incorrect')
    }
  }
  return (
    <div className="dashboard-login">
      <div className="dashboard-login__card">
        <h1>Accès Dashboard</h1>
        <p>Entrez le mot de passe pour accéder à l'administration</p>
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="Mot de passe" value={password}
            onChange={e => setPassword(e.target.value)} className="form__input" autoFocus />
          {error && <p className="dashboard-login__error">{error}</p>}
          <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#000000'
}

const COLOR_LABELS = {
  '--color-primary': 'Principale',
  '--color-primary-dark': 'Principale (foncé)',
  '--color-primary-light': 'Principale (clair)',
  '--color-accent': 'Accent',
  '--color-accent-dark': 'Accent (foncé)',
  '--color-green': 'Vert',
  '--color-green-dark': 'Vert (foncé)',
  '--color-green-text': 'Texte vert',
  '--color-bg': 'Arrière-plan',
  '--color-text': 'Texte',
  '--color-text-light': 'Texte (clair)',
  '--color-white': 'Blanc',
  '--color-error': 'Erreur',
  '--color-success': 'Succès',
  '--color-info': 'Info',
  '--color-border': 'Bordure',
}

const DEFAULT_THEME = Object.fromEntries(
  Object.keys(COLOR_LABELS).map(k => [k, getCSSVar(k)])
)

const TABS = ['Articles', 'Extras', 'Contact', 'À propos', 'Statistiques', 'Hero', 'Theme']
const DEFAULT_STATS = [
  { id: 1, number: '50+', label: 'Entreprises accompagnées' },
  { id: 2, number: '15+', label: "Années d'expérience" },
  { id: 3, number: '4', label: "Pôles d'expertise" },
]

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(!!getToken())
  const [tab, setTab] = useState('Articles')

  // Articles state
  const [articles, setArticles] = useState([])
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState({ titre: '', descs: [''], prix: '' })
  const [file, setFile] = useState(null)
  const [artMsg, setArtMsg] = useState('')

  // Extras state
  const [extras, setExtras] = useState([])
  const [extraEdit, setExtraEdit] = useState(null)
  const [extraForm, setExtraForm] = useState({ titre: '', descs: [''], prix: '', icone: '' })
  const [extraIconFile, setExtraIconFile] = useState(null)
  const [extraMsg, setExtraMsg] = useState('')

  // Contact state
  const [contact, setContact] = useState({ phone: '', email: '', address: '', facebook: '', tiktok: '', instagram: '', latitude: '', longitude: '', logo: '' })
  const [contactLogoFile, setContactLogoFile] = useState(null)
  const [contactMsg, setContactMsg] = useState('')
  const [contactErr, setContactErr] = useState('')

  // About state
  const [aboutContent, setAboutContent] = useState('')
  const [aboutMsg, setAboutMsg] = useState('')
  const [aboutErr, setAboutErr] = useState('')

  // Stats state
  const [stats, setStats] = useState(JSON.parse(JSON.stringify(DEFAULT_STATS)))
  const [statsMsg, setStatsMsg] = useState('')
  const [statsErr, setStatsErr] = useState('')

  // Change password state
  const [showPwdForm, setShowPwdForm] = useState(false)
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' })
  const [pwdMsg, setPwdMsg] = useState('')

  // Theme state
  const [themeColors, setThemeColors] = useState({ ...DEFAULT_THEME })
  const [themeMsg, setThemeMsg] = useState('')
  const [themeErr, setThemeErr] = useState('')

  // Hero slides state
  const [heroSlides, setHeroSlides] = useState([])
  const [heroInterval, setHeroInterval] = useState(5000)
  const [heroMsg, setHeroMsg] = useState('')
  const [heroUploading, setHeroUploading] = useState(false)
  const [dragIndex, setDragIndex] = useState(null)

  const [loading, setLoading] = useState(true)

  const loadArticles = useCallback(async () => {
    try {
      const data = await getArticles()
      setArticles(Array.isArray(data) ? data : [])
    } catch { setArticles([]) }
  }, [])

  const loadExtras = useCallback(async () => {
    try {
      const data = await getExtras()
      setExtras(Array.isArray(data) ? data : [])
    } catch { setExtras([]) }
  }, [])

  const loadContact = useCallback(async () => {
    try {
      const data = await getContact()
      if (data) setContact({ phone: data.phone || '', email: data.email || '', address: data.address || '', facebook: data.facebook || '', tiktok: data.tiktok || '', instagram: data.instagram || '', latitude: data.latitude ?? '', longitude: data.longitude ?? '', logo: data.logo || '' })
    } catch {}
  }, [])

  const loadAbout = useCallback(async () => {
    try {
      const data = await getAbout()
      if (data) setAboutContent(data.content || '')
    } catch {}
  }, [])

  const loadStats = useCallback(async () => {
    try {
      const data = await getStats()
      if (Array.isArray(data) && data.length > 0) setStats(data)
    } catch {}
  }, [])

  const loadTheme = useCallback(async () => {
    try {
      const data = await getTheme()
      if (data && typeof data === 'object') setThemeColors(prev => ({ ...prev, ...data }))
    } catch {}
  }, [])

  const loadHeroSlides = useCallback(async () => {
    try {
      const data = await getHeroSlides()
      if (data?.slides) setHeroSlides(data.slides)
      if (data?.interval) setHeroInterval(data.interval)
    } catch {}
  }, [])

  useEffect(() => {
    if (!authenticated) { setLoading(false); return }
    Promise.all([loadArticles(), loadExtras(), loadContact(), loadAbout(), loadStats(), loadTheme(), loadHeroSlides()]).finally(() => setLoading(false))
  }, [authenticated])

  // ---- Articles ----
  function openNew() {
    setForm({ titre: '', descs: [''], prix: '' })
    setFile(null)
    setEdit('new')
  }
  function openEdit(a) {
    const descs = Array.isArray(a.description) && a.description.length ? [...a.description] : ['']
    setForm({ titre: a.titre || '', descs, prix: a.prix || '' })
    setFile(null)
    setEdit(a)
  }
  function addDesc() { setForm(f => ({ ...f, descs: [...f.descs, ''] })) }
  function removeDesc(i) { setForm(f => ({ ...f, descs: f.descs.filter((_, idx) => idx !== i) })) }
  function setDesc(i, val) { setForm(f => { const d = [...f.descs]; d[i] = val; return { ...f, descs: d } }) }

  async function handleSaveArticle(e) {
    e.preventDefault()
    setArtMsg('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    const fd = new FormData()
    fd.append('titre', form.titre)
    fd.append('desc', JSON.stringify(form.descs.filter(d => d.trim())))
    fd.append('prix', form.prix)
    if (file) fd.append('img', file)
    try {
      if (edit === 'new') await createArticle(fd, token)
      else await updateArticle(edit.id_article, fd, token)
      setEdit(null)
      setArtMsg('Article enregistré ✓')
      setTimeout(() => setArtMsg(''), 3000)
      loadArticles()
    } catch (err) { setArtMsg(err.message || 'Erreur lors de l\'enregistrement') }
  }

  async function handleDeleteArticle(id) {
    if (!confirm('Supprimer cet article ?')) return
    setArtMsg('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try { await deleteArticle(id, token); setArtMsg('Article supprimé ✓'); setTimeout(() => setArtMsg(''), 3000); loadArticles() }
    catch (err) { setArtMsg(err.message || 'Erreur lors de la suppression') }
  }

  // ---- Extras ----
  function openExtraNew() {
    setExtraForm({ titre: '', descs: [''], prix: '', icone: '' })
    setExtraIconFile(null)
    setExtraEdit('new')
  }
  function openExtraEdit(e) {
    const descs = Array.isArray(e.description) && e.description.length ? [...e.description] : ['']
    setExtraForm({ titre: e.titre || '', descs, prix: e.prix || '', icone: e.icone || '' })
    setExtraIconFile(null)
    setExtraEdit(e)
  }
  function addExtraDesc() { setExtraForm(f => ({ ...f, descs: [...f.descs, ''] })) }
  function removeExtraDesc(i) { setExtraForm(f => ({ ...f, descs: f.descs.filter((_, idx) => idx !== i) })) }
  function setExtraDesc(i, val) { setExtraForm(f => { const d = [...f.descs]; d[i] = val; return { ...f, descs: d } }) }

  async function handleSaveExtra(e) {
    e.preventDefault()
    setExtraMsg('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    const fd = new FormData()
    fd.append('titre', extraForm.titre)
    fd.append('desc', JSON.stringify(extraForm.descs.filter(d => d.trim())))
    fd.append('prix', extraForm.prix)
    if (extraIconFile) {
      fd.append('icone', extraIconFile)
    } else if (extraForm.icone) {
      fd.append('icone', extraForm.icone)
    }
    try {
      if (extraEdit === 'new') await createExtra(fd, token)
      else await updateExtra(extraEdit.id_extra, fd, token)
      setExtraEdit(null)
      setExtraMsg('Extra enregistré ✓')
      setTimeout(() => setExtraMsg(''), 3000)
      loadExtras()
    } catch (err) { setExtraMsg(err.message || 'Erreur lors de l\'enregistrement') }
  }

  async function handleDeleteExtra(id) {
    if (!confirm('Supprimer cet extra ?')) return
    setExtraMsg('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try { await deleteExtra(id, token); setExtraMsg('Extra supprimé ✓'); setTimeout(() => setExtraMsg(''), 3000); loadExtras() }
    catch (err) { setExtraMsg(err.message || 'Erreur lors de la suppression') }
  }

  // ---- Contact ----
  async function handleSaveContact(e) {
    e.preventDefault()
    setContactMsg('')
    setContactErr('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try {
      const fd = new FormData()
      fd.append('phone', contact.phone)
      fd.append('email', contact.email)
      fd.append('address', contact.address)
      fd.append('facebook', contact.facebook || '')
      fd.append('tiktok', contact.tiktok || '')
      fd.append('instagram', contact.instagram || '')
      fd.append('latitude', contact.latitude ?? '')
      fd.append('longitude', contact.longitude ?? '')
      if (contactLogoFile) fd.append('logo', contactLogoFile)
      await updateContact(fd, token)
      setContactMsg('Contact mis à jour ✓')
      setTimeout(() => setContactMsg(''), 3000)
    } catch (err) { setContactErr(err.message || 'Erreur lors de l\'enregistrement') }
  }

  // ---- About ----
  async function handleSaveAbout() {
    setAboutMsg('')
    setAboutErr('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try {
      await updateAbout(aboutContent, token)
      setAboutMsg('Contenu mis à jour ✓')
      setTimeout(() => setAboutMsg(''), 3000)
    } catch (err) { setAboutErr(err.message || 'Erreur lors de l\'enregistrement') }
  }

  // ---- Stats ----
  async function handleSaveStats() {
    setStatsMsg('')
    setStatsErr('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try {
      await updateStats(stats, token)
      setStatsMsg('Statistiques mises à jour ✓')
      setTimeout(() => setStatsMsg(''), 3000)
    } catch (err) { setStatsErr(err.message || 'Erreur lors de l\'enregistrement') }
  }

  async function handleSaveTheme() {
    setThemeMsg('')
    setThemeErr('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try {
      await updateTheme(themeColors, token)
      setThemeMsg('Thème enregistré ✓')
      setTimeout(() => setThemeMsg(''), 3000)
    } catch (err) { setThemeErr(err.message || 'Erreur') }
  }

  function handleThemeChange(varName, value) {
    const updated = { ...themeColors, [varName]: value }
    setThemeColors(updated)
    document.documentElement.style.setProperty(varName, value)
  }

  function handleResetTheme() {
    const root = document.documentElement
    Object.entries(DEFAULT_THEME).forEach(([key, val]) => root.style.setProperty(key, val))
    setThemeColors({ ...DEFAULT_THEME })
  }

  // ---- Hero Slides ----
  async function handleUploadHeroSlide(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setHeroMsg('')
    setHeroUploading(true)
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try {
      const data = await uploadHeroSlide(file, token)
      const maxId = heroSlides.reduce((max, s) => Math.max(max, s.id), 0)
      const newSlide = { id: maxId + 1, image: data.image, ordre: heroSlides.length + 1 }
      const updated = [...heroSlides, newSlide]
      setHeroSlides(updated)
      await updateHeroSlides({ slides: updated, interval: heroInterval }, token)
      setHeroMsg('Image ajoutée ✓')
      setTimeout(() => setHeroMsg(''), 3000)
    } catch (err) { setHeroMsg(err.message || 'Erreur upload') }
    finally { setHeroUploading(false); e.target.value = '' }
  }

  async function handleDeleteHeroSlide(id) {
    if (!confirm('Supprimer cette image ?')) return
    setHeroMsg('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try {
      await deleteHeroSlide(id, token)
      const updated = heroSlides.filter(s => s.id !== id).map((s, i) => ({ ...s, ordre: i + 1 }))
      setHeroSlides(updated)
      await updateHeroSlides({ slides: updated, interval: heroInterval }, token)
      setHeroMsg('Image supprimée ✓')
      setTimeout(() => setHeroMsg(''), 3000)
    } catch (err) { setHeroMsg(err.message || 'Erreur') }
  }

  async function handleHeroDragStart(e, index) {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  async function handleHeroDragOver(e, index) {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const updated = [...heroSlides]
    const dragged = updated[dragIndex]
    updated.splice(dragIndex, 1)
    updated.splice(index, 0, dragged)
    updated.forEach((s, i) => s.ordre = i + 1)
    setHeroSlides(updated)
    setDragIndex(index)
  }

  async function handleHeroDragEnd() {
    setDragIndex(null)
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try {
      await updateHeroSlides({ slides: heroSlides, interval: heroInterval }, token)
      setHeroMsg('Ordre mis à jour ✓')
      setTimeout(() => setHeroMsg(''), 3000)
    } catch (err) { setHeroMsg(err.message || 'Erreur') }
  }

  async function handleSaveHeroInterval() {
    setHeroMsg('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try {
      await updateHeroSlides({ slides: heroSlides, interval: heroInterval }, token)
      setHeroMsg('Intervalle enregistré ✓')
      setTimeout(() => setHeroMsg(''), 3000)
    } catch (err) { setHeroMsg(err.message || 'Erreur') }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    if (pwdForm.newPwd !== pwdForm.confirm) {
      setPwdMsg('Les mots de passe ne correspondent pas')
      return
    }
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try {
      await changePassword(pwdForm.current, pwdForm.newPwd, token)
      setPwdMsg('Mot de passe modifié ✓')
      setPwdForm({ current: '', newPwd: '', confirm: '' })
      setTimeout(() => setPwdMsg(''), 3000)
    } catch (err) {
      setPwdMsg(err.message || 'Erreur')
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpiry')
    setAuthenticated(false)
    setEdit(null)
  }

  if (!authenticated) return <LoginForm onLogin={() => setAuthenticated(true)} />
  if (loading) return <div className="dashboard"><p>Chargement...</p></div>

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Dashboard</h1>
        <div className="dashboard__header-actions">
          {tab === 'Articles' && <button className="btn btn--primary" onClick={openNew}>+ Ajouter</button>}
          <Link to="/" className="btn btn--outline">Espace client</Link>
          <button className="btn btn--outline" onClick={() => setShowPwdForm(!showPwdForm)}>
            {showPwdForm ? 'Fermer' : 'Mot de passe'}
          </button>
          <button className="btn btn--outline" onClick={logout}>Déconnexion</button>
        </div>
      </div>

      {showPwdForm && (
        <div className="dashboard__card" style={{ marginBottom: '1rem' }}>
          <h3>Changer le mot de passe</h3>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'end' }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Actuel</label>
              <input className="form__input" type="password" placeholder="Mot de passe actuel"
                value={pwdForm.current} onChange={e => setPwdForm({ ...pwdForm, current: e.target.value })} required />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Nouveau</label>
              <input className="form__input" type="password" placeholder="Nouveau mot de passe"
                value={pwdForm.newPwd} onChange={e => setPwdForm({ ...pwdForm, newPwd: e.target.value })} required />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Confirmation</label>
              <input className="form__input" type="password" placeholder="Confirmer"
                value={pwdForm.confirm} onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn--primary" style={{ marginBottom: 0 }}>Enregistrer</button>
          </form>
          {pwdMsg && <p className="dashboard__msg" style={{ marginTop: '0.5rem' }}>{pwdMsg}</p>}
        </div>
      )}
      <div className="dashboard__tabs">
        {TABS.map(t => (
          <button key={t} className={`dashboard__tab${tab === t ? ' is-active' : ''}`}
            onClick={() => { setTab(t); setEdit(null) }}>{t}</button>
        ))}
      </div>

      {/* ---- TAB: Articles ---- */}
      {tab === 'Articles' && (
        <>
          <div className="dashboard__table-wrap">
            <table className="dashboard__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Prix</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Aucun article</td></tr>
                )}
                {articles.map(a => (
                  <tr key={a.id_article}>
                    <td>{a.id_article}</td>
                    <td>{a.img ? <img src={`/uploads/${a.img}`} alt="" className="dashboard__thumb" /> : <span className="dashboard__no-img">—</span>}</td>
                    <td>{a.titre}</td>
                    <td className="dashboard__desc-cell">{Array.isArray(a.description) ? a.description.join(' · ') : a.description}</td>
                    <td>{a.prix || '—'}</td>
                    <td>
                      <div className="dashboard__actions">
                        <button className="dashboard__btn dashboard__btn--edit" onClick={() => openEdit(a)}>Modifier</button>
                        <button className="dashboard__btn dashboard__btn--del" onClick={() => handleDeleteArticle(a.id_article)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {artMsg && <p className="dashboard__msg" style={{ color: artMsg.includes('✓') ? '#2e7d32' : '#d32f2f' }}>{artMsg}</p>}

          {edit && (
            <div className="dashboard__modal">
              <div className="dashboard__form-card">
                <h2>{edit === 'new' ? "Nouvel article" : "Modifier l'article"}</h2>
                <form onSubmit={handleSaveArticle}>
                  <input className="form__input" placeholder="Titre" value={form.titre}
                    onChange={e => setForm({ ...form, titre: e.target.value })} required />
                  <div className="dashboard__descs">
                    <label>Descriptions</label>
                    {form.descs.map((d, i) => (
                      <div key={i} className="dashboard__desc-row">
                        <input className="form__input" placeholder={`Élément ${i + 1}`} value={d}
                          onChange={e => setDesc(i, e.target.value)} />
                        <button type="button" className="dashboard__btn dashboard__btn--del"
                          onClick={() => removeDesc(i)} disabled={form.descs.length <= 1}>×</button>
                      </div>
                    ))}
                    <button type="button" className="dashboard__btn-add" onClick={addDesc}>+ Ajouter un élément</button>
                  </div>
                  <input className="form__input" placeholder="Prix (optionnel)" value={form.prix}
                    onChange={e => setForm({ ...form, prix: e.target.value })} />
                  <input className="form__input" type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
                  {edit !== 'new' && <small style={{ opacity: 0.6 }}>Laissez vide pour garder l'image actuelle</small>}
                  <div className="dashboard__form-actions">
                    <button type="submit" className="btn btn--primary">Enregistrer</button>
                    <button type="button" className="btn btn--outline" onClick={() => setEdit(null)}>Annuler</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ---- TAB: Extras ---- */}
      {tab === 'Extras' && (
        <>
          <div className="dashboard__header-actions" style={{ marginBottom: '1rem' }}>
            <button className="btn btn--primary" onClick={openExtraNew}>+ Ajouter</button>
          </div>
          <div className="dashboard__table-wrap">
            <table className="dashboard__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Icône</th>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Prix</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {extras.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Aucun extra</td></tr>
                )}
                {extras.map(e => (
                  <tr key={e.id_extra}>
                    <td>{e.id_extra}</td>
                    <td style={{ fontSize: '1.5rem' }}>
                      {e.icone && /\.(jpe?g|png|gif|webp|svg|bmp|tiff?|heic|heif|avif)$/i.test(e.icone)
                        ? <img src={`/uploads/${e.icone}`} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                        : e.icone || '—'}
                    </td>
                    <td>{e.titre}</td>
                    <td className="dashboard__desc-cell">{Array.isArray(e.description) ? e.description.join(' · ') : e.description}</td>
                    <td>{e.prix || '—'}</td>
                    <td>
                      <div className="dashboard__actions">
                        <button className="dashboard__btn dashboard__btn--edit" onClick={() => openExtraEdit(e)}>Modifier</button>
                        <button className="dashboard__btn dashboard__btn--del" onClick={() => handleDeleteExtra(e.id_extra)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {extraMsg && <p className="dashboard__msg" style={{ color: extraMsg.includes('✓') ? '#2e7d32' : '#d32f2f' }}>{extraMsg}</p>}

          {extraEdit && (
            <div className="dashboard__modal">
              <div className="dashboard__form-card">
                <h2>{extraEdit === 'new' ? "Nouvel extra" : "Modifier l'extra"}</h2>
                <form onSubmit={handleSaveExtra}>
                  <label>Icône (fichier image)</label>
                  <input className="form__input" type="file" accept="image/*"
                    onChange={e => setExtraIconFile(e.target.files[0])} />
                  {extraIconFile && <small style={{ opacity: 0.8, display: 'block', marginBottom: '0.5rem' }}>{extraIconFile.name}</small>}
                  {extraEdit !== 'new' && extraEdit?.icone && /\.(jpe?g|png|gif|webp|svg|bmp|tiff?|heic|heif|avif)$/i.test(extraEdit.icone) && !extraIconFile && (
                    <small style={{ opacity: 0.8, display: 'block', marginBottom: '0.5rem' }}>Actuel : {extraEdit.icone}</small>
                  )}
                  <small style={{ opacity: 0.6, display: 'block', marginBottom: '0.5rem' }}>
                    Ou saisir un emoji/texte :
                  </small>
                  <input className="form__input" placeholder="Ex: 🚀" value={extraForm.icone}
                    onChange={e => { setExtraForm({ ...extraForm, icone: e.target.value }); setExtraIconFile(null) }} />
                  <label>Titre</label>
                  <input className="form__input" placeholder="Titre" value={extraForm.titre}
                    onChange={e => setExtraForm({ ...extraForm, titre: e.target.value })} required />
                  <div className="dashboard__descs">
                    <label>Descriptions</label>
                    {extraForm.descs.map((d, i) => (
                      <div key={i} className="dashboard__desc-row">
                        <input className="form__input" placeholder={`Élément ${i + 1}`} value={d}
                          onChange={e => setExtraDesc(i, e.target.value)} />
                        <button type="button" className="dashboard__btn dashboard__btn--del"
                          onClick={() => removeExtraDesc(i)} disabled={extraForm.descs.length <= 1}>×</button>
                      </div>
                    ))}
                    <button type="button" className="dashboard__btn-add" onClick={addExtraDesc}>+ Ajouter un élément</button>
                  </div>
                  <label>Prix (optionnel)</label>
                  <input className="form__input" placeholder="Prix" value={extraForm.prix}
                    onChange={e => setExtraForm({ ...extraForm, prix: e.target.value })} />
                  <div className="dashboard__form-actions">
                    <button type="submit" className="btn btn--primary">Enregistrer</button>
                    <button type="button" className="btn btn--outline" onClick={() => setExtraEdit(null)}>Annuler</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ---- TAB: Contact ---- */}
      {tab === 'Contact' && (
        <div className="dashboard__card">
          <h2>Coordonnées</h2>
          <form onSubmit={handleSaveContact} className="dashboard__contact-form">
            <label>Logo du site</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <img src={contact.logo || '/uploads/logonav.png'} alt="Logo" style={{ height: 48, borderRadius: 6, border: '1px solid #ddd' }} />
              <label style={{ cursor: 'pointer', color: '#1976d2', fontSize: '0.875rem', fontWeight: 500 }}>
                Changer le logo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) { setContactLogoFile(file); setContact({ ...contact, logo: URL.createObjectURL(file) }) }
                }} />
              </label>
            </div>
            <label>Téléphone</label>
            <input className="form__input" value={contact.phone}
              onChange={e => setContact({ ...contact, phone: e.target.value })} required />
            <label>Email</label>
            <input className="form__input" type="email" value={contact.email}
              onChange={e => setContact({ ...contact, email: e.target.value })} required />
            <label>Adresse</label>
            <input className="form__input" value={contact.address}
              onChange={e => setContact({ ...contact, address: e.target.value })} required />
            <div className="dashboard__coords">
              <div>
                <label>Latitude</label>
                <input className="form__input" type="number" step="any" placeholder="Ex: 36.8065"
                  value={contact.latitude} onChange={e => setContact({ ...contact, latitude: e.target.value })} />
              </div>
              <div>
                <label>Longitude</label>
                <input className="form__input" type="number" step="any" placeholder="Ex: 10.1815"
                  value={contact.longitude} onChange={e => setContact({ ...contact, longitude: e.target.value })} />
              </div>
            </div>
            <small style={{ opacity: 0.6, marginTop: '-0.5rem', display: 'block' }}>
              Coordonnées de la carte affichée sous le formulaire (veuillez le laisser vide pour masquer la carte)
            </small>
            <label>Facebook (URL)</label>
            <input className="form__input" value={contact.facebook || ''}
              onChange={e => setContact({ ...contact, facebook: e.target.value })} />
            <label>TikTok (URL)</label>
            <input className="form__input" value={contact.tiktok || ''}
              onChange={e => setContact({ ...contact, tiktok: e.target.value })} />
            <label>Instagram (URL)</label>
            <input className="form__input" value={contact.instagram || ''}
              onChange={e => setContact({ ...contact, instagram: e.target.value })} />
            <div className="dashboard__form-actions">
              <button type="submit" className="btn btn--primary">Enregistrer</button>
            </div>
            {contactMsg && <p className="dashboard__msg" style={{ color: '#2e7d32' }}>{contactMsg}</p>}
            {contactErr && <p className="dashboard__msg" style={{ color: '#d32f2f' }}>{contactErr}</p>}
          </form>
        </div>
      )}

      {/* ---- TAB: À propos ---- */}
      {tab === 'À propos' && (
        <div className="dashboard__card dashboard__card--wide">
          <h2>Contenu À propos</h2>
          <ReactQuill theme="snow" value={aboutContent} onChange={setAboutContent}
            modules={{ toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'clean'],
            ]}}
          />
          <div className="dashboard__form-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn--primary" onClick={handleSaveAbout}>Enregistrer</button>
          </div>
          {aboutMsg && <p className="dashboard__msg" style={{ color: '#2e7d32' }}>{aboutMsg}</p>}
          {aboutErr && <p className="dashboard__msg" style={{ color: '#d32f2f' }}>{aboutErr}</p>}
        </div>
      )}

      {/* ---- TAB: Statistiques ---- */}
      {tab === 'Statistiques' && (
        <div className="dashboard__card">
          <h2>Statistiques</h2>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Modifiez les chiffres affichés dans la section À propos
          </p>
          <div className="dashboard__stats-form">
            {stats.map((s, i) => (
              <div key={s.id} className="dashboard__stats-row">
                <input className="form__input dashboard__stats-number" placeholder="Ex: 50+"
                  value={s.number} onChange={e => {
                    const copy = [...stats]
                    copy[i] = { ...copy[i], number: e.target.value }
                    setStats(copy)
                  }} />
                <input className="form__input" placeholder="Ex: Entreprises accompagnées"
                  value={s.label} onChange={e => {
                    const copy = [...stats]
                    copy[i] = { ...copy[i], label: e.target.value }
                    setStats(copy)
                  }} />
              </div>
            ))}
          </div>
          <div className="dashboard__form-actions">
            <button className="btn btn--primary" onClick={handleSaveStats}>Enregistrer</button>
          </div>
          {statsMsg && <p className="dashboard__msg" style={{ color: '#2e7d32' }}>{statsMsg}</p>}
          {statsErr && <p className="dashboard__msg" style={{ color: '#d32f2f' }}>{statsErr}</p>}
        </div>
      )}

      {/* ---- TAB: Hero ---- */}
      {tab === 'Hero' && (
        <div className="dashboard__card">
          <h2>Images du Hero (Carousel)</h2>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Ajoutez des images qui s'affichent en arrière-plan du Hero. Si aucune image n'est ajoutée, le fond par défaut (dégradé) est affiché.
          </p>

          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <label className="btn btn--primary" style={{ cursor: 'pointer' }}>
              {heroUploading ? 'Envoi...' : '+ Ajouter une image'}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml" onChange={handleUploadHeroSlide}
                style={{ display: 'none' }} disabled={heroUploading} />
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#666' }}>Intervalle :</label>
              <input type="number" min="1000" step="500" value={heroInterval} onChange={e => setHeroInterval(Number(e.target.value))}
                className="form__input" style={{ width: '100px' }} />
              <span style={{ fontSize: '0.8rem', color: '#999' }}>ms</span>
              <button className="btn btn--outline" onClick={handleSaveHeroInterval} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>OK</button>
            </div>
          </div>

          {heroSlides.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '3rem', border: '2px dashed #ddd', borderRadius: '8px' }}>
              Aucune image. Le Hero affiche le fond par défaut.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[...heroSlides].sort((a, b) => (a.ordre || 0) - (b.ordre || 0)).map((slide, i) => (
                <div key={slide.id}
                  draggable
                  onDragStart={e => handleHeroDragStart(e, i)}
                  onDragOver={e => handleHeroDragOver(e, i)}
                  onDragEnd={handleHeroDragEnd}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.75rem', borderRadius: '8px',
                    border: dragIndex === i ? '2px solid var(--color-primary)' : '1px solid #e0e0e0',
                    background: dragIndex === i ? 'var(--color-bg, #f0f7ff)' : '#fff',
                    cursor: 'grab', opacity: dragIndex !== null && dragIndex !== i ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}>
                  <span style={{ cursor: 'grab', color: '#999', fontSize: '1.2rem', userSelect: 'none' }} title="Glisser pour réordonner">⠿</span>
                  <span style={{ fontSize: '0.75rem', color: '#999', minWidth: '20px' }}>#{slide.ordre}</span>
                  <img src={slide.image} alt="" style={{ width: '120px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }} />
                  <span style={{ flex: 1, fontSize: '0.8rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slide.image}</span>
                  <button onClick={() => handleDeleteHeroSlide(slide.id)}
                    style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}

          {heroMsg && <p className="dashboard__msg" style={{ marginTop: '1rem', color: heroMsg.includes('✓') ? '#2e7d32' : '#d32f2f' }}>{heroMsg}</p>}
        </div>
      )}

      {/* ---- TAB: Theme ---- */}
      {tab === 'Theme' && (
        <div className="dashboard__card">
          <h2>Personnalisation du thème</h2>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Modifiez les couleurs du site. Les changements sont visibles en temps réel.
          </p>
          <div className="dashboard__theme-grid">
            {Object.entries(COLOR_LABELS).map(([varName, label]) => (
              <div key={varName} className="dashboard__theme-item">
                <label>{label}</label>
                <div className="dashboard__theme-input-row">
                  <span className="dashboard__theme-original" style={{ background: DEFAULT_THEME[varName] }}
                    title={`Original : ${DEFAULT_THEME[varName]}`} />
                  <input type="color" value={themeColors[varName] || DEFAULT_THEME[varName]}
                    onChange={e => handleThemeChange(varName, e.target.value)} />
                  <input className="form__input dashboard__theme-hex" type="text"
                    value={themeColors[varName] || ''}
                    onChange={e => handleThemeChange(varName, e.target.value)} />
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard__form-actions">
            <button className="btn btn--primary" onClick={handleSaveTheme}>Enregistrer le thème</button>
            <button className="btn btn--outline" onClick={handleResetTheme}>Réinitialiser</button>
          </div>
          {themeMsg && <p className="dashboard__msg" style={{ color: '#2e7d32' }}>{themeMsg}</p>}
          {themeErr && <p className="dashboard__msg" style={{ color: '#d32f2f' }}>{themeErr}</p>}
        </div>
      )}
    </div>
  )
}
