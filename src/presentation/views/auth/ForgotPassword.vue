<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { forgotPassword } from '@infra/services/auth.service'
import IconInput from '@ui/components/IconInput.vue'
import { useValidation, required, email } from '@shared/validation'

const { t } = useI18n()
const form = reactive({ email: '' })
const { errors, check, validate } = useValidation(form, {
  email: [required('Informe seu e-mail.'), email],
})
const loading = ref(false)
const message = ref<string | null>(null)

async function submit() {
  if (!(await validate())) return
  loading.value = true
  message.value = null
  try {
    await forgotPassword(form.email.trim())
  } catch {
    // always show success to avoid email enumeration
  } finally {
    message.value = t('auth.emailSent')
    loading.value = false
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
        <div class="flex items-center gap-3">
          <RouterLink to="/login" class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <Icon icon="mdi:arrow-left" class="text-slate-600" />
          </RouterLink>
          <h2 class="text-lg font-bold text-slate-900">{{ t('auth.forgot') }}</h2>
        </div>

        <p class="text-sm text-slate-500">Digite seu e-mail e enviaremos as instruções para redefinir sua senha.</p>

        <form @submit.prevent="submit" novalidate class="grid gap-3">
          <IconInput v-model="form.email" icon="mdi:email-outline" type="email" :placeholder="t('auth.email')" autocomplete="email" :error="errors.email" @blur="check('email')" />

          <div v-if="message" class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            <Icon icon="mdi:check-circle" class="text-lg flex-shrink-0" />
            {{ message }}
          </div>

          <button
            v-if="!message"
            :disabled="loading"
            class="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Icon v-if="loading" icon="mdi:loading" class="animate-spin" />
            {{ loading ? t('auth.sending') : t('auth.sendInstructions') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
