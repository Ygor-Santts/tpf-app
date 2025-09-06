<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
const tax = useTaxonomyStore()
onMounted(() => tax.loadCategories())
</script>

<template>
  <section class="grid gap-3">
    <h2 class="text-lg font-semibold">Categories</h2>
    <RouterLink v-for="c in tax.categories" :key="c.id" :to="`/tabs/categories/${c.id}/occupations`">
      <div class="rounded-2xl border p-4 shadow-card">{{ c.name }}</div>
    </RouterLink>
  </section>
</template>
