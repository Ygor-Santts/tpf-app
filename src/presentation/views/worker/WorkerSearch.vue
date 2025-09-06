<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonChip, IonButton, IonList, IonAvatar, IonText } from '@ionic/vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { searchWorkers, type WorkerSearchParams, type WorkerSearchResult } from '@infra/services/worker.service'
const tax = useTaxonomyStore()
const name = ref(''); const selectedCategory = ref<number | null>(null); const selectedOccupationIds = ref<number[]>([]); const selectedState = ref<string>(''); const selectedCityIds = ref<number[]>([])
const page = ref(1); const limit = ref(10); const loading = ref(false); const error = ref<string | null>(null); const results = ref<WorkerSearchResult | null>(null)
onMounted(async () => { await tax.loadCategories(); await tax.loadStates() })
function toggle(list: number[], id: number) { const i = list.indexOf(id); if (i>=0) list.splice(i,1); else list.push(id) }
async function onCategoryChange() { selectedOccupationIds.value = []; if (selectedCategory.value) await tax.loadOccupations(selectedCategory.value) }
async function onStateChange() { selectedCityIds.value = []; if (selectedState.value) await tax.loadCities(selectedState.value) }
async function run(pageNum = 1) {
  loading.value = true; error.value = null; page.value = pageNum
  try {
    const params: WorkerSearchParams = { name: name.value || undefined, page: page.value, limit: limit.value, jobCategoryIds: selectedCategory.value ? [selectedCategory.value] : undefined, jobOccupationIds: selectedOccupationIds.value.length ? selectedOccupationIds.value : undefined, operationCitiesIds: selectedCityIds.value.length ? selectedCityIds.value : undefined }
    results.value = await searchWorkers(params)
  } catch (e: any) { error.value = e?.response?.data?.message || 'Search failed' } finally { loading.value = false }
}
</script>
<template>
  <IonPage>
    <IonHeader translucent><IonToolbar><IonTitle>Find Professionals</IonTitle></IonToolbar></IonHeader>
    <IonContent class="ion-padding">
      <IonItem><IonLabel position="stacked">Name (optional)</IonLabel><IonInput v-model="name" placeholder="Type a name..." /></IonItem>
      <IonItem><IonLabel position="stacked">Category</IonLabel><IonSelect v-model="selectedCategory" @ionChange="onCategoryChange"><IonSelectOption :value="null">All</IonSelectOption><IonSelectOption v-for="c in tax.categories" :key="c.id" :value="c.id">{{ c.name }}</IonSelectOption></IonSelect></IonItem>
      <div v-if="selectedCategory" class="mt-2"><div class="text-sm mb-1">Occupations</div><div class="flex flex-wrap gap-2"><IonChip v-for="o in tax.occupationsByCategory[selectedCategory] || []" :key="o.id" :color="selectedOccupationIds.includes(o.id) ? 'primary' : undefined" @click="toggle(selectedOccupationIds, o.id)">{{ o.name }}</IonChip></div></div>
      <IonItem class="mt-2"><IonLabel position="stacked">State</IonLabel><IonSelect v-model="selectedState" @ionChange="onStateChange"><IonSelectOption value="">All</IonSelectOption><IonSelectOption v-for="s in tax.states" :key="s.code" :value="s.code">{{ s.name }}</IonSelectOption></IonSelect></IonItem>
      <div v-if="selectedState" class="mt-2"><div class="text-sm mb-1">Cities</div><div class="flex flex-wrap gap-2"><IonChip v-for="c in tax.citiesByState[selectedState] || []" :key="c.id" :color="selectedCityIds.includes(c.id) ? 'primary' : undefined" @click="toggle(selectedCityIds, c.id)">{{ c.name }}</IonChip></div></div>
      <IonButton expand="block" class="mt-3" @click="run(1)" :disabled="loading">{{ loading ? 'Searching...' : 'Search' }}</IonButton>
      <p v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</p>
      <div v-if="results" class="mt-3">
        <IonText color="medium" class="text-sm">Total: {{ results.total }}</IonText>
        <IonList class="mt-2">
          <div v-for="w in results.data" :key="w.id" class="flex items-center gap-3 py-3 border-b">
            <IonAvatar class="h-10 w-10"><div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">{{ w.name?.charAt(0)?.toUpperCase() }}</div></IonAvatar>
            <div class="flex-1"><div class="font-medium">{{ w.name }}</div><div class="text-xs text-gray-500">{{ w.email || w.phone }}</div><div class="flex flex-wrap gap-1 mt-1"><span v-for="b in w.occupations || []" :key="b" class="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 border">{{ b }}</span></div></div>
          </div>
        </IonList>
        <div class="flex justify-between items-center mt-3"><IonButton fill="outline" :disabled="page<=1" @click="run(page-1)">Prev</IonButton><div class="text-sm">Page {{ page }}</div><IonButton fill="outline" :disabled="results.data.length < limit" @click="run(page+1)">Next</IonButton></div>
      </div>
    </IonContent>
  </IonPage>
</template>
