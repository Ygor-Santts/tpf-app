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
          <div class="h-24 rounded-xl bg-gray-100 flex items-center justify-center">
            <Icon icon="mdi:account-cowboy-hat-outline" class="text-3xl text-gray-400" />
          </div>
          <div class="text-xs text-gray-500">{{ t('home.imWorker') }}</div>
          <RouterLink to="/register-worker" class="block w-full text-center rounded-xl bg-black text-white py-2 cursor-pointer">{{ t('common.go') }}</RouterLink>
        </div>
      </div>
      <div class="grid gap-2">
        <div class="text-xs text-right text-gray-500">{{ t('home.exploreCategories') }}</div>
        <div class="rounded-2xl border shadow-card p-3 grid gap-2">
          <div class="h-24 rounded-xl bg-gray-100 flex items-center justify-center">
            <Icon icon="mdi:view-grid-outline" class="text-3xl text-gray-400" />
          </div>
          <div class="text-xs text-gray-500">{{ t('home.browseAvailable') }}</div>
          <RouterLink to="/tabs/categories" class="block w-full text-center rounded-xl border py-2 cursor-pointer">{{ t('common.browse') }}</RouterLink>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="font-semibold">{{ t('home.locations') }}</div>
      <RouterLink to="/tabs/states" class="text-xs text-gray-500 underline cursor-pointer">{{ t('common.showAll') }}</RouterLink>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <RouterLink to="/tabs/states" class="rounded-xl border p-3 flex items-center gap-2 hover:bg-gray-50 cursor-pointer"><Icon icon="mdi:map-search-outline" /> <span>{{ t('common.find') }}</span></RouterLink>
      <RouterLink to="/tabs/categories" class="rounded-xl border p-3 flex items-center gap-2 hover:bg-gray-50 cursor-pointer"><Icon icon="mdi:book-open-variant-outline" /> <span>{{ t('common.browse') }}</span></RouterLink>
      <RouterLink to="/tabs/states" class="rounded-xl border p-3 flex items-center gap-2 hover:bg-gray-50 cursor-pointer"><Icon icon="mdi:earth" /> <span>Regions</span></RouterLink>
      <RouterLink to="/tabs/workers" class="rounded-xl border p-3 flex items-center gap-2 hover:bg-gray-50 cursor-pointer"><Icon icon="mdi:account-hard-hat-outline" /> <span>Professional</span></RouterLink>
      <div class="rounded-xl border p-3 flex items-center gap-2 opacity-50 pointer-events-none"><Icon icon="mdi:home-outline" /> <span>Home</span></div>
      <div class="rounded-xl border p-3 flex items-center gap-2 opacity-50 pointer-events-none"><Icon icon="mdi:lifebuoy" /> <span>Assistance</span></div>
    </div>
    <div class="flex items-center justify-between">
      <div class="font-semibold">{{ t('home.viewMore') }}</div>
      <RouterLink to="/tabs/states" class="text-xs text-gray-500 underline cursor-pointer">{{ t('common.seeAllLocations') }}</RouterLink>
    </div>
    <div class="grid gap-3">
      <div class="rounded-2xl border shadow-card p-4 grid gap-2">
        <div class="h-24 rounded-xl bg-gray-100"></div>
        <div class="text-xs text-gray-500">{{ t('home.trustedWorkers') }}</div>
        <RouterLink to="/tabs/workers" class="block w-full text-center rounded-xl border py-2 cursor-pointer">{{ t('common.find') }}</RouterLink>
      </div>
      <div class="rounded-2xl border shadow-card p-4 grid gap-2">
        <div class="h-24 rounded-xl bg-gray-100"></div>
        <div class="text-xs text-gray-500">{{ t('home.serviceAreas') }}</div>
        <RouterLink to="/tabs/workers" class="block w-full text-center rounded-xl bg-black text-white py-2 cursor-pointer">{{ t('common.find') }}</RouterLink>
      </div>
    </div>
  </section>
</template>
