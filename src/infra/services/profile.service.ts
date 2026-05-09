import { api } from '@infra/http'
import type { WorkerProfile, PortfolioItem, Rating, RatingSummary } from '@domain/worker'

export async function getWorkerMe(): Promise<WorkerProfile> {
  const { data } = await api.get('/worker/me')
  return data
}

export async function updateWorkerProfile(dto: {
  bio?: string; name?: string; phone?: string;
  jobOccupationIds?: number[]; operationCitiesIds?: number[];
}): Promise<void> {
  await api.patch('/worker/profile', dto)
}

export async function getWorkerPortfolio(workerId: number): Promise<PortfolioItem[]> {
  const { data } = await api.get(`/worker/${workerId}/portfolio`)
  return data
}

export async function uploadPortfolioItem(file: File, caption?: string): Promise<PortfolioItem> {
  const form = new FormData()
  form.append('file', file)
  if (caption) form.append('caption', caption)
  const { data } = await api.post('/worker/portfolio', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deletePortfolioItem(id: number): Promise<void> {
  await api.delete(`/worker/portfolio/${id}`)
}

export async function getWorkerRatings(workerId: number, page = 1, limit = 10): Promise<{ data: Rating[]; total: number; page: number; limit: number }> {
  const { data } = await api.get(`/worker/${workerId}/ratings`, { params: { page, limit } })
  return data
}

export async function getWorkerRatingSummary(workerId: number): Promise<RatingSummary> {
  const { data } = await api.get(`/worker/${workerId}/rating-summary`)
  return data
}

export async function submitRating(workerId: number, score: number, comment?: string): Promise<void> {
  await api.post(`/worker/${workerId}/ratings`, { score, comment })
}

export async function getWorkerPublicProfile(workerId: number): Promise<WorkerProfile & { averageRating: number; ratingCount: number }> {
  const { data } = await api.get(`/worker/${workerId}/portfolio`)
  return data
}
