<script setup lang="ts">
import AppLogo from '@ui/components/AppLogo.vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useAuthStore } from '@app/stores/auth'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const clientNavItems = computed(() => [
  { to: '/tabs/home', icon: 'mdi:home-outline', activeIcon: 'mdi:home', label: t('app.tabs.home') },
  { to: '/tabs/workers', icon: 'mdi:magnify', activeIcon: 'mdi:magnify', label: t('app.tabs.search') },
  { to: '/tabs/categories', icon: 'mdi:view-grid-outline', activeIcon: 'mdi:view-grid', label: t('app.tabs.categories') },
  { to: '/tabs/states', icon: 'mdi:map-marker-outline', activeIcon: 'mdi:map-marker', label: t('app.tabs.locations') },
])

const workerNavItems = computed(() => [
  { to: '/worker/dashboard', icon: 'mdi:view-dashboard-outline', activeIcon: 'mdi:view-dashboard', label: t('worker.tabs.dashboard') },
  { to: '/worker/profile/edit', icon: 'mdi:account-edit-outline', activeIcon: 'mdi:account-edit', label: t('worker.tabs.profile') },
  { to: '/worker/portfolio', icon: 'mdi:image-multiple-outline', activeIcon: 'mdi:image-multiple', label: t('worker.tabs.portfolio') },
  { to: '/worker/ratings', icon: 'mdi:star-outline', activeIcon: 'mdi:star', label: t('worker.tabs.ratings') },
])

const navItems = computed(() => auth.inWorkerMode ? workerNavItems.value : clientNavItems.value)

function isActive(to: string) {
  return route.path.startsWith(to)
}

function logout() {
  auth.logout()
  router.replace('/login')
}

function switchMode() {
  auth.setMode(auth.inWorkerMode ? 'client' : 'worker')
  router.push(auth.home)
}
</script>

<template>
  <aside class="fixed inset-y-0 left-0 w-60 bg-white border-r flex flex-col z-40">
    <div class="h-16 flex items-center px-6 border-b">
      <RouterLink :to="auth.home" class="text-xl">
        <AppLogo />
      </RouterLink>
    </div>

    <div v-if="auth.inWorkerMode" class="px-4 py-2 border-b">
      <span class="text-xs font-semibold uppercase tracking-wide text-brand bg-brand-50 px-2 py-1 rounded-full">Trabalhador</span>
    </div>

    <nav class="flex-1 px-3 py-4 flex flex-col gap-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
        :class="isActive(item.to)
          ? 'bg-brand-50 text-brand'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
      >
        <Icon :icon="isActive(item.to) ? item.activeIcon : item.icon" class="text-xl flex-shrink-0" />
        {{ item.label }}
      </RouterLink>

      <div v-if="auth.token" class="mt-2 pt-2 border-t">
        <button
          v-if="auth.isWorker"
          @click="switchMode"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <Icon icon="mdi:swap-horizontal" class="text-xl flex-shrink-0" />
          {{ auth.inWorkerMode ? t('mode.toClient') : t('mode.toWorker') }}
        </button>
        <RouterLink
          v-else
          to="/become-worker"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <Icon icon="mdi:briefcase-plus-outline" class="text-xl flex-shrink-0" />
          {{ t('mode.becomeWorker') }}
        </RouterLink>
      </div>
    </nav>

    <div class="p-4 border-t flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-xs text-slate-500 font-medium uppercase tracking-wide">{{ t('app.language') }}</span>
        <select v-model="locale" class="text-xs border rounded-lg px-2 py-1 cursor-pointer bg-white text-slate-700">
          <option value="pt-BR">PT-BR</option>
          <option value="en">EN</option>
        </select>
      </div>
      <RouterLink
        to="/ajuda"
        class="flex items-center gap-2 text-sm text-slate-500 hover:text-brand transition-colors px-1 py-1"
      >
        <Icon icon="mdi:help-circle-outline" class="text-lg" />
        Ajuda e suporte
      </RouterLink>
      <button
        v-if="auth.token"
        @click="logout"
        class="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors px-1 py-1"
      >
        <Icon icon="mdi:logout" class="text-lg" />
        Sair
      </button>
      <RouterLink
        v-if="!auth.token"
        to="/register-client"
        class="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
      >
        <Icon icon="mdi:account-plus-outline" class="text-lg" />
        {{ t('visitor.signUp') }}
      </RouterLink>
      <RouterLink
        v-if="!auth.token"
        to="/login"
        class="flex items-center gap-2 text-sm text-brand hover:text-brand-dark transition-colors px-1 py-1"
      >
        <Icon icon="mdi:login" class="text-lg" />
        Entrar
      </RouterLink>
    </div>
  </aside>
</template>
