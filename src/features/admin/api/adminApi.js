import { apiRequest } from '../../../helpers/apiHelper.js'

export const listUsers = async () => (await apiRequest('/admin/users', { auth: true })).data
export const listAllPosts = async () => (await apiRequest('/admin/posts', { auth: true })).data
