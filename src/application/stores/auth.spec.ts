import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { signIn, workerSignUp } from '@infra/services/auth.service'
import { useAuthStore } from './auth'

vi.mock('@infra/services/auth.service', () => ({
  signIn: vi.fn(),
  workerSignUp: vi.fn(),
  clientSignUp: vi.fn(),
}))

const user = { id: 1, name: 'Ana', email: 'a@b.c', phone: '1', isWorker: true, workerId: 7 }

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(signIn).mockReset()
    vi.mocked(workerSignUp).mockReset()
    setActivePinia(createPinia())
  })

  it('hydrates token and user from localStorage', () => {
    localStorage.setItem('tpf_token', 'tok')
    localStorage.setItem('tpf_user', JSON.stringify(user))
    const store = useAuthStore()
    expect(store.token).toBe('tok')
    expect(store.user).toEqual(user)
    expect(store.isWorker).toBe(true)
  })

  it('ignores a corrupted stored user', () => {
    localStorage.setItem('tpf_user', '{not json')
    expect(useAuthStore().user).toBeNull()
  })

  it('login stores the session on success', async () => {
    vi.mocked(signIn).mockResolvedValue({ access_token: 'tok', user })
    const store = useAuthStore()
    await expect(store.login({ email: 'a@b.c', password: 'x' })).resolves.toBe(true)
    expect(store.token).toBe('tok')
    expect(store.loading).toBe(false)
    expect(localStorage.getItem('tpf_token')).toBe('tok')
    expect(JSON.parse(localStorage.getItem('tpf_user')!)).toEqual(user)
  })

  it('login exposes the API error message on failure', async () => {
    vi.mocked(signIn).mockRejectedValue({
      response: { data: { message: 'Credenciais inválidas' } },
    })
    const store = useAuthStore()
    await expect(store.login({ email: 'a@b.c', password: 'x' })).resolves.toBe(false)
    expect(store.error).toBe('Credenciais inválidas')
    expect(store.token).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('logout clears state and storage', () => {
    localStorage.setItem('tpf_token', 'tok')
    localStorage.setItem('tpf_user', JSON.stringify(user))
    const store = useAuthStore()
    store.logout()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(localStorage.getItem('tpf_token')).toBeNull()
    expect(localStorage.getItem('tpf_user')).toBeNull()
  })

  it('registerWorker falls back to a default error message', async () => {
    vi.mocked(workerSignUp).mockRejectedValue(new Error('network'))
    const store = useAuthStore()
    const ok = await store.registerWorker({
      name: 'n',
      email: 'e',
      phone: 'p',
      password: 'x',
      jobOccupationIds: [],
      operationCitiesIds: [],
    })
    expect(ok).toBe(false)
    expect(store.error).toBe('Register failed')
  })
})
