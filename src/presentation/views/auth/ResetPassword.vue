<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { resetPassword } from '@infra/services/auth.service'
const { t } = useI18n()
const route = useRoute(); const router = useRouter()
const token = computed(() => String(route.query.token || ''))
const form = reactive({ password: '', confirm: '' })
const state = reactive({ loading: false, message: '', error: '' })
async function submit(){
  if (form.password !== form.confirm) { state.error = t('auth.passwordsMismatch') as string; return }
  state.loading = true; state.error = ''; state.message = ''
  try { await resetPassword(token.value, form.password); state.message = 'Senha redefinida com sucesso.'; setTimeout(() => router.replace('/login'), 1200) }
  catch { state.error = 'Não foi possível redefinir a senha.' }
  finally { state.loading = false }
}
</script>
<template>
  <div class="max-w-xs mx-auto grid gap-4">
    <h2 class="text-lg font-semibold">{{ t('auth.reset') }}</h2>
    <form @submit.prevent="submit" class="grid gap-3">
      <input v-model="form.password" type="password" :placeholder="t('auth.newPassword')" class="border rounded-xl p-3" required />
      <input v-model="form.confirm" type="password" :placeholder="t('auth.confirmPassword')" class="border rounded-xl p-3" required />
      <p v-if="form.password && form.confirm && form.password !== form.confirm" class="text-red-600 text-xs">{{ t('auth.passwordsMismatch') }}</p>
      <button :disabled="state.loading || (form.password !== form.confirm)" class="rounded-xl p-3 bg-black text-white cursor-pointer">{{ state.loading ? t('auth.reset') + '...' : t('auth.reset') }}</button>
      <p v-if="state.message" class="text-green-600 text-sm">{{ state.message }}</p>
      <p v-if="state.error" class="text-red-600 text-sm">{{ state.error }}</p>
    </form>
  </div>
</template>
