<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { mediaUrl } from '@infra/http'
import type { PortfolioItem } from '@domain/worker'

// Portfolio grid with a full-screen viewer. The first item shows larger on
// bigger screens, a tap opens the viewer (arrows, swipe, Esc), and the
// worker's own page can remove items.
const props = withDefaults(
  defineProps<{
    items: PortfolioItem[]
    editable?: boolean
    /** Show only this many in the grid, with a "Ver todos" button. */
    limit?: number
  }>(),
  { editable: false, limit: 0 },
)
const emit = defineEmits<{ remove: [id: number] }>()

const expanded = ref(false)
const shown = computed(() =>
  props.limit && !expanded.value ? props.items.slice(0, props.limit) : props.items,
)
const hidden = computed(() => props.items.length - shown.value.length)
const videos = computed(() => props.items.filter((i) => i.type === 'video').length)
const photos = computed(() => props.items.length - videos.value)

const confirmId = ref<number | null>(null)
const open = ref<number | null>(null)
const current = computed(() => (open.value === null ? null : props.items[open.value]))
const viewer = ref<HTMLElement>()

function show(index: number) {
  open.value = index
  nextTick(() => viewer.value?.focus())
}
function close() {
  open.value = null
}
function step(delta: number) {
  if (open.value === null) return
  const n = props.items.length
  open.value = (open.value + delta + n) % n
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

let touchX = 0
function onTouchStart(e: TouchEvent) {
  touchX = e.touches[0].clientX
}
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchX
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
}

// Keep the page from scrolling behind the viewer.
watch(open, (value) => {
  document.body.style.overflow = value === null ? '' : 'hidden'
})
// An item removed while the viewer is open.
watch(
  () => props.items.length,
  (n) => {
    if (open.value !== null && open.value >= n) open.value = n ? n - 1 : null
  },
)
onBeforeUnmount(() => {
  document.body.style.overflow = ''
})

const dateFormat = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' })
function when(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : dateFormat.format(d).replace('.', '')
}

function remove(id: number) {
  confirmId.value = null
  emit('remove', id)
}
</script>

<template>
  <div class="grid gap-3">
    <p class="text-xs text-slate-500">
      <template v-if="photos">{{ photos }} {{ photos === 1 ? 'foto' : 'fotos' }}</template>
      <template v-if="photos && videos"> · </template>
      <template v-if="videos">{{ videos }} {{ videos === 1 ? 'vídeo' : 'vídeos' }}</template>
    </p>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
      <div
        v-for="(item, index) in shown"
        :key="item.id"
        class="relative rounded-2xl overflow-hidden bg-slate-100 group"
        :class="index === 0 && shown.length >= 3 ? 'sm:col-span-2 sm:row-span-2' : ''"
      >
        <button
          type="button"
          class="block w-full h-full aspect-square focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
          :aria-label="item.caption ? `Ver: ${item.caption}` : `Ver item ${index + 1}`"
          @click="show(index)"
        >
          <video
            v-if="item.type === 'video'"
            :src="`${mediaUrl(item.url)}#t=0.1`"
            preload="metadata"
            muted
            playsinline
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <img
            v-else
            :src="mediaUrl(item.url)"
            :alt="item.caption || ''"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </button>

        <span
          v-if="item.type === 'video'"
          class="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span class="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center">
            <Icon icon="mdi:play" class="text-white text-3xl" />
          </span>
        </span>

        <div
          v-if="item.caption"
          class="pointer-events-none absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-6 pb-2"
        >
          <p class="text-white text-xs font-medium line-clamp-2">{{ item.caption }}</p>
        </div>

        <!-- Always visible: hover does not exist on a phone. -->
        <button
          v-if="editable"
          type="button"
          class="absolute top-2 right-2 h-9 w-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-red-50"
          aria-label="Remover do portfólio"
          @click="confirmId = item.id"
        >
          <Icon icon="mdi:trash-can-outline" class="text-red-500 text-lg" />
        </button>

        <div
          v-if="confirmId === item.id"
          class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 p-3"
        >
          <p class="text-white text-sm text-center font-medium">Remover este item?</p>
          <div class="flex gap-2">
            <button type="button" class="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg font-medium hover:bg-red-600" @click="remove(item.id)">Remover</button>
            <button type="button" class="px-3 py-1.5 bg-white/20 text-white text-xs rounded-lg hover:bg-white/30" @click="confirmId = null">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="hidden > 0"
      type="button"
      class="justify-self-start text-sm font-semibold text-brand hover:underline"
      @click="expanded = true"
    >
      Ver todos ({{ items.length }})
    </button>

    <Teleport to="body">
      <div
        v-if="current"
        ref="viewer"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        aria-label="Portfólio"
        class="fixed inset-0 z-[100] bg-black flex flex-col focus:outline-none"
        @keydown="onKey"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <div class="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2 text-white">
          <span class="text-sm tabular-nums text-white/80">{{ (open ?? 0) + 1 }} / {{ items.length }}</span>
          <button type="button" class="h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center" aria-label="Fechar" @click="close">
            <Icon icon="mdi:close" class="text-2xl" />
          </button>
        </div>

        <div class="relative flex-1 min-h-0 flex items-center justify-center px-2 sm:px-16" @click.self="close">
          <video
            v-if="current.type === 'video'"
            :key="current.id"
            :src="mediaUrl(current.url)"
            controls
            autoplay
            playsinline
            class="max-h-full max-w-full rounded-lg"
          />
          <img
            v-else
            :key="current.id"
            :src="mediaUrl(current.url)"
            :alt="current.caption || ''"
            class="max-h-full max-w-full object-contain rounded-lg select-none"
          />

          <template v-if="items.length > 1">
            <button type="button" class="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white" aria-label="Anterior" @click="step(-1)">
              <Icon icon="mdi:chevron-left" class="text-3xl" />
            </button>
            <button type="button" class="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white" aria-label="Próximo" @click="step(1)">
              <Icon icon="mdi:chevron-right" class="text-3xl" />
            </button>
          </template>
        </div>

        <div class="px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] grid gap-3">
          <div class="text-white max-w-2xl mx-auto w-full text-center">
            <p v-if="current.caption" class="text-sm">{{ current.caption }}</p>
            <p class="text-xs text-white/60 mt-0.5">{{ when(current.createdAt) }}</p>
          </div>
          <div v-if="items.length > 1" class="flex gap-2 overflow-x-auto justify-start sm:justify-center pb-1">
            <button
              v-for="(item, index) in items"
              :key="item.id"
              type="button"
              class="relative shrink-0 h-14 w-14 rounded-lg overflow-hidden ring-2 transition"
              :class="index === open ? 'ring-white' : 'ring-transparent opacity-60 hover:opacity-100'"
              :aria-label="`Ir para o item ${index + 1}`"
              @click="show(index)"
            >
              <video v-if="item.type === 'video'" :src="`${mediaUrl(item.url)}#t=0.1`" preload="metadata" muted class="h-full w-full object-cover" />
              <img v-else :src="mediaUrl(item.url)" alt="" loading="lazy" class="h-full w-full object-cover" />
              <Icon v-if="item.type === 'video'" icon="mdi:play" class="absolute inset-0 m-auto text-white text-xl drop-shadow" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
