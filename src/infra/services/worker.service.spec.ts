import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@infra/http'
import { searchWorkers } from './worker.service'

vi.mock('@infra/http', () => ({ api: { get: vi.fn() } }))

const get = vi.mocked(api.get)

describe('worker.service', () => {
  beforeEach(() => {
    get.mockReset()
    get.mockResolvedValue({ data: { data: [], page: 1, limit: 10, total: 0 } })
  })

  it('calls the paginated endpoint without a query string when no params are given', async () => {
    await searchWorkers({})
    expect(get).toHaveBeenCalledWith('/worker/paginated')
  })

  it('serializes filters into the query string', async () => {
    await searchWorkers({
      name: 'ana',
      page: 2,
      limit: 20,
      operationCitiesIds: [1, 2],
      jobOccupationIds: [3],
      minRating: 4,
    })
    const url = get.mock.calls[0][0] as string
    const qs = new URLSearchParams(url.split('?')[1])
    expect(url.startsWith('/worker/paginated?')).toBe(true)
    expect(qs.get('name')).toBe('ana')
    expect(qs.get('page')).toBe('2')
    expect(qs.get('limit')).toBe('20')
    expect(qs.get('operationCitiesIds')).toBe('1,2')
    expect(qs.get('jobOccupationIds')).toBe('3')
    expect(qs.get('minRating')).toBe('4')
  })

  it('sends category ids under the key the backend expects', async () => {
    await searchWorkers({ jobCategoryIds: [5, 6] })
    const qs = new URLSearchParams((get.mock.calls[0][0] as string).split('?')[1])
    expect(qs.get('jobCategoriyIds')).toBe('5,6')
  })

  it('skips empty arrays', async () => {
    await searchWorkers({ operationCitiesIds: [], jobOccupationIds: [] })
    expect(get).toHaveBeenCalledWith('/worker/paginated')
  })
})
