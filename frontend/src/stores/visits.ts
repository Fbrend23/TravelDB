import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiGetVisits, apiAddVisit, apiDeleteVisit } from '@/api/visits'

type VisitApiResponse = {
  id: number
  country: string
  visited_at?: string
}

export interface Visit {
  id: number
  country: string
  visited_at?: string
}
export const useVisitsStore = defineStore('visits', () => {
  const visits = ref<Visit[]>([])
  const loading = ref(false)

  // Load visit from backend
  async function loadVisits() {
    loading.value = true
    try {
      const res = await apiGetVisits()
      visits.value = res.data.map((v: VisitApiResponse) => ({
        id: v.id,
        country: v.country,
        visited_at: v.visited_at,
      }))
    } catch (err) {
      console.error('Erreur chargement visites:', err)
    } finally {
      loading.value = false
    }
  }

  // add visit and update the list
  async function addVisit(country_iso3: string, date?: string) {
    try {
      await apiAddVisit(country_iso3, date)
      // list update
      await loadVisits()
    } catch (err) {
      throw err
    }
  }

  // delete a visited country
  async function deleteVisit(visitId: number) {
    try {
      await apiDeleteVisit(visitId)
      visits.value = visits.value.filter((v) => v.id !== visitId)
    } catch (err) {
      console.error('Erreur suppression visite:', err)
      throw err
    }
  }

  return {
    visits,
    loading,
    loadVisits,
    addVisit,
    deleteVisit,
  }
})
