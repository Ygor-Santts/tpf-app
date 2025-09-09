<script setup lang="ts">
defineProps<{ name: string; subtitle?: string; badges?: string[] }>()
</script>
<template>
  <div class="rounded-2xl border p-4 shadow-sm flex items-start gap-3">
    <div
      class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
    >
      {{ name?.charAt(0)?.toUpperCase() }}
    </div>
    <div class="flex-1">
      <div class="font-medium">{{ name }}</div>
      <div v-if="subtitle" class="text-xs text-gray-500 mt-0.5">{{ subtitle }}</div>
      <div class="flex flex-wrap gap-1 mt-2">
        <span
          v-for="b in badges"
          :key="b"
          class="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 border"
          >{{ b }}</span
        >
      </div>
    </div>
  </div>
</template>
