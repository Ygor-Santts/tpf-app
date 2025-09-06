import { api } from '@infra/http'
import type { HealthCheck } from '@domain/health'

export async function getHealth(): Promise<HealthCheck> {
  const { data } = await api.get<HealthCheck>('/health-check')
  return data
}
