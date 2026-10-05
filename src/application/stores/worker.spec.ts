import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
  getWorkerMe,
  updateWorkerProfile,
  uploadPortfolioItem,
  deletePortfolioItem,
  getWorkerRatings,
} from '@infra/services/profile.service'
import { useWorkerStore } from './worker'

vi.mock('@infra/services/profile.service', () => ({
  getWorkerMe: vi.fn(),
  updateWorkerProfile: vi.fn(),
  getWorkerPortfolio: vi.fn(),
  uploadPortfolioItem: vi.fn(),
  deletePortfolioItem: vi.fn(),
  getWorkerRatings: vi.fn(),
  getWorkerRatingSummary: vi.fn(),
  submitRating: vi.fn(),
}))

describe('worker store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('loadRatings stores the page and total', async () => {
    vi.mocked(getWorkerRatings).mockResolvedValue({
      data: [{ id: 1 }] as never,
      total: 11,
      page: 2,
      limit: 10,
    })
    const store = useWorkerStore()
    await store.loadRatings(7, 2)
    expect(getWorkerRatings).toHaveBeenCalledWith(7, 2)
    expect(store.ratings).toEqual([{ id: 1 }])
    expect(store.ratingsTotal).toBe(11)
    expect(store.ratingsPage).toBe(2)
  })

  it('uploadItem prepends the new item', async () => {
    const store = useWorkerStore()
    store.portfolio = [{ id: 1 }] as never
    vi.mocked(uploadPortfolioItem).mockResolvedValue({ id: 2 } as never)
    const file = new File(['x'], 'a.png')
    await expect(store.uploadItem(file, 'legenda')).resolves.toBe(true)
    expect(uploadPortfolioItem).toHaveBeenCalledWith(file, 'legenda')
    expect(store.portfolio.map((i) => i.id)).toEqual([2, 1])
  })

  it('uploadItem reports failure', async () => {
    vi.mocked(uploadPortfolioItem).mockRejectedValue({
      response: { data: { message: 'Muito grande' } },
    })
    const store = useWorkerStore()
    await expect(store.uploadItem(new File(['x'], 'a.png'))).resolves.toBe(false)
    expect(store.error).toBe('Muito grande')
  })

  it('deleteItem removes the item locally', async () => {
    vi.mocked(deletePortfolioItem).mockResolvedValue()
    const store = useWorkerStore()
    store.portfolio = [{ id: 1 }, { id: 2 }] as never
    await store.deleteItem(1)
    expect(deletePortfolioItem).toHaveBeenCalledWith(1)
    expect(store.portfolio.map((i) => i.id)).toEqual([2])
  })

  it('updateProfile reloads the profile after saving', async () => {
    vi.mocked(updateWorkerProfile).mockResolvedValue()
    vi.mocked(getWorkerMe).mockResolvedValue({ id: 7, bio: 'nova' } as never)
    const store = useWorkerStore()
    await expect(store.updateProfile({ bio: 'nova' })).resolves.toBe(true)
    expect(store.profile).toEqual({ id: 7, bio: 'nova' })
    expect(store.loading).toBe(false)
  })
})
