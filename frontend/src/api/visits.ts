import axios from 'axios'

export function apiAddVisit(country_code: string, visited_at?: string) {
  return axios.post('/visits', {
    country: country_code,
    visited_at,
  })
}
