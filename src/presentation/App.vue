<script setup lang="ts">
import { APP_NAME } from '@shared/constants'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <header class="sticky top-0 z-10 bg-white border-b">
      <div class="mx-auto max-w-screen-sm px-4 py-3 flex items-center gap-3">
        <span>👷‍♂️</span>
        <h1 class="font-semibold">{{ APP_NAME }}</h1>
      </div>
    </header>

    <main class="flex-1 mx-auto w-full max-w-screen-sm px-4 py-4">
      <RouterView />
    </main>

    <nav class="sticky bottom-0 z-10 bg-white border-t">
      <div class="max-w-screen-sm mx-auto grid grid-cols-4 text-xs sm:text-sm">
        <RouterLink to="/tabs/home" class="p-3 text-center hover:bg-gray-50">🏠</RouterLink>
        <RouterLink to="/tabs/categories" class="p-3 text-center hover:bg-gray-50">📚</RouterLink>
        <RouterLink to="/tabs/states" class="p-3 text-center hover:bg-gray-50">📍</RouterLink>
        <RouterLink to="/tabs/workers" class="p-3 text-center hover:bg-gray-50">🔎</RouterLink>
      </div>
    </nav>
  </div>
</template>
