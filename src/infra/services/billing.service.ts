import { api } from '@infra/http'
import type { BillingSummary, Transaction, PaymentStatus } from '@domain/billing'
import type { Pagination } from '@shared/types'

export async function getBillingSummary(
  params: { from?: string; to?: string } = {}
): Promise<BillingSummary> {
  const q = new URLSearchParams()
  if (params.from) q.set('from', params.from)
  if (params.to) q.set('to', params.to)
  const { data } = await api.get<BillingSummary>(`/billing/summary${q.toString() ? `?${q}` : ''}`)
  return data
}
export async function listTransactions(
  params: { page?: number; limit?: number; status?: PaymentStatus; from?: string; to?: string } = {}
): Promise<Pagination<Transaction>> {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  if (params.status) q.set('status', params.status)
  if (params.from) q.set('from', params.from)
  if (params.to) q.set('to', params.to)
  const { data } = await api.get<Pagination<Transaction>>(
    `/billing/transactions${q.toString() ? `?${q}` : ''}`
  )
  return data
}
