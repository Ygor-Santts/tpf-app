import { api } from '@infra/http'

export type SupportTopic = 'duvida' | 'problema' | 'conta' | 'denuncia' | 'sugestao' | 'outro'

export interface SupportMessageDTO {
  name: string
  email: string
  topic: SupportTopic | ''
  message: string
}

// False while the server has no inbox set up for support messages.
export async function supportAvailable(): Promise<boolean> {
  const { data } = await api.get<{ available: boolean }>('/support')
  return data.available
}

export async function sendSupportMessage(payload: SupportMessageDTO): Promise<void> {
  await api.post('/support', payload)
}
