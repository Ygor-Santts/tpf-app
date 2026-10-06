import { defineStore } from 'pinia'
import {
  getWorkerMe, updateWorkerProfile, getWorkerPortfolio,
  uploadPortfolioItem, deletePortfolioItem,
  getWorkerRatings, getWorkerRatingSummary, submitRating,
} from '@infra/services/profile.service'
import { apiError } from '@shared/validation'
import type { WorkerProfile, PortfolioItem, Rating, RatingSummary } from '@domain/worker'

export const useWorkerStore = defineStore('worker', {
  state: () => ({
    profile: null as WorkerProfile | null,
    portfolio: [] as PortfolioItem[],
    ratings: [] as Rating[],
    ratingSummary: null as RatingSummary | null,
    ratingsTotal: 0,
    ratingsPage: 1,
    loading: false,
    error: null as string | null,
    // Per-field messages from the API, shown under each field by the form.
    fieldErrors: {} as Record<string, string>,
  }),
  actions: {
    fail(e: unknown, fallback: string) {
      const { message, fields } = apiError(e, fallback)
      this.error = message
      this.fieldErrors = fields
    },
    async loadProfile() {
      this.loading = true
      try { this.profile = await getWorkerMe() }
      catch (e: any) { this.fail(e, 'Erro ao carregar perfil') }
      finally { this.loading = false }
    },
    async loadPortfolio(workerId: number) {
      this.loading = true
      try { this.portfolio = await getWorkerPortfolio(workerId) }
      catch (e: any) { this.fail(e, 'Erro ao carregar portfólio') }
      finally { this.loading = false }
    },
    async loadRatings(workerId: number, page = 1) {
      this.loading = true
      try {
        const result = await getWorkerRatings(workerId, page)
        this.ratings = result.data
        this.ratingsTotal = result.total
        this.ratingsPage = page
      } catch (e: any) { this.fail(e, 'Erro ao carregar avaliações') }
      finally { this.loading = false }
    },
    async loadRatingSummary(workerId: number) {
      try { this.ratingSummary = await getWorkerRatingSummary(workerId) }
      catch {}
    },
    async uploadItem(file: File, caption?: string) {
      this.loading = true; this.error = null
      try {
        const item = await uploadPortfolioItem(file, caption)
        this.portfolio.unshift(item)
        return true
      } catch (e: any) { this.fail(e, 'Erro no upload'); return false }
      finally { this.loading = false }
    },
    async deleteItem(id: number) {
      await deletePortfolioItem(id)
      this.portfolio = this.portfolio.filter(i => i.id !== id)
    },
    async updateProfile(dto: Partial<WorkerProfile & { name: string; phone: string; jobOccupationIds: number[]; operationCitiesIds: number[] }>) {
      this.loading = true; this.error = null; this.fieldErrors = {}
      try { await updateWorkerProfile(dto); await this.loadProfile(); return true }
      catch (e: any) { this.fail(e, 'Erro ao atualizar perfil'); return false }
      finally { this.loading = false }
    },
    async submitRating(workerId: number, score: number, comment?: string) {
      await submitRating(workerId, score, comment)
      await this.loadRatings(workerId, 1)
      await this.loadRatingSummary(workerId)
    },
  },
})
