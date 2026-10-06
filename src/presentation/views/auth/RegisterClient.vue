<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@app/stores/auth'
import { Icon } from '@iconify/vue'
import IconInput from '@ui/components/IconInput.vue'
import { useValidation, required, email, phone, minLength, sameAs, formatPhone, phoneDigits, PASSWORD_MIN } from '@shared/validation'

const router = useRouter()
const auth = useAuthStore()
auth.error = null

const form = reactive({ name: '', email: '', phone: '', password: '', confirm: '' })
const success = ref(false)

const { errors, check, validate, setErrors } = useValidation(form, {
  name: [required('Informe seu nome.')],
  email: [required('Informe seu e-mail.'), email],
  phone: [required('Informe seu telefone.'), phone],
  password: [required('Crie uma senha.'), minLength(PASSWORD_MIN)],
  confirm: [required('Repita a senha.'), sameAs(() => form.password, 'As senhas não coincidem.')],
})

watch(() => form.phone, (v) => (form.phone = formatPhone(v)))

async function submit() {
  if (!(await validate())) return
  const ok = await auth.registerClient({
    name: form.name.trim(),
    email: form.email.trim(),
    phone: phoneDigits(form.phone),
    password: form.password,
  })
  if (ok) success.value = true
  else setErrors(auth.fieldErrors)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-50 to-slate-100 flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 grid gap-6">
      <div class="text-center">
        <div class="text-2xl font-bold text-brand mb-1">Trampo Fácil</div>
        <h1 class="text-xl font-bold text-slate-900">Criar conta de cliente</h1>
        <p class="text-sm text-slate-500 mt-1">Encontre profissionais qualificados</p>
      </div>

      <div v-if="success" class="text-center grid gap-4">
        <div class="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Icon icon="mdi:check" class="text-green-500 text-3xl" />
        </div>
        <p class="text-slate-700 font-medium">Conta criada com sucesso!</p>
        <button @click="router.push('/login')" class="w-full py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors">
          Fazer login
        </button>
      </div>

      <form v-else @submit.prevent="submit" novalidate class="grid gap-4">
        <IconInput v-model="form.name" icon="mdi:account-outline" placeholder="Nome completo" autocomplete="name" :error="errors.name" @blur="check('name')" />
        <IconInput v-model="form.email" icon="mdi:email-outline" type="email" placeholder="E-mail" autocomplete="email" :error="errors.email" @blur="check('email')" />
        <IconInput v-model="form.phone" icon="mdi:phone-outline" type="tel" inputmode="numeric" placeholder="Telefone com DDD" autocomplete="tel-national" :error="errors.phone" @blur="check('phone')" />
        <IconInput v-model="form.password" icon="mdi:lock-outline" type="password" placeholder="Senha (mínimo 8 caracteres)" autocomplete="new-password" :error="errors.password" @blur="check('password')" />
        <IconInput v-model="form.confirm" icon="mdi:lock-check-outline" type="password" placeholder="Repita a senha" autocomplete="new-password" :error="errors.confirm" @blur="check('confirm')" />

        <div v-if="auth.error" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <Icon icon="mdi:alert-circle-outline" class="flex-shrink-0" />{{ auth.error }}
        </div>

        <button type="submit" :disabled="auth.loading" class="w-full py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          <Icon v-if="auth.loading" icon="mdi:loading" class="animate-spin" />
          Criar conta
        </button>
        <p class="text-xs text-center text-slate-500">
          Ao criar a conta você concorda com a
          <RouterLink to="/privacidade" class="text-brand font-medium hover:underline">Política de Privacidade</RouterLink>.
        </p>
      </form>

      <div class="text-center text-sm text-slate-500">
        Já tem conta?
        <RouterLink to="/login" class="text-brand font-medium hover:underline ml-1">Entrar</RouterLink>
      </div>
      <div class="text-center text-sm text-slate-500">
        É profissional?
        <RouterLink to="/register-worker" class="text-brand font-medium hover:underline ml-1">Cadastro de trabalhador</RouterLink>
      </div>
    </div>
  </div>
</template>
