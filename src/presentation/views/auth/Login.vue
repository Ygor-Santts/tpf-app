<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@app/stores/auth'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const form = reactive({ email: '', password: '' })

async function submit() {
  if (await auth.login(form)) router.replace('/tabs/home')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <RouterLink to="/" class="text-2xl font-bold text-brand">Trampo Fácil</RouterLink>
        <p class="text-sm text-slate-500 mt-1">{{ t('home.heroSub') }}</p>
      </div>

      <div class="bg-white rounded-2xl shadow-card border p-6 grid gap-4">
        <h2 class="text-lg font-bold text-slate-900">{{ t('auth.login') }}</h2>

        <form @submit.prevent="submit" class="grid gap-3">
          <div class="relative">
            <Icon icon="mdi:email-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              v-model="form.email"
              type="email"
              :placeholder="t('auth.email')"
              class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all"
              required
            />
          </div>

          <div class="relative">
            <Icon icon="mdi:lock-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              v-model="form.password"
              type="password"
              :placeholder="t('auth.password')"
              class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all"
              required
            />
          </div>

          <button
            :disabled="auth.loading"
            class="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
          >
            <Icon v-if="auth.loading" icon="mdi:loading" class="animate-spin" />
            {{ auth.loading ? t('auth.signingIn') : t('auth.login') }}
          </button>

          <p v-if="auth.error" class="text-red-500 text-sm text-center">{{ auth.error }}</p>
        </form>

        <div class="flex justify-between text-xs text-slate-500 pt-1">
          <RouterLink to="/forgot-password" class="hover:text-brand transition-colors">{{ t('auth.forgot') }}</RouterLink>
          <RouterLink to="/register-worker" class="hover:text-brand transition-colors font-medium text-brand">{{ t('auth.noAccount') }} {{ t('auth.registerWorker') }}</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
