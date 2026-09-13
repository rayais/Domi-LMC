const API = '/lmc'

async function request(url, options = {}) {
  const res = await fetch(API + url, {
    headers: { 'Accept': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || 'Erreur serveur')
  return data
}

export function getFormations(type) {
  const query = type ? `?type=${type}` : ''
  return request(`/formations${query}`)
}

export function getFormation(slug) {
  return request(`/formation/${slug}`)
}

export function createFormation(formData, token) {
  return fetch(API + '/formation', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function updateFormation(id, formData, token) {
  return fetch(API + `/formation/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function deleteFormation(id, token) {
  return request(`/formation/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export function getAbout() {
  return request('/about')
}

export function updateAbout(data, token) {
  return request('/about', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
}

export function sendMessage(data) {
  return request('/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export function getMessages(token) {
  return request('/contact/messages', {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export function deleteMessage(id, token) {
  return request(`/contact/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export function markMessageRead(id, token) {
  return request(`/contact/${id}/read`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export function getSiteData() {
  return request('/formations')
}

export function getSite() {
  return request('/')
}

export function updateSite(formData, token) {
  return fetch(API + '/', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function changePassword(currentPassword, newPassword, token) {
  return fetch('/change-password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function login(password) {
  return fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  }).then(r => r.json()).then(d => {
    if (d.error) throw new Error(d.error)
    return d
  })
}

export function getHeroSlides() {
  return request('/hero-slides')
}

export function updateHeroSlides(data, token) {
  return request('/hero-slides', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
}

export function uploadHeroSlide(file, token) {
  const fd = new FormData()
  fd.append('image', file)
  return fetch(API + '/hero-slides/upload', {
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
    headers: { Authorization: `Bearer ${token}` }
  })
}
