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

//update a visit
export function apiUpdateVisit(id: number, country_code: string, visited_at?: string) {
  return api.put(`/visits/${id}`, {
    country: country_code,
    visited_at,
  })
}
