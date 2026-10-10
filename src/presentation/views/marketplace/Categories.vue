<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import EmptyState from '@ui/components/EmptyState.vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()
const tax = useTaxonomyStore()

onMounted(() => tax.loadCategories())

// A worker's own new category can sit in the store while it waits for review;
// browsing only shows the approved ones.
const categories = computed(() => tax.categories.filter((c) => !c.pending))

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
    <div>
      <h2 class="text-xl font-bold text-slate-900">{{ t('marketplace.categories') }}</h2>
      <p class="text-sm text-slate-500 mt-1">{{ t('marketplace.categoriesHint') }}</p>
    </div>

    <div v-if="tax.loading" class="grid gap-3">
      <div v-for="i in 4" :key="i" class="h-20 rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <EmptyState
      v-else-if="!categories.length"
      icon="mdi:view-grid-outline"
      :title="t('marketplace.noCategories')"
      :description="t('marketplace.noCategoriesDesc')"
    >
      <RouterLink to="/tabs/workers" class="px-4 py-2 rounded-xl border text-sm text-brand border-brand hover:bg-brand-50 transition-colors">
        {{ t('workers.findProfessionals') }}
      </RouterLink>
    </EmptyState>

    <div v-else class="grid gap-3">
      <RouterLink
        v-for="c in categories"
        :key="c.id"
        :to="`/tabs/categories/${c.id}/occupations`"
        class="group bg-white rounded-2xl border shadow-card p-4 flex items-center gap-4 hover:shadow-card-hover hover:border-brand-200 transition-all cursor-pointer"
      >
        <div class="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
          <Icon :icon="getCategoryIcon(c.name)" class="text-2xl text-brand" />
        </div>
        <div class="flex-1">
          <div class="font-semibold text-slate-900">{{ c.name }}</div>
          <div class="text-xs text-slate-500 mt-0.5">{{ t('marketplace.seeOccupations') }}</div>
        </div>
        <Icon icon="mdi:chevron-right" class="text-slate-300 text-xl flex-shrink-0 group-hover:text-brand transition-colors" />
      </RouterLink>
    </div>
  </section>
</template>
