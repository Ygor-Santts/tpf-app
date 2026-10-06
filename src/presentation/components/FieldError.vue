<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{ message?: string }>()
</script>

<template>
  <p v-if="message" class="flex items-center gap-1 text-xs text-red-600 mt-1" role="alert">
    <Icon icon="mdi:alert-circle-outline" class="flex-shrink-0" />{{ message }}
  </p>
</template>
