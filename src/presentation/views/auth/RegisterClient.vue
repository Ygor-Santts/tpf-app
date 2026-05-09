<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@app/stores/auth'
import { Icon } from '@iconify/vue'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const success = ref(false)

async function submit() {
  const ok = await auth.registerClient({ name: name.value, email: email.value, phone: phone.value, password: password.value })
  if (ok) success.value = true
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

      <form v-else @submit.prevent="submit" class="grid gap-4">
        <div class="relative">
          <Icon icon="mdi:account-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="name" placeholder="Nome completo" required class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all" />
        </div>
        <div class="relative">
          <Icon icon="mdi:email-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="email" type="email" placeholder="E-mail" required class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all" />
        </div>
        <div class="relative">
          <Icon icon="mdi:phone-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="phone" placeholder="Telefone" required class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all" />
        </div>
        <div class="relative">
          <Icon icon="mdi:lock-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="password" type="password" placeholder="Senha" required minlength="6" class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all" />
        </div>

        <p v-if="auth.error" class="text-red-500 text-sm text-center">{{ auth.error }}</p>

        <button type="submit" :disabled="auth.loading" class="w-full py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          <Icon v-if="auth.loading" icon="mdi:loading" class="animate-spin" />
          Criar conta
        </button>
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
