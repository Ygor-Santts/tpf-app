<script setup lang="ts">
import { onMounted } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem } from '@ionic/vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
const tax = useTaxonomyStore(); onMounted(() => tax.loadCategories())
</script>
<template>
  <IonPage>
    <IonHeader translucent><IonToolbar><IonTitle>Categories</IonTitle></IonToolbar></IonHeader>
    <IonContent><IonList><IonItem v-for="c in tax.categories" :key="c.id" :routerLink="`/tabs/categories/${c.id}/occupations`">{{ c.name }}</IonItem></IonList></IonContent>
  </IonPage>
</template>
