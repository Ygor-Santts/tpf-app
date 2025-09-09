<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@app/stores/auth'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const auth = useAuthStore(); const tax = useTaxonomyStore()
const form = reactive({ name:'', email:'', password:'', phone:'', jobCategoryId: 0, jobOccupationIds: [] as number[], stateCode:'', operationCitiesIds: [] as number[] })
onMounted(async () => { await tax.loadCategories(); await tax.loadStates() })
function toggle(list: number[], id: number) { const i=list.indexOf(id); if (i>=0) list.splice(i,1); else list.push(id) }
async function onCategoryChange(){ if(form.jobCategoryId){ form.jobOccupationIds = []; await tax.loadOccupations(form.jobCategoryId) } }
async function onStateChange(){ form.operationCitiesIds = []; if(form.stateCode) await tax.loadCities(form.stateCode) }
const canSubmit = computed(() => form.name && form.email && form.password && form.phone && form.jobOccupationIds.length > 0 && form.operationCitiesIds.length > 0)
async function submit(){ if(!canSubmit) return; await auth.registerWorker({ name: form.name, email: form.email, password: form.password, phone: form.phone, jobOccupationIds: form.jobOccupationIds, operationCitiesIds: form.operationCitiesIds }) }
</script>
<template>
  <div class="grid gap-4">
    <h2 class="text-lg font-semibold">{{ t('auth.registerWorker') }}</h2>
    <input v-model="form.name" :placeholder="t('auth.fullName')" class="border rounded-xl p-3" />
    <input v-model="form.email" type="email" :placeholder="t('auth.email')" class="border rounded-xl p-3" />
    <input v-model="form.password" type="password" :placeholder="t('auth.password')" class="border rounded-xl p-3" />
    <input v-model="form.phone" :placeholder="t('auth.phone')" class="border rounded-xl p-3" />
    <div class="grid gap-1">
      <label class="text-sm text-gray-600">{{ t('auth.category') }}</label>
      <select v-model.number="form.jobCategoryId" @change="onCategoryChange" class="border rounded-xl p-3 cursor-pointer">
        <option :value="0" disabled>{{ t('auth.select') }}</option>
        <option v-for="c in tax.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>
    <div v-if="form.jobCategoryId" class="grid gap-1">
      <label class="text-sm text-gray-600">{{ t('auth.occupations') }}</label>
      <div class="flex flex-wrap gap-2">
        <button v-for="o in tax.occupationsByCategory[form.jobCategoryId] || []" :key="o.id" type="button"
          class="px-3 py-2 rounded-full border cursor-pointer"
          :class="{'bg-black text-white': form.jobOccupationIds.includes(o.id)}"
          @click="toggle(form.jobOccupationIds, o.id)">{{ o.name }}</button>
      </div>
      <p v-if="form.jobOccupationIds.length === 0" class="text-xs text-red-600">Selecione ao menos uma ocupação.</p>
    </div>
    <div class="grid gap-1">
      <label class="text-sm text-gray-600">{{ t('auth.state') }}</label>
      <select v-model="form.stateCode" @change="onStateChange" class="border rounded-xl p-3 cursor-pointer">
        <option value="" disabled>{{ t('auth.select') }}</option>
        <option v-for="s in tax.states" :key="s.code" :value="s.code">{{ s.name }}</option>
      </select>
    </div>
    <div v-if="form.stateCode" class="grid gap-1">
      <label class="text-sm text-gray-600">{{ t('auth.cities') }}</label>
      <div class="flex flex-wrap gap-2">
        <button v-for="c in tax.citiesByState[form.stateCode] || []" :key="c.id" type="button"
          class="px-3 py-2 rounded-full border cursor-pointer"
          :class="{'bg-black text-white': form.operationCitiesIds.includes(c.id)}"
          @click="toggle(form.operationCitiesIds, c.id)">{{ c.name }}</button>
      </div>
      <p v-if="form.operationCitiesIds.length === 0" class="text-xs text-red-600">Selecione ao menos uma cidade.</p>
    </div>
    <button :disabled="auth.loading || !canSubmit" @click="submit" class="rounded-xl p-3 bg-black text-white" :class="{ 'opacity-60': !canSubmit }">
      {{ auth.loading ? t('auth.sending') : t('auth.register') }}
    </button>
    <p v-if="auth.error" class="text-red-600 text-sm">{{ auth.error }}</p>
  </div>
</template>
