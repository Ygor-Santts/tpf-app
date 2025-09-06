import { api } from '@infra/http'
import type { WorkerSummary } from '@domain/marketplace'
export type WorkerSearchResult = { data: WorkerSummary[]; page: number; limit: number; total: number }
export type WorkerSearchParams = { name?: string; operationCitiesIds?: number[]; jobOccupationIds?: number[]; jobCategoryIds?: number[]; page?: number; limit?: number }
function toQuery(params: WorkerSearchParams): string {
  const q = new URLSearchParams()
  if (params.name) q.set('name', params.name)
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  if (params.operationCitiesIds?.length) q.set('operationCitiesIds', params.operationCitiesIds.join(','))
  if (params.jobOccupationIds?.length) q.set('jobOccupationIds', params.jobOccupationIds.join(','))
  if (params.jobCategoryIds?.length) q.set('jobCategoriyIds', params.jobCategoryIds.join(',')) // compat backend
  return q.toString()
}
export async function searchWorkers(params: WorkerSearchParams): Promise<WorkerSearchResult> { const qs = toQuery(params); const { data } = await api.get(`/worker/paginated${qs ? `?${qs}` : ''}`); return data }
