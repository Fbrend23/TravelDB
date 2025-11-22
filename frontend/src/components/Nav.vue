<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div class="container-fluid">
            <!-- Logo linking to the homepage -->
            <RouterLink to="/" class="navbar-brand fw-bold fs-4"> TravelDB </RouterLink>

            <div class="d-flex ms-auto">
                <!-- Navigation buttons -->
                <RouterLink to="/login" class="btn btn-outline-secondary me-2"> Se connecter </RouterLink>
                <RouterLink to="/register" class="btn btn-primary"> S'inscrire </RouterLink>
            </div>
        </div>
    </nav>
</template>

<style scoped></style>