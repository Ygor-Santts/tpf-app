<script setup lang="ts">
// The two ways in for a visitor: as a client or as a worker.
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()

const choices = [
  { to: '/register-client', icon: 'mdi:account-search-outline', title: 'visitor.asClient', desc: 'visitor.asClientDesc', color: 'bg-brand-50 text-brand' },
  { to: '/register-worker', icon: 'mdi:account-hard-hat-outline', title: 'visitor.asWorker', desc: 'visitor.asWorkerDesc', color: 'bg-amber-50 text-amber-600' },
]
</script>

<template>
  <div class="grid gap-3">
    <h2 class="font-bold text-slate-900">{{ t('visitor.joinTitle') }}</h2>
    <div class="grid sm:grid-cols-2 gap-3">
      <RouterLink
        v-for="c in choices"
        :key="c.to"
        :to="c.to"
        class="group bg-white rounded-2xl border shadow-card p-4 flex items-center gap-4 hover:shadow-card-hover hover:border-brand-200 transition-all"
      >
        <div :class="['h-11 w-11 rounded-full flex items-center justify-center flex-shrink-0', c.color]">
          <Icon :icon="c.icon" class="text-2xl" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-slate-900 text-sm">{{ t(c.title) }}</div>
          <div class="text-xs text-slate-500 mt-0.5">{{ t(c.desc) }}</div>
        </div>
        <Icon icon="mdi:chevron-right" class="text-xl text-slate-300 group-hover:text-brand" />
      </RouterLink>
    </div>
  </div>
</template>
