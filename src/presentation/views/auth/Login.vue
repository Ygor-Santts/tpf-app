<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@app/stores/auth'
const router = useRouter(); const auth = useAuthStore()
const form = reactive({ email: '', password: '' })
async function submit() { if (await auth.login(form)) router.replace('/tabs/home') }
</script>

<template>
  <div class="max-w-xs mx-auto grid gap-4">
    <h2 class="text-lg font-semibold">Login</h2>
    <form @submit.prevent="submit" class="grid gap-3">
      <input v-model="form.email" type="email" placeholder="Email" class="border rounded-xl p-3" required />
      <input v-model="form.password" type="password" placeholder="Password" class="border rounded-xl p-3" required />
      <button :disabled="auth.loading" class="rounded-xl p-3 bg-black text-white">
        {{ auth.loading ? 'Signing in...' : 'Login' }}
      </button>
      <p v-if="auth.error" class="text-red-600 text-sm">{{ auth.error }}</p>
    </form>
  </div>
</template>
