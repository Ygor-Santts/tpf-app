<script setup lang="ts">
// Shown to visitors who try to contact a professional: contact details are
// only for people with an account.
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const props = defineProps<{ name?: string }>()
const open = defineModel<boolean>({ default: false })
const { t } = useI18n()
const route = useRoute()

const loginTo = computed(() => ({ path: '/login', query: { redirect: route.fullPath } }))
const title = computed(() =>
  props.name ? t('visitor.promptTitle', { name: props.name }) : t('visitor.promptTitleGeneric'),
)
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="open = false" />
        <div class="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 grid gap-4">
          <button
            @click="open = false"
            :aria-label="t('common.close')"
            class="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100"
          >
            <Icon icon="mdi:close" class="text-slate-500" />
          </button>
          <div class="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
            <Icon icon="mdi:whatsapp" class="text-2xl text-green-600" />
          </div>
          <div>
            <h3 class="font-bold text-slate-900 pr-8">{{ title }}</h3>
            <p class="text-sm text-slate-500 mt-1">{{ t('visitor.promptText') }}</p>
          </div>
          <div class="grid gap-2">
            <RouterLink
              to="/register-client"
              class="flex items-center justify-center gap-2 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors"
            >
              <Icon icon="mdi:account-plus-outline" class="text-lg" />
              {{ t('visitor.signUp') }}
            </RouterLink>
            <RouterLink
              :to="loginTo"
              class="flex items-center justify-center gap-2 py-3 rounded-xl border text-slate-700 font-medium text-sm hover:border-brand hover:text-brand transition-colors"
            >
              {{ t('visitor.haveAccount') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.2s ease; }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
</style>
