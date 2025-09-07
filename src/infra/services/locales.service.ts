import { api } from '@infra/http'
import type { State, City } from '@domain/marketplace'

// Some backends return states as { id, name } instead of { code, name }.
// Normalize here so the rest of the app can rely on `code`.
export async function getStates(): Promise<State[]> {
  const { data } = await api.get('/locales/states')
  return (data || []).map((s: any) => ({ code: s.code ?? s.id, name: s.name }))
}

export async function getCitiesByState(code: string): Promise<City[]> {
  const { data } = await api.get(`/locales/state/${code}/cities`)
  return data
}
