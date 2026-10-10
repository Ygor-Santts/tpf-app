<script setup lang="ts">
// What Trampo Fácil is for and how to use it, as a client or as a worker.
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@app/stores/auth'
import { useTourStore } from '@app/stores/tour'

const { t } = useI18n()
const auth = useAuthStore()
const tour = useTourStore()
const side = ref<'client' | 'worker'>(auth.inWorkerMode ? 'worker' : 'client')
const openFaq = ref<number | null>(null)

const goals = [
  { icon: 'mdi:map-marker-radius-outline', key: 'help.goals.near', color: 'bg-brand-50 text-brand' },
  { icon: 'mdi:account-hard-hat-outline', key: 'help.goals.work', color: 'bg-amber-50 text-amber-600' },
  { icon: 'mdi:shield-star-outline', key: 'help.goals.trust', color: 'bg-green-50 text-green-600' },
]

const paths = {
  client: [
    { icon: 'mdi:magnify', key: 'help.client.step1' },
    { icon: 'mdi:account-details-outline', key: 'help.client.step2' },
    { icon: 'mdi:whatsapp', key: 'help.client.step3' },
    { icon: 'mdi:star-outline', key: 'help.client.step4' },
  ],
  worker: [
    { icon: 'mdi:account-plus-outline', key: 'help.worker.step1' },
    { icon: 'mdi:account-edit-outline', key: 'help.worker.step2' },
    { icon: 'mdi:image-multiple-outline', key: 'help.worker.step3' },
    { icon: 'mdi:star-outline', key: 'help.worker.step4' },
  ],
}

// Where the "get started" button leads, depending on who is looking.
const cta = computed(() => {
  if (side.value === 'client') {
    return auth.token
      ? { to: '/tabs/workers', label: t('help.client.ctaIn') }
      : { to: '/register-client', label: t('help.client.ctaOut') }
  }
  if (auth.isWorker) return { to: '/worker/dashboard', label: t('help.worker.ctaWorker') }
  return auth.token
    ? { to: '/become-worker', label: t('help.worker.ctaOut') }
    : { to: '/register-worker', label: t('help.worker.ctaOut') }
})

const faqs = ['account', 'contact', 'price', 'ratings', 'best', 'both', 'review']

function startTour() {
  tour.show(side.value)
}
</script>

<template>
  <section class="grid gap-8">

    <!-- What it is -->
    <div class="rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white p-6 grid gap-4">
      <div>
        <h1 class="text-2xl font-bold leading-tight">{{ t('help.title') }}</h1>
        <p class="text-brand-100 text-sm mt-2 leading-relaxed">{{ t('help.intro') }}</p>
      </div>
      <button
        @click="startTour"
        class="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-brand font-semibold text-sm hover:bg-brand-50 transition-colors"
      >
        <Icon icon="mdi:play-circle-outline" class="text-lg" />
        {{ t('help.watchTour') }}
      </button>
    </div>

    <!-- Goals -->
    <div class="grid gap-3">
      <h2 class="font-bold text-slate-900">{{ t('help.goalsTitle') }}</h2>
      <div class="grid sm:grid-cols-3 gap-3">
        <div v-for="g in goals" :key="g.key" class="bg-white rounded-2xl border shadow-card p-4 grid gap-2">
          <div :class="['h-10 w-10 rounded-full flex items-center justify-center', g.color]">
            <Icon :icon="g.icon" class="text-xl" />
          </div>
          <div class="font-semibold text-slate-900 text-sm">{{ t(`${g.key}.title`) }}</div>
          <div class="text-xs text-slate-500 leading-relaxed">{{ t(`${g.key}.text`) }}</div>
        </div>
      </div>
    </div>

    <!-- Step by step, for each side -->
    <div class="grid gap-3">
      <h2 class="font-bold text-slate-900">{{ t('help.stepsTitle') }}</h2>
      <div class="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100">
        <button
          v-for="s in (['client', 'worker'] as const)"
          :key="s"
          @click="side = s"
          :class="['py-2 rounded-lg text-sm font-medium transition-colors', side === s ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700']"
        >
          {{ s === 'client' ? t('visitor.asClient') : t('visitor.asWorker') }}
        </button>
      </div>

      <ol class="grid gap-3">
        <li
          v-for="(step, i) in paths[side]"
          :key="step.key"
          class="bg-white rounded-2xl border shadow-card p-4 flex items-start gap-4"
        >
          <div class="relative h-10 w-10 rounded-full bg-brand-50 text-brand flex items-center justify-center flex-shrink-0">
            <Icon :icon="step.icon" class="text-xl" />
            <span class="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-brand text-white text-[11px] font-bold flex items-center justify-center">{{ i + 1 }}</span>
          </div>
          <div>
            <div class="font-semibold text-slate-900 text-sm">{{ t(`${step.key}.title`) }}</div>
            <div class="text-xs text-slate-500 mt-0.5 leading-relaxed">{{ t(`${step.key}.text`) }}</div>
          </div>
        </li>
      </ol>

      <RouterLink
        :to="cta.to"
        class="flex items-center justify-center gap-2 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors"
      >
        {{ cta.label }}
        <Icon icon="mdi:arrow-right" class="text-lg" />
      </RouterLink>
    </div>

    <!-- Questions -->
    <div class="grid gap-3">
      <h2 class="font-bold text-slate-900">{{ t('help.faqTitle') }}</h2>
      <div class="bg-white rounded-2xl border shadow-card divide-y">
        <div v-for="(f, i) in faqs" :key="f">
          <button
            @click="openFaq = openFaq === i ? null : i"
            class="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors"
          >
            {{ t(`help.faq.${f}.q`) }}
            <Icon :icon="openFaq === i ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="text-xl text-slate-400 flex-shrink-0" />
          </button>
          <p v-if="openFaq === i" class="px-4 pb-4 -mt-1 text-sm text-slate-600 leading-relaxed">{{ t(`help.faq.${f}.a`) }}</p>
        </div>
      </div>
    </div>

  </section>
</template>
