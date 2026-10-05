import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@infra/http'
import { signIn, workerSignUp, clientSignUp } from './auth.service'

vi.mock('@infra/http', () => ({ api: { get: vi.fn(), post: vi.fn() } }))

const post = vi.mocked(api.post)

describe('auth.service', () => {
  beforeEach(() => post.mockReset())

  it('signIn posts credentials and returns the response body', async () => {
    const body = { access_token: 'tok', user: { id: 1 } }
    post.mockResolvedValue({ data: body })
    await expect(signIn({ email: 'a@b.c', password: 'x' })).resolves.toEqual(body)
    expect(post).toHaveBeenCalledWith('/auth/sign-in', { email: 'a@b.c', password: 'x' })
  })

  it('workerSignUp and clientSignUp hit their own endpoints', async () => {
    post.mockResolvedValue({ data: undefined })
    const worker = {
      name: 'n',
      email: 'e',
      phone: 'p',
      password: 'x',
      jobOccupationIds: [1],
      operationCitiesIds: [2],
    }
    const client = { name: 'n', email: 'e', phone: 'p', password: 'x' }
    await workerSignUp(worker)
    await clientSignUp(client)
    expect(post).toHaveBeenNthCalledWith(1, '/auth/worker/sign-up', worker)
    expect(post).toHaveBeenNthCalledWith(2, '/auth/client/sign-up', client)
  })
})
