<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem } from '@ionic/vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
const route = useRoute(); const code = computed(() => String(route.params.code)); const tax = useTaxonomyStore()
onMounted(async () => { await tax.loadStates(); await tax.loadCities(code.value) })
</script>
<template>
  <IonPage>
    <IonHeader translucent><IonToolbar><IonTitle>Cities</IonTitle></IonToolbar></IonHeader>
    <IonContent><IonList><IonItem v-for="c in tax.citiesByState[code] || []" :key="c.id">{{ c.name }}</IonItem></IonList></IonContent>
  </IonPage>
</template>
