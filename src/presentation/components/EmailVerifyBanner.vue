<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@app/stores/auth'
import { getMe, resendEmailVerification } from '@infra/services/auth.service'
import { apiError } from '@shared/validation'

// Reminds a signed-in person to confirm their email, with a button to get
// the link again. Nothing in the app is blocked while it is not confirmed.
const auth = useAuthStore()
const state = reactive({ sending: false, sent: false, error: '' })

// The saved session may be older than the confirmation, so ask the API.
onMounted(async () => {
  if (auth.user?.emailVerified !== false) return
  try {
    const me = await getMe()
    auth.updateUser({ emailVerified: me.emailVerified })
  } catch { /* keep what we have */ }
})

async function resend() {
  state.sending = true
  state.error = ''
  try {
    await resendEmailVerification()
    state.sent = true
  } catch (e) {
    state.error = apiError(e, 'Não foi possível enviar o link. Tente de novo.').message
  } finally {
    state.sending = false
  }
}
</script>

<template>
  <div
    v-if="auth.user?.emailVerified === false"
    class="mb-5 flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200"
  >
    <Icon icon="mdi:email-alert-outline" class="text-xl text-amber-600 flex-shrink-0" />
    <p class="flex-1 min-w-[12rem] text-xs sm:text-sm text-slate-700">
      <template v-if="state.sent">Enviamos um novo link para <b>{{ auth.user.email }}</b>. Confira também a caixa de spam.</template>
      <template v-else-if="state.error">{{ state.error }}</template>
      <template v-else>Confirme seu e-mail: clique no link que enviamos para <b>{{ auth.user.email }}</b>.</template>
    </p>
    <button
      v-if="!state.sent"
      :disabled="state.sending"
      @click="resend"
      class="flex-shrink-0 px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-800 text-xs sm:text-sm font-semibold hover:bg-amber-100 transition-colors disabled:opacity-60 flex items-center gap-1"
    >
      <Icon v-if="state.sending" icon="mdi:loading" class="animate-spin" />
      Reenviar link
    </button>
  </div>
</template>
