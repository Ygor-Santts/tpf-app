<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getBillingSummary, listTransactions } from '@infra/services/billing.service'
import StatCard from '@ui/components/StatCard.vue'
import ProgressBar from '@ui/components/ProgressBar.vue'
import TransactionRow from '@ui/components/TransactionRow.vue'
const { t } = useI18n()
const from = ref(''); const to = ref(''); const loading = ref(false)
const summary = ref(null as any); const pPage = ref(1); const pLimit = ref(5); const uPage = ref(1); const uLimit = ref(5)
const paid = ref(null as any); const unpaid = ref(null as any)
const totalCount = computed(() => (summary?.value ? summary.value.paidCount + summary.value.unpaidCount : 0))
const paidPct = computed(() => totalCount.value ? Math.round((summary.value.paidCount / totalCount.value) * 100) : 0)
function money(n: number){ return n.toLocaleString(undefined, { style: 'currency', currency: 'BRL' }) }
async function run(){ loading.value = true }
</script>
<template><section class="grid gap-4"><div class="grid grid-cols-2 gap-3"><StatCard label="Total pago" value="R$ 0,00"/><StatCard label="Total em aberto" value="R$ 0,00"/></div><div class="rounded-2xl border shadow-card p-4 grid gap-2"><div class="font-semibold">Pago x Não pago</div><ProgressBar :value="50"/></div></section></template>
