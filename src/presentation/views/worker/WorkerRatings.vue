<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useWorkerStore } from '@app/stores/worker'
import { Icon } from '@iconify/vue'
import StarRating from '@ui/components/StarRating.vue'

const worker = useWorkerStore()

onMounted(async () => {
  await worker.loadProfile()
  if (worker.profile) {
    await Promise.all([
      worker.loadRatings(worker.profile.id, 1),
      worker.loadRatingSummary(worker.profile.id),
    ])
  }
})

const totalPages = computed(() =>
  worker.ratingSummary ? Math.ceil(worker.ratingSummary.count / 10) : 0
)

async function goPage(page: number) {
  if (worker.profile) await worker.loadRatings(worker.profile.id, page)
}
</script>

<template>
  <section class="grid gap-5">
    <div class="flex items-center gap-2">
      <Icon icon="mdi:star-outline" class="text-brand text-2xl" />
      <h2 class="text-xl font-bold text-slate-900">Avaliações</h2>
    </div>

    <!-- Summary -->
    <div v-if="worker.ratingSummary" class="bg-white rounded-2xl border shadow-card p-5 flex items-center gap-5">
      <div class="text-center">
        <div class="text-4xl font-bold text-brand">{{ worker.ratingSummary.average.toFixed(1) }}</div>
        <StarRating :score="Math.round(worker.ratingSummary.average)" size="w-5 h-5" class="justify-center mt-1" />
      </div>
      <div class="flex-1 border-l pl-5">
        <div class="text-2xl font-bold text-slate-800">{{ worker.ratingSummary.count }}</div>
        <div class="text-sm text-slate-500">avaliações recebidas</div>
      </div>
    </div>

    <div v-if="worker.loading" class="grid gap-3">
      <div v-for="i in 4" :key="i" class="h-20 rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <div v-else-if="!worker.ratings.length" class="text-center py-12 text-slate-400">
      <Icon icon="mdi:star-off-outline" class="text-5xl mb-2" />
      <p>Nenhuma avaliação recebida ainda.</p>
    </div>

    <div v-else class="grid gap-3">
      <div
        v-for="r in worker.ratings"
        :key="r.id"
        class="bg-white rounded-2xl border shadow-card p-4 grid gap-2"
      >
        <div class="flex items-center justify-between">
          <span class="font-medium text-slate-800 text-sm">{{ r.authorName || 'Usuário' }}</span>
          <StarRating :score="r.score" size="w-4 h-4" />
        </div>
        <p v-if="r.comment" class="text-sm text-slate-600">{{ r.comment }}</p>
        <span class="text-xs text-slate-400">{{ new Date(r.createdAt).toLocaleDateString('pt-BR') }}</span>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-between items-center pt-2">
        <button
          :disabled="worker.ratingsPage <= 1"
          @click="goPage(worker.ratingsPage - 1)"
          class="flex items-center gap-1 px-4 py-2 border rounded-xl text-sm hover:bg-slate-50 disabled:opacity-40"
        >
          <Icon icon="mdi:chevron-left" /> Anterior
        </button>
        <span class="text-sm text-slate-500">{{ worker.ratingsPage }} / {{ totalPages }}</span>
        <button
          :disabled="worker.ratingsPage >= totalPages"
          @click="goPage(worker.ratingsPage + 1)"
          class="flex items-center gap-1 px-4 py-2 border rounded-xl text-sm hover:bg-slate-50 disabled:opacity-40"
        >
          Próxima <Icon icon="mdi:chevron-right" />
        </button>
      </div>
    </div>
  </section>
</template>
