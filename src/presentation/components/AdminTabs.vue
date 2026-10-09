<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tabs = [
  { to: '/admin/categories', icon: 'mdi:view-grid-outline', label: 'Categorias' },
  { to: '/admin/users', icon: 'mdi:account-group-outline', label: 'Usuários' },
]
</script>

<template>
  <div class="grid gap-3">
    <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
      <Icon icon="mdi:shield-crown-outline" class="text-brand" />Admin
    </h2>
    <nav class="flex gap-1 p-1 bg-slate-100 rounded-xl">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="route.path.startsWith(tab.to) ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800'"
      >
        <Icon :icon="tab.icon" />{{ tab.label }}
      </RouterLink>
    </nav>
  </div>
</template>
