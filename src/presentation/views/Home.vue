<script setup lang="ts">
import QuickCard from '@ui/components/QuickCard.vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
const { t } = useI18n()
</script>
<template>
  <section class="grid gap-4">
    <input class="w-full border rounded-xl p-3 text-sm" :placeholder="t('common.searchServices')" />
    <QuickCard />
    <div class="grid grid-cols-2 gap-3 items-start">
      <div class="grid gap-2">
        <div class="text-xs text-gray-500">{{ t('home.join') }}</div>
        <div class="rounded-2xl border shadow-card p-3 grid gap-2">
          <div class="h-24 rounded-xl bg-gray-100 flex items-center justify-center"><Icon icon="mdi:account-cowboy-hat-outline" class="text-3xl text-gray-400" /></div>
          <div class="text-xs text-gray-500">{{ t('home.imWorker') }}</div>
          <RouterLink to="/register-worker" class="block w-full text-center rounded-xl bg-black text-white py-2 cursor-pointer">{{ t('common.go') }}</RouterLink>
        </div>
      </div>
      <div class="grid gap-2">
        <div class="text-xs text-right text-gray-500">{{ t('home.exploreCategories') }}</div>
        <div class="rounded-2xl border shadow-card p-3 grid gap-2">
          <div class="h-24 rounded-xl bg-gray-100 flex items-center justify-center"><Icon icon="mdi:view-grid-outline" class="text-3xl text-gray-400" /></div>
          <div class="text-xs text-gray-500">{{ t('home.browseAvailable') }}</div>
          <RouterLink to="/tabs/categories" class="block w-full text-center rounded-xl border py-2 cursor-pointer">{{ t('common.browse') }}</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
