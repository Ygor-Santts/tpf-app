import { api } from '@infra/http'
import type { JobCategory, JobOccupation } from '@domain/marketplace'
export async function getJobCategories(): Promise<JobCategory[]> {
  const { data } = await api.get('/job/categories')
  return data
}
export async function getOccupationsByCategory(categoryId: number): Promise<JobOccupation[]> {
  const { data } = await api.get(`/job/category/${categoryId}/occupations`)
  return data
}
