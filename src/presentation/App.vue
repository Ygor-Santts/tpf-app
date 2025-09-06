<script setup lang="ts">
import { APP_NAME } from '@shared/constants'
</script>

<template>
  <div>
    <header class="border-b bg-white">
      <div class="mx-auto max-w-6xl flex items-center justify-between p-4">
        <h1 class="font-semibold">{{ APP_NAME }}</h1>
        <nav class="flex gap-4">
          <RouterLink to="/dashboard" class="hover:underline">Dashboard</RouterLink>
          <RouterLink to="/health" class="hover:underline">Health</RouterLink>
          <RouterLink to="/login" class="hover:underline">Login</RouterLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-6xl p-4">
      <RouterView />
    </main>
  </div>
</template>
