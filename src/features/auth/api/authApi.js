import { apiRequest } from '../../../helpers/apiHelper.js'

export const login = async (payload) => (await apiRequest('/auth/login', { method: 'POST', body: payload })).data
export const register = async (payload) => (await apiRequest('/auth/register', { method: 'POST', body: payload })).data
export const logout = () => apiRequest('/auth/logout', { method: 'POST', auth: true })
export const getProfile = async () => (await apiRequest('/auth/profile', { auth: true })).data
