<template>
    <div class="map-container">
        <div ref="mapElement" class="map"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import L from 'leaflet'

const map = ref<L.Map | null>(null)
const mapElement = ref<HTMLDivElement | null>(null)

onMounted(() => {
    if (!mapElement.value) return

    map.value = L.map(mapElement.value, {
        zoomControl: true,
        scrollWheelZoom: true,
        worldCopyJump: false,
        maxBounds: [
            [-85, -180],
            [85, 180],
        ],
    }).setView([20, 0], 2)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.value)
})

onBeforeUnmount(() => {
    if (map.value) map.value.remove()
})
</script>

<style scoped>
.map-container {
    height: 80vh;
    width: 100%;
}

.map {
    height: 100%;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
}
</style>
