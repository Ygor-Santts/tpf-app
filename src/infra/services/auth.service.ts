import { api } from '@infra/http'
import type { LoginDTO, LoginResponseDTO, RegisterWorkerDTO } from '@domain/auth'

export async function signIn(payload: LoginDTO): Promise<LoginResponseDTO> {
  const { data } = await api.post<LoginResponseDTO>('/auth/sign-in', payload)
  return data
}

// The backend controller indicates a workerSignUp; adjust path if different
export async function workerSignUp(payload: RegisterWorkerDTO): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/worker/sign-up', payload)
  return data
}
