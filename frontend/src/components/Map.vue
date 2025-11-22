<template>
    <div class="map-container">
        <div ref="mapElement" class="map"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import L from 'leaflet'
import { useVisitsStore } from '@/stores/visits'

const visitsStore = useVisitsStore()
const map = ref<L.Map | null>(null)
const mapElement = ref<HTMLDivElement | null>(null)
let geoJsonLayer: L.GeoJSON | null = null

// Color visited country
function styleCountry(feature: any) {
    const iso = feature.id
    const isVisited = visitsStore.visits.includes(iso)

    return {
        color: '#999',
        weight: 1,
        fillColor: isVisited ? '#2ecc71' : '#d9d9d9',
        fillOpacity: isVisited ? 0.8 : 0.4,
    }
}

// Refresh colors
function refreshMapColors() {
    if (geoJsonLayer) {
        geoJsonLayer.setStyle(styleCountry)
    }
}

onMounted(async () => {
    if (!mapElement.value) return

    // load user's visits
    await visitsStore.loadVisits()

    // iniialise map
    map.value = L.map(mapElement.value, {
        zoomControl: true,
        scrollWheelZoom: true,
        worldCopyJump: false,
        maxBounds: [
            [-85, -180],
            [85, 180],
        ],
        maxBoundsViscosity: 1.0,
    }).setView([20, 0], 2)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.value)

    // load geojson data
    const geojson = await fetch('/countries.geo.json').then(r => r.json())

    geoJsonLayer = L.geoJSON(geojson, {
        style: styleCountry,
    }).addTo(map.value)

    // change color when data refresh
    watch(
        () => visitsStore.visits,
        () => refreshMapColors()
    )
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
