import { api } from '@infra/http'
import type { State, City } from '@domain/marketplace'
export async function getStates(): Promise<State[]> { const { data } = await api.get('/locales/states'); return data }
export async function getCitiesByState(code: string): Promise<City[]> { const { data } = await api.get(`/locales/state/${code}/cities`); return data }
