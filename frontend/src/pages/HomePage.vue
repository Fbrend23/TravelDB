<template>
    <div class="container-fluid p-0 bg-light">

        <!-- guest page -->
        <div v-if="!auth.isLoggedIn" class="text-center py-5">
            <h1 class="fw-bold mb-3">Bienvenue sur TravelDB</h1>

            <p class="text-muted mb-4">
                Crée un compte pour enregistrer les pays que tu as visités et afficher ta carte du monde personnalisée
            </p>

            <RouterLink to="/register" class="btn btn-primary btn-lg me-2">
                S'inscrire
            </RouterLink>

            <RouterLink to="/login" class="btn btn-outline-secondary btn-lg">
                Se connecter
            </RouterLink>
        </div>

        <!-- user connected-->
        <div v-else class="p-0 mt-4">
            <h2 class="fw-bold text-center">Bonjour {{ auth.user?.username }}</h2>

            <!-- ToDo leaflet -->
            <div class="mt-4" style="height: 80vh; width: 100%;">
                <!-- leaflet here -->
                <div class="bg-light h-100 w-100 d-flex justify-content-center align-items-center">
                    <span class="text-muted">Carte en cours de chargement...</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<style scoped>
h1 {
    font-size: 2.4rem;
}
</style>
