const apiBase = '/api'

function getSessionHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  try {
    const sid = localStorage.getItem('sessionId')
    if (sid) headers['X-Session-Id'] = sid
  } catch {
    // ignore
  }
  return headers
}

async function fetchWithTimeout(path, options = {}, timeout = 60000) {
  const controller = new AbortController()
  const signal = timeout > 0 ? controller.signal : undefined
  const timer = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null
  try {
    return await fetch(path, {
      credentials: 'include',
      signal,
      ...options,
    })
  } catch (error) {
    if (error && error.name === 'AbortError' && timeout > 0) {
      throw new Error(`Request timed out after ${timeout}ms`)
    }
    throw error
  } finally {
    if (timer) clearTimeout(timer)
  }
}

async function fetchJson(path, options = {}, timeout = 60000) {
  const response = await fetchWithTimeout(path, {
    headers: getSessionHeaders(),
    ...options,
  }, timeout)
  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }
  if (!response.ok || (data && data.success === false)) {
    throw new Error(data?.message || `${response.status} ${response.statusText}`)
  }
  return data
}

export function getApiBase() {
  return apiBase
}

export async function getFormSettings() {
  return fetchJson(`${apiBase}/form-settings.php`)
}

export async function saveFormSettings(accessKeys) {
  return fetchJson(`${apiBase}/form-settings.php`, {
    method: 'POST',
    body: JSON.stringify({ accessKeys }),
  })
}

export async function getVehicles() {
  return fetchJson(`${apiBase}/vehicles.php`)
}

export async function createVehicle(vehicle) {
  return fetchJson(`${apiBase}/vehicles.php`, {
    method: 'POST',
    body: JSON.stringify(vehicle),
  })
}

export async function updateVehicle(vehicle) {
  return fetchJson(`${apiBase}/vehicles.php`, {
    method: 'PUT',
    body: JSON.stringify(vehicle),
  })
}

export async function deleteVehicle(id) {
  return fetchJson(`${apiBase}/vehicles.php`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
}

// Fleet (admin) endpoints
export async function getFleet(status = 'all') {
  const url = new URL(`${apiBase}/fleet.php`, window.location.href)
  if (status) url.searchParams.set('status', status)
  return fetchJson(url.toString())
}

export async function getFleetVehicle(id) {
  const url = new URL(`${apiBase}/fleet.php`, window.location.href)
  url.searchParams.set('id', id)
  return fetchJson(url.toString())
}

export async function createFleetVehicle(formData) {
  // formData: FormData instance including fields and images[]
  const response = await fetchWithTimeout(`${apiBase}/fleet.php`, {
    method: 'POST',
    credentials: 'include',
    headers: (() => {
      try {
        const sid = localStorage.getItem('sessionId')
        return sid ? { 'X-Session-Id': sid } : {}
      } catch { return {} }
    })(),
    body: formData,
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) throw new Error(data?.message || `${response.status} ${response.statusText}`)
  return data
}

export async function createFleetVehicleJson(payload) {
  return fetchJson(`${apiBase}/fleet.php`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateFleetVehicle(payload) {
  return fetchJson(`${apiBase}/fleet.php`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function trashFleetVehicle(id) {
  return fetchJson(`${apiBase}/fleet.php`, {
    method: 'DELETE',
    body: JSON.stringify({ id, permanent: false }),
  })
}

export async function deleteFleetVehiclePermanently(id) {
  return fetchJson(`${apiBase}/fleet.php`, {
    method: 'DELETE',
    body: JSON.stringify({ id, permanent: true }),
  })
}

export async function restoreFleetVehicle(id) {
  return fetchJson(`${apiBase}/fleet.php`, {
    method: 'PUT',
    body: JSON.stringify({ id, restore: 1 }),
  })
}

export async function uploadFleetImages(vehicleId, formData) {
  // formData must include action=upload_image and vehicle_id
  const response = await fetch(`${apiBase}/fleet.php`, {
    method: 'POST',
    credentials: 'include',
    headers: (() => {
      try {
        const sid = localStorage.getItem('sessionId')
        return sid ? { 'X-Session-Id': sid } : {}
      } catch { return {} }
    })(),
    body: formData,
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) throw new Error(data?.message || `${response.status} ${response.statusText}`)
  return data
}

export async function deleteFleetImage(imageId) {
  const url = new URL(`${apiBase}/fleet.php`, window.location.href)
  url.searchParams.set('image_id', imageId)
  return fetchJson(url.toString(), { method: 'DELETE' })
}

export async function setFleetImagePrimary(vehicleId, imageId) {
  const normalizedVehicleId = Number(vehicleId)
  const normalizedImageId = Number(imageId)
  if (!Number.isInteger(normalizedVehicleId) || normalizedVehicleId <= 0) {
    throw new Error('A valid vehicle is required to set a primary image.')
  }
  if (!Number.isInteger(normalizedImageId) || normalizedImageId <= 0) {
    throw new Error('A valid image is required to set a primary image.')
  }
  return fetchJson(`${apiBase}/fleet.php?action=set_primary`, {
    method: 'PUT',
    body: JSON.stringify({ vehicle_id: normalizedVehicleId, image_id: normalizedImageId }),
  })
}

export async function replaceFleetImage(imageId, formData) {
  const response = await fetchWithTimeout(`${apiBase}/fleet.php`, {
    method: 'POST',
    credentials: 'include',
    headers: (() => {
      try { const sid = localStorage.getItem('sessionId'); return sid ? { 'X-Session-Id': sid } : {} } catch { return {} }
    })(),
    body: formData,
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) throw new Error(data?.message || `${response.status} ${response.statusText}`)
  return data
}

export async function updateFleetImageMeta(payload) {
  return fetchJson(`${apiBase}/fleet.php?action=update_image`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function getMedia() {
  const url = new URL(`${apiBase}/fleet.php`, window.location.href)
  url.searchParams.set('media', '1')
  return fetchJson(url.toString())
}

export async function addImageUsage(imageId, location, referenceId = 0, referenceName = '') {
  const form = new FormData()
  form.append('action', 'add_usage')
  form.append('image_id', String(imageId))
  form.append('location', location)
  form.append('reference_id', String(referenceId))
  if (referenceName) form.append('reference_name', referenceName)
  const response = await fetchWithTimeout(`${apiBase}/fleet.php`, {
    method: 'POST',
    credentials: 'include',
    headers: (() => { try { const sid = localStorage.getItem('sessionId'); return sid ? { 'X-Session-Id': sid } : {} } catch { return {} } })(),
    body: form,
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) throw new Error(data?.message || `${response.status} ${response.statusText}`)
  return data
}

export async function getMostBooked() {
  const url = new URL(`${apiBase}/fleet.php`, window.location.href)
  url.searchParams.set('most_booked', '1')
  return fetchJson(url.toString())
}

export async function reorderFleetImages(vehicleId, order) {
  return fetchJson(`${apiBase}/fleet.php?action=reorder_images`, {
    method: 'PUT',
    body: JSON.stringify({ vehicle_id: vehicleId, order }),
  })
}

export async function getDashboardSummary() {
  return fetchJson(`${apiBase}/dashboard.php`)
}

export async function getBookings(status = 'active') {
  const url = new URL(`${apiBase}/bookings.php`, window.location.href)
  if (status) url.searchParams.set('status', status)
  return fetchJson(url.toString())
}

export async function saveBooking(booking) {
  return fetchJson(`${apiBase}/bookings.php`, {
    method: 'POST',
    body: JSON.stringify(booking),
  })
}

export async function updateBookingStatus(id, action) {
  return fetchJson(`${apiBase}/bookings.php`, {
    method: 'PUT',
    body: JSON.stringify({ id, action }),
  })
}

export async function deleteBookingPermanently(id) {
  return fetchJson(`${apiBase}/bookings.php`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
}

export async function saveContact(contact) {
  return fetchJson(`${apiBase}/contact.php`, {
    method: 'POST',
    body: JSON.stringify(contact),
  })
}

export async function getContactSubmissions(status = 'active') {
  const url = new URL(`${apiBase}/contact.php`, window.location.href)
  url.searchParams.set('status', status)
  return fetchJson(url.toString())
}

export async function updateContactSubmissionStatus(id, status, extra = {}) {
  return fetchJson(`${apiBase}/contact.php`, {
    method: 'PUT',
    body: JSON.stringify({ id, status, ...extra }),
  })
}

export async function deleteContactSubmission(id, permanent = false) {
  return fetchJson(`${apiBase}/contact.php`, { method: 'DELETE', body: JSON.stringify({ id, permanent }) })
}

// Notifications
export async function createNotification(notification) {
  return fetchJson(`${apiBase}/notifications.php`, {
    method: 'POST',
    body: JSON.stringify(notification),
  })
}

export async function getNotifications({ unread = false, limit = 50 } = {}) {
  const url = new URL(`${apiBase}/notifications.php`, window.location.href)
  if (unread) url.searchParams.set('unread', '1')
  if (limit) url.searchParams.set('limit', String(limit))
  return fetchJson(url.toString())
}

export async function getUnreadNotificationCount() {
  const url = new URL(`${apiBase}/notifications.php`, window.location.href)
  url.searchParams.set('count', '1')
  return fetchJson(url.toString())
}

export async function markNotificationRead(id, isRead = true) {
  return fetchJson(`${apiBase}/notifications.php`, {
    method: 'PUT',
    body: JSON.stringify({ id, is_read: isRead ? 1 : 0 }),
  })
}

export async function markAllNotificationsRead() {
  return fetchJson(`${apiBase}/notifications.php`, {
    method: 'PUT',
    body: JSON.stringify({ mark_all_read: 1 }),
  })
}

export async function deleteNotification(id) {
  return fetchJson(`${apiBase}/notifications.php`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
}

// User Management
export async function getUsers() {
  return fetchJson(`${apiBase}/users.php`)
}

export async function createUser(user) {
  return fetchJson(`${apiBase}/users.php`, {
    method: 'POST',
    body: JSON.stringify(user),
  })
}

export async function updateUser(user) {
  return fetchJson(`${apiBase}/users.php`, {
    method: 'PUT',
    body: JSON.stringify(user),
  })
}

export async function deleteUser(id) {
  return fetchJson(`${apiBase}/users.php`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
}
