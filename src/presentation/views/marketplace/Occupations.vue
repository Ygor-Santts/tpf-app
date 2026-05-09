<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTaxonomyStore } from '@app/stores/taxonomy'
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
const occupations = computed(() => tax.occupationsByCategory[categoryId.value] ?? [])
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

    <div v-else class="grid gap-2">
      <div
        v-for="o in occupations"
        :key="o.id"
        class="bg-white rounded-2xl border shadow-card p-4 flex items-center gap-3"
      >
        <div class="h-9 w-9 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
          <Icon icon="mdi:tools" class="text-brand text-lg" />
        </div>
        <span class="font-medium text-slate-800 text-sm">{{ o.name }}</span>
      </div>
    </div>
  </section>
</template>
