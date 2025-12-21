<template>
    <div class="h-100">
        <div class="mb-3 border-bottom border-travel pb-2">
            <div class="font-handwritten text-primary fs-5 d-flex align-items-center">
                <i class="bi bi-patch-check me-2"></i>
                {{ isEditing ? 'Rectificatif Visa' : 'Nouveau Visa' }}
            </div>
        </div>

        <form @submit.prevent="submit">
            <!-- Autocomplete -->
            <div class="mb-2 position-relative">
                <label class="form-label small fw-bold text-muted-travel mb-1">
                    Destination <span class="text-danger">*</span>
                </label>

                <div class="input-group custom-input-group rounded-3 overflow-hidden">
                    <span class="input-group-text border-0 pe-1">
                        <i class="bi bi-search"></i>
                    </span>
                    <input v-model="countrySearch" type="text"
                        class="form-control border-0 shadow-none ps-1 text-body-travel" placeholder="Ex: Japon"
                        @focus="!isEditing && (showList = true)" @input="updateSearch" :disabled="isEditing" />
                </div>
                <!-- Error if empty -->
                <small v-if="errors.country" class="text-danger d-block mt-1 small">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.country }}
                </small>
                <!-- Dropdown -->
                <ul v-if="showList && filteredCountries.length > 0"
                    class="list-group position-absolute w-100 mt-1 shadow border-0 rounded-3 overflow-hidden"
                    style="max-height: 200px; overflow-y: auto; z-index: 100;">
                    <li v-for="c in filteredCountries" :key="c.code"
                        class="list-group-item list-group-item-action small border-0 border-bottom bg-paper text-body-travel"
                        @click="selectCountry(c)">
                        <span class="fi" :class="'fi-' + c.code.toLowerCase()"></span> {{ c.name }}
                    </li>
                </ul>
            </div>
            <!-- Date -->
            <div class="mb-3">
                <label class="form-label small fw-bold text-muted-travel mb-1">Date d'arrivée</label>
                <input v-model="date" type="date" class="form-control" />
                <!-- Errors if empty -->
                <small v-if="errors.date" class="text-danger d-block mt-1 small">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.date }}
                </small>
            </div>
            <!-- Success message -->
            <p v-if="message" :class="messageClass" class="text-center d-block w-100 small fw-bold mb-2">
                {{ message }}
            </p>

            <div class="d-flex gap-2 mt-3">
                <button v-if="isEditing" type="button"
                    class="btn btn-light btn-sm w-50 rounded-pill fw-bold text-muted-travel border" @click="cancelEdit">
                    Annuler
                </button>
                <button class="btn btn-primary btn-sm rounded-pill fw-bold shadow-sm"
                    :class="isEditing ? 'w-50' : 'w-100'" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                    <span v-else>{{ isEditing ? 'Mettre à jour' : 'Tamponner' }}</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import countries from 'i18n-iso-countries'
import fr from 'i18n-iso-countries/langs/fr.json'
import { useVisitsStore, type Visit } from '@/stores/visits'
import type { AxiosError } from 'axios'

const props = defineProps<{
    visitToEdit: Visit | null
}>()

const emit = defineEmits(['cancel-edit', 'success'])

const visitsStore = useVisitsStore()

countries.registerLocale(fr)

/* Form state */
const loading = ref(false)
const date = ref('')
const countrySearch = ref('')
const selectedCountry = ref('')
const showList = ref(false)
const message = ref('')
const messageClass = ref('text-success')
const errors = ref({ country: '', date: '' })
const isEditing = computed(() => props.visitToEdit !== null)

/* Country list */
const allCountries = countries.getNames('fr', { select: 'official' })
const countryList = Object.entries(allCountries)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name))

// filter countries
const filteredCountries = computed(() => {
    const search = countrySearch.value.toLowerCase()
    return countryList.filter((c) => c.name.toLowerCase().includes(search))
})

/* Selection of country */
watch(() => props.visitToEdit, (newVisit) => {
    if (newVisit) {

        selectedCountry.value = countries.alpha3ToAlpha2(newVisit.country) || ''

        const foundName = countryList.find(c => c.code === selectedCountry.value)?.name || ''
        countrySearch.value = foundName || ''

        if (newVisit.visited_at) {
            date.value = new Date(newVisit.visited_at).toISOString().split('T')[0] || ''
        } else {
            date.value = ''
        }

        message.value = ''
        errors.value = { country: '', date: '' }
    }
}, { immediate: true })

function selectCountry(c: { code: string; name: string }) {
    countrySearch.value = c.name
    selectedCountry.value = c.code
    showList.value = false
}

function updateSearch() {
    showList.value = true
    if (countrySearch.value === '') selectedCountry.value = ''
}

function cancelEdit() {
    resetForm()
    emit('cancel-edit')
}

function resetForm() {
    countrySearch.value = ''
    selectedCountry.value = ''
    date.value = ''
    message.value = ''
    errors.value = { country: '', date: '' }
}

/* Validation */
function validateForm() {
    errors.value = { country: '', date: '' }
    let ok = true

    if (!selectedCountry.value) {
        const exactMatch = countryList.find(c => c.name.toLowerCase() === countrySearch.value.toLowerCase())
        if (exactMatch) {
            selectedCountry.value = exactMatch.code
        } else {
            errors.value.country = 'Veuillez sélectionner un pays dans la liste'
            ok = false
        }
    }

    if (date.value && new Date(date.value) > new Date()) {
        errors.value.date = 'La date ne peut pas être dans le futur'
        ok = false
    }

    return ok
}

/* Submit form */
async function submit() {
    message.value = ''
    loading.value = true

    if (!validateForm()) {
        loading.value = false
        return
    }

    const iso3 = countries.alpha2ToAlpha3(selectedCountry.value)
    if (!iso3) {
        errors.value.country = 'Code pays invalide'
        loading.value = false
        return
    }

    try {
        if (isEditing.value && props.visitToEdit) {
            await visitsStore.updateVisit(props.visitToEdit.id, iso3, date.value || undefined)
            message.value = 'Visite modifiée avec succès'
            messageClass.value = 'text-success'

            setTimeout(() => {
                emit('success')
                resetForm()
            }, 1000)

        } else {
            await visitsStore.addVisit(iso3, date.value || undefined)
            message.value = 'Pays ajouté avec succès'
            messageClass.value = 'text-success'
            resetForm()
        }

    } catch (error: unknown) {
        const err = error as AxiosError<{ message?: string }>
        message.value = err.response?.data?.message || 'Une erreur est survenue'
        messageClass.value = 'text-danger'
    } finally {
        loading.value = false
    }
}
</script>