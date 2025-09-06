<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
const tax = useTaxonomyStore()
onMounted(() => tax.loadStates())
</script>

<template>
  <section class="grid gap-3">
    <h2 class="text-lg font-semibold">States</h2>
    <RouterLink v-for="s in tax.states" :key="s.code" :to="`/tabs/states/${s.code}/cities`">
      <div class="rounded-2xl border p-4 shadow-card">{{ s.name }}</div>
    </RouterLink>
  </section>
</template>
