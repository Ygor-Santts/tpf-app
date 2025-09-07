<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { searchWorkers, type WorkerSearchParams } from '@infra/services/worker.service'
import WorkerCard from '@ui/components/WorkerCard.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const tax = useTaxonomyStore()
const name = ref('')
const selectedCategory = ref<number | null>(null)
const selectedOccupationIds = ref<number[]>([])
const selectedState = ref<string>('')
const selectedCityIds = ref<number[]>([])
const page = ref(1)
const limit = ref(10)
const loading = ref(false)
const error = ref<string | null>(null)
const results = ref<{ data: any[]; page: number; limit: number; total: number } | null>(null)
onMounted(async () => {
  await tax.loadCategories()
  await tax.loadStates()
})
function toggle(list: number[], id: number) {
  const i = list.indexOf(id)
  if (i >= 0) list.splice(i, 1)
  else list.push(id)
}
async function onCategoryChange() {
  selectedOccupationIds.value = []
  if (selectedCategory.value) await tax.loadOccupations(selectedCategory.value)
}
async function onStateChange() {
  selectedCityIds.value = []
  if (selectedState.value) await tax.loadCities(selectedState.value)
}
async function run(pageNum = 1) {
  loading.value = true
  error.value = null
  page.value = pageNum
  try {
    const params: WorkerSearchParams = {
      name: name.value || undefined,
      page: page.value,
      limit: limit.value,
      jobCategoryIds: selectedCategory.value ? [selectedCategory.value] : undefined,
      jobOccupationIds: selectedOccupationIds.value.length
        ? selectedOccupationIds.value
        : undefined,
      operationCitiesIds: selectedCityIds.value.length ? selectedCityIds.value : undefined,
    }
    results.value = await searchWorkers(params)
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Search failed'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <section class="grid gap-4">
    <h2 class="text-lg font-semibold">{{ t('workers.findProfessionals') }}</h2>
    <div class="grid gap-2">
      <input
        v-model="name"
        :placeholder="t('workers.nameOptional')"
        class="border rounded-xl p-3"
      />
      <div class="grid gap-1">
        <label class="text-sm text-gray-600">{{ t('auth.category') }}</label>
        <select
          v-model="selectedCategory"
          @change="onCategoryChange"
          class="border rounded-xl p-3 cursor-pointer"
        >
          <option :value="null">{{ t('common.all') }}</option>
          <option v-for="c in tax.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
      <div v-if="selectedCategory" class="grid gap-2">
        <label class="text-sm text-gray-600">{{ t('auth.occupations') }}</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="o in tax.occupationsByCategory[selectedCategory] || []"
            :key="o.id"
            type="button"
            class="px-3 py-2 rounded-full border cursor-pointer"
            :class="{ 'bg-black text-white': selectedOccupationIds.includes(o.id) }"
            @click="toggle(selectedOccupationIds, o.id)"
          >
            {{ o.name }}
          </button>
        </div>
      </div>
      <div class="grid gap-1">
        <label class="text-sm text-gray-600">{{ t('auth.state') }}</label>
        <select
          v-model="selectedState"
          @change="onStateChange"
          class="border rounded-xl p-3 cursor-pointer"
        >
          <option value="">{{ t('common.all') }}</option>
          <option v-for="s in tax.states" :key="s.code" :value="s.code">{{ s.name }}</option>
        </select>
      </div>
      <div v-if="selectedState" class="grid gap-2">
        <label class="text-sm text-gray-600">{{ t('auth.cities') }}</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="c in tax.citiesByState[selectedState] || []"
            :key="c.id"
            type="button"
            class="px-3 py-2 rounded-full border cursor-pointer"
            :class="{ 'bg-black text-white': selectedCityIds.includes(c.id) }"
            @click="toggle(selectedCityIds, c.id)"
          >
            {{ c.name }}
          </button>
        </div>
      </div>
      <button
        @click="run(1)"
        :disabled="loading"
        class="rounded-xl p-3 bg-black text-white cursor-pointer"
      >
        {{ loading ? t('common.find') + '...' : t('common.find') }}
      </button>
      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
    </div>
    <div v-if="results">
      <p class="text-sm text-gray-600">{{ t('workers.total') }}: {{ results.total }}</p>
      <div class="grid gap-3 mt-2">
        <WorkerCard
          v-for="w in results.data"
          :key="w.id"
          :name="w.name"
          :subtitle="w.email || w.phone"
          :badges="w.occupations || []"
        />
      </div>
      <div class="flex justify-between items-center mt-3">
        <button
          class="px-3 py-2 border rounded-xl cursor-pointer"
          :disabled="page <= 1"
          @click="run(page - 1)"
        >
          {{ t('common.previous') }}
        </button>
        <div class="text-sm">Page {{ page }}</div>
        <button
          class="px-3 py-2 border rounded-xl cursor-pointer"
          :disabled="results.data.length < limit"
          @click="run(page + 1)"
        >
          {{ t('common.next') }}
        </button>
      </div>
    </div>
  </section>
</template>
