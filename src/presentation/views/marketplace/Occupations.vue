<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const route = useRoute()
const categoryId = computed(() => Number(route.params.categoryId))
const tax = useTaxonomyStore()
onMounted(async () => { await tax.loadCategories(); await tax.loadOccupations(categoryId.value) })
</script>

<template>
  <section class="grid gap-3">
    <h2 class="text-lg font-semibold">{{ t('marketplace.occupations') }}</h2>
    <div class="grid gap-2">
      <div v-for="o in tax.occupationsByCategory[categoryId] || []" :key="o.id" class="rounded-2xl border p-4 shadow-card">
        {{ o.name }}
      </div>
    </div>
  </section>
</template>
