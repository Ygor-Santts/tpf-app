<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { forgotPassword } from '@infra/services/auth.service'
const { t } = useI18n()
const email = ref(''); const loading = ref(false); const message = ref<string | null>(null)
async function submit(){ loading.value = true; message.value = null; try { await forgotPassword(email.value); message.value = t('auth.emailSent') } catch { message.value = t('auth.emailSent') } finally { loading.value = false } }
</script>
<template>
  <div class="max-w-xs mx-auto grid gap-4">
    <h2 class="text-lg font-semibold">{{ t('auth.forgot') }}</h2>
    <form @submit.prevent="submit" class="grid gap-3">
      <input v-model="email" type="email" :placeholder="t('auth.email')" class="border rounded-xl p-3" required />
      <button :disabled="loading" class="rounded-xl p-3 bg-black text-white cursor-pointer">{{ loading ? t('auth.sendInstructions') + '...' : t('auth.sendInstructions') }}</button>
      <p v-if="message" class="text-green-600 text-sm">{{ message }}</p>
    </form>
  </div>
</template>
