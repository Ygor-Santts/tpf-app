<script setup lang="ts">
// A few skippable slides that explain the app on first visit.
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@app/stores/auth'
import { useTourStore } from '@app/stores/tour'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const tour = useTourStore()
const index = ref(0)

const clientSlides = [
  { icon: 'mdi:hand-wave-outline', color: 'bg-brand-50 text-brand', key: 'help.tour.client.welcome' },
  { icon: 'mdi:magnify', color: 'bg-brand-50 text-brand', key: 'help.tour.client.search' },
  { icon: 'mdi:whatsapp', color: 'bg-green-50 text-green-600', key: 'help.tour.client.contact' },
  { icon: 'mdi:star-outline', color: 'bg-amber-50 text-amber-600', key: 'help.tour.client.rate' },
]

const workerSlides = [
  { icon: 'mdi:hand-wave-outline', color: 'bg-brand-50 text-brand', key: 'help.tour.worker.welcome' },
  { icon: 'mdi:account-edit-outline', color: 'bg-brand-50 text-brand', key: 'help.tour.worker.profile' },
  { icon: 'mdi:image-multiple-outline', color: 'bg-purple-50 text-purple-600', key: 'help.tour.worker.portfolio' },
  { icon: 'mdi:star-outline', color: 'bg-amber-50 text-amber-600', key: 'help.tour.worker.ratings' },
]

const slides = computed(() => tour.mode === 'worker' ? workerSlides : clientSlides)
const slide = computed(() => slides.value[index.value])
const isLast = computed(() => index.value === slides.value.length - 1)

watch(() => tour.open, (open) => { if (open) index.value = 0 })

function next() {
  if (!isLast.value) { index.value++; return }
  tour.close()
  // Visitors finish on the sign-up screen; everyone else stays where they are.
  if (!auth.token) router.push(tour.mode === 'worker' ? '/register-worker' : '/register-client')
}
</script>

<template>
  <Transition name="tour">
    <div v-if="tour.open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-4" @click.self="tour.close()">
      <div class="w-full max-w-sm bg-white rounded-3xl shadow-card-hover p-6 grid gap-5" role="dialog" aria-modal="true">
        <div class="flex justify-end -mt-2 -mr-2">
          <button @click="tour.close()" class="text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1">
            {{ t('help.tour.skip') }}
          </button>
        </div>

        <div class="grid gap-3 justify-items-center text-center min-h-[200px] content-start">
          <div :class="['h-16 w-16 rounded-full flex items-center justify-center', slide.color]">
            <Icon :icon="slide.icon" class="text-3xl" />
          </div>
          <h2 class="text-lg font-bold text-slate-900 leading-tight">{{ t(`${slide.key}.title`) }}</h2>
          <p class="text-sm text-slate-600 leading-relaxed">{{ t(`${slide.key}.text`) }}</p>
        </div>

        <div class="flex justify-center gap-1.5">
          <span
            v-for="(_, i) in slides"
            :key="i"
            :class="['h-1.5 rounded-full transition-all', i === index ? 'w-5 bg-brand' : 'w-1.5 bg-slate-200']"
          />
        </div>

        <div class="flex gap-2">
          <button
            v-if="index > 0"
            @click="index--"
            class="flex-1 py-3 rounded-xl border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {{ t('common.back') }}
          </button>
          <button
            @click="next"
            class="flex-1 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            {{ isLast ? (auth.token ? t('help.tour.done') : t('help.tour.signUp')) : t('help.tour.next') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.tour-enter-active, .tour-leave-active { transition: opacity 0.2s ease; }
.tour-enter-from, .tour-leave-to { opacity: 0; }
</style>
