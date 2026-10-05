import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { getJobCategories, getOccupationsByCategory } from '@infra/services/job.service'
import { getCitiesByState } from '@infra/services/locales.service'
import { useTaxonomyStore } from './taxonomy'

vi.mock('@infra/services/job.service', () => ({
  getJobCategories: vi.fn(),
  getOccupationsByCategory: vi.fn(),
}))
vi.mock('@infra/services/locales.service', () => ({
  getStates: vi.fn(),
  getCitiesByState: vi.fn(),
}))

describe('taxonomy store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('loads categories', async () => {
    vi.mocked(getJobCategories).mockResolvedValue([{ id: 1, name: 'Obras' }] as never)
    const store = useTaxonomyStore()
    await store.loadCategories()
    expect(store.categories).toEqual([{ id: 1, name: 'Obras' }])
    expect(store.loading).toBe(false)
  })

  it('caches cities per state', async () => {
    vi.mocked(getCitiesByState).mockResolvedValue([{ id: 1, name: 'Campinas' }] as never)
    const store = useTaxonomyStore()
    await store.loadCities('SP')
    await store.loadCities('SP')
    expect(getCitiesByState).toHaveBeenCalledTimes(1)
    expect(store.citiesByState.SP).toEqual([{ id: 1, name: 'Campinas' }])
  })

  it('caches occupations per category', async () => {
    vi.mocked(getOccupationsByCategory).mockResolvedValue([] as never)
    const store = useTaxonomyStore()
    await store.loadOccupations(3)
    await store.loadOccupations(3)
    expect(getOccupationsByCategory).toHaveBeenCalledTimes(1)
  })

  it('records an error and stops loading when a request fails', async () => {
    vi.mocked(getJobCategories).mockRejectedValue(new Error('boom'))
    const store = useTaxonomyStore()
    await store.loadCategories()
    expect(store.error).toBe('Failed to load categories')
    expect(store.loading).toBe(false)
  })
})
