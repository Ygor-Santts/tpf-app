import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@infra/http'
import { getStates, getCitiesByState } from './locales.service'

vi.mock('@infra/http', () => ({ api: { get: vi.fn() } }))

const get = vi.mocked(api.get)

describe('locales.service', () => {
  beforeEach(() => get.mockReset())

  it('normalizes states returned with `id` into `code`', async () => {
    get.mockResolvedValue({
      data: [
        { id: 'SP', name: 'São Paulo' },
        { code: 'RJ', name: 'Rio' },
      ],
    })
    await expect(getStates()).resolves.toEqual([
      { code: 'SP', name: 'São Paulo' },
      { code: 'RJ', name: 'Rio' },
    ])
    expect(get).toHaveBeenCalledWith('/locales/states')
  })

  it('returns an empty list when the API returns no body', async () => {
    get.mockResolvedValue({ data: null })
    await expect(getStates()).resolves.toEqual([])
  })

  it('fetches cities for a state code', async () => {
    get.mockResolvedValue({ data: [{ id: 1, name: 'Campinas' }] })
    await expect(getCitiesByState('SP')).resolves.toEqual([{ id: 1, name: 'Campinas' }])
    expect(get).toHaveBeenCalledWith('/locales/state/SP/cities')
  })
})
