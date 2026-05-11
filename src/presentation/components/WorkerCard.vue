<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import StarRating from '@ui/components/StarRating.vue'
const { t } = useI18n()

defineProps<{
  id?: number
  name: string
  phone?: string
  cities?: string[]
  occupations?: string[]
  averageRating?: number
  ratingCount?: number
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
        <div class="flex items-center gap-2 mt-0.5 flex-wrap">
          <div v-if="ratingCount && ratingCount > 0" class="flex items-center gap-1">
            <StarRating :score="Math.round(averageRating ?? 0)" size="w-3 h-3" />
            <span class="text-xs text-slate-500">{{ averageRating?.toFixed(1) }} ({{ ratingCount }})</span>
          </div>
          <div v-if="phone" class="flex items-center gap-1 text-xs text-slate-500">
            <Icon icon="mdi:phone-outline" class="text-sm" />
            {{ phone }}
          </div>
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

    <div class="flex gap-2 mt-1">
      <RouterLink
        v-if="id"
        :to="`/tabs/workers/${id}`"
        class="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border text-sm font-medium text-slate-600 hover:border-brand hover:text-brand transition-colors"
      >
        <Icon icon="mdi:account-outline" class="text-base" />
        {{ t('workers.viewProfile') }}
      </RouterLink>
      <a
        v-if="phone"
        :href="`tel:${phone}`"
        class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-colors"
      >
        <Icon icon="mdi:phone" class="text-base" />
        {{ t('workers.contact') }}
      </a>
    </div>
  </div>
</template>
