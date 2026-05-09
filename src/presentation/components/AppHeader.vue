<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
</script>

<template>
  <header class="fixed top-0 inset-x-0 z-30 h-14 bg-white border-b flex items-center justify-between px-4">
    <RouterLink to="/tabs/home" class="flex items-center gap-2">
      <span class="text-lg font-bold text-brand">Trampo Fácil</span>
    </RouterLink>
    <select v-model="locale" class="text-xs border rounded-lg px-2 py-1 cursor-pointer bg-white text-slate-600">
      <option value="pt-BR">PT-BR</option>
      <option value="en">EN</option>
    </select>
  </header>
</template>
