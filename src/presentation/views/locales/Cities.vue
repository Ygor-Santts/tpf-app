<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTaxonomyStore } from '@app/stores/taxonomy'
const route = useRoute()
const code = computed(() => String(route.params.code))
const tax = useTaxonomyStore()
onMounted(async () => { await tax.loadStates(); await tax.loadCities(code.value) })
</script>

<template>
  <section class="grid gap-3">
    <h2 class="text-lg font-semibold">Cities</h2>
    <div class="grid gap-2">
      <div v-for="c in tax.citiesByState[code] || []" :key="c.id" class="rounded-2xl border p-4 shadow-card">
        {{ c.name }}
      </div>
    </div>
  </section>
</template>
