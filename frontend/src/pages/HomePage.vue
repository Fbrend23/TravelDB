<template>
    <div class="container-fluid p-0 h-100 d-flex flex-column">
        <!-- guest page -->
        <div v-if="!auth.isLoggedIn"
            class="hero-section h-100 position-relative d-flex align-items-center justify-content-center text-body-travel overflow-hidden">

            <video autoplay muted loop playsinline class="bg-video">
                <source src="/assets/travel.mp4" type="video/mp4">
                Votre navigateur ne supporte pas la vidéo.
            </video>

            <div class="overlay"></div>

            <div class="content position-relative text-center p-5 rounded-4 shadow-lg text-body-travel animate-fade-in-up"
                style="max-width: 700px; transform: rotate(-1deg); background-color: rgba(var(--travel-paper-rgb), 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.6);">
                <div class="visa position-absolute p-3 opacity-75 marker">
                    <div class="visa border border-4 rounded-circle d-flex align-items-center justify-content-center "
                        style="width: 80px; height: 80px; transform: rotate(15deg);">
                        <span class="fw-bold font-handwritten visa">✓</span>
                    </div>
                </div>

                <div class="mb-4">
                    <img :src="currentLogoSrc" height="80" alt="TravelDB Logo" />
                </div>

                <h1 class="fw-extrabold mb-2 display-4 text-primary text-uppercase" style="letter-spacing: -1px;">Votre
                    Monde</h1>
                <h2 class="mb-4 text-secondary font-handwritten display-6">votre carnet de voyage numérique</h2>
                <p class="text-muted mb-4 fs-5 px-4 mb-5">
                    Ne laissez plus vos souvenirs s'effacer. Marquez chaque pays, notez chaque aventure et visualisez
                    votre empreinte sur le globe.
                </p>
                <div class="d-flex justify-content-center gap-3 mt-4">
                    <RouterLink to="/login"
                        class="btn btn-outline-primary btn-lg px-4 rounded-pill font-handwritten fw-bold fs-4 border-2">
                        Se connecter
                    </RouterLink>
                    <RouterLink to="/register"
                        class="btn btn-primary btn-lg px-5 rounded-pill fw-bold d-flex align-items-center gap-2 font-handwritten shadow-travel text-uppercase"
                        style="letter-spacing: 1px;">
                        <span>S'inscrire</span> <i class="bi bi-airplane-fill"></i>
                    </RouterLink>
                </div>
            </div>
        </div>
        <!-- user connected-->
        <div v-else class="h-100 d-flex flex-column bg-gradient-travel" style="overflow: hidden;">
            <div class="container-fluid py-3 h-100 d-flex flex-column" style="overflow: hidden;">

                <div class="row g-0 flex-grow-1 mx-md-3 mb-md-3 mt-1 login-card-container animate-fade-in-up"
                    style="min-height: 0;">
                    <!-- Left Column (Map) - Styled as the 'Main Ticket' Section -->
                    <div class="col-md-9 col-lg-9 d-flex ticket-main shadow-travel position-relative p-2"
                        style="border-right: 2px dashed var(--travel-dashed-color);">
                        <div
                            class="w-100 h-100 position-relative z-1 rounded-4 overflow-hidden shadow-sm border border-travel">
                            <Map @show-visits="setSelectedVisits" />
                        </div>
                    </div>
                    <!-- Right Column (Sidebar) - Styled as 'Ticket Stub' -->
                    <div
                        class="col-md-3 col-lg-3 d-flex flex-column h-100 ticket-stub shadow-travel py-2 overflow-hidden">
                        <!-- form -->
                        <div class="p-3 pb-0 text-center flex-shrink-0">
                            <h5 class="text-uppercase text-muted-travel fw-bold small mb-1"
                                style="letter-spacing: 2px;">
                                Boarding Pass
                            </h5>
                            <div class="font-handwritten text-accent fs-3 lh-1">Mes Escales</div>
                            <div class="d-flex justify-content-center mt-2 opacity-50">
                                <i class="bi bi-airplane text-secondary" style="transform: rotate(45deg);"></i>
                            </div>
                        </div>

                        <div class="flex-shrink-0 pt-2 px-3 pb-2">
                            <div class="bg-paper p-3 rounded-3 border border-travel shadow-sm">
                                <AddVisitForm :visitToEdit="visitToEdit" @cancel-edit="cancelEdit"
                                    @success="onFormSuccess" />
                            </div>
                        </div>

                        <!-- country list-->
                        <div class="flex-grow-1 d-flex flex-column px-3 pb-3 " style="min-height: 0; overflow: hidden;">
                            <div class="h-100 bg-paper rounded-3 border border-travel shadow-sm overflow-hidden p-2">
                                <VisitList class="h-100" :country="currentCountryName" :visits="currentVisits"
                                    @edit="setVisitToEdit" />
                            </div>
                        </div>

                        <div class="px-3 pb-2 text-center opacity-50">
                            <small class="font-monospace text-uppercase text-muted-travel"
                                style="font-size: 0.6rem; letter-spacing: 2px;">TravelDB Official Record</small>
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
import { useThemeStore } from '@/stores/theme'
import { ref, watch, computed } from 'vue'

const auth = useAuthStore()
const themeStore = useThemeStore()
const logoPathLight = '/assets/logo/logo-light-mode.png';
const logoPathDark = '/assets/logo/logo-dark-mode.png';

const currentLogoSrc = computed(() => {
    // dark theme
    if (themeStore.currentTheme === 'dark') {
        return logoPathDark;
    }
    // light theme
    return logoPathLight;
});

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
    z-index: 1;
}

.content {
    z-index: 2;
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

.visa {
    color: #0077b6;
    border-color: #0077b6 !important;
    font-size: 6rem;
}

.marker {
    top: -10px;
    right: -10px;
}
</style>