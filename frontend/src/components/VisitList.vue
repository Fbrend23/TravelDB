<template>
  <div class="card mt-3 h-100 d-flex flex-column">

    <!-- fixed header -->
    <div class="card-header fw-bold fs-5 bg-white border-bottom">
      {{ country }}
    </div>

    <!-- scrollable content -->
    <div class="flex-grow-1 overflow-auto">
      <ul class="list-group list-group-flush">
        <li v-for="v in sortedVisits" :key="v.id"
          class="list-group-item list-group-item-action d-flex align-items-center">
          <i class="bi bi-calendar-event me-2 text-primary"></i>
          <span>{{ formatFullDate(v.visited_at) }}</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Visit } from '@/stores/visits'

const props = defineProps<{
  country: string
  visits: Visit[]
}>()

function formatFullDate(dateString?: string) {
  if (!dateString) return '—'

  const date = new Date(dateString)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()

  return `${day}/${month}/${year}`
}

const sortedVisits = computed<Visit[]>(() =>
  [...props.visits].sort((a, b) => {
    const da = new Date(a.visited_at ?? '').getTime()
    const db = new Date(b.visited_at ?? '').getTime()
    return db - da
  })
)
</script>

<style scoped></style>
