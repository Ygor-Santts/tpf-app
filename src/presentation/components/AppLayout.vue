<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import BottomNav from './BottomNav.vue'
import SidebarNav from './SidebarNav.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Desktop sidebar -->
    <SidebarNav class="hidden lg:flex" />

    <!-- Mobile header -->
    <AppHeader class="lg:hidden" />

    <!-- Content -->
    <main class="lg:pl-60 pt-14 lg:pt-0 pb-20 lg:pb-0">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <RouterView />
      </div>
    </main>

    <!-- Mobile bottom nav -->
    <BottomNav class="lg:hidden" />
  </div>
</template>
