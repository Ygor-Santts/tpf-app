<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '@app/stores/auth.store'

const store = useAuthStore()
const form = reactive({
  name: '',
  password: '',
  email: '',
  phone: '',
  jobOccupationIds: [] as number[],
  operationCitiesIds: [] as number[]
})

async function handleSubmit() {
  await store.registerWorker(form as any)
}
</script>

<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Cadastro de Trabalhador</h2>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-4">
      <input v-model="form.name" placeholder="Nome" class="border rounded p-2" required />
      <input v-model="form.email" type="email" placeholder="Email" class="border rounded p-2" required />
      <input v-model="form.password" type="password" placeholder="Senha" class="border rounded p-2" required />
      <input v-model="form.phone" placeholder="Telefone" class="border rounded p-2" required />
      <input v-model="form.jobOccupationIds" placeholder="IDs de ocupação (ex: 1,2)"
             class="border rounded p-2"
             @change="form.jobOccupationIds = String(form.jobOccupationIds).split(',').map(x=>Number(x.trim())).filter(Boolean)" />
      <input v-model="form.operationCitiesIds" placeholder="IDs de cidades (ex: 10,12)"
             class="border rounded p-2"
             @change="form.operationCitiesIds = String(form.operationCitiesIds).split(',').map(x=>Number(x.trim())).filter(Boolean)" />
      <button :disabled="store.loading" class="border rounded p-2 hover:bg-gray-50">
        {{ store.loading ? 'Enviando...' : 'Cadastrar' }}
      </button>
      <p v-if="store.error" class="text-red-600 text-sm">{{ store.error }}</p>
    </form>
  </div>
</template>
