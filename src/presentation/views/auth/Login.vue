<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@app/stores/auth'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const router = useRouter(); const auth = useAuthStore()
const form = reactive({ email: '', password: '' })
async function submit() { if (await auth.login(form)) router.replace('/tabs/home') }
</script>
<template>
  <div class="max-w-xs mx-auto grid gap-4">
    <h2 class="text-lg font-semibold">{{ t('auth.login') }}</h2>
    <form @submit.prevent="submit" class="grid gap-3">
      <input v-model="form.email" type="email" :placeholder="t('auth.email')" class="border rounded-xl p-3" required />
      <input v-model="form.password" type="password" :placeholder="t('auth.password')" class="border rounded-xl p-3" required />
      <button :disabled="auth.loading" class="rounded-xl p-3 bg-black text-white cursor-pointer">{{ auth.loading ? t('auth.signingIn') : t('auth.login') }}</button>
      <div class="flex justify-between text-xs">
        <RouterLink to="/forgot-password" class="underline cursor-pointer">{{ t('auth.forgot') }}</RouterLink>
        <RouterLink to="/register-worker" class="underline cursor-pointer">{{ t('auth.registerWorker') }}</RouterLink>
      </div>
      <p v-if="auth.error" class="text-red-600 text-sm">{{ auth.error }}</p>
    </form>
  </div>
</template>
