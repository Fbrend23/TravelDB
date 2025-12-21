<template>
  <div class="d-flex flex-column h-100 w-100 rounded-3 bg-paper shadow-inset border border-travel overflow-hidden">

    <!-- fixed header -->
    <div class="p-3 border-bottom border-travel bg-paper flex-shrink-0">
      <div class="font-handwritten text-primary fs-5 d-flex align-items-center">
        <i class="bi bi-geo-alt me-2"></i>
        {{ country || 'Destination' }}
      </div>
    </div>
    <!-- no country selected -->

    <div v-if="!props.country"
      class="p-4 text-center text-muted-travel flex-grow-1 d-flex flex-column justify-content-center bg-paper">
      <i class="bi bi-globe fs-1 d-block mb-3 opacity-50"></i>
      <span>Cliquez sur un pays pour voir vos souvenirs</span>
    </div>
    <!-- scrollable content -->
    <div v-else class="flex-grow-1 overflow-y-auto bg-paper custom-scrollbar">
      <ul class="list-group list-group-flush">
        <li v-for="v in sortedVisits" :key="v.id"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 border-travel bg-transparent text-body-travel">
          <!-- Visit date -->
          <div class="d-flex align-items-center">
            <i class="bi bi-geo-alt me-2 text-secondary"></i>
            <span class="fw-medium">{{ formatFullDate(v.visited_at) }}</span>
          </div>
          <!-- Edit -->
          <div class="btn-group btn-group-sm opacity-50">
            <button class="btn btn-link text-body-travel p-0 me-2" @click="handleEdit(v)" title="Modifier">
              <i class="bi bi-pencil"></i>
            </button>
            <!-- Delete -->
            <button class="btn btn-link text-danger p-0" @click="handleDelete(v.id)" :disabled="visitStore.loading"
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--bs-secondary);
  border-radius: 10px;
  opacity: 0.5;
}
</style>
