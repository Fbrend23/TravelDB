import { api } from './axios'

export function apiAddVisit(country_code: string, visited_at?: string) {
  return api.post('/visits', {
    country: country_code,
    visited_at,
  })
}

//Get user's visited country
export function apiGetVisits() {
  return api.get('/visits')
}

//Delete a visited country
export function apiDeleteVisit(id: number) {
  return api.delete(`/visits/${id}`)
}
