<script setup lang="ts">

import Nav from '@/components/Nav.vue'
import { BApp } from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'leaflet/dist/leaflet.css'
</script>

<template>
  <BApp>

    <header>
      <Nav />
    </header>

    <main>
      <router-view />
    </main>
  </BApp>
</template>

<style scoped></style>
