<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useAuthStore } from '@app/stores/auth'

const { t } = useI18n()
const route = useRoute()
const auth = useAuthStore()

const clientTabs = computed(() => [
  { to: '/tabs/home', icon: 'mdi:home-outline', activeIcon: 'mdi:home', label: t('app.tabs.home') },
  { to: '/tabs/workers', icon: 'mdi:magnify', activeIcon: 'mdi:magnify', label: t('app.tabs.search') },
  { to: '/tabs/categories', icon: 'mdi:view-grid-outline', activeIcon: 'mdi:view-grid', label: t('app.tabs.categories') },
  { to: '/tabs/states', icon: 'mdi:map-marker-outline', activeIcon: 'mdi:map-marker', label: t('app.tabs.locations') },
])

const workerTabs = [
  { to: '/worker/dashboard', icon: 'mdi:view-dashboard-outline', activeIcon: 'mdi:view-dashboard', label: 'Dashboard' },
  { to: '/worker/profile/edit', icon: 'mdi:account-edit-outline', activeIcon: 'mdi:account-edit', label: 'Perfil' },
  { to: '/worker/portfolio', icon: 'mdi:image-multiple-outline', activeIcon: 'mdi:image-multiple', label: 'Portfólio' },
  { to: '/worker/ratings', icon: 'mdi:star-outline', activeIcon: 'mdi:star', label: 'Avaliações' },
]

const tabs = computed(() => auth.isWorker ? workerTabs : clientTabs.value)

function isActive(to: string) {
  return route.path.startsWith(to)
}
</script>

<template>
  <nav class="fixed bottom-0 inset-x-0 z-30 bg-white border-t flex safe-bottom">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[11px] transition-colors"
      :class="isActive(tab.to) ? 'text-brand' : 'text-slate-400'"
    >
      <Icon :icon="isActive(tab.to) ? tab.activeIcon : tab.icon" class="text-xl" />
      <span>{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>
