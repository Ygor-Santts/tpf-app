<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()
const tax = useTaxonomyStore()

onMounted(() => tax.loadStates())
</script>

<template>
  <section class="grid gap-4">
    <h2 class="text-xl font-bold text-slate-900">{{ t('locales.states') }}</h2>

    <div v-if="tax.loading" class="grid grid-cols-2 gap-3">
      <div v-for="i in 8" :key="i" class="h-16 rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <RouterLink
        v-for="s in tax.states"
        :key="s.code"
        :to="`/tabs/states/${s.code}/cities`"
        class="group bg-white rounded-2xl border shadow-card p-3 flex items-center gap-3 hover:shadow-card-hover hover:border-brand-200 transition-all cursor-pointer"
      >
        <div class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-50 transition-colors">
          <span class="text-xs font-bold text-slate-600 group-hover:text-brand transition-colors">{{ s.code }}</span>
        </div>
        <span class="text-sm font-medium text-slate-700 leading-tight truncate">{{ s.name }}</span>
      </RouterLink>
    </div>
  </section>
</template>
