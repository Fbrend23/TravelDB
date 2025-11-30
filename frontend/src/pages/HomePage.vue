<template>
    <div class="container-fluid p-0 bg-light">

        <!-- guest page -->
        <div v-if="!auth.isLoggedIn" class="text-center py-5">
            <h1 class="fw-bold mb-3">Bienvenue sur TravelDB</h1>

            <p class="text-muted mb-4">
                Crée un compte pour enregistrer les pays que tu as visités et afficher ta carte du monde personnalisée
            </p>

            <RouterLink to="/register" class="btn btn-primary btn-lg me-2">
                S'inscrire
            </RouterLink>

            <RouterLink to="/login" class="btn btn-outline-secondary btn-lg">
                Se connecter
            </RouterLink>
        </div>

        <!-- user connected-->
        <div v-else class="">
            <div class="container-fluid py-4">
                <div class="row">

                    <!-- Left Column -->
                    <div class="col-md-10 d-flex mt-1">
                        <div class="w-100" style="height: 80vh;">
                            <Map @show-visits="setSelectedVisits" />
                        </div>
                    </div>

                    <!-- right column -->
                    <div class="col-md-2 d-flex flex-column pt-2 pb-2" style="height: 80vh;">
                        <!-- form -->
                        <div class="flex-shrink-0 mt-1 pt-4">
                            <AddVisitForm />
                        </div>
                        <!-- country list-->
                        <div class="flex-grow-1 mt-1 d-flex flex-column overflow-hidden pb-4">
                            <VisitList :country="currentCountryName" :visits="currentVisits"
                                :countryISO3="currentCountryISO3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import Map from '@/components/MapComponent.vue';
import AddVisitForm from '@/components/AddVisitForm.vue';
import VisitList from "@/components/VisitList.vue"
import { useVisitsStore, type Visit } from "@/stores/visits"
import { ref, watch } from 'vue'

const auth = useAuthStore()
const currentCountryName = ref<string>('')
const currentCountryISO3 = ref<string>('')
const currentVisits = ref<Visit[]>([])
const visitsStore = useVisitsStore()

function setSelectedVisits(payload: { countryName: string; countryISO3: string; visits: Visit[] }) {
    currentCountryName.value = payload.countryName
    currentCountryISO3.value = payload.countryISO3
    currentVisits.value = payload.visits
}
watch(
    () => visitsStore.visits,
    (newVisits) => {
        if (!currentCountryISO3.value) return

        currentVisits.value = newVisits.filter(
            v => v.country === currentCountryISO3.value
        )
    },
    { deep: true }
)
</script>

<style scoped></style>
