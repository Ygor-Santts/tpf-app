import { defineStore } from 'pinia'
import type { AppMode } from '@domain/auth'

// The first-visit tutorial. It shows once per side of the app (client or
// worker) and can be reopened at any time from "Como funciona".
const seenKey = (mode: AppMode) => `tpf_tour_seen_${mode}`

const hasSeen = (mode: AppMode) => {
  try { return localStorage.getItem(seenKey(mode)) === '1' } catch { return true }
}

export const useTourStore = defineStore('tour', {
  state: () => ({ open: false, mode: 'client' as AppMode }),
  actions: {
    showIfNew(mode: AppMode) {
      if (!this.open && !hasSeen(mode)) this.show(mode)
    },
    show(mode: AppMode) {
      this.mode = mode
      this.open = true
    },
    close() {
      this.open = false
      try { localStorage.setItem(seenKey(this.mode), '1') } catch { /* private mode */ }
    },
  },
})
