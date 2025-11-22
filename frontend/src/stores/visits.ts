import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiGetVisits, apiAddVisit } from '@/api/visits'

type VisitApiResponse = {
  country: string
  visited_at?: string
}
export const useVisitsStore = defineStore('visits', () => {
  const visits = ref<string[]>([])
  const loading = ref(false)

  // Load visit from backend
  async function loadVisits() {
    loading.value = true
    try {
      const res = await apiGetVisits()
      visits.value = res.data.map((v: VisitApiResponse) => v.country)
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

  return {
    visits,
    loading,
    loadVisits,
    addVisit,
  }
})
