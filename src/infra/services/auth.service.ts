import { api } from '@infra/http'
import type { LoginDTO, LoginResponse, RegisterWorkerDTO } from '@domain/auth'
export async function signIn(payload: LoginDTO): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/sign-in', payload); return data
}
export async function workerSignUp(payload: RegisterWorkerDTO): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/worker/sign-up', payload); return data
}
