<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
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
        <div class="flex items-center gap-2 mt-0.5">
          <div v-if="ratingCount" class="flex items-center gap-1">
            <svg v-for="i in 5" :key="i" :class="['w-3 h-3', i <= Math.round(averageRating ?? 0) ? 'text-amber-400' : 'text-slate-200']" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
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
        Ver perfil
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
