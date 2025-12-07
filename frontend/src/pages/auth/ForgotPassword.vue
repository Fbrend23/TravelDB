<template>
  <div class="container d-flex justify-content-center align-items-center my-5">
    <div class="col-12 col-md-6 col-lg-4">
      <h2 class="text-center mb-4">Mot de passe oublié</h2>
      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label">Votre email</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>

        <div v-if="message" class="alert alert-success">{{ message }}</div>

        <button class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading">Envoi...</span>
          <span v-else>Envoyer le lien</span>
        </button>
      </form>
      <div class="text-center mt-3">
        <router-link to="/login">Retour à la connexion</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { apiForgotPassword } from '@/api/auth' // À créer

const email = ref('')
const message = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  message.value = ''
  try {
    await apiForgotPassword(email.value)
    message.value = 'Si cet email existe, un lien a été envoyé.'
  } catch (e) {
    message.value = 'Une erreur est survenue.'
  } finally {
    loading.value = false
  }
}
</script>
