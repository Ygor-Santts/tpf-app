import { defineStore } from 'pinia'
import { signIn, workerSignUp } from '@infra/services/auth.service'
import type { LoginDTO, RegisterWorkerDTO } from '@domain/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: localStorage.getItem('tpf_token') as string | null, loading: false, error: null as string | null }),
  actions: {
    async login(dto: LoginDTO) {
      this.loading = true; this.error = null
      try { const { access_token } = await signIn(dto); this.token = access_token; localStorage.setItem('tpf_token', access_token); return true }
      catch (e: any) { this.error = e?.response?.data?.message || 'Login failed'; return false }
      finally { this.loading = false }
    },
    logout() { this.token = null; localStorage.removeItem('tpf_token') },
    async registerWorker(dto: RegisterWorkerDTO) {
      this.loading = true; this.error = null
      try { await workerSignUp(dto); return true }
      catch (e: any) { this.error = e?.response?.data?.message || 'Register failed'; return false }
      finally { this.loading = false }
    }
  }
})
