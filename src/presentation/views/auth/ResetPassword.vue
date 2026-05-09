<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { resetPassword } from '@infra/services/auth.service'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const token = computed(() => String(route.query.token || ''))
const form = reactive({ password: '', confirm: '' })
const state = reactive({ loading: false, message: '', error: '' })
const passwordsMatch = computed(() => !form.password || !form.confirm || form.password === form.confirm)

async function submit() {
  if (!passwordsMatch.value) { state.error = t('auth.passwordsMismatch'); return }
  state.loading = true
  state.error = ''
  state.message = ''
  try {
    await resetPassword(token.value, form.password)
    state.message = 'Senha redefinida com sucesso.'
    setTimeout(() => router.replace('/login'), 1500)
  } catch {
    state.error = 'Não foi possível redefinir a senha.'
  } finally {
    state.loading = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <RouterLink to="/" class="text-2xl font-bold text-brand">Trampo Fácil</RouterLink>
      </div>

      <div class="bg-white rounded-2xl shadow-card border p-6 grid gap-4">
        <h2 class="text-lg font-bold text-slate-900">{{ t('auth.reset') }}</h2>

        <form @submit.prevent="submit" class="grid gap-3">
          <div class="relative">
            <Icon icon="mdi:lock-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              v-model="form.password"
              type="password"
              :placeholder="t('auth.newPassword')"
              class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all"
              required
            />
          </div>

          <div class="relative">
            <Icon icon="mdi:lock-check-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              v-model="form.confirm"
              type="password"
              :placeholder="t('auth.confirmPassword')"
              class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all"
              required
            />
          </div>

          <p v-if="!passwordsMatch" class="text-red-500 text-xs">{{ t('auth.passwordsMismatch') }}</p>

          <div v-if="state.message" class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            <Icon icon="mdi:check-circle" class="text-lg flex-shrink-0" />
            {{ state.message }}
          </div>
          <p v-if="state.error" class="text-red-500 text-sm">{{ state.error }}</p>

          <button
            :disabled="state.loading || !passwordsMatch"
            class="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
          >
            <Icon v-if="state.loading" icon="mdi:loading" class="animate-spin" />
            {{ state.loading ? t('auth.sending') : t('auth.reset') }}
          </button>
        </form>

        <RouterLink to="/login" class="text-center text-xs text-brand hover:underline">{{ t('auth.backToLogin') }}</RouterLink>
      </div>
    </div>
  </div>
</template>
