<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWorkerStore } from '@app/stores/worker'
import { Icon } from '@iconify/vue'
import PortfolioGallery from '@ui/components/PortfolioGallery.vue'

const worker = useWorkerStore()
const fileInput = ref<HTMLInputElement>()
const caption = ref('')
const uploading = ref(false)
const uploadError = ref('')

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

onMounted(async () => {
  await worker.loadProfile()
  if (worker.profile) await worker.loadPortfolio(worker.profile.id)
})


async function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadError.value = ''
  if (file.size > MAX_FILE_SIZE) {
    uploadError.value = 'Arquivo muito grande. Limite: 50 MB.'
    if (fileInput.value) fileInput.value.value = ''
    return
  }
  uploading.value = true
  await worker.uploadItem(file, caption.value || undefined)
  caption.value = ''
  uploading.value = false
  if (fileInput.value) fileInput.value.value = ''
}

async function remove(id: number) {
  await worker.deleteItem(id)
}
</script>

<template>
  <section class="grid gap-5">
    <div class="flex items-center gap-2">
      <Icon icon="mdi:image-multiple-outline" class="text-brand text-2xl" />
      <h2 class="text-xl font-bold text-slate-900">Portfólio</h2>
    </div>

    <!-- Upload -->
    <div class="bg-white rounded-2xl border shadow-card p-5 grid gap-3">
      <h3 class="font-semibold text-slate-800 text-sm">Adicionar trabalho</h3>
      <input v-model="caption" maxlength="200" placeholder="Descrição (opcional)" class="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100" />
      <label class="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-brand hover:bg-brand-50 transition-colors text-sm text-slate-500">
        <Icon v-if="uploading" icon="mdi:loading" class="animate-spin text-brand" />
        <Icon v-else icon="mdi:cloud-upload-outline" class="text-xl text-slate-400" />
        <span>{{ uploading ? 'Enviando...' : 'Selecionar imagem ou vídeo' }}</span>
        <input ref="fileInput" type="file" accept="image/*,video/*" class="sr-only" :disabled="uploading" @change="onFileChange" />
      </label>
      <p v-if="uploadError" class="flex items-center gap-1.5 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
        <Icon icon="mdi:alert-circle-outline" />{{ uploadError }}
      </p>
      <p v-else-if="worker.error" class="flex items-center gap-1.5 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
        <Icon icon="mdi:alert-circle-outline" />{{ worker.error }}
      </p>
    </div>

    <!-- Grid -->
    <div v-if="worker.loading" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div v-for="i in 6" :key="i" class="aspect-square rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <div v-else-if="!worker.portfolio.length" class="text-center py-12 text-slate-400">
      <Icon icon="mdi:image-off-outline" class="text-5xl mb-2" />
      <p>Nenhum trabalho no portfólio ainda.</p>
    </div>

    <PortfolioGallery v-else :items="worker.portfolio" editable @remove="remove" />
  </section>
</template>
