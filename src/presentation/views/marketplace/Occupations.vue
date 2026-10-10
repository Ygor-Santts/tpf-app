<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import EmptyState from '@ui/components/EmptyState.vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()
const route = useRoute()
const tax = useTaxonomyStore()
const categoryId = computed(() => Number(route.params.categoryId))

onMounted(async () => {
  await tax.loadCategories()
  await tax.loadOccupations(categoryId.value)
})

const categoryName = computed(() => tax.categories.find(c => c.id === categoryId.value)?.name ?? '')
// Only approved professions lead to a search; a worker's own pending ones stay out.
const occupations = computed(() => (tax.occupationsByCategory[categoryId.value] ?? []).filter(o => !o.pending))

// Opens the search already filtered; it starts near the user like any search.
function workersLink(occupationId?: number) {
  const query: Record<string, string> = { category: String(categoryId.value) }
  if (occupationId) query.occupation = String(occupationId)
  return { path: '/tabs/workers', query }
}
</script>

<template>
  <section class="grid gap-4">
    <div class="flex items-center gap-3">
      <RouterLink to="/tabs/categories" class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
        <Icon icon="mdi:arrow-left" class="text-slate-600" />
      </RouterLink>
      <div>
        <div class="text-xs text-slate-500">{{ t('marketplace.backToCategories') }}</div>
        <h2 class="text-xl font-bold text-slate-900">{{ categoryName || t('marketplace.occupations') }}</h2>
      </div>
    </div>

    <div v-if="tax.loading" class="grid gap-3">
      <div v-for="i in 5" :key="i" class="h-16 rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <EmptyState
      v-else-if="!occupations.length"
      icon="mdi:tools"
      :title="t('marketplace.noOccupations')"
      :description="t('marketplace.noOccupationsDesc')"
    >
      <RouterLink to="/tabs/categories" class="px-4 py-2 rounded-xl border text-sm text-brand border-brand hover:bg-brand-50 transition-colors">
        {{ t('marketplace.backToCategories') }}
      </RouterLink>
    </EmptyState>

    <template v-else>
      <p class="text-sm text-slate-500">{{ t('marketplace.occupationsHint') }}</p>

      <RouterLink
        :to="workersLink()"
        class="flex items-center justify-center gap-2 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors"
      >
        <Icon icon="mdi:account-search-outline" class="text-lg" />
        {{ t('marketplace.allInCategory', { category: categoryName }) }}
      </RouterLink>

      <div class="grid gap-2">
        <RouterLink
          v-for="o in occupations"
          :key="o.id"
          :to="workersLink(o.id)"
          class="group bg-white rounded-2xl border shadow-card p-4 flex items-center gap-3 hover:shadow-card-hover hover:border-brand-200 transition-all"
        >
          <div class="h-9 w-9 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
            <Icon icon="mdi:tools" class="text-brand text-lg" />
          </div>
          <span class="flex-1 font-medium text-slate-800 text-sm">{{ o.name }}</span>
          <Icon icon="mdi:chevron-right" class="text-slate-300 text-xl flex-shrink-0 group-hover:text-brand transition-colors" />
        </RouterLink>
      </div>
    </template>
  </section>
</template>
