<template>
    <div class="card shadow-sm">
        <div class="card-body">

            <h4 class="fw-bold mb-3">
                {{ isEditing ? 'Modifier la visite' : 'Ajouter un pays visité' }}
            </h4>

            <form @submit.prevent="submit">

                <!-- Autocomplete -->
                <div class="mb-3 position-relative">
                    <label class="form-label">Pays <span class="text-danger">*</span></label>

                    <input v-model="countrySearch" type="text" class="form-control" placeholder="Ex: Suisse"
                        @focus="!isEditing && (showList = true)" @input="updateSearch" :disabled="isEditing" />
                    <!-- Error if empty -->
                    <small v-if="errors.country" class="text-danger text-center d-block w-100">
                        {{ errors.country }}
                    </small>
                    <!-- Dropdown -->
                    <ul v-if="showList && filteredCountries.length > 0"
                        class="list-group position-absolute w-100 mt-1 shadow-sm"
                        style="max-height: 200px; overflow-y: auto; z-index: 10">
                        <li v-for="c in filteredCountries" :key="c.code" class="list-group-item list-group-item-action"
                            @click="selectCountry(c)">
                            {{ c.name }}
                        </li>
                    </ul>
                </div>
                <!-- Date -->
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input v-model="date" type="date" class="form-control" />
                    <!-- Errors if empty -->
                    <small v-if="errors.date" class="text-danger text-center d-block w-100">
                        {{ errors.date }}
                    </small>
                </div>
                <!-- Success message -->
                <p v-if="message" :class="messageClass" class="text-center d-block w-100">
                    {{ message }}
                </p>

                <p class="text-muted small mb-2"> * obligatoire</p>

                <div class="d-flex gap-2">
                    <button v-if="isEditing" type="button" class="btn btn-outline-secondary w-50" @click="cancelEdit">
                        Annuler
                    </button>

                    <button class="btn btn-primary" :class="isEditing ? 'w-50' : 'w-100'" :disabled="loading">
                        <span v-if="loading">Chargement...</span>
                        <span v-else>{{ isEditing ? 'Modifier' : 'Ajouter' }}</span>
                    </button>
                </div>
            </form>
        </div>
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