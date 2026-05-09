<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@app/stores/auth'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import StepIndicator from '@ui/components/StepIndicator.vue'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const tax = useTaxonomyStore()

const currentStep = ref(1)
const success = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  jobCategoryId: 0,
  jobOccupationIds: [] as number[],
  stateCode: '',
  operationCitiesIds: [] as number[],
})

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
  form.jobOccupationIds = []
  if (form.jobCategoryId) await tax.loadOccupations(form.jobCategoryId)
}

async function onStateChange() {
  form.operationCitiesIds = []
  if (form.stateCode) await tax.loadCities(form.stateCode)
}

const step1Valid = computed(() => form.name && form.email && form.password && form.phone)
const step2Valid = computed(() => form.jobOccupationIds.length > 0)
const step3Valid = computed(() => form.operationCitiesIds.length > 0)

function nextStep() {
  if (currentStep.value < 3) currentStep.value++
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}

async function submit() {
  if (!step3Valid.value) return
  await auth.registerWorker({
    name: form.name,
    email: form.email,
    password: form.password,
    phone: form.phone,
    jobOccupationIds: form.jobOccupationIds,
    operationCitiesIds: form.operationCitiesIds,
  })
  if (!auth.error) {
    success.value = true
    setTimeout(() => router.replace('/login'), 2000)
  }
}

const steps = computed(() => [t('auth.step1Label'), t('auth.step2Label'), t('auth.step3Label')])
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-6">
        <RouterLink to="/" class="text-2xl font-bold text-brand">Trampo Fácil</RouterLink>
      </div>

      <div class="bg-white rounded-2xl shadow-card border p-6 grid gap-5">
        <div>
          <h2 class="text-lg font-bold text-slate-900 mb-4">{{ t('auth.registerWorker') }}</h2>
          <StepIndicator :steps="steps" :current="currentStep" />
        </div>

        <!-- Sucesso -->
        <div v-if="success" class="flex flex-col items-center gap-3 py-6 text-center">
          <div class="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
            <Icon icon="mdi:check-circle" class="text-3xl text-green-500" />
          </div>
          <p class="font-semibold text-slate-800">{{ t('auth.registerSuccess') }}</p>
        </div>

        <!-- Step 1: Dados pessoais -->
        <div v-else-if="currentStep === 1" class="grid gap-3">
          <div class="relative">
            <Icon icon="mdi:account-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input v-model="form.name" :placeholder="t('auth.fullName')" class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div class="relative">
            <Icon icon="mdi:email-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input v-model="form.email" type="email" :placeholder="t('auth.email')" class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div class="relative">
            <Icon icon="mdi:phone-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input v-model="form.phone" :placeholder="t('auth.phone')" class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div class="relative">
            <Icon icon="mdi:lock-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input v-model="form.password" type="password" :placeholder="t('auth.password')" class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <button @click="nextStep" :disabled="!step1Valid" class="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-50">
            {{ t('auth.continue') }}
          </button>
        </div>

        <!-- Step 2: Habilidades -->
        <div v-else-if="currentStep === 2" class="grid gap-4">
          <div class="grid gap-1.5">
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.category') }}</label>
            <select v-model.number="form.jobCategoryId" @change="onCategoryChange" class="border rounded-xl px-3 py-3 text-sm cursor-pointer focus:outline-none focus:border-brand">
              <option :value="0" disabled>{{ t('auth.select') }}</option>
              <option v-for="c in tax.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div v-if="form.jobCategoryId" class="grid gap-2">
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.occupations') }}</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="o in tax.occupationsByCategory[form.jobCategoryId] || []"
                :key="o.id"
                type="button"
                @click="toggle(form.jobOccupationIds, o.id)"
                class="px-3 py-1.5 rounded-full border text-sm font-medium cursor-pointer transition-colors"
                :class="form.jobOccupationIds.includes(o.id) ? 'bg-brand text-white border-brand' : 'text-slate-600 hover:border-brand hover:text-brand'"
              >
                {{ o.name }}
              </button>
            </div>
            <p v-if="!step2Valid" class="text-xs text-red-500">{{ t('auth.selectAtLeastOne') }}</p>
          </div>
          <div class="flex gap-2 mt-1">
            <button @click="prevStep" class="flex-1 py-3 rounded-xl border text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">{{ t('common.back') }}</button>
            <button @click="nextStep" :disabled="!step2Valid" class="flex-1 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-50">{{ t('auth.continue') }}</button>
          </div>
        </div>

        <!-- Step 3: Localização -->
        <div v-else class="grid gap-4">
          <div class="grid gap-1.5">
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.state') }}</label>
            <select v-model="form.stateCode" @change="onStateChange" class="border rounded-xl px-3 py-3 text-sm cursor-pointer focus:outline-none focus:border-brand">
              <option value="" disabled>{{ t('auth.select') }}</option>
              <option v-for="s in tax.states" :key="s.code" :value="s.code">{{ s.name }}</option>
            </select>
          </div>
          <div v-if="form.stateCode" class="grid gap-2">
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.cities') }}</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="c in tax.citiesByState[form.stateCode] || []"
                :key="c.id"
                type="button"
                @click="toggle(form.operationCitiesIds, c.id)"
                class="px-3 py-1.5 rounded-full border text-sm font-medium cursor-pointer transition-colors"
                :class="form.operationCitiesIds.includes(c.id) ? 'bg-brand text-white border-brand' : 'text-slate-600 hover:border-brand hover:text-brand'"
              >
                {{ c.name }}
              </button>
            </div>
            <p v-if="!step3Valid" class="text-xs text-red-500">{{ t('auth.selectAtLeastOne') }}</p>
          </div>
          <p v-if="auth.error" class="text-red-500 text-sm">{{ auth.error }}</p>
          <div class="flex gap-2 mt-1">
            <button @click="prevStep" class="flex-1 py-3 rounded-xl border text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">{{ t('common.back') }}</button>
            <button @click="submit" :disabled="auth.loading || !step3Valid" class="flex-1 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Icon v-if="auth.loading" icon="mdi:loading" class="animate-spin" />
              {{ auth.loading ? t('auth.sending') : t('auth.finish') }}
            </button>
          </div>
        </div>

        <div class="text-center text-xs text-slate-500 pt-1 border-t">
          {{ t('auth.haveAccount') }}
          <RouterLink to="/login" class="text-brand font-medium hover:underline ml-1">{{ t('auth.login') }}</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
