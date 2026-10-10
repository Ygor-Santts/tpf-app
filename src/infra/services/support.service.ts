import { api } from '@infra/http'

export type SupportTopic = 'duvida' | 'problema' | 'conta' | 'denuncia' | 'sugestao' | 'outro'

export interface SupportMessageDTO {
  name: string
  email: string
  topic: SupportTopic | ''
  message: string
}

export async function sendSupportMessage(payload: SupportMessageDTO): Promise<void> {
  await api.post('/support', payload)
}
