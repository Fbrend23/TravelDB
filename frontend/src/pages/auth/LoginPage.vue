<template>
    <div class="container-fluid bg-surface d-flex justify-content-center align-items-center py-5 h-100 master">
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card shadow-sm border-0 rounded-4 p-4">
                <h2 class="text-center mb-4 fw-bold" style="font-family: 'Montserrat', sans-serif;">Connexion</h2>

                <form @submit.prevent="submit">
                    <!-- Email -->
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input v-model="email" type="text" class="form-control" required />
                    </div>

                    <!-- Password -->
                    <div class="mb-3">
                        <label class="form-label">Mot de passe</label>
                        <input v-model="password" type="password" class="form-control" required />
                        <p class="text-center mt-3">
                            <router-link to="/forgot-password">Mot de passe oublié ?</router-link>
                        </p>
                    </div>

                    <!-- Backend errors -->
                    <div v-if="urlMessage" :class="`alert alert-${urlVariant} mb-3`" role="alert">
                        {{ urlMessage }}
                    </div>
                    <div v-if="errorMessage" class="alert alert-danger mb-3">
                        {{ errorMessage }}
                        <!-- Mail resend button -->
                        <div v-if="showResendButton" class="mt-2 pt-2 border-top border-danger-subtle">
                            <button type="button" class="btn btn-sm btn-outline-danger w-100" @click="handleResendEmail"
                                :disabled="resendLoading">
                                <span v-if="resendLoading" class="spinner-border spinner-border-sm me-1"></span>
                                Renvoyer l'email de vérification
                            </button>
                        </div>
                    </div>

                    <div v-if="resendSuccessMessage" class="alert alert-success mb-3">
                        {{ resendSuccessMessage }}
                    </div>
                    <!-- Submit -->
                    <button class="btn btn-primary w-100" :disabled="loading">
                        <span v-if="loading">Connexion...</span>
                        <span v-else>Se connecter</span>
                    </button>
                </form>

                <p class="text-center mt-3">
                    Pas encore de compte ?
                    <router-link to="/register">Créer un compte</router-link>
                </p>
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
.master {
    flex: 1
}
</style>