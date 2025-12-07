<template>
  <div class="map-container">
    <div ref="mapElement" class="map"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import L from 'leaflet'
import { useVisitsStore } from '@/stores/visits'
import type { Feature, Geometry } from 'geojson'
import countries from 'i18n-iso-countries'
import fr from 'i18n-iso-countries/langs/fr.json'
import type { Visit } from '@/stores/visits'
countries.registerLocale(fr)

const visitsStore = useVisitsStore()
const map = ref<L.Map | null>(null)
const mapElement = ref<HTMLDivElement | null>(null)
let geoJsonLayer: L.GeoJSON | null = null

const emit = defineEmits<{
  (
    e: 'show-visits',
    payload: {
      countryName: string
      countryISO3: string
      visits: Visit[]
    },
  ): void
}>()

// Color visited country
function styleCountry(feature?: Feature<Geometry>) {
  if (!feature) {
    return {
      color: '#999',
      weight: 1,
      fillColor: '#d9d9d9',
      fillOpacity: 0.4,
    }
  }

  const iso = String(feature.id ?? '')
  const isVisited = visitsStore.visits.some((v) => v.country === iso)

  return {
    color: '#999',
    weight: 1,
    fillColor: isVisited ? '#2ecc71' : '#d9d9d9',
    fillOpacity: isVisited ? 0.8 : 0.4,
  }
}

// Attach popup and click behaviour
function onEachFeature(feature: Feature<Geometry>, layer: L.Layer) {
  const iso3 = String(feature.id ?? '')

  // All visits from this country
  const visitsForCountry = visitsStore.visits.filter((v) => v.country === iso3)
  if (visitsForCountry.length === 0) return

  const count = visitsForCountry.length

  // baguette name
  const iso2 = countries.alpha3ToAlpha2(iso3)
  const allCountries = countries.getNames('fr', { select: 'official' })
  const countryNameFR = (iso2 && allCountries[iso2]) || feature.properties?.name || 'Pays'

  layer.on('click', () => {
    const popupContent = `
            <div class="p-1" style="font-size:14px;">
                <strong>${countryNameFR}</strong><br>
                Nombre de visites : <strong>${count}</strong><br><br>

                <div class="d-flex justify-content-center">
                    <button id="show-visits-${iso3}" class="btn btn-primary btn-sm">
                        Voir les visites
                    </button>
                </div>
            </div>
        `
    layer.bindPopup(popupContent).openPopup()

    //todo add visit list component
    setTimeout(() => {
      const btn = document.getElementById(`show-visits-${iso3}`)
      if (!btn) return
      btn.addEventListener('click', () => {
        emit('show-visits', {
          countryName: countryNameFR,
          countryISO3: iso3,
          visits: visitsForCountry,
        })

        map.value?.closePopup()
      })
    }, 0)
  })
}

// Refresh colors
function refreshMapColors() {
  if (geoJsonLayer) {
    geoJsonLayer.setStyle(styleCountry)
  }
}

//refresh handlers
function refreshFeatureHandlers() {
  if (!geoJsonLayer) return

  geoJsonLayer.eachLayer((layer) => {
    const typedLayer = layer as L.Layer & { feature?: Feature }

    if (!typedLayer.feature) return

    typedLayer.off()
    onEachFeature(typedLayer.feature, typedLayer)
  })
}

onMounted(async () => {
  if (!mapElement.value) return

  await visitsStore.loadVisits()

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
  }).addTo(map.value as L.Map)

  const geojson = await fetch('/countries.geo.json').then((r) => r.json())

  geoJsonLayer = L.geoJSON(geojson, {
    style: styleCountry,
    onEachFeature,
  }).addTo(map.value as L.Map)

  watch(
    () => visitsStore.visits,
    () => {
      refreshMapColors()
      refreshFeatureHandlers()
    },
    { deep: true },
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
