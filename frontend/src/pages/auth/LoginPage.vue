<template>
    <main class="">
        <div class="contaier">
            <h1 class="">Connexion</h1>

            <!-- Alerte d’erreur -->
            <div v-if="auth.error" class="alert alert-danger" role="alert">
                {{ auth.error }}
            </div>

            <form @submit.prevent="submit" novalidate class="needs-validation">
                <!-- Email -->
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input id="email" type="email" class="form-control" v-model="email" autocomplete="email"
                        placeholder="vous@exemple.com" required />
                    <div class="form-text">Utilisez l’email de votre compte.</div>
                </div>

                <!-- Mot de passe -->
                <div class="mb-3">
                    <label for="password" class="form-label">Mot de passe</label>
                    <div class="input-group">
                        <input id="password" :type="showPassword ? 'text' : 'password'" class="form-control"
                            v-model="password" autocomplete="current-password" placeholder="Votre mot de passe"
                            required />
                        <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword"
                            :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'">
                            {{ showPassword ? 'Masquer' : 'Afficher' }}
                        </button>
                    </div>
                </div>

                <!-- Options -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="remember" v-model="remember">
                        <label class="form-check-label" for="remember">
                            Se souvenir de moi
                        </label>
                    </div>
                    <router-link class="link-secondary" to="/login">Mot de passe oublié ?</router-link>
                </div>

                <!-- Bouton -->
                <button class="btn btn-primary w-100" type="submit" :disabled="isDisabled">
                    <span v-if="auth.loading" class="spinner-border spinner-border-sm me-2" role="status"
                        aria-hidden="true"></span>
                    <span v-if="auth.loading">Connexion…</span>
                    <span v-else>Se connecter</span>
                </button>
            </form>

            <!-- Pied de carte -->
            <div class="text-center mt-4 text-secondary">
                Pas encore de compte ?
                <router-link to="/register" class="link-secondary">S'inscrire</router-link>
            </div>



            <!-- Lien retour accueil -->
            <div class="text-center mt-3">
                <router-link to="/" class="link-secondary">&larr; Retour à l’accueil</router-link>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

/*
Page de connexion avec pinia
*/

//formulaire
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const remember = ref(true)

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

onMounted(() => { auth.clearError() })

function validate(): string | null {
    if (!email.value.trim()) return 'Veuillez saisir votre email.'
    if (!/.+@.+\..+/.test(email.value)) return 'Format d’email invalide.'
    if (!password.value) return 'Veuillez saisir votre mot de passe.'
    return null
}

async function submit() {
    auth.clearError()
    const localError = validate()
    if (localError) {
        auth.error = localError
        return
    }
    try {
        await auth.login({ email: email.value.trim(), password: password.value })
        const next = (route.query.next as string) || '/app'
        router.replace(next)
    } catch {
    }
}
//Bouton désactivé si invalide ou en chargement
const isDisabled = computed(() => auth.loading || !email.value || !password.value)
</script>

<style scoped></style>