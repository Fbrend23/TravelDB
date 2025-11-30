<script setup lang="ts">

import Nav from '@/components/NavBar.vue'
import Footer from '@/components/FooterComponent.vue'
import { BApp } from 'bootstrap-vue-next'
import 'leaflet/dist/leaflet.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import { useThemeStore } from './stores/theme'
import "@/assets/scss/custom.scss";
import { createBootstrap } from 'bootstrap-vue-next'

const bootstrap = createBootstrap({
  global: {
    ripple: true,
  },
  components: {
    BButton: {
      rounded: 'pill',
      boxShadow: false,
    },
    BCard: {
      borderVariant: 'none',
      class: 'shadow-sm border-0',
    },
    BFormInput: {
      size: 'lg',
    },
    BFormSelect: {
      size: 'lg',
    },
    BNavbar: {
      shadow: true,
    }
  }
})
const themeStore = useThemeStore()
themeStore.initTheme()
</script>

<template>
  <div class="app-wrapper">
    <BApp>
      <header>
        <Nav />
      </header>
      <main class="main-content">
        <router-view />
      </main>
    </BApp>
    <Footer />
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>
