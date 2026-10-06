<script setup lang="ts">
import CityPicker from '@ui/components/CityPicker.vue'
import { reactive, ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@app/stores/auth'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import StepIndicator from '@ui/components/StepIndicator.vue'
import IconInput from '@ui/components/IconInput.vue'
import FieldError from '@ui/components/FieldError.vue'
import { useValidation, required, email, phone, minLength, sameAs, formatPhone, phoneDigits, PASSWORD_MIN } from '@shared/validation'

// upgrade: a logged-in client adds a worker profile, so the personal-data step is skipped.
const props = defineProps<{ upgrade?: boolean }>()

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
auth.error = null
const tax = useTaxonomyStore()

const firstStep = props.upgrade ? 2 : 1
const currentStep = ref(firstStep)
const success = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirm: '',
  phone: '',
  jobCategoryId: 0,
  jobOccupationIds: [] as number[],
  stateCode: '',
  operationCitiesIds: [] as number[],
})

const { errors, check, validate, setErrors } = useValidation(form, {
  name: [required('Informe seu nome.')],
  email: [required('Informe seu e-mail.'), email],
  phone: [required('Informe seu telefone.'), phone],
  password: [required('Crie uma senha.'), minLength(PASSWORD_MIN)],
  confirm: [required('Repita a senha.'), sameAs(() => form.password, 'As senhas não coincidem.')],
  jobCategoryId: [(v) => (v ? '' : 'Escolha uma categoria.')],
  jobOccupationIds: [required('Escolha pelo menos uma ocupação.')],
  stateCode: [required('Escolha um estado.')],
  operationCitiesIds: [required('Escolha pelo menos uma cidade.')],
})

// Fields checked before leaving each step.
const STEP_FIELDS: Record<number, string[]> = {
  1: ['name', 'email', 'phone', 'password', 'confirm'],
  2: ['jobCategoryId', 'jobOccupationIds'],
  3: ['stateCode', 'operationCitiesIds'],
}

watch(() => form.phone, (v) => (form.phone = formatPhone(v)))

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

async function nextStep() {
  if (await validate(STEP_FIELDS[currentStep.value])) currentStep.value++
}

function prevStep() {
  if (currentStep.value > firstStep) currentStep.value--
  else if (props.upgrade) router.back()
}

async function submit() {
  if (!(await validate(STEP_FIELDS[3]))) return
  const ok = props.upgrade
    ? await auth.activateWorker({
      jobOccupationIds: form.jobOccupationIds,
      operationCitiesIds: form.operationCitiesIds,
    })
    : await auth.registerWorker({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: phoneDigits(form.phone),
      jobOccupationIds: form.jobOccupationIds,
      operationCitiesIds: form.operationCitiesIds,
    })
  if (!ok) {
    // An error in an earlier step's field takes the person back to that step.
    const step = [1, 2].find((n) => STEP_FIELDS[n].some((f) => auth.fieldErrors[f]))
    if (step && step >= firstStep) currentStep.value = step
    setErrors(auth.fieldErrors)
    return
  }
  if (props.upgrade) return router.replace('/worker/profile/edit')
  success.value = true
  setTimeout(() => router.replace('/login'), 2000)
}

const steps = computed(() => [t('auth.step1Label'), t('auth.step2Label'), t('auth.step3Label')].slice(firstStep - 1))
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-6">
        <RouterLink to="/" class="text-2xl font-bold text-brand">Trampo Fácil</RouterLink>
      </div>

      <div class="bg-white rounded-2xl shadow-card border p-6 grid gap-5">
        <div>
          <h2 class="text-lg font-bold text-slate-900 mb-4">{{ upgrade ? t('mode.becomeWorker') : t('auth.registerWorker') }}</h2>
          <StepIndicator :steps="steps" :current="currentStep - firstStep + 1" />
        </div>

        <!-- Sucesso -->
        <div v-if="success" class="flex flex-col items-center gap-3 py-6 text-center">
          <div class="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
            <Icon icon="mdi:check-circle" class="text-3xl text-green-500" />
          </div>
          <p class="font-semibold text-slate-800">{{ t('auth.registerSuccess') }}</p>
        </div>

        <!-- Step 1: Dados pessoais -->
        <form v-else-if="currentStep === 1" @submit.prevent="nextStep" novalidate class="grid gap-3">
          <IconInput v-model="form.name" icon="mdi:account-outline" :placeholder="t('auth.fullName')" autocomplete="name" :error="errors.name" @blur="check('name')" />
          <IconInput v-model="form.email" icon="mdi:email-outline" type="email" :placeholder="t('auth.email')" autocomplete="email" :error="errors.email" @blur="check('email')" />
          <IconInput v-model="form.phone" icon="mdi:phone-outline" type="tel" inputmode="numeric" placeholder="Telefone com DDD" autocomplete="tel-national" :error="errors.phone" @blur="check('phone')" />
          <IconInput v-model="form.password" icon="mdi:lock-outline" type="password" placeholder="Senha (mínimo 8 caracteres)" autocomplete="new-password" :error="errors.password" @blur="check('password')" />
          <IconInput v-model="form.confirm" icon="mdi:lock-check-outline" type="password" placeholder="Repita a senha" autocomplete="new-password" :error="errors.confirm" @blur="check('confirm')" />
          <button class="w-full py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors">
            {{ t('auth.continue') }}
          </button>
        </form>

        <!-- Step 2: Habilidades -->
        <div v-else-if="currentStep === 2" class="grid gap-4">
          <div class="grid gap-1.5">
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.category') }}</label>
            <select v-model.number="form.jobCategoryId" @change="onCategoryChange" :aria-invalid="!!errors.jobCategoryId" class="border rounded-xl px-3 py-3 text-sm cursor-pointer focus:outline-none focus:border-brand">
              <option :value="0" disabled>{{ t('auth.select') }}</option>
              <option v-for="c in tax.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <FieldError :message="errors.jobCategoryId" />
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
            <FieldError :message="errors.jobOccupationIds" />
          </div>
          <div class="flex gap-2 mt-1">
            <button @click="prevStep" class="flex-1 py-3 rounded-xl border text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">{{ t('common.back') }}</button>
            <button @click="nextStep" class="flex-1 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors">{{ t('auth.continue') }}</button>
          </div>
        </div>

        <!-- Step 3: Localização -->
        <div v-else class="grid gap-4">
          <div class="grid gap-1.5">
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.state') }}</label>
            <select v-model="form.stateCode" @change="onStateChange" :aria-invalid="!!errors.stateCode" class="border rounded-xl px-3 py-3 text-sm cursor-pointer focus:outline-none focus:border-brand">
              <option value="" disabled>{{ t('auth.select') }}</option>
              <option v-for="s in tax.states" :key="s.code" :value="s.code">{{ s.name }}</option>
            </select>
            <FieldError :message="errors.stateCode" />
          </div>
          <div v-if="form.stateCode" class="grid gap-2">
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t('auth.cities') }}</label>
            <CityPicker v-model="form.operationCitiesIds" :cities="tax.citiesByState[form.stateCode] || []" />
            <FieldError :message="errors.operationCitiesIds" />
          </div>
          <div v-if="auth.error" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <Icon icon="mdi:alert-circle-outline" class="flex-shrink-0" />{{ auth.error }}
          </div>
          <div class="flex gap-2 mt-1">
            <button @click="prevStep" class="flex-1 py-3 rounded-xl border text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">{{ t('common.back') }}</button>
            <button @click="submit" :disabled="auth.loading" class="flex-1 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Icon v-if="auth.loading" icon="mdi:loading" class="animate-spin" />
              {{ auth.loading ? t('auth.sending') : t('auth.finish') }}
            </button>
          </div>
        </div>

        <div v-if="!upgrade" class="text-center text-xs text-slate-500 pt-1 border-t">
          {{ t('auth.haveAccount') }}
          <RouterLink to="/login" class="text-brand font-medium hover:underline ml-1">{{ t('auth.login') }}</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
