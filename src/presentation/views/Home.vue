<script setup lang="ts">
import QuickCard from '@ui/components/QuickCard.vue'
</script>

<template>
  <section class="grid gap-4">
    <input class="w-full border rounded-xl p-3 text-sm" placeholder="Search for services..." />

    <QuickCard />

    <div class="grid grid-cols-2 gap-3 items-start">
      <div class="grid gap-2">
        <div class="text-xs text-gray-500">Join our network</div>
        <div class="rounded-2xl border shadow-card p-3 grid gap-2">
          <div class="h-24 rounded-xl bg-gray-100"></div>
          <div class="text-xs text-gray-500">I am a Worker</div>
          <RouterLink to="/register-worker" class="block w-full text-center rounded-xl bg-black text-white py-2">Go</RouterLink>
        </div>
      </div>
      <div class="grid gap-2">
        <div class="text-xs text-right text-gray-500">Explore Categories</div>
        <div class="rounded-2xl border shadow-card p-3 grid gap-2">
          <div class="h-24 rounded-xl bg-gray-100"></div>
          <div class="text-xs text-gray-500">Browse available</div>
          <RouterLink to="/tabs/categories" class="block w-full text-center rounded-xl border py-2">Browse</RouterLink>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="font-semibold">Locations</div>
      <RouterLink to="/tabs/states" class="text-xs text-gray-500 underline">Show all</RouterLink>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <RouterLink to="/tabs/states" class="rounded-xl border p-3 flex items-center gap-2 hover:bg-gray-50">📍 <span>Find</span></RouterLink>
      <RouterLink to="/tabs/categories" class="rounded-xl border p-3 flex items-center gap-2 hover:bg-gray-50">📚 <span>Choose</span></RouterLink>
      <RouterLink to="/tabs/states" class="rounded-xl border p-3 flex items-center gap-2 hover:bg-gray-50">🌐 <span>Regions</span></RouterLink>
      <RouterLink to="/tabs/workers" class="rounded-xl border p-3 flex items-center gap-2 hover:bg-gray-50">🧑‍🔧 <span>Professional</span></RouterLink>
      <div class="rounded-xl border p-3 flex items-center gap-2 opacity-50 pointer-events-none">🏠 <span>Home</span></div>
      <div class="rounded-xl border p-3 flex items-center gap-2 opacity-50 pointer-events-none">🆘 <span>Assistance</span></div>
    </div>

    <div class="flex items-center justify-between">
      <div class="font-semibold">View more</div>
      <RouterLink to="/tabs/states" class="text-xs text-gray-500 underline">See All Locations</RouterLink>
    </div>

    <div class="grid gap-3">
      <div class="rounded-2xl border shadow-card p-4 grid gap-2">
        <div class="h-24 rounded-xl bg-gray-100"></div>
        <div class="text-xs text-gray-500">Trusted Workers</div>
        <RouterLink to="/tabs/workers" class="block w-full text-center rounded-xl border py-2">Find</RouterLink>
      </div>
      <div class="rounded-2xl border shadow-card p-4 grid gap-2">
        <div class="h-24 rounded-xl bg-gray-100"></div>
        <div class="text-xs text-gray-500">Service Areas</div>
        <RouterLink to="/tabs/workers" class="block w-full text-center rounded-xl bg-black text-white py-2">Find</RouterLink>
      </div>
    </div>
  </section>
</template>
