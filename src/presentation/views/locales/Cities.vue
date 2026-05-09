<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()
const route = useRoute()
const tax = useTaxonomyStore()
const code = computed(() => String(route.params.code))

onMounted(async () => {
  await tax.loadStates()
  await tax.loadCities(code.value)
})

const stateName = computed(() => tax.states.find(s => s.code === code.value)?.name ?? code.value)
const cities = computed(() => tax.citiesByState[code.value] ?? [])
</script>

<template>
  <section class="grid gap-4">
    <div class="flex items-center gap-3">
      <RouterLink to="/tabs/states" class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
        <Icon icon="mdi:arrow-left" class="text-slate-600" />
      </RouterLink>
      <div>
        <div class="text-xs text-slate-500">{{ t('locales.backToStates') }}</div>
        <h2 class="text-xl font-bold text-slate-900">{{ stateName }}</h2>
      </div>
    </div>

    <div v-if="tax.loading" class="grid grid-cols-2 gap-3">
      <div v-for="i in 6" :key="i" class="h-14 rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div
        v-for="c in cities"
        :key="c.id"
        class="bg-white rounded-2xl border shadow-card p-3 flex items-center gap-2"
      >
        <Icon icon="mdi:map-marker-outline" class="text-brand flex-shrink-0" />
        <span class="text-sm font-medium text-slate-700 truncate">{{ c.name }}</span>
      </div>
    </div>
  </section>
</template>
