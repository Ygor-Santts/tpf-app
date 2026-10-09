import { api } from '@infra/http'

export interface AdminOccupation { id: number; name: string; approved: boolean; workers: number }
export interface AdminCategory { id: number; name: string; approved: boolean; occupations: AdminOccupation[] }

export type AdminUserFilter = 'all' | 'workers' | 'clients' | 'disabled'
export interface AdminUser {
  id: number; name: string; email: string; phone: string
  enabled: boolean; isAdmin: boolean; isWorker: boolean; workerId?: number
  createdAt: string; lastAccess?: string; occupations: number; cities: number
}
export interface AdminUserDetail extends AdminUser {
  bio?: string; occupationNames: string[]; cityNames: string[]; ratingsReceived: number; portfolioItems: number
}
export interface AdminUserPage { data: AdminUser[]; total: number; pages: number }

export async function getCategories(): Promise<AdminCategory[]> { const { data } = await api.get('/admin/categories'); return data }
export async function createCategory(name: string) { await api.post('/admin/categories', { name }) }
export async function updateCategory(id: number, changes: { name?: string; approved?: boolean }) { await api.patch(`/admin/categories/${id}`, changes) }
export async function mergeCategory(id: number, intoId: number) { await api.post(`/admin/categories/${id}/merge`, { intoId }) }
export async function deleteCategory(id: number) { await api.delete(`/admin/categories/${id}`) }

export async function createOccupation(categoryId: number, name: string) { await api.post(`/admin/categories/${categoryId}/occupations`, { name }) }
export async function updateOccupation(id: number, changes: { name?: string; approved?: boolean; categoryId?: number }) { await api.patch(`/admin/occupations/${id}`, changes) }
export async function mergeOccupation(id: number, intoId: number) { await api.post(`/admin/occupations/${id}/merge`, { intoId }) }
export async function deleteOccupation(id: number) { await api.delete(`/admin/occupations/${id}`) }

export async function getUsers(params: { search?: string; filter?: AdminUserFilter; page?: number }): Promise<AdminUserPage> {
  const { data } = await api.get('/admin/users', { params }); return data
}
export async function getUser(id: number): Promise<AdminUserDetail> { const { data } = await api.get(`/admin/users/${id}`); return data }
export async function setUserEnabled(id: number, enabled: boolean) { await api.patch(`/admin/users/${id}`, { enabled }) }
export async function deleteUser(id: number) { await api.delete(`/admin/users/${id}`) }
