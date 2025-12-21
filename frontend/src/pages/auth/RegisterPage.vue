<template>
    <div class="container-fluid bg-gradient-travel d-flex justify-content-center align-items-center master">
        <div class="login-card-container animate-fade-in-up" style="max-width: 1080px; width: 100%;">
            <div class="row g-0">

                <!-- Main Form Section -->
                <div class="col-lg-8 p-4 p-md-5 ticket-main shadow-travel">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 class="text-uppercase text-muted-travel fw-bold small mb-1"
                                style="letter-spacing: 2px;">Application</h5>
                            <h2 class="fw-extrabold text-primary mb-0 text-uppercase" style="letter-spacing: -1px;">
                                Passeport</h2>
                        </div>
                        <i class="bi bi-passport text-accent opacity-50 animate-float" style="font-size: 3rem;"></i>
                    </div>

                    <form @submit.prevent="submit">
                        <!-- Username -->
                        <div class="mb-4">
                            <label class="form-label small fw-bold text-muted-travel text-uppercase"
                                style="letter-spacing: 1px;" for="username">Identité (Nom d'utilisateur)</label>
                            <div class="input-group custom-input-group rounded-3 overflow-hidden">
                                <span class="input-group-text border-0 pe-1 bg-transparent"><i
                                        class="bi bi-person-badge text-primary"></i></span>
                                <input id="username" v-model="username" type="text"
                                    class="form-control border-0 shadow-none ps-2 text-body-travel fw-bold"
                                    placeholder="Voyageur" required />
                            </div>
                            <small class="text-muted-travel opacity-75 d-block mt-1 small ms-1"
                                style="font-size: 0.75rem;">
                                Entre 3 et 32 caractères
                            </small>
                        </div>

                        <!-- Email -->
                        <div class="mb-4">
                            <label class="form-label small fw-bold text-muted-travel text-uppercase"
                                style="letter-spacing: 1px;" for="email">Email de contact</label>
                            <div class="input-group custom-input-group rounded-3 overflow-hidden">
                                <span class="input-group-text border-0 pe-1 bg-transparent"><i
                                        class="bi bi-envelope text-primary"></i></span>
                                <input id="email" v-model="email" type="text"
                                    class="form-control border-0 shadow-none ps-2 text-body-travel fw-bold"
                                    placeholder="nom@voyage.com" required />
                            </div>
                        </div>

                        <!-- Password -->
                        <div class="mb-4">
                            <label class="form-label small fw-bold text-muted-travel text-uppercase"
                                style="letter-spacing: 1px;" for="password">Code Secret</label>
                            <div class="input-group custom-input-group rounded-3 overflow-hidden">
                                <span class="input-group-text border-0 pe-1 bg-transparent"><i
                                        class="bi bi-shield-lock text-primary"></i></span>
                                <input id="password" v-model="password" type="password"
                                    class="form-control border-0 shadow-none ps-2 text-body-travel fw-bold"
                                    placeholder="••••••••" required />
                            </div>
                            <small class="text-muted-travel opacity-75 d-block mt-1 small ms-1"
                                style="font-size: 0.75rem;">
                                Minimum 8 caractères
                            </small>
                        </div>

                        <!-- Error message -->
                        <div v-if="errorMessage" class="alert alert-danger mb-3 border-0 rounded-3 shadow-sm small">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
                        </div>

                        <!-- Submit -->
                        <div class="d-grid mt-5">
                            <button
                                class="btn btn-primary btn-lg rounded-pill shadow fw-bold text-uppercase d-flex justify-content-between align-items-center px-4"
                                :disabled="loading">
                                <span>Demander mon Passeport</span>
                                <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                                <i v-else class="bi bi-check-circle"></i>
                            </button>
                        </div>
                    </form>

                    <div class="text-center mt-4">
                        <span class="text-muted-travel small">Déjà un passeport ?</span>
                        <router-link to="/login"
                            class="fw-bold text-primary text-decoration-none ms-2 font-handwritten fs-5">Accéder à
                            l'embarquement</router-link>
                    </div>
                </div>

                <!-- Stub / Decorative Section -->
                <div class="col-lg-4 d-none d-lg-flex flex-column ticket-stub shadow-travel">
                    <div class="p-4 h-100 d-flex flex-column justify-content-between text-center">
                        <div class="opacity-50">
                            <img :src="currentLogoSrc" height="50" class="mb-2 grayscale" alt="Logo" />
                        </div>

                        <div class="my-auto w-100 position-relative">
                            <div class="border border-2 border-primary rounded-circle d-inline-flex align-items-center justify-content-center p-3 opacity-25"
                                style="width: 150px; height: 150px; transform: rotate(-15deg);">
                                <div class="text-uppercase fw-bold text-primary text-center"
                                    style="letter-spacing: 2px; font-size: 0.8rem;">
                                    Visa<br>Authorized<br>TravelDB
                                </div>
                            </div>
                            <div class="text-center font-monospace small mt-4 text-muted-travel text-uppercase"
                                style="font-size: 0.6rem; letter-spacing: 3px;">Document Officiel</div>
                        </div>

                        <div class="opacity-75 w-100 mx-auto d-flex flex-column align-items-center">
                            <div class="barcode w-50 mx-auto"></div>
                            <div class="text-center font-monospace small mt-2 text-muted-travel"
                                style="font-size: 0.6rem; letter-spacing: 3px;">NEW MEMBER REGISTRY</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import type { AxiosError } from 'axios'

const auth = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()

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

//forms data
const username = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref<string | null>(null)
const loading = ref(false)
const emailValidFormat = computed(() =>
    /^[^@]+@[^@]+\.[^@]+$/.test(email.value)
)
type ApiErrorResponse = {
    errors?: { message: string }[]
    message?: string
}


/**
 * Submits the registration form
 */
async function submit() {
    errorMessage.value = null
    loading.value = true


    // Frontend email validation
    if (!emailValidFormat.value) {
        errorMessage.value = "Veuillez saisir une adresse email valide"
        loading.value = false
        return
    }
    try {
        await auth.register({
            username: username.value,
            email: email.value,
            password: password.value,
        })
        router.push({ path: '/login', query: { message: 'verification_sent', variant: 'success' } })
    } catch (error: unknown) {
        const err = error as AxiosError

        const data = err.response?.data as ApiErrorResponse

        if (data?.errors) {
            errorMessage.value = data.errors
                .map((e) => {
                    let msg = e.message

                    if (msg.includes('username')) {
                        msg = "Ce nom d'utilisateur est déjà utilisé"
                    }

                    if (msg.includes('email')) {
                        msg = "Cette adresse email est déjà utilisée"
                    }

                    return msg
                })
                .join(', ')
        }
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.barcode {
    height: 40px;
    background-size: 100% 100%;
    background-image: linear-gradient(to right,
            #333 0%, #333 2%, transparent 2%, transparent 4%,
            #333 4%, #333 5%, transparent 5%, transparent 6%,
            #333 6%, #333 9%, transparent 9%, transparent 10%,
            #333 10%, #333 12%, transparent 12%, transparent 14%,
            #333 14%, #333 18%, transparent 18%, transparent 19%,
            #333 19%, #333 20%, transparent 20%, transparent 22%,
            #333 22%, #333 24%, transparent 24%, transparent 26%,
            #333 26%, #333 30%, transparent 30%, transparent 31%,
            #333 31%, #333 33%, transparent 33%, transparent 35%,
            #333 35%, #333 38%, transparent 38%, transparent 40%,
            #333 40%, #333 42%, transparent 42%, transparent 44%,
            #333 44%, #333 50%, transparent 50%, transparent 52%,
            #333 52%, #333 55%, transparent 55%, transparent 58%,
            #333 58%, #333 60%, transparent 60%, transparent 62%,
            #333 62%, #333 68%, transparent 68%, transparent 70%,
            #333 70%, #333 75%, transparent 75%, transparent 78%,
            #333 78%, #333 80%, transparent 80%, transparent 82%,
            #333 82%, #333 86%, transparent 86%, transparent 88%,
            #333 88%, #333 92%, transparent 92%, transparent 95%,
            #333 95%, #333 98%, transparent 98%, transparent 100%);
}

.grayscale {
    filter: grayscale(100%);
    opacity: 0.6;
}

.master {
    flex: 1
}
</style>
