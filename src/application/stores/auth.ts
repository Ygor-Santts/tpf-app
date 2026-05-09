import { defineStore } from 'pinia'
import { signIn, workerSignUp, clientSignUp } from '@infra/services/auth.service'
import type { LoginDTO, RegisterWorkerDTO, RegisterClientDTO, UserProfile } from '@domain/auth'

const loadUser = (): UserProfile | null => {
  try { return JSON.parse(localStorage.getItem('tpf_user') || 'null') } catch { return null }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('tpf_token') as string | null,
    user: loadUser(),
    loading: false,
    error: null as string | null,
  }),
  getters: {
    isWorker: (state) => Boolean(state.user?.isWorker),
  },
  actions: {
    async login(dto: LoginDTO) {
      this.loading = true; this.error = null
      try {
        const { access_token, user } = await signIn(dto)
        this.token = access_token
        this.user = user
        localStorage.setItem('tpf_token', access_token)
        localStorage.setItem('tpf_user', JSON.stringify(user))
        return true
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Login failed'
        return false
      } finally { this.loading = false }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('tpf_token')
      localStorage.removeItem('tpf_user')
    },
    async registerWorker(dto: RegisterWorkerDTO) {
      this.loading = true; this.error = null
      try { await workerSignUp(dto); return true }
      catch (e: any) { this.error = e?.response?.data?.message || 'Register failed'; return false }
      finally { this.loading = false }
    },
    async registerClient(dto: RegisterClientDTO) {
      this.loading = true; this.error = null
      try { await clientSignUp(dto); return true }
      catch (e: any) { this.error = e?.response?.data?.message || 'Register failed'; return false }
      finally { this.loading = false }
    },
  },
})
