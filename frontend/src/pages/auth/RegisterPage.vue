<template>
    <div class="container d-flex justify-content-center align-items-center my-5">
        <div class="col-12 col-md-6 col-lg-4">
            <h2 class="text-center mb-4">Création de compte</h2>

            <form @submit.prevent="submit">
                <!-- Username -->
                <div class="mb-3">
                    <label class="form-label">Nom du compte</label>
                    <input v-model="username" type="text" class="form-control" required />
                    <small class="text-muted d-block mt-1">
                        Entre 3 et 32 caractères
                    </small>
                </div>

                <!-- Email -->
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input v-model="email" type="text" class="form-control" required />
                </div>

                <!-- Password -->
                <div class="mb-3">
                    <label class="form-label">Mot de passe</label>
                    <input v-model="password" type="password" class="form-control" required />
                    <small class="text-muted d-block mt-1">
                        Minimum 8 caractères
                    </small>
                </div>

                <!-- Error message -->
                <p v-if="errorMessage" class="text-danger mb-3">
                    {{ errorMessage }}
                </p>

                <!-- Submit -->
                <button class="btn btn-primary w-100" :disabled="loading">
                    <span v-if="loading">Création du compte...</span>
                    <span v-else>Créer le compte</span>
                </button>
            </form>

            <p class="text-center mt-3">
                Déjà inscrit ?
                <router-link to="/login">Se connecter</router-link>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'

const auth = useAuthStore()
const router = useRouter()

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

        // auto login
        await auth.login({
            email: email.value,
            password: password.value,
        })

        router.push('/')
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

<style scoped></style>
