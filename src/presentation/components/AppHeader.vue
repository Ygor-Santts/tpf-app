<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@app/stores/auth'
import { Icon } from '@iconify/vue'

const { locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const menuOpen = ref(false)

function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu() { menuOpen.value = false }

function logout() {
  auth.logout()
  closeMenu()
  router.replace('/login')
}
</script>

<template>
  <header class="fixed top-0 inset-x-0 z-30 h-14 bg-white border-b flex items-center justify-between px-4">
    <RouterLink :to="auth.isWorker ? '/worker/dashboard' : '/tabs/home'" class="flex items-center gap-2">
      <span class="text-lg font-bold text-brand">Trampo Fácil</span>
    </RouterLink>

    <div class="flex items-center gap-2">
      <select v-model="locale" class="text-xs border rounded-lg px-2 py-1 cursor-pointer bg-white text-slate-600">
        <option value="pt-BR">PT-BR</option>
        <option value="en">EN</option>
      </select>

      <!-- Account menu -->
      <div class="relative" v-if="auth.token">
        <button
          @click="toggleMenu"
          class="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand font-bold text-sm hover:bg-brand-200 transition-colors"
        >
          {{ auth.user?.name?.charAt(0)?.toUpperCase() ?? '?' }}
        </button>

        <!-- Backdrop to close on outside click -->
        <div v-if="menuOpen" class="fixed inset-0 z-40" @click="closeMenu" />

        <Transition name="fade">
          <div
            v-if="menuOpen"
            class="absolute right-0 top-10 w-52 bg-white rounded-2xl border shadow-card-hover py-1 z-50"
          >
            <div class="px-4 py-2.5 border-b">
              <p class="text-sm font-semibold text-slate-900 truncate">{{ auth.user?.name }}</p>
              <p class="text-xs text-slate-500 truncate">{{ auth.user?.email }}</p>
              <span v-if="auth.isWorker" class="mt-1 inline-block text-xs font-medium bg-brand-50 text-brand px-2 py-0.5 rounded-full">Trabalhador</span>
            </div>

            <RouterLink
              v-if="auth.isWorker"
              to="/worker/profile/edit"
              @click="closeMenu"
              class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Icon icon="mdi:account-edit-outline" class="text-lg text-slate-400" />
              Meu perfil
            </RouterLink>

            <button
              @click="logout"
              class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Icon icon="mdi:logout" class="text-lg" />
              Sair
            </button>
          </div>
        </Transition>
      </div>

      <RouterLink
        v-else
        to="/login"
        class="text-xs font-medium text-brand hover:text-brand-dark transition-colors px-2 py-1"
      >
        Entrar
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
