import { api } from './axios'

export function apiAddVisit(country_code: string, visited_at?: string) {
  return api.post('/visits', {
    country: country_code,
    visited_at,
  })
}
