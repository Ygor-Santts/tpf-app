<script setup lang="ts">
// Brand logo. "full" is the square logo with the wordmark (auth pages);
// "mark" is the "T" icon next to the app name (header and sidebar).
withDefaults(defineProps<{ variant?: 'full' | 'mark' }>(), { variant: 'mark' })
</script>

<template>
  <img v-if="variant === 'full'" src="/logo.png" alt="Trampo Fácil" class="w-24 h-24 rounded-2xl shadow-md mx-auto" />
  <span v-else class="flex items-center gap-2">
    <img src="/icon-192.png" alt="" class="w-8 h-8 rounded-lg" />
    <span class="font-bold text-brand">Trampo Fácil</span>
  </span>
</template>
