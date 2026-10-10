<script setup lang="ts">
import AppLogo from '@ui/components/AppLogo.vue'
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@app/stores/auth'
import { verifyEmail } from '@infra/services/auth.service'
import { apiError } from '@shared/validation'

// Opened from the link in the confirmation email.
const route = useRoute()
const auth = useAuthStore()
const state = reactive({ loading: true, ok: false, error: '' })

onMounted(async () => {
  const token = String(route.query.token || '')
  try {
    if (!token) throw new Error()
    await verifyEmail(token)
    state.ok = true
    auth.updateUser({ emailVerified: true })
  } catch (e) {
    state.error = apiError(e, 'Link de confirmação inválido. Peça um novo no app.').message
  } finally {
    state.loading = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <RouterLink to="/" class="block mb-3"><AppLogo variant="full" /></RouterLink>
      </div>

      <div class="bg-white rounded-2xl shadow-card border p-6 grid gap-4 text-center">
        <template v-if="state.loading">
          <Icon icon="mdi:loading" class="animate-spin text-3xl text-brand mx-auto" />
          <p class="text-sm text-slate-600">Confirmando seu e-mail...</p>
        </template>

        <template v-else-if="state.ok">
          <div class="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <Icon icon="mdi:check-circle" class="text-3xl text-green-500" />
          </div>
          <h2 class="text-lg font-bold text-slate-900">E-mail confirmado!</h2>
          <p class="text-sm text-slate-600">Obrigado. Sua conta está pronta.</p>
          <RouterLink
            :to="auth.token ? auth.home : '/login'"
            class="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors"
          >
            {{ auth.token ? 'Ir para o app' : 'Fazer login' }}
          </RouterLink>
        </template>

        <template v-else>
          <div class="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <Icon icon="mdi:alert-circle-outline" class="text-3xl text-red-500" />
          </div>
          <h2 class="text-lg font-bold text-slate-900">Não deu certo</h2>
          <p class="text-sm text-slate-600">{{ state.error }}</p>
          <RouterLink
            :to="auth.token ? auth.home : '/login'"
            class="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors"
          >
            {{ auth.token ? 'Voltar ao app' : 'Fazer login' }}
          </RouterLink>
        </template>
      </div>
    </div>
  </div>
</template>
