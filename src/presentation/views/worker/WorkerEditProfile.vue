<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useWorkerStore } from '@app/stores/worker'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { Icon } from '@iconify/vue'

const worker = useWorkerStore()
const tax = useTaxonomyStore()

const bio = ref('')
const name = ref('')
const phone = ref('')
const selectedOccupationIds = ref<number[]>([])
const selectedCityIds = ref<number[]>([])
const selectedCategory = ref<number | null>(null)
const selectedState = ref('')
const saved = ref(false)

onMounted(async () => {
  await worker.loadProfile()
  await Promise.all([tax.loadCategories(), tax.loadStates()])
  if (worker.profile) {
    bio.value = worker.profile.bio ?? ''
    name.value = worker.profile.user.name
    phone.value = worker.profile.user.phone
    selectedOccupationIds.value = worker.profile.jobOccupations.map(o => o.id)
  }
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

async function save() {
  saved.value = false
  const dto: any = {}
  if (bio.value !== (worker.profile?.bio ?? '')) dto.bio = bio.value
  if (name.value !== worker.profile?.user.name) dto.name = name.value
  if (phone.value !== worker.profile?.user.phone) dto.phone = phone.value
  if (selectedOccupationIds.value.length) dto.jobOccupationIds = selectedOccupationIds.value
  if (selectedCityIds.value.length) dto.operationCitiesIds = selectedCityIds.value

  const ok = await worker.updateProfile(dto)
  if (ok) saved.value = true
}

const currentOccupations = computed(() => worker.profile?.jobOccupations ?? [])
const currentCities = computed(() => worker.profile?.operationCities ?? [])
</script>

<template>
  <section class="grid gap-5 max-w-lg">
    <div class="flex items-center gap-2">
      <Icon icon="mdi:account-edit-outline" class="text-brand text-2xl" />
      <h2 class="text-xl font-bold text-slate-900">Editar perfil</h2>
    </div>

    <div v-if="saved" class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
      <Icon icon="mdi:check-circle-outline" />
      Perfil atualizado com sucesso!
    </div>

    <div v-if="worker.loading" class="grid gap-3">
      <div v-for="i in 4" :key="i" class="h-12 rounded-xl bg-slate-100 animate-pulse" />
    </div>

    <form v-else @submit.prevent="save" class="grid gap-5">
      <div class="bg-white rounded-2xl border shadow-card p-5 grid gap-4">
        <h3 class="font-semibold text-slate-800 text-sm">Dados pessoais</h3>
        <div class="grid gap-3">
          <div>
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">Nome</label>
            <input v-model="name" class="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100" />
          </div>
          <div>
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">Telefone</label>
            <input v-model="phone" class="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100" />
          </div>
          <div>
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">Bio</label>
            <textarea v-model="bio" rows="3" maxlength="500" placeholder="Fale sobre você e seu trabalho..."
              class="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 resize-none" />
            <div class="text-right text-xs text-slate-400 mt-0.5">{{ bio.length }}/500</div>
          </div>
        </div>
      </div>

      <!-- Current occupations -->
      <div class="bg-white rounded-2xl border shadow-card p-5 grid gap-3">
        <h3 class="font-semibold text-slate-800 text-sm">Ocupações atuais</h3>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="o in currentOccupations" :key="o.id" class="px-2.5 py-1 rounded-full bg-brand-50 text-brand text-xs font-medium border border-brand-100">
            {{ o.name }}
          </span>
          <span v-if="!currentOccupations.length" class="text-sm text-slate-400">Nenhuma ocupação cadastrada</span>
        </div>
        <div class="text-xs text-slate-500">Para adicionar novas, selecione uma categoria abaixo:</div>

        <select v-model="selectedCategory" @change="onCategoryChange" class="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand">
          <option :value="null">Selecionar categoria...</option>
          <option v-for="c in tax.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>

        <div v-if="selectedCategory" class="flex flex-wrap gap-1.5">
          <button
            v-for="o in tax.occupationsByCategory[selectedCategory] || []"
            :key="o.id"
            type="button"
            @click="toggle(selectedOccupationIds, o.id)"
            class="px-2.5 py-1 rounded-full border text-xs font-medium transition-colors"
            :class="selectedOccupationIds.includes(o.id) ? 'bg-brand text-white border-brand' : 'text-slate-600 hover:border-brand hover:text-brand'"
          >{{ o.name }}</button>
        </div>
      </div>

      <!-- Current cities -->
      <div class="bg-white rounded-2xl border shadow-card p-5 grid gap-3">
        <h3 class="font-semibold text-slate-800 text-sm">Cidades de atuação</h3>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="c in currentCities" :key="c.id" class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            {{ c.name }}
          </span>
          <span v-if="!currentCities.length" class="text-sm text-slate-400">Nenhuma cidade cadastrada</span>
        </div>
        <div class="text-xs text-slate-500">Para atualizar, selecione estado e cidades abaixo:</div>

        <select v-model="selectedState" @change="onStateChange" class="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand">
          <option value="">Selecionar estado...</option>
          <option v-for="s in tax.states" :key="s.code" :value="s.code">{{ s.name }}</option>
        </select>

        <div v-if="selectedState" class="flex flex-wrap gap-1.5">
          <span v-if="!(tax.citiesByState[selectedState]?.length)" class="text-sm text-slate-400">Nenhuma cidade encontrada para este estado.</span>
          <button
            v-for="c in tax.citiesByState[selectedState] || []"
            :key="c.id"
            type="button"
            @click="toggle(selectedCityIds, c.id)"
            class="px-2.5 py-1 rounded-full border text-xs font-medium transition-colors"
            :class="selectedCityIds.includes(c.id) ? 'bg-brand text-white border-brand' : 'text-slate-600 hover:border-brand hover:text-brand'"
          >{{ c.name }}</button>
        </div>
      </div>

      <div v-if="worker.error" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        <Icon icon="mdi:alert-circle-outline" class="flex-shrink-0" />{{ worker.error }}
      </div>

      <button type="submit" :disabled="worker.loading" class="w-full py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
        <Icon v-if="worker.loading" icon="mdi:loading" class="animate-spin" />
        Salvar alterações
      </button>
    </form>
  </section>
</template>
