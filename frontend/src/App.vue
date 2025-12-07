<script setup lang="ts">

import Nav from '@/components/NavBar.vue'
import Footer from '@/components/FooterComponent.vue'
import { BApp } from 'bootstrap-vue-next'
import 'leaflet/dist/leaflet.css'
import { useThemeStore } from './stores/theme'
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
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
