import { api } from '@infra/http'
import type { LoginDTO, LoginResponse, RegisterWorkerDTO, RegisterClientDTO, ActivateWorkerDTO } from '@domain/auth'

export async function signIn(payload: LoginDTO): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/sign-in', payload)
  return data
}

export async function workerSignUp(payload: RegisterWorkerDTO): Promise<void> {
  await api.post('/auth/worker/sign-up', payload)
}

export async function activateWorker(payload: ActivateWorkerDTO): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/worker/activate', payload)
  return data
}

export async function clientSignUp(payload: RegisterClientDTO): Promise<void> {
  await api.post('/auth/client/sign-up', payload)
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email })
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await api.post('/auth/reset-password', { token, password })
}

export async function deleteAccount(password: string): Promise<void> {
  await api.delete('/auth/me', { data: { password } })
}
