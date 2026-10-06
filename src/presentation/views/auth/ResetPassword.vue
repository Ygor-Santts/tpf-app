<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { resetPassword } from '@infra/services/auth.service'
import IconInput from '@ui/components/IconInput.vue'
import { useValidation, required, minLength, sameAs, apiError, PASSWORD_MIN } from '@shared/validation'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const token = computed(() => String(route.query.token || ''))
const form = reactive({ password: '', confirm: '' })
const state = reactive({ loading: false, message: '', error: '' })
const { errors, check, validate, setErrors } = useValidation(form, {
  password: [required('Crie uma nova senha.'), minLength(PASSWORD_MIN)],
  confirm: [required('Repita a nova senha.'), sameAs(() => form.password, 'As senhas não coincidem.')],
})

async function submit() {
  if (!(await validate())) return
  if (!token.value) { state.error = 'Link de redefinição inválido. Solicite um novo.'; return }
  state.loading = true
  state.error = ''
  state.message = ''
  try {
    await resetPassword(token.value, form.password)
    state.message = 'Senha redefinida com sucesso.'
    setTimeout(() => router.replace('/login'), 1500)
  } catch (e) {
    const { message, fields } = apiError(e, 'Não foi possível redefinir a senha.')
    state.error = message
    setErrors(fields)
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

        <form @submit.prevent="submit" novalidate class="grid gap-3">
          <IconInput v-model="form.password" icon="mdi:lock-outline" type="password" :placeholder="t('auth.newPassword') + ' (mínimo 8 caracteres)'" autocomplete="new-password" :error="errors.password" @blur="check('password')" />
          <IconInput v-model="form.confirm" icon="mdi:lock-check-outline" type="password" :placeholder="t('auth.confirmPassword')" autocomplete="new-password" :error="errors.confirm" @blur="check('confirm')" />

          <div v-if="state.message" class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            <Icon icon="mdi:check-circle" class="text-lg flex-shrink-0" />
            {{ state.message }}
          </div>
          <div v-if="state.error" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <Icon icon="mdi:alert-circle-outline" class="flex-shrink-0" />{{ state.error }}
          </div>

          <button
            :disabled="state.loading"
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
