<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { useI18n } from 'vue-i18n'
const { t } = useI18n(); const tax = useTaxonomyStore()
onMounted(() => tax.loadCategories())
</script>
<template>
  <section class="grid gap-3">
    <h2 class="text-lg font-semibold">{{ t('marketplace.categories') }}</h2>
    <RouterLink v-for="c in tax.categories" :key="c.id" :to="`/tabs/categories/${c.id}/occupations`" class="cursor-pointer">
      <div class="rounded-2xl border p-4 shadow-card">{{ c.name }}</div>
    </RouterLink>
  </section>
</template>
