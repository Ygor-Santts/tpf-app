<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
<template>
  <div
    class="rounded-2xl border shadow-card p-4 bg-gradient-to-br from-gray-50 to-white grid gap-1"
  >
    <div class="font-semibold">{{ t('home.quick') }}</div>
    <div class="text-xs text-gray-600">{{ t('home.quickSubtitle') }}</div>
  </div>
</template>
