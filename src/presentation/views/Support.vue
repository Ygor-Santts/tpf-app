<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import IconInput from '@ui/components/IconInput.vue'
import FieldError from '@ui/components/FieldError.vue'
import { useAuthStore } from '@app/stores/auth'
import { sendSupportMessage, type SupportMessageDTO } from '@infra/services/support.service'
import { useValidation, required, email, minLength, apiError } from '@shared/validation'
import { SUPPORT_EMAIL } from '@shared/constants'

const router = useRouter()
const auth = useAuthStore()

// Same keys as the API's support topics.
const topics = [
  { value: 'duvida', label: 'Dúvida sobre o app' },
  { value: 'problema', label: 'Algo não funciona' },
  { value: 'conta', label: 'Minha conta' },
  { value: 'denuncia', label: 'Denunciar um perfil' },
  { value: 'sugestao', label: 'Sugestão' },
  { value: 'outro', label: 'Outro assunto' },
]

const questions = [
  {
    q: 'Como encontro um profissional?',
    a: 'Toque em Buscar, escolha o serviço que você precisa e a sua cidade. Abra o perfil para ver fotos dos trabalhos, avaliações e as cidades que a pessoa atende.',
  },
  {
    q: 'Como falo com o profissional?',
    a: 'No perfil dele, toque em "Chamar no WhatsApp" ou em "Ligar". Para ver o contato é preciso criar uma conta, que é rápida e gratuita.',
  },
  {
    q: 'Quem combina preço e pagamento?',
    a: 'Você e o profissional, direto entre vocês. O Trampo Fácil ajuda a encontrar quem faz o serviço. Depois do trabalho, deixe uma avaliação para ajudar outras pessoas.',
  },
  {
    q: 'Como ofereço meus serviços?',
    a: 'Crie sua conta como trabalhador, ou, se já tem conta, abra o menu da conta e toque em "Quero trabalhar também". Escolha suas profissões e as cidades que atende, e capriche nas fotos do portfólio.',
  },
  {
    q: 'Esqueci minha senha. E agora?',
    a: 'Na tela de entrar, toque em "Esqueci minha senha" e digite seu e-mail. Enviamos um link para você criar uma senha nova.',
    link: { to: '/forgot-password', label: 'Criar uma senha nova' },
  },
  {
    q: 'Como mudo meus dados ou excluo minha conta?',
    a: 'Trabalhadores mudam o perfil em "Meu perfil". Para excluir a conta, abra o menu da conta e toque em "Excluir conta". Para outra mudança, mande uma mensagem abaixo.',
  },
  {
    q: 'Vi um perfil falso ou suspeito.',
    a: 'Mande uma mensagem abaixo com o assunto "Denunciar um perfil" e o nome da pessoa. Nós vamos verificar.',
  },
]

const form = reactive<SupportMessageDTO>({
  name: auth.user?.name ?? '',
  email: auth.user?.email ?? '',
  topic: '',
  message: '',
})
const { errors, check, validate, setErrors } = useValidation(form, {
  name: [required('Informe seu nome.')],
  email: [required('Informe seu e-mail para receber a resposta.'), email],
  topic: [required('Escolha um assunto.')],
  message: [required('Escreva sua mensagem.'), minLength(10)],
})
const loading = ref(false)
const sent = ref(false)
const error = ref('')

async function submit() {
  if (!(await validate())) return
  loading.value = true
  error.value = ''
  try {
    await sendSupportMessage({ ...form, name: form.name.trim(), email: form.email.trim(), message: form.message.trim() })
    sent.value = true
  } catch (e) {
    const { message, fields } = apiError(e, 'Não foi possível enviar sua mensagem. Tente novamente.')
    error.value = message
    setErrors(fields)
  } finally {
    loading.value = false
  }
}

function sendAnother() {
  form.topic = ''
  form.message = ''
  sent.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4">
    <div class="max-w-2xl mx-auto grid gap-4">
      <section class="bg-white rounded-2xl shadow-card border p-6 grid gap-3">
        <div class="flex items-center gap-3">
          <button type="button" @click="router.back()" class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <Icon icon="mdi:arrow-left" class="text-slate-600" />
          </button>
          <h1 class="text-lg font-bold text-slate-900">Ajuda e suporte</h1>
        </div>
        <p class="text-sm text-slate-600">Veja as dúvidas mais comuns. Se não achar sua resposta, mande uma mensagem para nossa equipe.</p>

        <h2 class="font-semibold text-slate-900 mt-1">Perguntas frequentes</h2>
        <div class="grid gap-2">
          <details v-for="item in questions" :key="item.q" class="group border rounded-xl px-4 py-3 open:bg-slate-50">
            <summary class="flex items-center justify-between gap-3 cursor-pointer list-none text-sm font-medium text-slate-800">
              {{ item.q }}
              <Icon icon="mdi:chevron-down" class="text-lg text-slate-400 flex-shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p class="mt-2 text-sm text-slate-600 leading-relaxed">{{ item.a }}</p>
            <RouterLink v-if="item.link" :to="item.link.to" class="mt-2 inline-block text-sm text-brand font-medium hover:underline">{{ item.link.label }}</RouterLink>
          </details>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-card border p-6 grid gap-3">
        <h2 class="font-semibold text-slate-900 flex items-center gap-2">
          <Icon icon="mdi:email-fast-outline" class="text-xl text-brand" />
          Fale com a gente
        </h2>

        <div v-if="sent" class="grid gap-3">
          <div class="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            <Icon icon="mdi:check-circle" class="text-lg flex-shrink-0" />
            <p>Mensagem enviada! Vamos responder no e-mail <strong>{{ form.email }}</strong>. Fique de olho também na caixa de spam.</p>
          </div>
          <button type="button" @click="sendAnother" class="justify-self-start text-sm text-brand font-medium hover:underline">Enviar outra mensagem</button>
        </div>

        <form v-else @submit.prevent="submit" novalidate class="grid gap-3">
          <p class="text-sm text-slate-600">Respondemos no seu e-mail.</p>
          <IconInput v-model="form.name" icon="mdi:account-outline" placeholder="Seu nome" autocomplete="name" :error="errors.name" @blur="check('name')" />
          <IconInput v-model="form.email" icon="mdi:email-outline" type="email" placeholder="Seu e-mail" autocomplete="email" :error="errors.email" @blur="check('email')" />

          <div>
            <select
              v-model="form.topic"
              :aria-invalid="!!errors.topic"
              @blur="check('topic')"
              class="w-full border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all"
              :class="form.topic ? 'text-slate-900' : 'text-slate-400'"
            >
              <option value="" disabled>Assunto</option>
              <option v-for="t in topics" :key="t.value" :value="t.value" class="text-slate-900">{{ t.label }}</option>
            </select>
            <FieldError :message="errors.topic" />
          </div>

          <div>
            <textarea
              v-model="form.message"
              rows="5"
              maxlength="2000"
              placeholder="Conte o que aconteceu ou o que você precisa"
              :aria-invalid="!!errors.message"
              @blur="check('message')"
              class="w-full border rounded-xl px-4 py-3 text-sm resize-y focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all"
            />
            <FieldError :message="errors.message" />
          </div>

          <p v-if="error" class="flex items-center gap-1.5 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <Icon icon="mdi:alert-circle-outline" class="flex-shrink-0" />{{ error }}
          </p>

          <button
            :disabled="loading"
            class="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Icon v-if="loading" icon="mdi:loading" class="animate-spin" />
            {{ loading ? 'Enviando...' : 'Enviar mensagem' }}
          </button>
        </form>

        <p v-if="SUPPORT_EMAIL" class="text-sm text-slate-600">
          Prefere e-mail? Escreva para
          <a :href="`mailto:${SUPPORT_EMAIL}`" class="text-brand font-medium hover:underline">{{ SUPPORT_EMAIL }}</a>.
        </p>
      </section>
    </div>
  </div>
</template>
