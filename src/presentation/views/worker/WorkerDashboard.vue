<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@app/stores/auth'
import { useWorkerStore } from '@app/stores/worker'
import { Icon } from '@iconify/vue'
import StarRating from '@ui/components/StarRating.vue'

const auth = useAuthStore()
const worker = useWorkerStore()

onMounted(async () => {
  await worker.loadProfile()
  if (worker.profile) {
    await Promise.all([
      worker.loadPortfolio(worker.profile.id),
      worker.loadRatingSummary(worker.profile.id),
      worker.loadRatings(worker.profile.id, 1),
    ])
  }
})

const displayName = computed(() => worker.profile?.user.name || auth.user?.name || '')
const summary = computed(() => worker.ratingSummary)
const recentRatings = computed(() => worker.ratings.slice(0, 3))
</script>

<template>
  <section class="grid gap-5">
    <div class="flex items-center gap-4">
      <div class="h-14 w-14 rounded-full bg-brand-100 flex items-center justify-center text-brand font-bold text-2xl flex-shrink-0">
        {{ displayName.charAt(0).toUpperCase() }}
      </div>
      <div>
        <h2 class="text-xl font-bold text-slate-900">Olá, {{ displayName.split(' ')[0] }}</h2>
        <p class="text-sm text-slate-500">Bem-vindo ao seu painel</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white rounded-2xl border shadow-card p-4 text-center">
        <div class="text-3xl font-bold text-brand">{{ summary?.average?.toFixed(1) ?? '—' }}</div>
        <div class="flex justify-center mt-1">
          <StarRating :score="Math.round(summary?.average ?? 0)" size="w-4 h-4" />
        </div>
        <div class="text-xs text-slate-500 mt-1">Avaliação média</div>
      </div>
      <div class="bg-white rounded-2xl border shadow-card p-4 text-center">
        <div class="text-3xl font-bold text-brand">{{ summary?.count ?? 0 }}</div>
        <div class="text-xs text-slate-500 mt-1">Avaliações recebidas</div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="grid gap-2">
      <h3 class="font-semibold text-slate-800 text-sm">Ações rápidas</h3>
      <div class="grid grid-cols-2 gap-2">
        <RouterLink to="/worker/profile/edit" class="bg-white rounded-2xl border shadow-card p-4 flex flex-col items-center gap-2 hover:shadow-card-hover hover:border-brand-200 transition-all">
          <Icon icon="mdi:account-edit-outline" class="text-2xl text-brand" />
          <span class="text-sm font-medium text-slate-700">Editar perfil</span>
        </RouterLink>
        <RouterLink to="/worker/portfolio" class="bg-white rounded-2xl border shadow-card p-4 flex flex-col items-center gap-2 hover:shadow-card-hover hover:border-brand-200 transition-all">
          <Icon icon="mdi:image-multiple-outline" class="text-2xl text-brand" />
          <span class="text-sm font-medium text-slate-700">Portfólio</span>
        </RouterLink>
        <RouterLink to="/worker/ratings" class="bg-white rounded-2xl border shadow-card p-4 flex flex-col items-center gap-2 hover:shadow-card-hover hover:border-brand-200 transition-all">
          <Icon icon="mdi:star-outline" class="text-2xl text-brand" />
          <span class="text-sm font-medium text-slate-700">Avaliações</span>
        </RouterLink>
        <RouterLink v-if="worker.profile?.id" :to="`/tabs/workers/${worker.profile.id}`" class="bg-white rounded-2xl border shadow-card p-4 flex flex-col items-center gap-2 hover:shadow-card-hover hover:border-brand-200 transition-all">
          <Icon icon="mdi:eye-outline" class="text-2xl text-brand" />
          <span class="text-sm font-medium text-slate-700">Ver perfil público</span>
        </RouterLink>
      </div>
    </div>

    <!-- Recent ratings -->
    <div v-if="recentRatings.length" class="grid gap-2">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-slate-800 text-sm">Avaliações recentes</h3>
        <RouterLink to="/worker/ratings" class="text-xs text-brand hover:underline">Ver todas</RouterLink>
      </div>
      <div
        v-for="r in recentRatings"
        :key="r.id"
        class="bg-white rounded-2xl border shadow-card p-4 grid gap-2"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-slate-800">{{ r.authorName || 'Anônimo' }}</span>
          <StarRating :score="r.score" size="w-4 h-4" />
        </div>
        <p v-if="r.comment" class="text-sm text-slate-500">{{ r.comment }}</p>
      </div>
    </div>
  </section>
</template>
