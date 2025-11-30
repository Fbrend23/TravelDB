<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import ThemeToggle from './ThemeButton.vue';

const auth = useAuthStore()
const router = useRouter()

async function logout() {
    await auth.logout()
    router.push('/')
}
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar border-bottom">
        <div class="container-fluid">

            <!-- Logo -->
            <RouterLink to="/" class="navbar-brand fw-bold fs-4">
                TravelDB
            </RouterLink>

            <!-- if not connected -->
            <div v-if="!auth.isLoggedIn" class="d-flex ms-auto align-items-center gap-2">

                <RouterLink to="/login" class="btn btn-outline-secondary">
                    Se connecter
                </RouterLink>

                <RouterLink to="/register" class="btn btn-primary">
                    S'inscrire
                </RouterLink>
                <ThemeToggle />
            </div>

            <!-- if connected -->
            <div v-else class="d-flex ms-auto align-items-center gap-2">

                <!-- Username -->
                <span class="text-muted">
                    Bonjour, {{ auth.user?.username }}
                </span>

                <button class="btn btn-primary" @click="logout">
                    Déconnexion
                </button>
                <ThemeToggle />
            </div>
        </div>
    </nav>
</template>

<style scoped></style>
