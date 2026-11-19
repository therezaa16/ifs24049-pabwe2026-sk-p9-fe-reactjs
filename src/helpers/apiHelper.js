const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export const TOKEN_KEY = 'delcom_token'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

/**
 * Wrapper fetch terpusat: menyuntikkan Bearer token dan mengurai amplop
 * JSON standar { status, message, data }. Mengembalikan seluruh amplop.
 */
export async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server', 0)
  }

  let json = null
  try {
    json = await res.json()
  } catch {
    json = null
  }

  if (!res.ok || json?.status !== 'success') {
    if (res.status === 401 && auth) window.dispatchEvent(new Event('auth:expired'))
    throw new ApiError(json?.message || `Permintaan gagal (${res.status})`, res.status)
  }
  return json
}
