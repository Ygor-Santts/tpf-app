<script setup lang="ts">
import { Icon } from '@iconify/vue'
import FieldError from './FieldError.vue'

// Text input with an icon on the left and its error message below.
// Other attributes (type, placeholder, @blur...) go to the <input>.
defineOptions({ inheritAttrs: false })
defineProps<{ icon: string; error?: string }>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <div>
    <div class="relative">
      <Icon :icon="icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
      <input
        v-model="model"
        v-bind="$attrs"
        :aria-invalid="!!error"
        class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all"
      />
    </div>
    <FieldError :message="error" />
  </div>
</template>
