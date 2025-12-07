<template>
    <div class="container-fluid p-0 h-100 d-flex flex-column">
        <!-- guest page -->
        <div v-if="!auth.isLoggedIn"
            class="hero-section h-100 position-relative d-flex align-items-center justify-content-center text-white">
            <video autoplay muted loop playsinline class="bg-video">
                <source src="/assets/travel.mp4" type="video/mp4">
                Votre navigateur ne supporte pas la vidéo.
            </video>
            <div class="overlay"></div>
            <div class="content position-relative text-center p-5 rounded-4 shadow-lg bg-paper text-body-travel"
                style="max-width: 700px; transform: rotate(-1deg);">
                <div class="visa position-absolute p-3 opacity-75 marker">
                    <div class="visa border border-4 rounded-circle d-flex align-items-center justify-content-center "
                        style="width: 80px; height: 80px; transform: rotate(15deg);">
                        <span class="fw-bold font-handwritten visa">✓</span>
                    </div>
                </div>
                <h1 class="fw-extrabold mb-2 display-4 text-primary text-uppercase" style="letter-spacing: -1px;">Votre
                    Monde</h1>
                <h2 class="mb-4 text-secondary font-handwritten display-6">votre carnet de voyage numérique</h2>
                <p class="text-muted mb-4 fs-5 px-4">
                    Ne laissez plus vos souvenirs s'effacer. Marquez chaque pays, notez chaque aventure et visualisez
                    votre empreinte sur le globe.
                </p>
                <div class="d-flex justify-content-center gap-3 mt-4">
                    <RouterLink to="/login"
                        class="btn btn-outline btn-lg px-4 rounded-pill font-handwritten fw-bold fs-4">
                        J'ai un compte
                    </RouterLink>
                    <RouterLink to="/register"
                        class="btn btn-primary btn-lg px-5 rounded-pill fw-bold d-flex align-items-center gap-2 font-handwritten">
                        <span>S'inscrire</span>
                    </RouterLink>
                </div>
            </div>
        </div>
        <!-- user connected-->
        <div v-else class="h-100 d-flex flex-column" style="background-color: var(--bs-body-bg); overflow: hidden;">
            <div class="container-fluid py-3 h-100 d-flex flex-column" style="overflow: hidden;">

                <div class="row g-0 flex-grow-1 shadow-lg rounded-4 overflow-hidden border border-travel border-4 mx-md-3 mb-md-3 mt-1"
                    style="min-height: 0;">
                    <!-- Left Column -->
                    <div class="col-md-9 col-lg-9 d-flex bg-paper position-relative p-2">
                        <div class="w-100 h-100 position-relative z-1 p-2">
                            <Map @show-visits="setSelectedVisits" />
                        </div>
                    </div>
                    <!-- right column -->
                    <div class="col-md-3 col-lg-3 d-flex flex-column h-100 boarding-pass py-2 overflow-hidden">
                        <!-- form -->
                        <div class="p-3 pb-0 text-center flex-shrink-0">
                            <h5 class="text-uppercase text-muted fw-bold small mb-1" style="letter-spacing: 2px;">
                                Boarding Pass
                            </h5>
                            <div class="font-handwritten text-primary fs-3 lh-1">Mes Escales</div>
                            <hr class="border-secondary opacity-25 mx-4 mt-2 mb-0">
                        </div>

                        <div class="flex-shrink-0 pt-2 px-3 pb-2">
                            <div class="bg-paper p-3 rounded-3 border">
                                <AddVisitForm :visitToEdit="visitToEdit" @cancel-edit="cancelEdit"
                                    @success="onFormSuccess" />
                            </div>
                        </div>

                        <!-- country list-->
                        <div class="flex-grow-1 d-flex flex-column px-3 pb-3 " style="min-height: 0; overflow: hidden;">
                            <VisitList class="h-100" :country="currentCountryName" :visits="currentVisits"
                                @edit="setVisitToEdit" />
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
const visitToEdit = ref<Visit | null>(null)

function setSelectedVisits(payload: { countryName: string; countryISO3: string; visits: Visit[] }) {
    currentCountryName.value = payload.countryName
    currentCountryISO3.value = payload.countryISO3
    currentVisits.value = payload.visits
    cancelEdit()
}

function setVisitToEdit(visit: Visit) {
    visitToEdit.value = visit
}

function cancelEdit() {
    visitToEdit.value = null
}

function onFormSuccess() {
    visitToEdit.value = null
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

<style scoped>
.overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 50, 80, 0.3), rgba(0, 0, 0, 0.2));
}

.visa {
    color: #0077b6;
    border-color: #0077b6 !important;
    font-size: 6rem;
}

.bg-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;

    z-index: 0;
}

.marker {
    top: -10px;
    right: -10px;
}
</style>