<template>
    <div class="container d-flex justify-content-center align-items-center my-5">
        <div class="col-12 col-md-6 col-lg-4">

            <div v-if="verifying" class="text-center py-5">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Vérification...</span>
                </div>
                <p class="text-muted">Vérification du lien de sécurité...</p>
            </div>

            <div v-else-if="tokenError" class="text-center">
                <div class="alert alert-danger mb-4">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    {{ tokenError }}
                </div>
                <p class="text-muted">Le lien de réinitialisation a expiré ou est incorrect.</p>
                <router-link to="/forgot-password" class="btn btn-outline-primary">
                    Demander un nouveau lien
                </router-link>
            </div>

            <div v-else>
                <h2 class="text-center mb-4">Nouveau mot de passe</h2>

                <form @submit.prevent="submit">
                    <div class="mb-3">
                        <label class="form-label">Nouveau mot de passe</label>
                        <input v-model="password" type="password" class="form-control" required
                            placeholder="••••••••" />
                        <small class="text-muted">Min. 8 caractères</small>
                    </div>

                    <div v-if="errorMessage" class="alert alert-danger">
                        {{ errorMessage }}
                    </div>

                    <div v-if="success" class="alert alert-success">
                        Mot de passe modifié ! <router-link to="/login" class="fw-bold">Connectez-vous</router-link>
                    </div>

                    <button v-if="!success" class="btn btn-primary w-100" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        <span v-if="loading">Modification...</span>
                        <span v-else>Changer le mot de passe</span>
                    </button>
                </form>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiResetPassword, apiVerifyResetToken } from '@/api/auth'

const route = useRoute()
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const success = ref(false)


const verifying = ref(true)
const tokenError = ref<string | null>(null)

onMounted(async () => {
    const token = route.query.token as string
    const email = route.query.email as string

    if (!token || !email) {
        tokenError.value = "Lien invalide. Veuillez utiliser le lien reçu par e-mail."
        verifying.value = false
        return
    }

    try {
        await apiVerifyResetToken(email, token)
        verifying.value = false
    } catch (error) {

        tokenError.value = "Ce lien a expiré ou a déjà été utilisé."
        verifying.value = false
    }
})

async function submit() {
    loading.value = true
    errorMessage.value = ''

    const token = route.query.token as string
    const email = route.query.email as string

    try {
        await apiResetPassword({ token, email, password: password.value })
        success.value = true
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || "Une erreur est survenue lors de la modification."
    } finally {
        loading.value = false
    }
}
</script>