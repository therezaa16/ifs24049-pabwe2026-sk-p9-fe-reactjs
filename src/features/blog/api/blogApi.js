import { apiRequest } from '../../../helpers/apiHelper.js'

export const CATEGORIES = ['Teknologi', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum']

const data = async (promise) => (await promise).data

export const getCategories = () => data(apiRequest('/public/categories'))

export function listPublicPosts({ q = '', category = '' } = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category && category !== 'Semua') params.set('category', category)
  const qs = params.toString()
  return data(apiRequest(`/public/posts${qs ? `?${qs}` : ''}`))
}

export const getPublicPost = (slug) => data(apiRequest(`/public/posts/${encodeURIComponent(slug)}`))

export const listMyPosts = () => data(apiRequest('/posts', { auth: true }))
export const getStats = () => data(apiRequest('/posts/stats', { auth: true }))
export const createPost = (body) => data(apiRequest('/posts', { method: 'POST', body, auth: true }))
export const updatePost = (id, body) => data(apiRequest(`/posts/${id}`, { method: 'PUT', body, auth: true }))
export const togglePublish = (id) => data(apiRequest(`/posts/${id}/toggle-publish`, { method: 'PATCH', auth: true }))
export const deletePost = (id) => apiRequest(`/posts/${id}`, { method: 'DELETE', auth: true })
export const aiGenerate = (body) => data(apiRequest('/posts/ai-generate', { method: 'POST', body, auth: true }))
