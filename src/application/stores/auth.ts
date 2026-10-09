import { defineStore } from 'pinia'
import { signIn, workerSignUp, clientSignUp, activateWorker } from '@infra/services/auth.service'
import { apiError } from '@shared/validation'
import type { LoginDTO, RegisterWorkerDTO, RegisterClientDTO, ActivateWorkerDTO, UserProfile, AppMode, LoginResponse } from '@domain/auth'

const loadUser = (): UserProfile | null => {
  try { return JSON.parse(localStorage.getItem('tpf_user') || 'null') } catch { return null }
}

// A user with a worker profile can use the app as a client too.
// The mode only picks which side of the app they see.
export const loadMode = (user: UserProfile | null): AppMode => {
  if (!user?.isWorker) return 'client'
  return localStorage.getItem('tpf_mode') === 'client' ? 'client' : 'worker'
}

export const homeFor = (mode: AppMode) => mode === 'worker' ? '/worker/dashboard' : '/tabs/home'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('tpf_token') as string | null,
    user: loadUser(),
    mode: loadMode(loadUser()),
    loading: false,
    error: null as string | null,
    // Per-field messages from the API, shown under each field by the form.
    fieldErrors: {} as Record<string, string>,
  }),
  getters: {
    isWorker: (state) => Boolean(state.user?.isWorker),
    isAdmin: (state) => Boolean(state.user?.isAdmin),
    inWorkerMode: (state) => Boolean(state.user?.isWorker) && state.mode === 'worker',
    home: (state) => homeFor(state.mode),
  },
  actions: {
    async login(dto: LoginDTO) {
      this.loading = true; this.error = null; this.fieldErrors = {}
      try {
        this.setSession(await signIn(dto))
        return true
      } catch (e: any) {
        this.fail(e, 'Não foi possível entrar. Tente novamente.')
        return false
      } finally { this.loading = false }
    },
    setSession({ access_token, user }: LoginResponse) {
      this.token = access_token
      this.user = user
      this.mode = loadMode(user)
      localStorage.setItem('tpf_token', access_token)
      localStorage.setItem('tpf_user', JSON.stringify(user))
    },
    fail(e: unknown, fallback: string) {
      const { message, fields } = apiError(e, fallback)
      this.error = message
      this.fieldErrors = fields
    },
    setMode(mode: AppMode) {
      this.mode = this.isWorker ? mode : 'client'
      localStorage.setItem('tpf_mode', this.mode)
    },
    logout() {
      this.token = null
      this.user = null
      this.mode = 'client'
      localStorage.removeItem('tpf_token')
      localStorage.removeItem('tpf_user')
      localStorage.removeItem('tpf_mode')
    },
    async activateWorker(dto: ActivateWorkerDTO) {
      this.loading = true; this.error = null; this.fieldErrors = {}
      try {
        this.setSession(await activateWorker(dto))
        this.setMode('worker')
        return true
      } catch (e: any) {
        this.fail(e, 'Não foi possível concluir o cadastro. Tente novamente.')
        return false
      } finally { this.loading = false }
    },
    async registerWorker(dto: RegisterWorkerDTO) {
      this.loading = true; this.error = null; this.fieldErrors = {}
      try { await workerSignUp(dto); return true }
      catch (e: any) { this.fail(e, 'Não foi possível concluir o cadastro. Tente novamente.'); return false }
      finally { this.loading = false }
    },
    async registerClient(dto: RegisterClientDTO) {
      this.loading = true; this.error = null; this.fieldErrors = {}
      try { await clientSignUp(dto); return true }
      catch (e: any) { this.fail(e, 'Não foi possível concluir o cadastro. Tente novamente.'); return false }
      finally { this.loading = false }
    },
  },
})
