<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { searchWorkers, type WorkerSearchParams } from '@infra/services/worker.service'
import { getCurrentPosition, type Coords } from '@infra/services/location.service'
import CityPicker from '@ui/components/CityPicker.vue'
import WorkerCard from '@ui/components/WorkerCard.vue'
import SkeletonCard from '@ui/components/SkeletonCard.vue'
import EmptyState from '@ui/components/EmptyState.vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()
const tax = useTaxonomyStore()
const route = useRoute()

const name = ref('')
const selectedCategory = ref<number | null>(null)
const selectedOccupationIds = ref<number[]>([])
const selectedState = ref<string>('')
const selectedCityIds = ref<number[]>([])
const minRating = ref<number | null>(null)
const page = ref(1)
const limit = ref(10)
const loading = ref(false)
const searched = ref(false)
const error = ref<string | null>(null)
const results = ref<{ data: any[]; page: number; limit: number; total: number } | null>(null)
const filtersOpen = ref(false)
// "best" = Melhores no ramo: ranked by rating only, paid Destaque does not count.
const sort = ref<'best' | undefined>(route.query.sort === 'best' ? 'best' : undefined)

function setSort(value: 'best' | undefined) {
  sort.value = value
  run(1)
}

// The search starts filtered by the user's region. Picking cities by hand wins
// over the location, and "see all" turns it off.
const RADII = [10, 30, 50]
const coords = ref<Coords | null>(null)
const location = ref<'locating' | 'on' | 'unavailable' | 'off'>('locating')
const radiusKm = ref(30)
const usingLocation = computed(() => location.value === 'on' && !selectedCityIds.value.length)

onMounted(async () => {
  await Promise.all([tax.loadCategories(), tax.loadStates()])
  await applyCategoryFromLink()
  await useMyLocation()
})

// The Categories tab links here with ?category= and, for one profession, ?occupation=.
async function applyCategoryFromLink() {
  const categoryId = Number(route.query.category)
  if (!categoryId) return
  selectedCategory.value = categoryId
  await tax.loadOccupations(categoryId)
  const occupationId = Number(route.query.occupation)
  if (occupationId) selectedOccupationIds.value = [occupationId]
}

// Shown above the results, since on a phone the filters sit in a closed drawer.
const activeTaxonomyLabel = computed(() => {
  if (!selectedCategory.value) return ''
  const occupations = tax.occupationsByCategory[selectedCategory.value] ?? []
  const names = occupations.filter((o) => selectedOccupationIds.value.includes(o.id)).map((o) => o.name)
  if (names.length) return names.join(', ')
  return tax.categories.find((c) => c.id === selectedCategory.value)?.name ?? ''
})

function clearTaxonomy() {
  selectedCategory.value = null
  selectedOccupationIds.value = []
  run(1)
}

async function useMyLocation() {
  location.value = 'locating'
  coords.value = await getCurrentPosition()
  location.value = coords.value ? 'on' : 'unavailable'
  await run(1)
}

function showAll() {
  location.value = 'off'
  run(1)
}

function setRadius(km: number) {
  radiusKm.value = km
  run(1)
}

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
  searched.value = true
  page.value = pageNum
  filtersOpen.value = false
  try {
    const params: WorkerSearchParams = {
      name: name.value || undefined,
      page: page.value,
      limit: limit.value,
      jobCategoryIds: selectedCategory.value ? [selectedCategory.value] : undefined,
      jobOccupationIds: selectedOccupationIds.value.length ? selectedOccupationIds.value : undefined,
      operationCitiesIds: selectedCityIds.value.length ? selectedCityIds.value : undefined,
      minRating: minRating.value ?? undefined,
      sort: sort.value,
      ...(usingLocation.value && coords.value ? { ...coords.value, radiusKm: radiusKm.value } : {}),
    }
    results.value = await searchWorkers(params)
  } catch (e: any) {
    // The API answers 404 when nobody matches: show the empty state, not an error.
    if (e?.response?.status === 404) results.value = { data: [], page: page.value, limit: limit.value, total: 0 }
    else error.value = e?.response?.data?.message || 'Erro na busca.'
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  selectedCategory.value = null
  selectedOccupationIds.value = []
  selectedState.value = ''
  selectedCityIds.value = []
  name.value = ''
  minRating.value = null
}

const hasFilters = computed(() =>
  name.value || selectedCategory.value || selectedOccupationIds.value.length || selectedState.value || selectedCityIds.value.length || minRating.value
)

const totalPages = computed(() => results.value ? Math.ceil(results.value.total / limit.value) : 0)

function workerOccupations(w: any): string[] {
  return w.jobCategories?.flatMap((cat: any) => cat.occupations?.map((o: any) => o.name) ?? []) ?? []
}

function workerCities(w: any): string[] {
  return w.operationCities?.map((c: any) => c.name) ?? []
}
</script>

<template>
  <section class="grid gap-4">
    <h2 class="text-xl font-bold text-slate-900">{{ sort === 'best' ? t('workers.bestTitle') : t('workers.findProfessionals') }}</h2>

    <div class="flex items-center gap-2 flex-wrap">
      <button
        v-for="option in [undefined, 'best'] as const"
        :key="option ?? 'all'"
        type="button"
        @click="setSort(option)"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors"
        :class="sort === option ? 'bg-brand text-white border-brand' : 'bg-white text-slate-600 hover:border-brand hover:text-brand'"
      >
        <Icon :icon="option ? 'mdi:trophy-outline' : 'mdi:account-group-outline'" />
        {{ option ? t('workers.sortBest') : t('workers.sortAll') }}
      </button>
      <span v-if="sort === 'best'" class="text-xs text-slate-500">{{ t('workers.bestHint') }}</span>
    </div>

    <!-- Search bar -->
    <div class="flex gap-2">
      <div class="relative flex-1">
        <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
        <input
          v-model="name"
          :placeholder="t('workers.nameOptional')"
          @keyup.enter="run(1)"
          class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all"
        />
      </div>
      <!-- Mobile: filter button -->
      <button
        @click="filtersOpen = true"
        class="lg:hidden flex items-center gap-1.5 px-4 py-3 border rounded-xl bg-white text-sm font-medium text-slate-600 hover:border-brand hover:text-brand transition-colors relative"
      >
        <Icon icon="mdi:filter-outline" class="text-lg" />
        {{ t('common.filters') }}
        <span v-if="hasFilters" class="absolute -top-1 -right-1 h-4 w-4 bg-brand rounded-full text-white text-[9px] flex items-center justify-center font-bold">!</span>
      </button>
      <button
        @click="run(1)"
        :disabled="loading"
        class="hidden lg:flex items-center gap-2 px-5 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60"
      >
        <Icon v-if="loading" icon="mdi:loading" class="animate-spin" />
        {{ t('common.search') }}
      </button>
    </div>

    <!-- Layout desktop: sidebar filters + results -->
    <div class="lg:grid lg:grid-cols-[240px_1fr] lg:gap-6">

      <!-- Desktop filters panel -->
      <aside class="hidden lg:block">
        <div class="bg-white rounded-2xl border shadow-card p-4 grid gap-4 sticky top-6">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-slate-900 text-sm">{{ t('common.filters') }}</span>
            <button v-if="hasFilters" @click="clearFilters" class="text-xs text-brand hover:underline">{{ t('common.clearFilters') }}</button>
          </div>

          <div class="grid gap-1.5">
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.category') }}</label>
            <select v-model="selectedCategory" @change="onCategoryChange" class="border rounded-xl px-3 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-brand">
              <option :value="null">{{ t('common.all') }}</option>
              <option v-for="c in tax.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>

          <div v-if="selectedCategory" class="grid gap-2">
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.occupations') }}</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="o in tax.occupationsByCategory[selectedCategory] || []"
                :key="o.id"
                type="button"
                @click="toggle(selectedOccupationIds, o.id)"
                class="px-2.5 py-1 rounded-full border text-xs font-medium cursor-pointer transition-colors"
                :class="selectedOccupationIds.includes(o.id) ? 'bg-brand text-white border-brand' : 'text-slate-600 hover:border-brand hover:text-brand'"
              >{{ o.name }}</button>
            </div>
          </div>

          <div class="grid gap-1.5">
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.state') }}</label>
            <select v-model="selectedState" @change="onStateChange" class="border rounded-xl px-3 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-brand">
              <option value="">{{ t('common.all') }}</option>
              <option v-for="s in tax.states" :key="s.code" :value="s.code">{{ s.name }}</option>
            </select>
          </div>

          <div v-if="selectedState" class="grid gap-2">
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.cities') }}</label>
            <CityPicker v-model="selectedCityIds" :cities="tax.citiesByState[selectedState] || []" />
          </div>

          <div class="grid gap-1.5">
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('workers.minRating') }}</label>
            <div class="flex gap-1">
              <button
                v-for="star in [1,2,3,4,5]"
                :key="star"
                type="button"
                @click="minRating = minRating === star ? null : star"
                class="flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center gap-0.5"
                :class="minRating && minRating >= star ? 'bg-amber-50 border-amber-300 text-amber-600' : 'text-slate-300 hover:border-amber-300'"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span>{{ star }}</span>
              </button>
            </div>
          </div>

          <button @click="run(1)" :disabled="loading" class="w-full py-2.5 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60">
            {{ t('common.search') }}
          </button>
        </div>
      </aside>

      <!-- Results -->
      <div class="grid gap-3">
        <!-- Mobile: search button -->
        <button
          @click="run(1)"
          :disabled="loading"
          class="lg:hidden w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Icon v-if="loading" icon="mdi:loading" class="animate-spin" />
          {{ t('common.search') }}
        </button>

        <div v-if="activeTaxonomyLabel" class="flex">
          <button
            type="button"
            @click="clearTaxonomy"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-sm font-medium text-brand hover:bg-brand-100 transition-colors"
          >
            <Icon icon="mdi:tools" />
            {{ activeTaxonomyLabel }}
            <Icon icon="mdi:close" class="text-base" />
          </button>
        </div>

        <!-- Region -->
        <div class="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <template v-if="location === 'locating'">
            <Icon icon="mdi:loading" class="animate-spin text-brand" />{{ t('workers.locating') }}
          </template>
          <template v-else-if="usingLocation">
            <Icon icon="mdi:map-marker" class="text-brand" />
            <span class="font-medium text-slate-800">{{ t('workers.nearYou') }}</span>
            <button
              v-for="km in RADII"
              :key="km"
              type="button"
              @click="setRadius(km)"
              class="px-2.5 py-1 rounded-full border text-xs font-medium transition-colors"
              :class="radiusKm === km ? 'bg-brand text-white border-brand' : 'text-slate-600 hover:border-brand hover:text-brand'"
            >{{ t('workers.upToKm', { km }) }}</button>
            <button type="button" @click="showAll" class="text-xs text-brand hover:underline">{{ t('workers.seeAll') }}</button>
          </template>
          <template v-else-if="location === 'unavailable' && !selectedCityIds.length">
            <Icon icon="mdi:map-marker-off-outline" class="text-slate-400" />{{ t('workers.locationOff') }}
            <button type="button" @click="useMyLocation" class="text-xs text-brand hover:underline">{{ t('workers.tryAgain') }}</button>
          </template>
          <template v-else-if="location === 'off' && !selectedCityIds.length">
            <Icon icon="mdi:earth" class="text-slate-400" />{{ t('workers.allBrazil') }}
            <button type="button" @click="useMyLocation" class="text-xs text-brand hover:underline">{{ t('workers.useMyLocation') }}</button>
          </template>
        </div>

        <div v-if="error" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <Icon icon="mdi:alert-circle-outline" class="flex-shrink-0" />{{ error }}
        </div>

        <!-- Skeleton -->
        <template v-if="loading">
          <SkeletonCard v-for="i in 4" :key="i" />
        </template>

        <!-- Empty state -->
        <EmptyState
          v-else-if="searched && results && results.data.length === 0 && sort === 'best'"
          icon="mdi:trophy-outline"
          :title="t('workers.noBest')"
          :description="t('workers.noBestDesc')"
        >
          <button @click="setSort(undefined)" class="px-4 py-2 rounded-xl border text-sm text-brand border-brand hover:bg-brand-50 transition-colors">
            {{ t('workers.sortAll') }}
          </button>
        </EmptyState>
        <EmptyState
          v-else-if="searched && results && results.data.length === 0 && usingLocation"
          icon="mdi:map-marker-radius-outline"
          :title="t('workers.noneNearby')"
          :description="t('workers.noneNearbyDesc')"
        >
          <button @click="showAll" class="px-4 py-2 rounded-xl border text-sm text-brand border-brand hover:bg-brand-50 transition-colors">
            {{ t('workers.seeAll') }}
          </button>
        </EmptyState>
        <EmptyState
          v-else-if="searched && results && results.data.length === 0"
          icon="mdi:account-search-outline"
          :title="t('workers.noResults')"
          :description="t('workers.noResultsDesc')"
        >
          <button @click="clearFilters" class="px-4 py-2 rounded-xl border text-sm text-brand border-brand hover:bg-brand-50 transition-colors">
            {{ t('common.clearFilters') }}
          </button>
        </EmptyState>

        <!-- Results list -->
        <template v-else-if="results && results.data.length > 0">
          <div class="flex items-center justify-between text-sm text-slate-500">
            <span>{{ results.total }} {{ t('workers.total').toLowerCase() }}</span>
            <span>{{ t('common.page') }} {{ page }} / {{ totalPages }}</span>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <WorkerCard
              v-for="w in results.data"
              :key="w.id"
              :id="w.id"
              :name="w.name"
              :phone="w.phone"
              :occupations="workerOccupations(w)"
              :cities="workerCities(w)"
              :average-rating="w.averageRating"
              :rating-count="w.ratingCount"
              :featured="w.featured && sort !== 'best'"
            />
          </div>

          <div class="flex justify-between items-center pt-2">
            <button
              class="flex items-center gap-1 px-4 py-2 border rounded-xl text-sm cursor-pointer hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              :disabled="page <= 1"
              @click="run(page - 1)"
            >
              <Icon icon="mdi:chevron-left" /> {{ t('common.previous') }}
            </button>
            <button
              class="flex items-center gap-1 px-4 py-2 border rounded-xl text-sm cursor-pointer hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              :disabled="page >= totalPages"
              @click="run(page + 1)"
            >
              {{ t('common.next') }} <Icon icon="mdi:chevron-right" />
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Mobile filters drawer -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="filtersOpen" class="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div class="absolute inset-0 bg-black/40" @click="filtersOpen = false" />
          <div class="relative bg-white rounded-t-3xl p-5 grid gap-4 max-h-[85vh] overflow-y-auto">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900">{{ t('common.filters') }}</span>
              <button @click="filtersOpen = false" class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100">
                <Icon icon="mdi:close" class="text-slate-600" />
              </button>
            </div>

            <div class="grid gap-1.5">
              <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.category') }}</label>
              <select v-model="selectedCategory" @change="onCategoryChange" class="border rounded-xl px-3 py-3 text-sm cursor-pointer focus:outline-none focus:border-brand">
                <option :value="null">{{ t('common.all') }}</option>
                <option v-for="c in tax.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>

            <div v-if="selectedCategory" class="grid gap-2">
              <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.occupations') }}</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="o in tax.occupationsByCategory[selectedCategory] || []"
                  :key="o.id"
                  type="button"
                  @click="toggle(selectedOccupationIds, o.id)"
                  class="px-3 py-1.5 rounded-full border text-sm font-medium cursor-pointer transition-colors"
                  :class="selectedOccupationIds.includes(o.id) ? 'bg-brand text-white border-brand' : 'text-slate-600 hover:border-brand hover:text-brand'"
                >{{ o.name }}</button>
              </div>
            </div>

            <div class="grid gap-1.5">
              <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.state') }}</label>
              <select v-model="selectedState" @change="onStateChange" class="border rounded-xl px-3 py-3 text-sm cursor-pointer focus:outline-none focus:border-brand">
                <option value="">{{ t('common.all') }}</option>
                <option v-for="s in tax.states" :key="s.code" :value="s.code">{{ s.name }}</option>
              </select>
            </div>

            <div v-if="selectedState" class="grid gap-2">
              <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.cities') }}</label>
              <CityPicker v-model="selectedCityIds" :cities="tax.citiesByState[selectedState] || []" />
            </div>

            <div class="grid gap-1.5">
              <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('workers.minRating') }}</label>
              <div class="flex gap-1.5">
                <button
                  v-for="star in [1,2,3,4,5]"
                  :key="star"
                  type="button"
                  @click="minRating = minRating === star ? null : star"
                  class="flex-1 py-2 rounded-xl border text-sm font-medium transition-colors flex flex-col items-center gap-0.5"
                  :class="minRating && minRating >= star ? 'bg-amber-50 border-amber-300 text-amber-600' : 'text-slate-300 hover:border-amber-300'"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span>{{ star }}</span>
                </button>
              </div>
            </div>

            <div class="flex gap-2 pt-2">
              <button @click="clearFilters" class="flex-1 py-3 rounded-xl border text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">{{ t('common.clearFilters') }}</button>
              <button @click="run(1)" class="flex-1 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors">{{ t('common.search') }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-active .relative,
.drawer-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .relative,
.drawer-leave-to .relative {
  transform: translateY(100%);
}
</style>
