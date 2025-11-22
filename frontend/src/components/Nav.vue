<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
    await auth.logout()
    router.push('/login')
}
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div class="container-fluid">

            <!-- Logo -->
            <RouterLink to="/" class="navbar-brand fw-bold fs-4">
                TravelDB
            </RouterLink>

            <!-- if not connected -->
            <div v-if="!auth.isLoggedIn" class="d-flex ms-auto">
                <RouterLink to="/login" class="btn btn-outline-secondary me-2">
                    Se connecter
                </RouterLink>

                <RouterLink to="/register" class="btn btn-primary">
                    S'inscrire
                </RouterLink>
            </div>

            <!-- if connected -->
            <div v-else class="d-flex ms-auto align-items-center gap-3">

                <!-- Username -->
                <span class="text-muted">
                    Bonjour, {{ auth.user?.username }}
                </span>

                <button class="btn btn-primary" @click="logout">
                    Déconnexion
                </button>

            </div>
        </div>
    </nav>
</template>

<style scoped></style>
