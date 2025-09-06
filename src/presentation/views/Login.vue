<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@app/stores/auth.store'

const store = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

async function handleSubmit() {
  const ok = await store.login(form)
  if (ok) router.push('/dashboard')
}
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Entrar</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm mb-1">Email</label>
        <input v-model="form.email" type="email" required class="w-full border rounded p-2" />
      </div>

      <div>
        <label class="block text-sm mb-1">Senha</label>
        <input v-model="form.password" type="password" required class="w-full border rounded p-2" />
      </div>

      <button :disabled="store.loading" class="w-full border rounded p-2 hover:bg-gray-50">
        {{ store.loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <p v-if="store.error" class="text-red-600 text-sm">{{ store.error }}</p>
    </form>
  </div>
</template>
