<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'

const { t } = useI18n()
const tax = useTaxonomyStore()

onMounted(() => tax.loadCategories())

const categoryIcons: Record<string, string> = {
  'Construção Civil': 'mdi:hammer-wrench',
  'Jardinagem': 'mdi:flower',
  'Limpeza': 'mdi:broom',
  'Elétrica': 'mdi:lightning-bolt',
  'Pintura': 'mdi:format-paint',
}

function getCategoryIcon(name: string) {
  return categoryIcons[name] ?? 'mdi:briefcase-outline'
}

const steps = [
  { icon: 'mdi:magnify', titleKey: 'home.step1Title', descKey: 'home.step1Desc', color: 'bg-brand-50 text-brand' },
  { icon: 'mdi:phone-outline', titleKey: 'home.step2Title', descKey: 'home.step2Desc', color: 'bg-green-50 text-green-600' },
  { icon: 'mdi:handshake-outline', titleKey: 'home.step3Title', descKey: 'home.step3Desc', color: 'bg-purple-50 text-purple-600' },
]
</script>

<template>
  <section class="grid gap-8">

    <!-- Hero -->
    <div class="rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white p-6 grid gap-4">
      <div>
        <h1 class="text-2xl font-bold leading-tight">{{ t('home.hero') }}</h1>
        <p class="text-brand-100 text-sm mt-2">{{ t('home.heroSub') }}</p>
      </div>
      <div class="grid gap-2.5">
        <RouterLink
          to="/tabs/workers"
          class="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-brand font-semibold text-sm hover:bg-brand-50 transition-colors"
        >
          <Icon icon="mdi:magnify" class="text-lg" />
          {{ t('home.heroCta') }}
        </RouterLink>
        <RouterLink
          to="/register-worker"
          class="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/40 text-white font-medium text-sm hover:bg-white/10 transition-colors"
        >
          <Icon icon="mdi:account-hard-hat-outline" class="text-lg" />
          {{ t('home.heroSecondary') }}
        </RouterLink>
      </div>
    </div>

    <!-- Categorias populares -->
    <div class="grid gap-3">
      <div class="flex items-center justify-between">
        <h2 class="font-bold text-slate-900">{{ t('home.popularCategories') }}</h2>
        <RouterLink to="/tabs/categories" class="text-xs text-brand font-medium hover:underline">{{ t('common.showAll') }}</RouterLink>
      </div>
      <div v-if="tax.loading" class="grid grid-cols-2 gap-3">
        <div v-for="i in 4" :key="i" class="h-20 rounded-2xl bg-slate-100 animate-pulse" />
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <RouterLink
          v-for="c in tax.categories"
          :key="c.id"
          :to="`/tabs/categories/${c.id}/occupations`"
          class="group bg-white rounded-2xl border shadow-card p-4 flex flex-col items-center gap-2 hover:shadow-card-hover hover:border-brand-200 transition-all cursor-pointer"
        >
          <div class="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
            <Icon :icon="getCategoryIcon(c.name)" class="text-xl text-brand" />
          </div>
          <span class="text-sm font-medium text-slate-700 text-center leading-tight">{{ c.name }}</span>
        </RouterLink>
      </div>
    </div>

    <!-- Como funciona -->
    <div class="grid gap-4">
      <h2 class="font-bold text-slate-900">{{ t('home.howItWorks') }}</h2>
      <div class="grid gap-3">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="bg-white rounded-2xl border shadow-card p-4 flex items-start gap-4"
        >
          <div :class="['h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0', step.color]">
            <Icon :icon="step.icon" class="text-xl" />
          </div>
          <div>
            <div class="font-semibold text-slate-900 text-sm">{{ i + 1 }}. {{ t(step.titleKey) }}</div>
            <div class="text-xs text-slate-500 mt-0.5">{{ t(step.descKey) }}</div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>
