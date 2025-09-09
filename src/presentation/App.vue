<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
const { t, locale } = useI18n()
</script>
<template>
  <div class="min-h-screen flex flex-col bg-white">
    <header class="sticky top-0 z-10 bg-white border-b">
      <div class="mx-auto max-w-screen-sm px-4 py-3 flex items-center gap-3 justify-between">
        <div class="flex items-center gap-2">
          <Icon icon="mdi:account-hard-hat-outline" class="text-xl" />
          <h1 class="font-semibold">{{ t('app.name') }}</h1>
        </div>
        <select v-model="locale" class="border rounded-lg text-xs p-1 cursor-pointer">
          <option value="pt-BR">PT-BR</option>
          <option value="en">EN</option>
        </select>
      </div>
    </header>
    <main class="flex-1 mx-auto w-full max-w-screen-sm px-4 py-4">
      <RouterView />
    </main>
    <nav class="sticky bottom-0 z-10 bg-white border-t">
      <div class="max-w-screen-sm mx-auto grid grid-cols-5 text-[11px] sm:text-sm">
        <RouterLink
          to="/tabs/home"
          class="p-3 text-center hover:bg-gray-50 flex flex-col items-center gap-1 cursor-pointer"
          ><Icon icon="mdi:home-outline" class="text-xl" /><span>{{
            t('app.tabs.home')
          }}</span></RouterLink
        >
        <RouterLink
          to="/tabs/categories"
          class="p-3 text-center hover:bg-gray-50 flex flex-col items-center gap-1 cursor-pointer"
          ><Icon icon="mdi:book-open-variant-outline" class="text-xl" /><span>{{
            t('app.tabs.categories')
          }}</span></RouterLink
        >
        <RouterLink
          to="/tabs/states"
          class="p-3 text-center hover:bg-gray-50 flex flex-col items-center gap-1 cursor-pointer"
          ><Icon icon="mdi:map-marker-outline" class="text-xl" /><span>{{
            t('app.tabs.locations')
          }}</span></RouterLink
        >
        <RouterLink
          to="/tabs/workers"
          class="p-3 text-center hover:bg-gray-50 flex flex-col items-center gap-1 cursor-pointer"
          ><Icon icon="mdi:magnify" class="text-xl" /><span>{{
            t('app.tabs.search')
          }}</span></RouterLink
        >
        <RouterLink
          to="/tabs/dashboard"
          class="p-3 text-center hover:bg-gray-50 flex flex-col items-center gap-1 cursor-pointer"
          ><Icon icon="mdi:view-dashboard-outline" class="text-xl" /><span>{{
            t('dashboard.tab')
          }}</span></RouterLink
        >
      </div>
    </nav>
  </div>
</template>
