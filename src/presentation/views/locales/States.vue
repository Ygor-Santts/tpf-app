<script setup lang="ts">
import { onMounted } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem } from '@ionic/vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
const tax = useTaxonomyStore(); onMounted(() => tax.loadStates())
</script>
<template>
  <IonPage>
    <IonHeader translucent><IonToolbar><IonTitle>States</IonTitle></IonToolbar></IonHeader>
    <IonContent><IonList><IonItem v-for="s in tax.states" :key="s.code" :routerLink="`/tabs/states/${s.code}/cities`">{{ s.name }}</IonItem></IonList></IonContent>
  </IonPage>
</template>
