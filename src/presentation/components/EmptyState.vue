<script setup lang="ts">
import { Icon } from '@iconify/vue'
defineProps<{ icon?: string; title: string; description?: string }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="h-16 w-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
      <Icon :icon="icon ?? 'mdi:magnify'" class="text-3xl text-brand" />
    </div>
    <h3 class="text-base font-semibold text-slate-800 mb-1">{{ title }}</h3>
    <p v-if="description" class="text-sm text-slate-500 max-w-xs">{{ description }}</p>
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>
