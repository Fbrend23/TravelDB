<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import ThemeToggle from './ThemeButton.vue';
import { useThemeStore } from '@/stores/theme';
import { computed } from 'vue';

const auth = useAuthStore()
const themeStore = useThemeStore();
const router = useRouter()
const logoPathLight = '/assets/logo/logo-light-mode.png';
const logoPathDark = '/assets/logo/logo-dark-mode.png';

async function logout() {
    await auth.logout()
    router.push('/')
}

const currentLogoSrc = computed(() => {
    // dark theme
    if (themeStore.currentTheme === 'dark') {
        return logoPathDark;
    }
    // light theme
    return logoPathLight;
});
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar bg-paper shadow-sm sticky-top border-bottom border-travel">
        <div class="container-fluid px-4">
            <!-- Logo -->
            <RouterLink to="/" class="navbar-brand d-flex align-items-center gap-2">
                <div class="position-relative">
                    <div class="position-absolute top-50 start-50 translate-middle">
                    </div>
                    <img :src="currentLogoSrc" alt="TravelDB" height="52" class="position-relative"
                        style="transform: rotate(-5deg);" />
                </div>
            </RouterLink>
            <!-- if not connected -->
            <div v-if="!auth.isLoggedIn" class="d-flex ms-auto align-items-center gap-3">
                <RouterLink to="/login"
                    class="btn btn-link text-decoration-none text-muted-travel fw-bold font-handwritten fs-5">
                    Se connecter
                </RouterLink>
                <RouterLink to="/register" class="btn btn-primary rounded-pill px-4 shadow-sm fw-bold font-handwritten">
                    S'inscrire
                </RouterLink>
                <ThemeToggle />
            </div>
            <!-- if connected -->
            <div v-else class="d-flex ms-auto align-items-center gap-3">
                <!-- Username -->
                <span class="text-muted-travel fw-bold font-handwritten fs-5 d-none d-md-block">
                    Bonjour, {{ auth.user?.username }}
                </span>
                <button class="btn btn-outline-danger rounded-pill px-4 btn-sm fw-bold" @click="logout">
                    Déconnexion
                </button>
                <ThemeToggle />
            </div>
        </div>
    </nav>
</template>

<style scoped></style>
