<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { useI18n } from 'vue-i18n'
const { t } = useI18n(); const tax = useTaxonomyStore()
onMounted(() => tax.loadStates())
</script>
<template>
  <section class="grid gap-3">
    <h2 class="text-lg font-semibold">{{ t('locales.states') }}</h2>
    <RouterLink v-for="s in tax.states" :key="s.code" :to="`/tabs/states/${s.code}/cities`" class="cursor-pointer">
      <div class="rounded-2xl border p-4 shadow-card">{{ s.name }}</div>
    </RouterLink>
  </section>
</template>
