const API = ''

async function request(url, options = {}) {
  const res = await fetch(API + url, {
    headers: { 'Accept': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || 'Erreur serveur')
  return data
}

export function getArticles() {
  return request('/articles')
}

export function getArticle(id) {
  return request(`/article/${id}`)
}

export function createArticle(formData, token) {
  return fetch('/articles', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function updateArticle(id, formData, token) {
  return fetch(`/articles/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function deleteArticle(id, token) {
  return request(`/articles/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function login(password) {
  return request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
}

export function getContact() {
  return request('/contact')
}

export function updateContact(formData, token) {
  return fetch('/contact', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function getExtras() {
  return request('/extras')
}

export function createExtra(formData, token) {
  return fetch('/extras', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function updateExtra(id, formData, token) {
  return fetch(`/extras/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function deleteExtra(id, token) {
  return request(`/extras/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function getAbout() {
  return request('/about')
}

export function updateAbout(content, token) {
  return request('/about', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content }),
  })
}

export function getStats() {
  return request('/stats')
}

export function updateStats(stats, token) {
  return request('/stats', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ stats }),
  })
}

export function getTheme() {
  return request('/theme')
}

export function updateTheme(colors, token) {
  return request('/theme', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ colors }),
  })
}

export function changePassword(currentPassword, newPassword, token) {
  return request('/change-password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

export function getHeroSlides() {
  return request('/hero-slides')
}

export function updateHeroSlides(data, token) {
  return request('/hero-slides', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export function uploadHeroSlide(file, token) {
  const fd = new FormData()
  fd.append('image', file)
  return fetch('/hero-slides/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function deleteHeroSlide(id, token) {
  return request(`/hero-slides/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ---- LMC Formation ----
export function getLmcFormations(type) {
  const query = type ? `?type=${type}` : ''
  return request(`/lmc/formations${query}`)
}

export function getLmcFormation(slug) {
  return request(`/lmc/formation/${slug}`)
}

export function createLmcFormation(formData, token) {
  return fetch('/lmc/formation', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function updateLmcFormation(id, formData, token) {
  return fetch(`/lmc/formation/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function deleteLmcFormation(id, token) {
  return request(`/lmc/formation/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function getLmcAbout() {
  return request('/lmc/about')
}

export function updateLmcAbout(data, token) {
  return request('/lmc/about', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export function getLmcMessages(token) {
  return request('/lmc/contact/messages', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function deleteLmcMessage(id, token) {
  return request(`/lmc/contact/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function markLmcMessageRead(id, token) {
  return request(`/lmc/contact/${id}/read`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  })
}
