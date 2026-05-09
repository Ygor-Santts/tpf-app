<script setup lang="ts">
defineProps<{ steps: string[]; current: number }>()
</script>

<template>
  <div class="flex items-center gap-0">
    <template v-for="(label, i) in steps" :key="i">
      <div class="flex flex-col items-center gap-1 flex-1">
        <div
          class="h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
          :class="i + 1 < current
            ? 'bg-brand text-white'
            : i + 1 === current
              ? 'bg-brand text-white ring-4 ring-brand-100'
              : 'bg-slate-100 text-slate-400'"
        >
          <span v-if="i + 1 < current">✓</span>
          <span v-else>{{ i + 1 }}</span>
        </div>
        <span class="text-[10px] font-medium text-center leading-tight"
          :class="i + 1 === current ? 'text-brand' : 'text-slate-400'">
          {{ label }}
        </span>
      </div>
      <div v-if="i < steps.length - 1" class="h-px flex-1 mb-5 transition-colors"
        :class="i + 1 < current ? 'bg-brand' : 'bg-slate-200'" />
    </template>
  </div>
</template>
