<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <span class="inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
    <Icon icon="mdi:star-shooting" class="text-xs" />
    {{ t('workers.featured') }}
  </span>
</template>
