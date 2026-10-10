<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import BottomNav from './BottomNav.vue'
import SidebarNav from './SidebarNav.vue'
import OnboardingTour from './OnboardingTour.vue'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@app/stores/auth'
import { useTourStore } from '@app/stores/tour'

const { t } = useI18n()
const auth = useAuthStore()
const tour = useTourStore()

// First visit to each side of the app opens the tutorial once.
watch(() => auth.inWorkerMode, (worker) => tour.showIfNew(worker ? 'worker' : 'client'), { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Desktop sidebar -->
    <SidebarNav class="hidden lg:flex" />

    <!-- Mobile header -->
    <AppHeader class="lg:hidden" />

    <!-- Content -->
    <main class="lg:pl-60 pt-14 lg:pt-0 pb-20 lg:pb-0">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <!-- Visitors browse a preview of the app -->
        <div
          v-if="!auth.token"
          class="mb-5 flex items-center gap-3 p-3 rounded-2xl bg-brand-50 border border-brand-100"
        >
          <Icon icon="mdi:eye-outline" class="text-xl text-brand flex-shrink-0" />
          <p class="flex-1 text-xs sm:text-sm text-slate-700">{{ t('visitor.previewBanner') }}</p>
          <RouterLink
            to="/register-client"
            class="flex-shrink-0 px-3 py-2 rounded-xl bg-brand text-white text-xs sm:text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            {{ t('visitor.signUp') }}
          </RouterLink>
        </div>
        <RouterView />
      </div>
    </main>

    <!-- Mobile bottom nav -->
    <BottomNav class="lg:hidden" />

    <OnboardingTour />
  </div>
</template>
