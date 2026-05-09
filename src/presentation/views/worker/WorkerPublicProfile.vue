<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@app/stores/auth'
import { getWorkerPortfolio, getWorkerRatings, getWorkerRatingSummary, submitRating } from '@infra/services/profile.service'
import { api } from '@infra/http'
import { Icon } from '@iconify/vue'
import StarRating from '@ui/components/StarRating.vue'
import type { PortfolioItem, Rating, RatingSummary } from '@domain/worker'

const props = defineProps<{ id: string }>()
const auth = useAuthStore()

const worker = ref<any>(null)
const portfolio = ref<PortfolioItem[]>([])
const ratings = ref<Rating[]>([])
const summary = ref<RatingSummary | null>(null)
const loading = ref(true)
const ratingScore = ref(0)
const ratingComment = ref('')
const submitting = ref(false)
const submitted = ref(false)
const ratingError = ref('')

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3000'

function mediaUrl(url: string) {
  return url.startsWith('http') ? url : `${API_BASE}${url}`
}

onMounted(async () => {
  const workerId = Number(props.id)
  try {
    const [profile, port, rat, sum] = await Promise.all([
      api.get(`/worker/${workerId}/profile`).then(r => r.data),
      getWorkerPortfolio(workerId),
      getWorkerRatings(workerId),
      getWorkerRatingSummary(workerId),
    ])
    worker.value = profile
    portfolio.value = port
    ratings.value = rat.data
    summary.value = sum
  } catch {}
  finally { loading.value = false }
})

const canRate = computed(() => auth.token && !auth.isWorker && !submitted.value)

const occupations = computed(() =>
  worker.value?.jobOccupations?.map((o: any) => o.name) ?? []
)

const cities = computed(() =>
  worker.value?.operationCities?.map((c: any) => c.name) ?? []
)

async function sendRating() {
  if (!ratingScore.value) { ratingError.value = 'Selecione uma nota de 1 a 5.'; return }
  submitting.value = true; ratingError.value = ''
  try {
    await submitRating(Number(props.id), ratingScore.value, ratingComment.value || undefined)
    submitted.value = true
    const [rat, sum] = await Promise.all([
      getWorkerRatings(Number(props.id)),
      getWorkerRatingSummary(Number(props.id)),
    ])
    ratings.value = rat.data
    summary.value = sum
  } catch (e: any) {
    ratingError.value = e?.response?.data?.message || 'Erro ao enviar avaliação.'
  } finally { submitting.value = false }
}
</script>

<template>
  <section class="grid gap-6">
    <div v-if="loading" class="grid gap-4">
      <div class="h-24 rounded-2xl bg-slate-100 animate-pulse" />
      <div class="grid grid-cols-3 gap-3">
        <div v-for="i in 3" :key="i" class="aspect-square rounded-2xl bg-slate-100 animate-pulse" />
      </div>
    </div>

    <template v-else-if="worker">
      <!-- Header -->
      <div class="bg-white rounded-2xl border shadow-card p-5 flex items-start gap-4">
        <div class="h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center text-brand font-bold text-2xl flex-shrink-0">
          {{ worker.user?.name?.charAt(0)?.toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="text-xl font-bold text-slate-900">{{ worker.user?.name }}</h2>
          <div v-if="summary && summary.count > 0" class="flex items-center gap-2 mt-1">
            <StarRating :score="Math.round(summary.average)" size="w-4 h-4" />
            <span class="text-sm text-slate-600">{{ summary.average.toFixed(1) }} · {{ summary.count }} avaliações</span>
          </div>
          <p v-if="worker.bio" class="text-sm text-slate-500 mt-2">{{ worker.bio }}</p>
          <div class="flex flex-wrap gap-1.5 mt-2">
            <span v-for="o in occupations" :key="o" class="text-xs px-2.5 py-1 rounded-full bg-brand-50 text-brand border border-brand-100 font-medium">{{ o }}</span>
          </div>
          <div v-if="cities.length" class="flex items-center gap-1 mt-2 text-sm text-slate-500">
            <Icon icon="mdi:map-marker-outline" class="flex-shrink-0" />
            {{ cities.join(', ') }}
          </div>
        </div>
      </div>

      <!-- Contact -->
      <a
        v-if="worker.user?.phone"
        :href="`tel:${worker.user.phone}`"
        class="flex items-center justify-center gap-2 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors"
      >
        <Icon icon="mdi:phone" />
        {{ worker.user.phone }}
      </a>

      <!-- Portfolio -->
      <div v-if="portfolio.length" class="grid gap-3">
        <h3 class="font-semibold text-slate-800">Portfólio</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div v-for="item in portfolio" :key="item.id" class="rounded-2xl overflow-hidden border aspect-square bg-slate-100">
            <video v-if="item.type === 'video'" :src="mediaUrl(item.url)" class="w-full h-full object-cover" controls />
            <img v-else :src="mediaUrl(item.url)" :alt="item.caption" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <!-- Ratings -->
      <div class="grid gap-3">
        <h3 class="font-semibold text-slate-800">Avaliações</h3>
        <div v-if="!ratings.length" class="text-sm text-slate-400">Nenhuma avaliação ainda.</div>
        <div
          v-for="r in ratings"
          :key="r.id"
          class="bg-white rounded-2xl border shadow-card p-4 grid gap-1"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-800">{{ r.authorName || 'Usuário' }}</span>
            <StarRating :score="r.score" size="w-4 h-4" />
          </div>
          <p v-if="r.comment" class="text-sm text-slate-600">{{ r.comment }}</p>
          <span class="text-xs text-slate-400">{{ new Date(r.createdAt).toLocaleDateString('pt-BR') }}</span>
        </div>
      </div>

      <!-- Rating form -->
      <div v-if="canRate" class="bg-white rounded-2xl border shadow-card p-5 grid gap-4">
        <h3 class="font-semibold text-slate-800">Avaliar profissional</h3>
        <div class="grid gap-1">
          <span class="text-sm text-slate-600">Sua nota:</span>
          <StarRating :score="ratingScore" size="w-8 h-8" @update:score="ratingScore = $event" />
        </div>
        <textarea
          v-model="ratingComment"
          rows="3"
          placeholder="Deixe um comentário (opcional)"
          class="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100 resize-none"
        />
        <p v-if="ratingError" class="text-red-500 text-sm">{{ ratingError }}</p>
        <button
          @click="sendRating"
          :disabled="submitting"
          class="py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Icon v-if="submitting" icon="mdi:loading" class="animate-spin" />
          Enviar avaliação
        </button>
      </div>

      <div v-else-if="submitted" class="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm">
        <Icon icon="mdi:check-circle-outline" />
        Obrigado pela sua avaliação!
      </div>

      <div v-else-if="!auth.token" class="p-4 bg-slate-50 rounded-2xl text-sm text-slate-600 text-center">
        <RouterLink to="/login" class="text-brand font-medium hover:underline">Faça login</RouterLink>
        para avaliar este profissional.
      </div>
    </template>

    <div v-else class="text-center py-12 text-slate-400">
      <Icon icon="mdi:account-question-outline" class="text-5xl mb-2" />
      <p>Profissional não encontrado.</p>
    </div>
  </section>
</template>
