import { defineStore } from 'pinia'
import { getJobCategories, getOccupationsByCategory, addOccupation, type AddOccupationDTO } from '@infra/services/job.service'
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
    // Adds a category and/or occupation the worker did not find in the list.
    // The API returns the existing one when the name is already there.
    async addOccupation(dto: AddOccupationDTO) {
      const added = await addOccupation(dto)
      // New ones wait for review, so the public lists don't have them yet.
      if (!this.categories.some((c) => c.id === added.categoryId)) {
        this.categories.push({ id: added.categoryId, name: added.categoryName, pending: added.pending })
        this.occupationsByCategory[added.categoryId] ??= []
      }
      await this.loadOccupations(added.categoryId)
      const list = this.occupationsByCategory[added.categoryId] ?? []
      if (!list.some((o) => o.id === added.id)) list.push({ id: added.id, name: added.name, categoryId: added.categoryId, pending: added.pending })
      this.occupationsByCategory[added.categoryId] = list
      return added
    },
    async loadOccupations(categoryId: number) {
      if (this.occupationsByCategory[categoryId]) return
      try {
        this.loading = true
        const list = await getOccupationsByCategory(categoryId)
        // The API answers with an error object, not a list, when the category has none.
        this.occupationsByCategory[categoryId] = Array.isArray(list) ? list : []
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Failed to load occupations'
      } finally {
        this.loading = false
      }
    },
  },
})
