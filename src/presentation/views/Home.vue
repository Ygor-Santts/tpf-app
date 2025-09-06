<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/vue'
</script>
<template>
  <IonPage>
    <IonHeader translucent><IonToolbar><IonTitle>Trampo Fácil</IonTitle></IonToolbar></IonHeader>
    <IonContent fullscreen class="ion-padding">
      <IonSearchbar placeholder="Search for services..." />
      <IonCard class="mt-2"><IonCardHeader><IonCardTitle>Quick</IonCardTitle></IonCardHeader><IonCardContent class="text-sm text-gray-600">Find trusted professionals easily.</IonCardContent></IonCard>
      <IonGrid>
        <IonRow>
          <IonCol size="6">
            <IonCard><IonCardHeader><IonCardTitle>Join our network</IonCardTitle></IonCardHeader><IonCardContent><IonButton expand="block" router-link="/register-worker">Go</IonButton></IonCardContent></IonCard>
          </IonCol>
          <IonCol size="6">
            <IonCard><IonCardHeader><IonCardTitle>Explore Categories</IonCardTitle></IonCardHeader><IonCardContent><IonButton expand="block" router-link="/tabs/categories">Browse</IonButton></IonCardContent></IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
      <div class="flex items-center justify-between mt-2 mb-1"><h2 class="font-semibold">Locations</h2><a class="text-sm underline" href="/tabs/states">Show all</a></div>
      <IonGrid>
        <IonRow>
          <IonCol size="6"><IonButton expand="block" fill="outline" router-link="/tabs/states">Find</IonButton></IonCol>
          <IonCol size="6"><IonButton expand="block" fill="outline" router-link="/tabs/categories">Choose</IonButton></IonCol>
          <IonCol size="6"><IonButton expand="block" fill="outline" router-link="/tabs/states">Regions</IonButton></IonCol>
          <IonCol size="6"><IonButton expand="block" fill="outline" router-link="/tabs/workers">Professional</IonButton></IonCol>
        </IonRow>
      </IonGrid>
      <div class="mt-2">
        <h2 class="font-semibold mb-1">View more</h2>
        <IonGrid><IonRow><IonCol size="12"><IonCard><IonCardHeader><IonCardTitle>Service Areas</IonCardTitle></IonCardHeader><IonCardContent><IonButton router-link="/tabs/workers">Find</IonButton></IonCardContent></IonCard></IonCol></IonRow></IonGrid>
      </div>
    </IonContent>
  </IonPage>
</template>
