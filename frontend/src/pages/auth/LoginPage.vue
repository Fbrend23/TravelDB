<template>
    <div class="container-fluid bg-gradient-travel d-flex justify-content-center align-items-center master">

        <div class="login-card-container animate-fade-in-up" style="max-width: 1080px; width: 100%;">
            <div class="row g-0">

                <div class="col-lg-8 p-4 p-md-5 ticket-main shadow-travel">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 class="text-uppercase text-muted-travel fw-bold small mb-1"
                                style="letter-spacing: 2px;">Boarding Pass</h5>
                            <h2 class="fw-extrabold text-primary mb-0 text-uppercase" style="letter-spacing: -1px;">
                                Connexion</h2>
                        </div>
                        <i class="bi bi-airplane-engines text-accent opacity-50 animate-float" style="font-size: 3rem;"></i>
                    </div>

                    <form @submit.prevent="submit">
                        <div class="mb-4">
                            <label class="form-label small fw-bold text-muted-travel text-uppercase"
                                style="letter-spacing: 1px;">Email Passager</label>
                            <div class="input-group custom-input-group rounded-3 overflow-hidden">
                                <span class="input-group-text border-0 pe-1 bg-transparent"><i
                                        class="bi bi-envelope text-primary"></i></span>
                                <input v-model="email" type="text"
                                    class="form-control border-0 shadow-none ps-2 text-body-travel fw-bold"
                                    placeholder="nom@voyage.com" required />
                            </div>
                        </div>

                        <div class="mb-4">
                            <div class="d-flex justify-content-between">
                                <label class="form-label small fw-bold text-muted-travel text-uppercase"
                                    style="letter-spacing: 1px;">Code d'accès</label>
                                <router-link to="/forgot-password"
                                    class="text-decoration-none small font-handwritten fw-bold text-accent">Oublié ?</router-link>
                            </div>
                            <div class="input-group custom-input-group rounded-3 overflow-hidden">
                                <span class="input-group-text border-0 pe-1 bg-transparent"><i
                                        class="bi bi-key text-primary"></i></span>
                                <input v-model="password" type="password"
                                    class="form-control border-0 shadow-none ps-2 text-body-travel fw-bold"
                                    placeholder="••••••••" required />
                            </div>
                        </div>

                        <div v-if="urlMessage"
                            :class="`alert alert-${urlVariant} mb-3 border-0 rounded-3 shadow-sm small`" role="alert">
                            <i class="bi bi-info-circle-fill me-2"></i>{{ urlMessage }}
                        </div>
                        <div v-if="errorMessage" class="alert alert-danger mb-3 border-0 rounded-3 shadow-sm small">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
                            <div v-if="showResendButton" class="mt-2 pt-2 border-top border-danger-subtle">
                                <button type="button" class="btn btn-sm btn-outline-danger w-100 rounded-pill"
                                    @click="handleResendEmail" :disabled="resendLoading">
                                    <span v-if="resendLoading" class="spinner-border spinner-border-sm me-1"></span>
                                    Renvoyer l'email
                                </button>
                            </div>
                        </div>

                        <div v-if="resendSuccessMessage"
                            class="alert alert-success mb-3 border-0 rounded-3 shadow-sm small">{{ resendSuccessMessage
                            }}</div>

                        <div class="d-grid mt-5">
                            <button
                                class="btn btn-primary btn-lg rounded-pill shadow fw-bold text-uppercase d-flex justify-content-between align-items-center px-4"
                                :disabled="loading">
                                <span>Embarquement</span>
                                <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                                <i v-else class="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    </form>

                    <div class="text-center mt-4">
                        <span class="text-muted-travel small">Nouveau voyageur ?</span>
                        <router-link to="/register"
                            class="fw-bold text-primary text-decoration-none ms-2 font-handwritten fs-5">Créer un
                            passeport</router-link>
                    </div>
                </div>

                <div class="col-lg-4 d-none d-lg-flex flex-column ticket-stub shadow-travel">

                    <div class="p-4 h-100 d-flex flex-column justify-content-between text-center">
                        <div class="opacity-50">
                            <img src="/assets/logo/logo-light-mode.png" height="50" class="mb-2 grayscale" alt="Logo" />
                        </div>

                        <div class="my-auto w-100">
                            <div class="row g-3 text-center">
                                <div class="col-6">
                                    <div class="small text-muted-travel text-uppercase" style="font-size: 0.7rem;">Vol
                                    </div>
                                    <div class="fw-bold font-monospace text-body-travel">TDB-001</div>
                                </div>
                                <div class="col-6">
                                    <div class="small text-muted-travel text-uppercase" style="font-size: 0.7rem;">Porte
                                    </div>
                                    <div class="fw-bold font-monospace text-body-travel">A12</div>
                                </div>
                                <div class="col-6">
                                    <div class="small text-muted-travel text-uppercase" style="font-size: 0.7rem;">Date
                                    </div>
                                    <div class="fw-bold font-monospace text-body-travel">JOUR J</div>
                                </div>
                                <div class="col-6">
                                    <div class="small text-muted-travel text-uppercase" style="font-size: 0.7rem;">Siège
                                    </div>
                                    <div class="fw-bold font-monospace text-body-travel">1A</div>
                                </div>
                            </div>
                        </div>

                        <div class="opacity-75 w-100 mx-auto d-flex flex-column align-items-center">
                            <div class="barcode w-50 mx-auto"></div>
                            <div class="text-center font-monospace small mt-2 text-muted-travel"
                                style="font-size: 0.6rem; letter-spacing: 3px;">8891 0029 1928</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import type { AxiosError } from 'axios'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)

const errorMessage = ref<string | null>(null)
const urlMessage = ref<string | null>(null)
const urlVariant = ref('info') // 'success', 'danger', 'info'

const showResendButton = ref(false)
const resendLoading = ref(false)
const resendSuccessMessage = ref<string | null>(null)

onMounted(() => {
    const msg = route.query.message as string
    const variant = route.query.variant as string
    if (msg) {

        if (msg === 'verification_sent') {
            urlMessage.value = "Inscription réussie ! Un e-mail de vérification vous a été envoyé."
            urlVariant.value = 'success'
        } else if (msg === 'verified_success') {
            urlMessage.value = "Votre compte a été vérifié avec succès ! Vous pouvez vous connecter."
            urlVariant.value = 'success'
        } else if (msg === 'already_verified') {
            urlMessage.value = "Votre compte est déjà vérifié."
            urlVariant.value = 'info'
        } else if (msg === 'invalid_link') {
            urlMessage.value = "Le lien de vérification est invalide ou a expiré."
            urlVariant.value = 'danger'
        } else if (msg === 'user_not_found') {
            urlMessage.value = "Utilisateur introuvable."
            urlVariant.value = 'danger'
        } else {
            urlMessage.value = msg
            urlVariant.value = variant || 'info'
        }
    }
})

function translate(msg: string): string {
    if (msg.includes('credentials') || msg.includes('Invalid')) {
        return 'Email ou mot de passe incorrect'
    }
    if (msg.includes('vérifier votre adresse')) {
        return 'Votre adresse email n\'a pas encore été vérifiée.'
    }
    return msg
}

async function submit() {
    errorMessage.value = null
    urlMessage.value = null
    resendSuccessMessage.value = null
    showResendButton.value = false
    loading.value = true

    try {
        await auth.login({
            email: email.value,
            password: password.value,
        })
        router.push('/')
    } catch (error: unknown) {
        const err = error as AxiosError
        const data = err.response?.data as { message?: string, code?: string }

        if (data?.message) {
            errorMessage.value = translate(data.message)

            if (err.response?.status === 403 || data.code === 'EMAIL_NOT_VERIFIED') {
                showResendButton.value = true
            }
        } else {
            errorMessage.value = 'Une erreur est survenue'
        }
    } finally {
        loading.value = false
    }
}

async function handleResendEmail() {
    resendLoading.value = true
    errorMessage.value = null
    resendSuccessMessage.value = null

    try {
        await auth.resendVerificationEmail(email.value)
        resendSuccessMessage.value = "Un nouvel e-mail a été envoyé ! Vérifiez votre boîte de réception."
        showResendButton.value = false
    } catch (error: unknown) {
        const err = error as AxiosError
        const data = err.response?.data as { message?: string, errors?: { message: string }[] }

        // Rate Limiting (429)
        if (err.response?.status === 429) {
            errorMessage.value = "Trop de tentatives. Veuillez patienter une minute avant de réessayer."
        }
        else if (data?.message) {
            errorMessage.value = translate(data.message)
        }
        else {
            errorMessage.value = "Impossible de renvoyer l'e-mail. Réessayez plus tard."
        }
        showResendButton.value = true
    } finally {
        resendLoading.value = false
    }
}
</script>

<style scoped>
.border-dashed {
    border-style: dashed !important;
}

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
</style>