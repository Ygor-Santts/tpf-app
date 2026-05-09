<script setup lang="ts">
defineProps<{ lines?: number }>()
</script>

<template>
  <div class="bg-white rounded-2xl border shadow-card p-4 animate-pulse">
    <div class="flex items-start gap-3">
      <div class="h-10 w-10 rounded-full bg-slate-200 flex-shrink-0" />
      <div class="flex-1 grid gap-2">
        <div class="h-4 bg-slate-200 rounded-lg w-2/3" />
        <div class="h-3 bg-slate-100 rounded-lg w-1/2" />
        <div v-if="(lines ?? 2) > 1" class="flex gap-2 mt-1">
          <div class="h-5 w-16 bg-slate-100 rounded-full" />
          <div class="h-5 w-20 bg-slate-100 rounded-full" />
        </div>
      </div>
    </div>
  </div>
</template>
