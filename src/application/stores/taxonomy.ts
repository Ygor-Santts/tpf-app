import { defineStore } from 'pinia'
import { getJobCategories, getOccupationsByCategory } from '@infra/services/job.service'
import { getStates, getCitiesByState } from '@infra/services/locales.service'
import type { JobCategory, JobOccupation, State, City } from '@domain/marketplace'
export const useTaxonomyStore = defineStore('taxonomy', {
  state: () => ({
    categories: [] as JobCategory[],
    states: [] as State[],
    citiesByState: {} as Record<string, City[]>,
    occupationsByCategory: {} as Record<number, JobOccupation[]>,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async loadCategories() {
      try {
        this.loading = true
        this.categories = await getJobCategories()
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Failed to load categories'
      } finally {
        this.loading = false
      }
    },
    async loadStates() {
      try {
        this.loading = true
        this.states = await getStates()
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Failed to load states'
      } finally {
        this.loading = false
      }
    },
    async loadCities(code: string) {
      if (this.citiesByState[code]) return
      try {
        this.loading = true
        this.citiesByState[code] = await getCitiesByState(code)
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Failed to load cities'
      } finally {
        this.loading = false
      }
    },
    async loadOccupations(categoryId: number) {
      if (this.occupationsByCategory[categoryId]) return
      try {
        this.loading = true
        this.occupationsByCategory[categoryId] = await getOccupationsByCategory(categoryId)
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Failed to load occupations'
      } finally {
        this.loading = false
      }
    },
  },
})
