<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useAuthStore } from '@app/stores/auth'
import { useTaxonomyStore } from '@app/stores/taxonomy'
const auth = useAuthStore(); const tax = useTaxonomyStore()
const form = reactive({ name:'', email:'', password:'', phone:'', jobCategoryId: 0, jobOccupationIds: [] as number[], stateCode:'', operationCitiesIds: [] as number[] })
onMounted(async () => { await tax.loadCategories(); await tax.loadStates() })
function toggle(list: number[], id: number) { const i=list.indexOf(id); if (i>=0) list.splice(i,1); else list.push(id) }
async function onCategoryChange(){ if(form.jobCategoryId) await tax.loadOccupations(form.jobCategoryId) }
async function onStateChange(){ if(form.stateCode) await tax.loadCities(form.stateCode) }
async function submit(){ await auth.registerWorker({ name: form.name, email: form.email, password: form.password, phone: form.phone, jobOccupationIds: form.jobOccupationIds, operationCitiesIds: form.operationCitiesIds }) }
</script>

<template>
  <div class="grid gap-4">
    <h2 class="text-lg font-semibold">Worker Registration</h2>
    <input v-model="form.name" placeholder="Full name" class="border rounded-xl p-3" />
    <input v-model="form.email" type="email" placeholder="Email" class="border rounded-xl p-3" />
    <input v-model="form.password" type="password" placeholder="Password" class="border rounded-xl p-3" />
    <input v-model="form.phone" placeholder="Phone (+55...)" class="border rounded-xl p-3" />

    <div class="grid gap-1">
      <label class="text-sm text-gray-600">Category</label>
      <select v-model.number="form.jobCategoryId" @change="onCategoryChange" class="border rounded-xl p-3">
        <option :value="0" disabled>Select...</option>
        <option v-for="c in tax.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>

    <div v-if="form.jobCategoryId" class="grid gap-1">
      <label class="text-sm text-gray-600">Occupations</label>
      <div class="flex flex-wrap gap-2">
        <button v-for="o in tax.occupationsByCategory[form.jobCategoryId] || []" :key="o.id" type="button"
          class="px-3 py-2 rounded-full border"
          :class="{'bg-black text-white': form.jobOccupationIds.includes(o.id)}"
          @click="toggle(form.jobOccupationIds, o.id)">{{ o.name }}</button>
      </div>
    </div>

    <div class="grid gap-1">
      <label class="text-sm text-gray-600">State</label>
      <select v-model="form.stateCode" @change="onStateChange" class="border rounded-xl p-3">
        <option value="" disabled>Select...</option>
        <option v-for="s in tax.states" :key="s.code" :value="s.code">{{ s.name }}</option>
      </select>
    </div>

    <div v-if="form.stateCode" class="grid gap-1">
      <label class="text-sm text-gray-600">Cities</label>
      <div class="flex flex-wrap gap-2">
        <button v-for="c in tax.citiesByState[form.stateCode] || []" :key="c.id" type="button"
          class="px-3 py-2 rounded-full border"
          :class="{'bg-black text-white': form.operationCitiesIds.includes(c.id)}"
          @click="toggle(form.operationCitiesIds, c.id)">{{ c.name }}</button>
      </div>
    </div>

    <button :disabled="auth.loading" @click="submit" class="rounded-xl p-3 bg-black text-white">
      {{ auth.loading ? 'Sending...' : 'Register' }}
    </button>
    <p v-if="auth.error" class="text-red-600 text-sm">{{ auth.error }}</p>
  </div>
</template>
