<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { deleteAccount } from '@infra/services/auth.service'
import { useAuthStore } from '@app/stores/auth'
import IconInput from '@ui/components/IconInput.vue'
import { useValidation, required, apiError } from '@shared/validation'

const router = useRouter()
const auth = useAuthStore()
const form = reactive({ password: '' })
const { errors, check, validate } = useValidation(form, {
  password: [required('Informe sua senha para confirmar.')],
})
const loading = ref(false)
const error = ref('')

async function submit() {
  if (!(await validate())) return
  loading.value = true
  error.value = ''
  try {
    await deleteAccount(form.password)
    auth.logout()
    router.replace({ path: '/login', query: { deleted: '1' } })
  } catch (e) {
    error.value = apiError(e, 'Não foi possível excluir a conta. Tente novamente.').message
  } finally {
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
          <button type="button" @click="router.back()" class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <Icon icon="mdi:arrow-left" class="text-slate-600" />
          </button>
          <h2 class="text-lg font-bold text-slate-900">Excluir minha conta</h2>
        </div>

        <div class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 grid gap-1">
          <p class="font-semibold flex items-center gap-1.5"><Icon icon="mdi:alert-outline" class="text-lg" />Isso não tem volta.</p>
          <p>Vamos apagar sua conta, seu perfil de trabalhador, suas fotos e vídeos, as avaliações que você recebeu e as que você escreveu.</p>
        </div>

        <form @submit.prevent="submit" novalidate class="grid gap-3">
          <IconInput v-model="form.password" icon="mdi:lock-outline" type="password" placeholder="Sua senha" autocomplete="current-password" :error="errors.password" @blur="check('password')" />

          <p v-if="error" class="flex items-center gap-1.5 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <Icon icon="mdi:alert-circle-outline" />{{ error }}
          </p>

          <button
            :disabled="loading"
            class="w-full py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Icon v-if="loading" icon="mdi:loading" class="animate-spin" />
            {{ loading ? 'Excluindo...' : 'Excluir minha conta' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
