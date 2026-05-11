<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWorkerStore } from '@app/stores/worker'
import { Icon } from '@iconify/vue'

const worker = useWorkerStore()
const fileInput = ref<HTMLInputElement>()
const caption = ref('')
const uploading = ref(false)
const uploadError = ref('')
const confirmDeleteId = ref<number | null>(null)

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

onMounted(async () => {
  await worker.loadProfile()
  if (worker.profile) await worker.loadPortfolio(worker.profile.id)
})

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function mediaUrl(url: string) {
  return url.startsWith('http') ? url : `${API_BASE}${url}`
}

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
  confirmDeleteId.value = null
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
      <input v-model="caption" placeholder="Descrição (opcional)" class="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-100" />
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

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div
        v-for="item in worker.portfolio"
        :key="item.id"
        class="relative group rounded-2xl overflow-hidden border bg-slate-100"
      >
        <video v-if="item.type === 'video'" :src="mediaUrl(item.url)" class="w-full aspect-square object-cover" />
        <img v-else :src="mediaUrl(item.url)" :alt="item.caption" class="w-full aspect-square object-cover" />

        <!-- Hover overlay — trash trigger -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button @click.stop="confirmDeleteId = item.id" class="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-red-50">
            <Icon icon="mdi:trash-can-outline" class="text-red-500 text-xl" />
          </button>
        </div>

        <!-- Inline confirm overlay -->
        <div v-if="confirmDeleteId === item.id" class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 p-3">
          <p class="text-white text-xs text-center font-medium">Remover este item?</p>
          <div class="flex gap-2">
            <button @click="remove(item.id)" class="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg font-medium hover:bg-red-600">Remover</button>
            <button @click="confirmDeleteId = null" class="px-3 py-1.5 bg-white/20 text-white text-xs rounded-lg hover:bg-white/30">Cancelar</button>
          </div>
        </div>

        <div v-if="item.caption" class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <p class="text-white text-xs truncate">{{ item.caption }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
