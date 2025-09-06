import { defineStore } from 'pinia'
import { signIn, workerSignUp } from '@infra/services/auth.service'
import type { LoginDTO, RegisterWorkerDTO, LoginResponseDTO } from '@domain/auth'

interface AuthState {
  token: string | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('tpf_token'),
    loading: false,
    error: null
  }),
  actions: {
    async login(payload: LoginDTO) {
      this.loading = true
      this.error = null
      try {
        const res: LoginResponseDTO = await signIn(payload)
        this.token = res.access_token
        localStorage.setItem('tpf_token', res.access_token)
        return true
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Falha no login'
        return false
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.token = null
      localStorage.removeItem('tpf_token')
    },
    async registerWorker(payload: RegisterWorkerDTO) {
      this.loading = true
      this.error = null
      try {
        await workerSignUp(payload)
        return true
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Falha ao registrar'
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
