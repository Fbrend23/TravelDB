<template>
    <button class="btn btn-link nav-link d-flex align-items-center mx-1" @click="themeStore.toggleTheme()"
        aria-label="Changer le thème" title="Changer le thème (Clair/Sombre)">
        <i v-if="themeStore.currentTheme === 'dark'" class="bi bi-sun-fill fs-5"></i>

        <i v-else class="bi bi-moon-stars-fill fs-5"></i>
    </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
</script>