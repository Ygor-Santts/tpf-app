<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import type { City } from '@domain/marketplace'

// A state can have hundreds of cities, so only the selected ones and the
// first matches of the search are shown as chips.
const MAX_SHOWN = 30

const props = defineProps<{ cities: City[]; modelValue: number[] }>()
const emit = defineEmits<{ 'update:modelValue': [ids: number[]] }>()
const { t } = useI18n()

const query = ref('')
const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const matches = computed(() => {
  const q = normalize(query.value.trim())
  return props.cities.filter((c) => !props.modelValue.includes(c.id) && normalize(c.name).includes(q))
})
const selected = computed(() => props.cities.filter((c) => props.modelValue.includes(c.id)))
const shown = computed(() => [...selected.value, ...matches.value.slice(0, MAX_SHOWN)])

function toggle(id: number) {
  const ids = props.modelValue.includes(id) ? props.modelValue.filter((x) => x !== id) : [...props.modelValue, id]
  emit('update:modelValue', ids)
}
</script>

<template>
  <div class="grid gap-2">
    <div class="relative">
      <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        v-model="query"
        :placeholder="t('locales.searchCity')"
        class="w-full border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-brand"
      />
    </div>
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="c in shown"
        :key="c.id"
        type="button"
        @click="toggle(c.id)"
        class="px-2.5 py-1 rounded-full border text-xs font-medium cursor-pointer transition-colors"
        :class="modelValue.includes(c.id) ? 'bg-brand text-white border-brand' : 'text-slate-600 hover:border-brand hover:text-brand'"
      >{{ c.name }}</button>
      <span v-if="!shown.length" class="text-sm text-slate-400">{{ t('locales.noCityFound') }}</span>
    </div>
    <p v-if="matches.length > MAX_SHOWN" class="text-xs text-slate-400">{{ t('locales.typeToFindMore') }}</p>
  </div>
</template>
