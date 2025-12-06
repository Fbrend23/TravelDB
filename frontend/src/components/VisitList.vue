<template>
  <div class="card mt-3 h-100 d-flex flex-column">

    <!-- fixed header -->
    <div class="card-header fw-bold fs-5 border-bottom">
      {{ country }}
    </div>
    <!-- no country selected -->
    <div v-if="!props.country" class="p-3 text-center text-muted">
      <i class="bi bi-globe fs-3 d-block mb-2"></i>
      Cliquez sur un pays pour afficher vos visites
    </div>

    <!-- scrollable content -->
    <div class="flex-grow-1 overflow-auto">
      <ul class="list-group list-group-flush">
        <li v-for="v in sortedVisits" :key="v.id"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
          <!-- Visit date -->
          <div class="d-flex align-items-center">
            <i class="bi bi-calendar-event me-2 text-primary"></i>
            <span>{{ formatFullDate(v.visited_at) }}</span>
          </div>
          <!-- Edit -->
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary" @click="handleEdit(v)" title="Modifier">
              <i class="bi bi-pencil"></i>
            </button>
            <!-- Delete -->
            <button class="btn btn-outline-danger" @click="handleDelete(v.id)" :disabled="visitStore.loading"
              title="Supprimer">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Visit } from '@/stores/visits'
import { useVisitsStore } from '@/stores/visits'

const visitStore = useVisitsStore()

const props = defineProps<{
  country: string
  visits: Visit[]
}>()
const emit = defineEmits<{
  (e: 'edit', visit: Visit): void
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

async function handleDelete(id: number) {
  if (confirm('Voulez-vous vraiment supprimer cette visite ?')) {
    await visitStore.deleteVisit(id)
  }
}

function handleEdit(visit: Visit) {
  emit('edit', visit)
}
</script>

<style scoped></style>
