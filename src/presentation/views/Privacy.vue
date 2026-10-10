<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { SUPPORT_EMAIL } from '@shared/constants'

const UPDATED_AT = '06/10/2026'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4">
    <article class="max-w-2xl mx-auto bg-white rounded-2xl shadow-card border p-6 grid gap-4 text-sm text-slate-700 leading-relaxed">
      <div class="flex items-center gap-3">
        <button type="button" @click="router.back()" class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <Icon icon="mdi:arrow-left" class="text-slate-600" />
        </button>
        <h1 class="text-lg font-bold text-slate-900">Política de Privacidade</h1>
      </div>
      <p class="text-xs text-slate-500">Atualizada em {{ UPDATED_AT }}</p>

      <p>O Trampo Fácil liga clientes a trabalhadores autônomos. Esta página explica, de forma simples, quais dados guardamos, por quê e o que você pode fazer com eles, conforme a Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018).</p>

      <h2 class="font-semibold text-slate-900">Quais dados guardamos</h2>
      <ul class="list-disc pl-5 grid gap-1">
        <li>Da sua conta: nome, e-mail, telefone e senha (guardada de forma cifrada, ninguém consegue lê-la).</li>
        <li>Se você é trabalhador: descrição do perfil, profissões, cidades que atende e as fotos e vídeos do portfólio.</li>
        <li>Avaliações: a nota e o comentário que um cliente escreve sobre um trabalhador.</li>
        <li>A data do seu último acesso.</li>
      </ul>

      <h2 class="font-semibold text-slate-900">Para que usamos</h2>
      <ul class="list-disc pl-5 grid gap-1">
        <li>Para você entrar no app e recuperar a senha.</li>
        <li>Para mostrar os trabalhadores aos clientes que procuram um serviço.</li>
        <li>Para os clientes entrarem em contato com o trabalhador por WhatsApp ou ligação.</li>
      </ul>
      <p>Não vendemos seus dados e não usamos seus dados para propaganda.</p>

      <h2 class="font-semibold text-slate-900">O que fica público</h2>
      <p>No perfil de um trabalhador, qualquer pessoa vê o nome, o telefone, a descrição, as profissões, as cidades atendidas, o portfólio e as avaliações. O telefone fica público porque é por ele que o cliente faz contato. O e-mail nunca aparece para outras pessoas.</p>
      <p>Quem escreve uma avaliação tem o nome mostrado junto dela.</p>

      <h2 class="font-semibold text-slate-900">Sua localização</h2>
      <p>Na busca, o app pode pedir sua localização para mostrar trabalhadores perto de você. Ela é usada só naquela busca e não é guardada. Se você não permitir, a busca funciona normalmente, escolhendo estado e cidade.</p>

      <h2 class="font-semibold text-slate-900">Com quem compartilhamos</h2>
      <p>Os dados ficam no nosso servidor e banco de dados. Quando você toca em "Chamar no WhatsApp", o app abre o WhatsApp, que segue a política de privacidade dele.</p>

      <h2 class="font-semibold text-slate-900">Por quanto tempo</h2>
      <p>Guardamos seus dados enquanto sua conta existir. Quando você exclui a conta, apagamos tudo na hora.</p>

      <h2 class="font-semibold text-slate-900">Seus direitos</h2>
      <p>Se você é trabalhador, pode corrigir seus dados em <strong>Meu perfil</strong>. Para corrigir outros dados, fale com a gente pelo contato abaixo. Você pode excluir sua conta a qualquer momento em <strong>menu da conta → Excluir conta</strong>. Isso apaga sua conta, seu perfil, seu portfólio e as avaliações que você recebeu e escreveu.</p>
      <!-- The contact channel the LGPD requires. -->
      <p>
        Para qualquer dúvida ou pedido sobre seus dados, mande uma mensagem em
        <RouterLink to="/ajuda" class="text-brand font-medium hover:underline">Ajuda e suporte</RouterLink><template v-if="SUPPORT_EMAIL">
          ou escreva para <a :href="`mailto:${SUPPORT_EMAIL}`" class="text-brand font-medium hover:underline">{{ SUPPORT_EMAIL }}</a></template>.
      </p>

      <h2 class="font-semibold text-slate-900">Mudanças nesta política</h2>
      <p>Se esta política mudar, a data no topo será atualizada.</p>
    </article>
  </div>
</template>
