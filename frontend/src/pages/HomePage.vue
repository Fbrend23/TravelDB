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
            <div class="container-fluid py-4">
                <div class="row">
                    <!-- Left Column -->
                    <div class="col-md-10">
                        <Map />
                    </div>

                    <!-- right column -->
                    <div class="col-md-2">
                        <AddVisitForm />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import Map from '@/components/Map.vue';
import AddVisitForm from '@/components/AddVisitForm.vue';
const auth = useAuthStore()
</script>

<style scoped></style>
