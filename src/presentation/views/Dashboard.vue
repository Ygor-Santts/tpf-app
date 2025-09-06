<script setup lang="ts">
import { useAuthStore } from '@app/stores/auth.store'
const auth = useAuthStore()
function logout() { auth.logout() }
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Dashboard</h2>
    <p>Bem-vindo! Você está autenticado.</p>
    <button @click="logout" class="border rounded px-3 py-2 hover:bg-gray-50">Sair</button>
  </div>
</template>
