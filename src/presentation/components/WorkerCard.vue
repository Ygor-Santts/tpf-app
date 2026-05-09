<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps<{
  name: string
  phone?: string
  cities?: string[]
  occupations?: string[]
}>()
</script>

<template>
  <div class="bg-white rounded-2xl border shadow-card p-4 flex flex-col gap-3 hover:shadow-card-hover transition-shadow">
    <div class="flex items-start gap-3">
      <div class="h-11 w-11 rounded-full bg-brand-100 flex items-center justify-center text-brand font-bold text-lg flex-shrink-0">
        {{ name?.charAt(0)?.toUpperCase() }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-slate-900 truncate">{{ name }}</div>
        <div v-if="phone" class="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
          <Icon icon="mdi:phone-outline" class="text-sm" />
          {{ phone }}
        </div>
      </div>
    </div>

    <div v-if="occupations?.length" class="flex flex-wrap gap-1.5">
      <span
        v-for="o in occupations"
        :key="o"
        class="text-xs px-2.5 py-1 rounded-full bg-brand-50 text-brand font-medium border border-brand-100"
      >
        {{ o }}
      </span>
    </div>

    <div v-if="cities?.length" class="flex items-start gap-1.5">
      <Icon icon="mdi:map-marker-outline" class="text-slate-400 text-sm mt-0.5 flex-shrink-0" />
      <span class="text-xs text-slate-500">{{ cities.join(', ') }}</span>
    </div>

    <a
      v-if="phone"
      :href="`tel:${phone}`"
      class="mt-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-colors"
    >
      <Icon icon="mdi:phone" class="text-base" />
      {{ t('workers.contact') }}
    </a>
  </div>
</template>
