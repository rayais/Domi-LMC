import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import lmcLogo from '../assets/lmc.png'
import {
  login,
  getFormations as getLmcFormations, createFormation as createLmcFormation,
  updateFormation as updateLmcFormation, deleteFormation as deleteLmcFormation,
  getAbout as getLmcAbout, updateAbout as updateLmcAbout,
  getMessages as getLmcMessages, deleteMessage as deleteLmcMessage,
  markMessageRead as markLmcMessageRead,
  getSite as getLmcSite, updateSite as updateLmcSite,
  changePassword as lmcChangePassword,
  getHeroSlides, updateHeroSlides, uploadHeroSlide, deleteHeroSlide,
} from '../services/api'

function getToken() {
  const token = localStorage.getItem('lmc-token')
  const expiry = localStorage.getItem('lmc-tokenExpiry')
  if (!token || !expiry || Date.now() > Number(expiry)) {
    localStorage.removeItem('lmc-token')
    localStorage.removeItem('lmc-tokenExpiry')
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
      localStorage.setItem('lmc-token', data.token)
      localStorage.setItem('lmc-tokenExpiry', Date.now() + data.expiresIn * 1000)
      onLogin()
    } catch (err) {
      setError(err.message || 'Mot de passe incorrect')
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-[#1A1A1A] px-4">
      <div className="bg-white dark:bg-[#2A2A2A] rounded-xl shadow-lg p-8 w-full max-w-md border border-border dark:border-gray-600">
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src={lmcLogo} alt="LMC Formation" className="h-12 w-auto" />
        </div>
        <h1 className="text-xl font-bold text-secondary dark:text-white text-center mb-2">Dashboard LMC</h1>
        <p className="text-sm text-text-light dark:text-gray-400 text-center mb-6">Entrez le mot de passe pour accéder</p>
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="Mot de passe" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg text-base bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white focus:outline-none focus:border-primary mb-4"
            autoFocus />
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}

const TABS = ['Formations', 'Messages', 'Site', 'Hero', 'À propos']

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(!!getToken())
  const [tab, setTab] = useState('Formations')
  const [loading, setLoading] = useState(true)

  const [lmcFormations, setLmcFormations] = useState({ intra: [], extra: [] })
  const [lmcEdit, setLmcEdit] = useState(null)
  const [lmcForm, setLmcForm] = useState({ type: 'extra', nom: '', slug: '', module: '', description: '', descriptionLongue: '', duree: '', publicCible: '', objectifs: '', ordre: '1', afficherAccueil: false })
  const [lmcLogo, setLmcLogo] = useState(null)
  const [lmcVitrine, setLmcVitrine] = useState(null)
  const [lmcGalerie, setLmcGalerie] = useState(null)
  const [lmcMsg, setLmcMsg] = useState('')

  const [lmcMessages, setLmcMessages] = useState([])
  const [lmcMsgMsg, setLmcMsgMsg] = useState('')

  const [lmcAbout, setLmcAbout] = useState({ titre: '', description: '', mission: '', vision: '', valeurs: [] })
  const [lmcAboutMsg, setLmcAboutMsg] = useState('')

  const [lmcSite, setLmcSite] = useState({ nom: '', slogan: '', description: '', contact: { adresse: '', telephone: '', email: '', horaires: '' }, reseauxSociaux: { facebook: '', linkedin: '', instagram: '' }, stats: [], temoignages: [] })
  const [lmcSiteMsg, setLmcSiteMsg] = useState('')

  const [showPwdForm, setShowPwdForm] = useState(false)
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' })
  const [pwdMsg, setPwdMsg] = useState('')

  const [heroSlides, setHeroSlides] = useState([])
  const [heroInterval, setHeroInterval] = useState(5000)
  const [heroMsg, setHeroMsg] = useState('')
  const [heroUploading, setHeroUploading] = useState(false)
  const [dragIndex, setDragIndex] = useState(null)

  const loadFormations = useCallback(async () => {
    try {
      const data = await getLmcFormations()
      if (data && typeof data === 'object') setLmcFormations(data)
    } catch { setLmcFormations({ intra: [], extra: [] }) }
  }, [])

  const loadMessages = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const data = await getLmcMessages(token)
      if (Array.isArray(data)) setLmcMessages(data)
    } catch { setLmcMessages([]) }
  }, [])

  const loadAbout = useCallback(async () => {
    try {
      const data = await getLmcAbout()
      if (data) setLmcAbout({ titre: data.titre || '', description: data.description || '', mission: data.mission || '', vision: data.vision || '', valeurs: Array.isArray(data.valeurs) ? data.valeurs : [] })
    } catch {}
  }, [])

  const loadSite = useCallback(async () => {
    try {
      const data = await getLmcSite()
      if (data) setLmcSite({
        nom: data.nom || '',
        slogan: data.slogan || '',
        description: data.description || '',
        contact: { adresse: data.contact?.adresse || '', telephone: data.contact?.telephone || '', email: data.contact?.email || '', horaires: data.contact?.horaires || '' },
        reseauxSociaux: { facebook: data.reseauxSociaux?.facebook || '', linkedin: data.reseauxSociaux?.linkedin || '', instagram: data.reseauxSociaux?.instagram || '' },
        stats: Array.isArray(data.stats) ? data.stats : [],
        temoignages: Array.isArray(data.temoignages) ? data.temoignages : [],
      })
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
    Promise.all([loadFormations(), loadMessages(), loadAbout(), loadSite(), loadHeroSlides()]).finally(() => setLoading(false))
  }, [authenticated])

  function openNew() {
    setLmcForm({ type: 'extra', nom: '', slug: '', module: '', description: '', descriptionLongue: '', duree: '', publicCible: '', objectifs: '', ordre: '1', afficherAccueil: false })
    setLmcLogo(null); setLmcVitrine(null); setLmcGalerie(null)
    setLmcEdit('new')
  }

  function openEdit(f) {
    const isExtra = (lmcFormations.extra || []).some(x => x.id === f.id)
    setLmcForm({
      type: isExtra ? 'extra' : 'intra',
      nom: f.nom || '', slug: f.slug || '', module: f.module || '',
      description: f.description || '', descriptionLongue: f.descriptionLongue || '',
      duree: f.duree || '', publicCible: f.publicCible || '',
      objectifs: Array.isArray(f.objectifs) ? f.objectifs.join('\n') : (f.objectifs || ''),
      ordre: String(f.ordre || '1'), afficherAccueil: !!f.afficherAccueil
    })
    setLmcLogo(null); setLmcVitrine(null); setLmcGalerie(null)
    setLmcEdit(f)
  }

  async function handleSave(e) {
    e.preventDefault()
    setLmcMsg('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    const fd = new FormData()
    fd.append('type', lmcForm.type)
    fd.append('nom', lmcForm.nom)
    fd.append('slug', lmcForm.slug)
    fd.append('module', lmcForm.module)
    fd.append('description', lmcForm.description)
    fd.append('descriptionLongue', lmcForm.descriptionLongue)
    fd.append('duree', lmcForm.duree)
    fd.append('publicCible', lmcForm.publicCible)
    fd.append('objectifs', JSON.stringify(lmcForm.objectifs.split('\n').filter(o => o.trim())))
    fd.append('ordre', lmcForm.ordre)
    fd.append('afficherAccueil', lmcForm.afficherAccueil)
    if (lmcLogo) fd.append('logo', lmcLogo)
    if (lmcVitrine) fd.append('imageVitrine', lmcVitrine)
    if (lmcGalerie) { for (const f of lmcGalerie) fd.append('galerie', f) }
    try {
      if (lmcEdit === 'new') await createLmcFormation(fd, token)
      else await updateLmcFormation(lmcEdit.id, fd, token)
      setLmcEdit(null)
      setLmcMsg('Formation enregistrée ✓')
      setTimeout(() => setLmcMsg(''), 3000)
      loadFormations()
    } catch (err) { setLmcMsg(err.message || 'Erreur') }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette formation ?')) return
    setLmcMsg('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try { await deleteLmcFormation(id, token); setLmcMsg('Supprimée ✓'); setTimeout(() => setLmcMsg(''), 3000); loadFormations() }
    catch (err) { setLmcMsg(err.message || 'Erreur') }
  }

  async function handleDeleteMessage(id) {
    if (!confirm('Supprimer ce message ?')) return
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try { await deleteLmcMessage(id, token); setLmcMsgMsg('Supprimé ✓'); setTimeout(() => setLmcMsgMsg(''), 3000); loadMessages() }
    catch (err) { setLmcMsgMsg(err.message || 'Erreur') }
  }

  async function handleMarkRead(id) {
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try { await markLmcMessageRead(id, token); loadMessages() } catch {}
  }

  async function handleSaveAbout() {
    setLmcAboutMsg('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try {
      await updateLmcAbout(lmcAbout, token)
      setLmcAboutMsg('Mis à jour ✓')
      setTimeout(() => setLmcAboutMsg(''), 3000)
    } catch (err) { setLmcAboutMsg(err.message || 'Erreur') }
  }

  async function handleSaveSite() {
    setLmcSiteMsg('')
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try {
      await updateLmcSite(lmcSite, token)
      setLmcSiteMsg('Mis à jour ✓')
      setTimeout(() => setLmcSiteMsg(''), 3000)
    } catch (err) { setLmcSiteMsg(err.message || 'Erreur') }
  }

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

  function logout() {
    localStorage.removeItem('lmc-token')
    localStorage.removeItem('lmc-tokenExpiry')
    setAuthenticated(false)
    setLmcEdit(null)
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPwdMsg('')
    if (pwdForm.newPwd !== pwdForm.confirm) { setPwdMsg('Les mots de passe ne correspondent pas'); return }
    const token = getToken()
    if (!token) { setAuthenticated(false); return }
    try {
      await lmcChangePassword(pwdForm.current, pwdForm.newPwd, token)
      setPwdMsg('Mot de passe changé ✓')
      setPwdForm({ current: '', newPwd: '', confirm: '' })
      setTimeout(() => setPwdMsg(''), 3000)
    } catch (err) { setPwdMsg(err.message || 'Erreur') }
  }

  if (!authenticated) return <LoginForm onLogin={() => setAuthenticated(true)} />
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-[#1A1A1A]"><p className="text-text-light dark:text-gray-400">Chargement...</p></div>

  const allFormations = [...(lmcFormations.extra || []), ...(lmcFormations.intra || [])]

  return (
    <div className="min-h-screen bg-bg dark:bg-[#1A1A1A] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary dark:text-white">Dashboard LMC</h1>
              <p className="text-xs text-text-light dark:text-gray-500">LMC Formation Conseil Étude</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="px-4 py-2 border border-border dark:border-gray-600 rounded-lg text-sm text-secondary dark:text-gray-300 hover:bg-bg-alt dark:hover:bg-gray-700 no-underline transition-colors">
              Voir le site
            </Link>
            <button onClick={() => setShowPwdForm(!showPwdForm)} className="px-4 py-2 border border-border dark:border-gray-600 rounded-lg text-sm text-secondary dark:text-gray-300 hover:bg-bg-alt dark:hover:bg-gray-700 transition-colors">
              {showPwdForm ? 'Fermer' : 'Mot de passe'}
            </button>
            <button onClick={logout} className="px-4 py-2 border border-border dark:border-gray-600 rounded-lg text-sm text-secondary dark:text-gray-300 hover:bg-bg-alt dark:hover:bg-gray-700 transition-colors">
              Déconnexion
            </button>
          </div>
        </div>

        {showPwdForm && (
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl border border-border dark:border-gray-600 p-6 mb-6">
            <h3 className="font-semibold text-secondary dark:text-white mb-4">Changer le mot de passe</h3>
            <form onSubmit={handleChangePassword} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs text-text-light dark:text-gray-500 mb-1">Mot de passe actuel</label>
                <input type="password" value={pwdForm.current} onChange={e => setPwdForm({ ...pwdForm, current: e.target.value })} required
                  className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white text-sm" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs text-text-light dark:text-gray-500 mb-1">Nouveau mot de passe</label>
                <input type="password" value={pwdForm.newPwd} onChange={e => setPwdForm({ ...pwdForm, newPwd: e.target.value })} required
                  className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white text-sm" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs text-text-light dark:text-gray-500 mb-1">Confirmer</label>
                <input type="password" value={pwdForm.confirm} onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })} required
                  className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white text-sm" />
              </div>
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shrink-0">
                Enregistrer
              </button>
            </form>
            {pwdMsg && <p className={`mt-3 text-sm font-medium ${pwdMsg.includes('✓') ? 'text-green-600' : 'text-red-500'}`}>{pwdMsg}</p>}
          </div>
        )}

        <div className="flex gap-1 mb-6 border-b border-border dark:border-gray-600">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setLmcEdit(null) }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-text-light dark:text-gray-400 hover:text-secondary dark:hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* TAB: Formations */}
        {tab === 'Formations' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary dark:text-white">Formations ({allFormations.length})</h2>
              <button onClick={openNew} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                + Nouvelle formation
              </button>
            </div>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl border border-border dark:border-gray-600 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border dark:border-gray-600 bg-bg-alt dark:bg-[#1A1A1A]">
                      <th className="text-left px-4 py-3 font-medium text-secondary dark:text-gray-300">Type</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary dark:text-gray-300">Nom</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary dark:text-gray-300">Slug</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary dark:text-gray-300">Durée</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary dark:text-gray-300">Accueil</th>
                      <th className="text-right px-4 py-3 font-medium text-secondary dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allFormations.length === 0 && (
                      <tr><td colSpan="6" className="text-center py-8 text-text-light dark:text-gray-500">Aucune formation</td></tr>
                    )}
                    {allFormations.map(f => {
                      const isExtra = (lmcFormations.extra || []).some(x => x.id === f.id)
                      return (
                        <tr key={f.id} className="border-b border-border dark:border-gray-600 last:border-0 hover:bg-bg-alt dark:hover:bg-[#1A1A1A] transition-colors">
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${isExtra ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                              {isExtra ? 'Société' : 'Individuelle'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-secondary dark:text-white">{f.nom}</td>
                          <td className="px-4 py-3 text-text-light dark:text-gray-400 text-xs">{f.slug}</td>
                          <td className="px-4 py-3 text-text-light dark:text-gray-400">{f.duree}</td>
                          <td className="px-4 py-3 text-text-light dark:text-gray-400">{f.afficherAccueil ? '✓' : '—'}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => openEdit(f)} className="text-primary hover:text-primary-dark text-sm font-medium mr-3">Modifier</button>
                            <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Supprimer</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {lmcMsg && <p className={`mt-3 text-sm font-medium ${lmcMsg.includes('✓') ? 'text-green-600' : 'text-red-500'}`}>{lmcMsg}</p>}

            {lmcEdit && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setLmcEdit(null)}>
                <div className="bg-white dark:bg-[#2A2A2A] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border dark:border-gray-600" onClick={e => e.stopPropagation()}>
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-secondary dark:text-white mb-4">
                      {lmcEdit === 'new' ? 'Nouvelle formation' : 'Modifier la formation'}
                    </h2>
                    <form onSubmit={handleSave} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Type</label>
                        <select value={lmcForm.type} onChange={e => setLmcForm({ ...lmcForm, type: e.target.value })}
                          className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white">
                          <option value="extra">Formation Société (Extra)</option>
                          <option value="intra">Formation Individuelle (Intra)</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Nom *</label>
                          <input value={lmcForm.nom} onChange={e => setLmcForm({ ...lmcForm, nom: e.target.value })} required
                            className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Slug (URL) *</label>
                          <input value={lmcForm.slug} onChange={e => setLmcForm({ ...lmcForm, slug: e.target.value })} required
                            className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Module</label>
                        <input value={lmcForm.module} onChange={e => setLmcForm({ ...lmcForm, module: e.target.value })}
                          placeholder="ex: Management de la qualité"
                          className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Description courte</label>
                        <input value={lmcForm.description} onChange={e => setLmcForm({ ...lmcForm, description: e.target.value })}
                          className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Description longue</label>
                        <textarea value={lmcForm.descriptionLongue} onChange={e => setLmcForm({ ...lmcForm, descriptionLongue: e.target.value })} rows="4"
                          className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white resize-y" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Durée</label>
                          <input value={lmcForm.duree} onChange={e => setLmcForm({ ...lmcForm, duree: e.target.value })} placeholder="ex: 3 jours"
                            className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Public cible</label>
                          <input value={lmcForm.publicCible} onChange={e => setLmcForm({ ...lmcForm, publicCible: e.target.value })} placeholder="ex: Managers"
                            className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Objectifs (un par ligne)</label>
                        <textarea value={lmcForm.objectifs} onChange={e => setLmcForm({ ...lmcForm, objectifs: e.target.value })} rows="3" placeholder={"Objectif 1\nObjectif 2"}
                          className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white resize-y" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Ordre</label>
                          <input type="number" min="1" value={lmcForm.ordre} onChange={e => setLmcForm({ ...lmcForm, ordre: e.target.value })}
                            className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                        </div>
                        <div className="pb-1">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={lmcForm.afficherAccueil} onChange={e => setLmcForm({ ...lmcForm, afficherAccueil: e.target.checked })}
                              className="w-4 h-4 rounded border-border dark:border-gray-600 text-primary focus:ring-primary" />
                            <span className="text-sm text-secondary dark:text-gray-300">Afficher sur l'accueil</span>
                          </label>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Logo</label>
                          <input type="file" accept="image/*" onChange={e => setLmcLogo(e.target.files[0])}
                            className="w-full text-sm text-text-light dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Image vitrine</label>
                          <input type="file" accept="image/*" onChange={e => setLmcVitrine(e.target.files[0])}
                            className="w-full text-sm text-text-light dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Galerie images</label>
                          <input type="file" accept="image/*" multiple onChange={e => setLmcGalerie(e.target.files)}
                            className="w-full text-sm text-text-light dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">Enregistrer</button>
                        <button type="button" onClick={() => setLmcEdit(null)} className="border border-border dark:border-gray-600 px-6 py-2 rounded-lg text-sm text-secondary dark:text-gray-300 hover:bg-bg-alt dark:hover:bg-gray-700 transition-colors">Annuler</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: Messages */}
        {tab === 'Messages' && (
          <div>
            <h2 className="text-lg font-bold text-secondary dark:text-white mb-4">Messages de contact ({lmcMessages.length})</h2>
            {lmcMessages.length === 0 ? (
              <div className="bg-white dark:bg-[#2A2A2A] rounded-xl border border-border dark:border-gray-600 p-8 text-center">
                <p className="text-text-light dark:text-gray-500">Aucun message reçu</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lmcMessages.map(m => (
                  <div key={m.id} className={`bg-white dark:bg-[#2A2A2A] rounded-xl border p-4 ${m.lu ? 'border-border dark:border-gray-600' : 'border-primary/50 bg-primary/5 dark:bg-primary/10'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-secondary dark:text-white text-sm">{m.nom}</span>
                          <span className="text-text-light dark:text-gray-500 text-xs">&lt;{m.email}&gt;</span>
                          {!m.lu && <span className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                        {m.sujet && <p className="text-sm font-medium text-secondary dark:text-gray-300 mb-1">{m.sujet}</p>}
                        <p className="text-sm text-text-light dark:text-gray-400">{m.message}</p>
                        <p className="text-xs text-text-light dark:text-gray-500 mt-2">{new Date(m.date).toLocaleDateString('fr', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {!m.lu && <button onClick={() => handleMarkRead(m.id)} className="text-primary hover:text-primary-dark text-xs font-medium">Marquer lu</button>}
                        <button onClick={() => handleDeleteMessage(m.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Supprimer</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {lmcMsgMsg && <p className="mt-3 text-sm font-medium text-green-600">{lmcMsgMsg}</p>}
          </div>
        )}

        {/* TAB: Site */}
        {tab === 'Site' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-secondary dark:text-white">Informations du site</h2>

            {/* Général */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl border border-border dark:border-gray-600 p-6">
              <h3 className="font-semibold text-secondary dark:text-white mb-4">Général</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Nom du site</label>
                  <input value={lmcSite.nom} onChange={e => setLmcSite({ ...lmcSite, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Slogan</label>
                  <input value={lmcSite.slogan} onChange={e => setLmcSite({ ...lmcSite, slogan: e.target.value })}
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Description</label>
                  <textarea value={lmcSite.description} onChange={e => setLmcSite({ ...lmcSite, description: e.target.value })} rows="3"
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white resize-y" />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl border border-border dark:border-gray-600 p-6">
              <h3 className="font-semibold text-secondary dark:text-white mb-4">Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Adresse</label>
                  <input value={lmcSite.contact.adresse} onChange={e => setLmcSite({ ...lmcSite, contact: { ...lmcSite.contact, adresse: e.target.value } })}
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Téléphone</label>
                  <input value={lmcSite.contact.telephone} onChange={e => setLmcSite({ ...lmcSite, contact: { ...lmcSite.contact, telephone: e.target.value } })}
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Email</label>
                  <input value={lmcSite.contact.email} onChange={e => setLmcSite({ ...lmcSite, contact: { ...lmcSite.contact, email: e.target.value } })}
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Horaires</label>
                  <input value={lmcSite.contact.horaires} onChange={e => setLmcSite({ ...lmcSite, contact: { ...lmcSite.contact, horaires: e.target.value } })}
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl border border-border dark:border-gray-600 p-6">
              <h3 className="font-semibold text-secondary dark:text-white mb-4">Réseaux sociaux</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Facebook</label>
                  <input value={lmcSite.reseauxSociaux.facebook} onChange={e => setLmcSite({ ...lmcSite, reseauxSociaux: { ...lmcSite.reseauxSociaux, facebook: e.target.value } })} placeholder="https://..."
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">LinkedIn</label>
                  <input value={lmcSite.reseauxSociaux.linkedin} onChange={e => setLmcSite({ ...lmcSite, reseauxSociaux: { ...lmcSite.reseauxSociaux, linkedin: e.target.value } })} placeholder="https://..."
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Instagram</label>
                  <input value={lmcSite.reseauxSociaux.instagram} onChange={e => setLmcSite({ ...lmcSite, reseauxSociaux: { ...lmcSite.reseauxSociaux, instagram: e.target.value } })} placeholder="https://..."
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl border border-border dark:border-gray-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary dark:text-white">Statistiques</h3>
                <button onClick={() => setLmcSite({ ...lmcSite, stats: [...lmcSite.stats, { nombre: '', label: '' }] })}
                  className="text-primary hover:text-primary-dark text-sm font-medium">+ Ajouter</button>
              </div>
              <div className="space-y-3">
                {lmcSite.stats.map((s, i) => (
                  <div key={i} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-xs text-text-light dark:text-gray-500 mb-1">Nombre</label>
                      <input value={s.nombre} onChange={e => { const stats = [...lmcSite.stats]; stats[i] = { ...stats[i], nombre: e.target.value }; setLmcSite({ ...lmcSite, stats }) }}
                        className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white text-sm" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-text-light dark:text-gray-500 mb-1">Label</label>
                      <input value={s.label} onChange={e => { const stats = [...lmcSite.stats]; stats[i] = { ...stats[i], label: e.target.value }; setLmcSite({ ...lmcSite, stats }) }}
                        className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white text-sm" />
                    </div>
                    <button onClick={() => setLmcSite({ ...lmcSite, stats: lmcSite.stats.filter((_, j) => j !== i) })}
                      className="text-red-500 hover:text-red-700 text-sm font-medium pb-2">Supprimer</button>
                  </div>
                ))}
                {lmcSite.stats.length === 0 && <p className="text-text-light dark:text-gray-500 text-sm">Aucune statistique</p>}
              </div>
            </div>

            {/* Témoignages */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl border border-border dark:border-gray-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary dark:text-white">Témoignages</h3>
                <button onClick={() => setLmcSite({ ...lmcSite, temoignages: [...lmcSite.temoignages, { id: Date.now(), nom: '', poste: '', entreprise: '', texte: '', photo: '' }] })}
                  className="text-primary hover:text-primary-dark text-sm font-medium">+ Ajouter</button>
              </div>
              <div className="space-y-4">
                {lmcSite.temoignages.map((t, i) => (
                  <div key={t.id} className="border border-border dark:border-gray-600 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-secondary dark:text-gray-300">Témoignage {i + 1}</span>
                      <button onClick={() => setLmcSite({ ...lmcSite, temoignages: lmcSite.temoignages.filter((_, j) => j !== i) })}
                        className="text-red-500 hover:text-red-700 text-xs font-medium">Supprimer</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input value={t.nom} onChange={e => { const temoignages = [...lmcSite.temoignages]; temoignages[i] = { ...temoignages[i], nom: e.target.value }; setLmcSite({ ...lmcSite, temoignages }) }} placeholder="Nom"
                        className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white text-sm" />
                      <input value={t.poste} onChange={e => { const temoignages = [...lmcSite.temoignages]; temoignages[i] = { ...temoignages[i], poste: e.target.value }; setLmcSite({ ...lmcSite, temoignages }) }} placeholder="Poste"
                        className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white text-sm" />
                      <input value={t.entreprise} onChange={e => { const temoignages = [...lmcSite.temoignages]; temoignages[i] = { ...temoignages[i], entreprise: e.target.value }; setLmcSite({ ...lmcSite, temoignages }) }} placeholder="Entreprise"
                        className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white text-sm" />
                    </div>
                    <textarea value={t.texte} onChange={e => { const temoignages = [...lmcSite.temoignages]; temoignages[i] = { ...temoignages[i], texte: e.target.value }; setLmcSite({ ...lmcSite, temoignages }) }} placeholder="Texte du témoignage" rows="2"
                      className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white text-sm resize-y" />
                  </div>
                ))}
                {lmcSite.temoignages.length === 0 && <p className="text-text-light dark:text-gray-500 text-sm">Aucun témoignage</p>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleSaveSite} className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">Enregistrer</button>
              {lmcSiteMsg && <p className={`text-sm font-medium ${lmcSiteMsg.includes('✓') ? 'text-green-600' : 'text-red-500'}`}>{lmcSiteMsg}</p>}
            </div>
          </div>
        )}

        {/* TAB: Hero */}
        {tab === 'Hero' && (
          <div>
            <h2 className="text-lg font-bold text-secondary dark:text-white mb-4">Images du Hero (Carousel)</h2>
            <p className="text-sm text-text-light dark:text-gray-400 mb-4">
              Ajoutez des images en arrière-plan du Hero. Si aucune image n'est ajoutée, le fond par défaut est affiché.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <label className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer">
                {heroUploading ? 'Envoi...' : '+ Ajouter une image'}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml" onChange={handleUploadHeroSlide}
                  style={{ display: 'none' }} disabled={heroUploading} />
              </label>
              <div className="flex items-center gap-2">
                <label className="text-sm text-text-light dark:text-gray-400">Intervalle :</label>
                <input type="number" min="1000" step="500" value={heroInterval} onChange={e => setHeroInterval(Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white text-sm" />
                <span className="text-xs text-text-light dark:text-gray-500">ms</span>
                <button onClick={handleSaveHeroInterval} className="px-3 py-2 border border-border dark:border-gray-600 rounded-lg text-sm text-secondary dark:text-gray-300 hover:bg-bg-alt dark:hover:bg-gray-700 transition-colors">
                  OK
                </button>
              </div>
            </div>

            {heroSlides.length === 0 ? (
              <div className="bg-white dark:bg-[#2A2A2A] rounded-xl border-2 border-dashed border-border dark:border-gray-600 p-8 text-center">
                <p className="text-text-light dark:text-gray-500">Aucune image. Le Hero affiche le fond par défaut.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...heroSlides].sort((a, b) => (a.ordre || 0) - (b.ordre || 0)).map((slide, i) => (
                  <div key={slide.id}
                    draggable
                    onDragStart={e => handleHeroDragStart(e, i)}
                    onDragOver={e => handleHeroDragOver(e, i)}
                    onDragEnd={handleHeroDragEnd}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-grab ${
                      dragIndex === i
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-border dark:border-gray-600 bg-white dark:bg-[#2A2A2A] hover:bg-bg-alt dark:hover:bg-gray-700'
                    } ${dragIndex !== null && dragIndex !== i ? 'opacity-60' : ''}`}>
                    <span className="text-text-light dark:text-gray-500 text-lg select-none">⠿</span>
                    <span className="text-xs text-text-light dark:text-gray-500 w-6">#{slide.ordre}</span>
                    <img src={slide.image} alt="" className="w-28 h-16 object-cover rounded-md border border-border dark:border-gray-600" />
                    <span className="flex-1 text-xs text-text-light dark:text-gray-400 truncate">{slide.image}</span>
                    <button onClick={() => handleDeleteHeroSlide(slide.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium shrink-0">
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}

            {heroMsg && <p className={`mt-3 text-sm font-medium ${heroMsg.includes('✓') ? 'text-green-600' : 'text-red-500'}`}>{heroMsg}</p>}
          </div>
        )}

        {/* TAB: À propos */}
        {tab === 'À propos' && (
          <div>
            <h2 className="text-lg font-bold text-secondary dark:text-white mb-4">À propos — LMC Formation</h2>
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl border border-border dark:border-gray-600 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Titre</label>
                <input value={lmcAbout.titre} onChange={e => setLmcAbout({ ...lmcAbout, titre: e.target.value })}
                  className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Description</label>
                <textarea value={lmcAbout.description} onChange={e => setLmcAbout({ ...lmcAbout, description: e.target.value })} rows="3"
                  className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white resize-y" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Mission</label>
                <textarea value={lmcAbout.mission} onChange={e => setLmcAbout({ ...lmcAbout, mission: e.target.value })} rows="3"
                  className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white resize-y" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Vision</label>
                <textarea value={lmcAbout.vision} onChange={e => setLmcAbout({ ...lmcAbout, vision: e.target.value })} rows="3"
                  className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white resize-y" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-1">Valeurs (une par ligne)</label>
                <textarea value={lmcAbout.valeurs.join('\n')} onChange={e => setLmcAbout({ ...lmcAbout, valeurs: e.target.value.split('\n') })} rows="4"
                  className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg bg-bg dark:bg-[#1A1A1A] text-secondary dark:text-white resize-y" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSaveAbout} className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">Enregistrer</button>
                {lmcAboutMsg && <p className={`text-sm font-medium ${lmcAboutMsg.includes('✓') ? 'text-green-600' : 'text-red-500'}`}>{lmcAboutMsg}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
