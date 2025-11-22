<template>
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="col-12 col-md-6 col-lg-4">
            <h2 class="text-center mb-4">Connexion</h2>

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
                </div>

                <!-- Backend errors -->
                <p v-if="errorMessage" class="text-danger mb-3">
                    {{ errorMessage }}
                </p>

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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref<string | null>(null)
const loading = ref(false)

// Traduction ultra simple des erreurs du validator
function translate(msg: string): string {
    if (msg.includes('credentials') || msg.includes('Invalid')) {
        return 'Email ou mot de passe incorrect'
    }
    if (msg.includes('email')) {
        return 'Veuillez saisir une adresse email valide'
    }
    return msg
}

/**
 * Submit login form
 */
async function submit() {
    errorMessage.value = null
    loading.value = true

    try {
        await auth.login({
            email: email.value,
            password: password.value,
        })

        router.push('/')
    } catch (error: unknown) {
        const err = error as AxiosError
        const data = err.response?.data as { message?: string, errors?: { message: string }[] }

        if (data?.errors) {
            errorMessage.value = data.errors.map((e) => translate(e.message)).join(', ')
        } else if (data?.message) {
            errorMessage.value = translate(data.message)
        } else {
            errorMessage.value = 'Une erreur est survenue'
        }
    } finally {
        loading.value = false
    }
}
</script>

<style scoped></style>
