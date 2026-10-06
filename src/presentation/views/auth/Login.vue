<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@app/stores/auth'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import IconInput from '@ui/components/IconInput.vue'
import { useValidation, required, email } from '@shared/validation'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const form = reactive({ email: '', password: '' })
const { errors, check, validate } = useValidation(form, {
  email: [required('Informe seu e-mail.'), email],
  password: [required('Informe sua senha.')],
})
auth.error = null

const sessionExpired = computed(() => route.query.expired === '1')

async function submit() {
  if (!(await validate())) return
  if (await auth.login({ ...form, email: form.email.trim() })) {
    router.replace(auth.home)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <RouterLink to="/" class="text-2xl font-bold text-brand">Trampo Fácil</RouterLink>
        <p class="text-sm text-slate-500 mt-1">{{ t('home.heroSub') }}</p>
      </div>

      <div v-if="sessionExpired" class="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm mb-2">
        <Icon icon="mdi:clock-alert-outline" class="flex-shrink-0" />
        Sua sessão expirou. Faça login novamente.
      </div>

      <div class="bg-white rounded-2xl shadow-card border p-6 grid gap-4">
        <h2 class="text-lg font-bold text-slate-900">{{ t('auth.login') }}</h2>

        <form @submit.prevent="submit" novalidate class="grid gap-3">
          <IconInput v-model="form.email" icon="mdi:email-outline" type="email" :placeholder="t('auth.email')" autocomplete="email" :error="errors.email" @blur="check('email')" />
          <IconInput v-model="form.password" icon="mdi:lock-outline" type="password" :placeholder="t('auth.password')" autocomplete="current-password" :error="errors.password" @blur="check('password')" />

          <button
            :disabled="auth.loading"
            class="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
          >
            <Icon v-if="auth.loading" icon="mdi:loading" class="animate-spin" />
            {{ auth.loading ? t('auth.signingIn') : t('auth.login') }}
          </button>

          <div v-if="auth.error" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <Icon icon="mdi:alert-circle-outline" class="flex-shrink-0" />{{ auth.error }}
          </div>
        </form>

        <div class="flex justify-between text-xs text-slate-500 pt-1">
          <RouterLink to="/forgot-password" class="hover:text-brand transition-colors">{{ t('auth.forgot') }}</RouterLink>
          <RouterLink to="/register-worker" class="hover:text-brand transition-colors font-medium text-brand">{{ t('auth.imWorker') }}</RouterLink>
        </div>
        <div class="text-center text-xs text-slate-500">
          {{ t('auth.noAccount') }}
          <RouterLink to="/register-client" class="text-brand font-medium hover:underline ml-1">{{ t('auth.createClientAccount') }}</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
