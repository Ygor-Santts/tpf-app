<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()
const tax = useTaxonomyStore()

onMounted(() => tax.loadCategories())

const categoryIcons: Record<string, string> = {
  'Construção Civil': 'mdi:hammer-wrench',
  'Jardinagem': 'mdi:flower',
  'Limpeza': 'mdi:broom',
  'Elétrica': 'mdi:lightning-bolt',
  'Pintura': 'mdi:format-paint',
}

function getCategoryIcon(name: string) {
  return categoryIcons[name] ?? 'mdi:briefcase-outline'
}
</script>

<template>
  <section class="grid gap-4">
    <h2 class="text-xl font-bold text-slate-900">{{ t('marketplace.categories') }}</h2>

    <div v-if="tax.loading" class="grid gap-3">
      <div v-for="i in 4" :key="i" class="h-20 rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <div v-else class="grid gap-3">
      <RouterLink
        v-for="c in tax.categories"
        :key="c.id"
        :to="`/tabs/categories/${c.id}/occupations`"
        class="group bg-white rounded-2xl border shadow-card p-4 flex items-center gap-4 hover:shadow-card-hover hover:border-brand-200 transition-all cursor-pointer"
      >
        <div class="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
          <Icon :icon="getCategoryIcon(c.name)" class="text-2xl text-brand" />
        </div>
        <div class="flex-1">
          <div class="font-semibold text-slate-900">{{ c.name }}</div>
          <div class="text-xs text-slate-500 mt-0.5">{{ t('marketplace.occupations') }}</div>
        </div>
        <Icon icon="mdi:chevron-right" class="text-slate-300 text-xl flex-shrink-0 group-hover:text-brand transition-colors" />
      </RouterLink>
    </div>
  </section>
</template>
