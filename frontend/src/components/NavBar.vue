<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import ThemeToggle from './ThemeButton.vue'
import { useThemeStore } from '@/stores/theme'
import { computed } from 'vue'

const auth = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()
const logoPathLight = '/assets/logo/logo-light-mode.png'
const logoPathDark = '/assets/logo/logo-dark-mode.png'

async function logout() {
  await auth.logout()
  router.push('/')
}

const currentLogoSrc = computed(() => {
  // dark theme
  if (themeStore.currentTheme === 'dark') {
    return logoPathDark
  }
  // light theme
  return logoPathLight
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar border-bottom">
    <div class="container-fluid">
      <!-- Logo -->
      <RouterLink to="/" class="navbar-brand fw-bold fs-4">
        <img :src="currentLogoSrc" alt="TravelDB" height="52" />
      </RouterLink>

      <!-- if not connected -->
      <div v-if="!auth.isLoggedIn" class="d-flex ms-auto align-items-center gap-2">
        <RouterLink to="/login" class="btn btn-outline-secondary"> Se connecter </RouterLink>

        <RouterLink to="/register" class="btn btn-primary"> S'inscrire </RouterLink>
        <ThemeToggle />
      </div>

      <!-- if connected -->
      <div v-else class="d-flex ms-auto align-items-center gap-2">
        <!-- Username -->
        <span class="text-muted"> Bonjour, {{ auth.user?.username }} </span>

        <button class="btn btn-primary" @click="logout">Déconnexion</button>
        <ThemeToggle />
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
