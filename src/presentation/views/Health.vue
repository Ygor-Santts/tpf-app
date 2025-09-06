<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getHealth } from '@infra/services/health.service'
import type { HealthCheck } from '@domain/health'

const health = ref<HealthCheck | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    health.value = await getHealth()
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Falha ao obter saúde da API'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Health Check</h2>
    <div v-if="loading" class="text-sm text-gray-500">Carregando...</div>
    <pre v-if="health" class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ health }}</pre>
    <div v-if="error" class="text-sm text-red-600">{{ error }}</div>
  </div>
</template>
