<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem } from '@ionic/vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
const route = useRoute(); const categoryId = computed(() => Number(route.params.categoryId)); const tax = useTaxonomyStore()
onMounted(async () => { await tax.loadCategories(); await tax.loadOccupations(categoryId.value) })
</script>
<template>
  <IonPage>
    <IonHeader translucent><IonToolbar><IonTitle>Occupations</IonTitle></IonToolbar></IonHeader>
    <IonContent><IonList><IonItem v-for="o in tax.occupationsByCategory[categoryId] || []" :key="o.id">{{ o.name }}</IonItem></IonList></IonContent>
  </IonPage>
</template>
