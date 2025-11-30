<template>
    <div class="card shadow-sm">
        <div class="card-body">

            <h4 class="fw-bold mb-3">Ajouter un pays visité</h4>

            <form @submit.prevent="submit">

                <!-- Autocomplete -->
                <div class="mb-3 position-relative">
                    <label class="form-label">Pays <span class="text-danger">*</span></label>

                    <input v-model="countrySearch" type="text" class="form-control" placeholder="Ex: Suisse"
                        @focus="showList = true" @input="updateSearch" />
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
                    <!-- Success message -->
                </div>
                <p v-if="message" class="text-success text-center d-block w-100">
                    {{ message }}
                </p>
                <p class="text-muted small mb-2"> * obligatoire</p>
                <button class="btn btn-primary w-100" :disabled="loading">
                    <span v-if="loading">Ajout...</span>
                    <span v-else>Ajouter</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import countries from 'i18n-iso-countries'
import fr from 'i18n-iso-countries/langs/fr.json'
import { useVisitsStore } from '@/stores/visits'
import type { AxiosError } from 'axios'

const visitsStore = useVisitsStore()

countries.registerLocale(fr)

/* Form state */
const loading = ref(false)
const date = ref('')

/* Country : select + autocomplete */
const countrySearch = ref('')
const selectedCountry = ref('')
const showList = ref(false)

/* Errors */
const errors = ref({
    country: '',
    date: '',
})

const message = ref('')

/* Country list */
const allCountries = countries.getNames('fr', { select: 'official' })
const countryList = Object.entries(allCountries)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name))

// block country already visited
const filteredCountries = computed(() => {
    const search = countrySearch.value.toLowerCase()

    return countryList
        .filter((c) => c.name.toLowerCase().includes(search))
        .filter((c) => {
            const iso3 = countries.alpha2ToAlpha3(c.code)
            return iso3 && !visitsStore.visits.includes(iso3)
        })
})

/* Selection of country */
function selectCountry(c: { code: string; name: string }) {
    countrySearch.value = c.name
    selectedCountry.value = c.code
    showList.value = false
}

/* Validation */
function validateForm() {
    errors.value = {
        country: '',
        date: '',
    }

    let ok = true

    if (!selectedCountry.value) {
        errors.value.country = 'Veuillez sélectionner un pays'
        ok = false
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
        await visitsStore.addVisit(iso3, date.value || "")
        message.value = 'Pays ajouté avec succès'

        // reset forms
        countrySearch.value = ''
        selectedCountry.value = ''
        date.value = ''

    } catch (error: unknown) {
        const err = error as AxiosError<{ message?: string }>
        message.value = err.response?.data?.message || 'Erreur lors de l’ajout'
    }

    loading.value = false
}

function updateSearch() {
    showList.value = true
}

</script>
