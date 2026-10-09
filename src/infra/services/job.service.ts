import { api } from '@infra/http'
import type { JobCategory, JobOccupation } from '@domain/marketplace'
export async function getJobCategories(): Promise<JobCategory[]> { const { data } = await api.get('/job/categories'); return data }
export async function getOccupationsByCategory(categoryId: number): Promise<JobOccupation[]> { const { data } = await api.get(`/job/category/${categoryId}/occupations`); return data }
export interface AddOccupationDTO { name: string; categoryId?: number; categoryName?: string }
export interface AddedOccupation { id: number; name: string; categoryId: number; categoryName: string }
export async function addOccupation(dto: AddOccupationDTO): Promise<AddedOccupation> { const { data } = await api.post('/job/occupations', dto); return data }
