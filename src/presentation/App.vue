<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/vue'
import { homeOutline, albumsOutline, locationOutline, searchOutline } from 'ionicons/icons'
</script>
<template>
  <IonApp>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home"><IonIcon :icon="homeOutline" /><IonLabel>Home</IonLabel></IonTabButton>
        <IonTabButton tab="categories" href="/tabs/categories"><IonIcon :icon="albumsOutline" /><IonLabel>Categories</IonLabel></IonTabButton>
        <IonTabButton tab="locations" href="/tabs/states"><IonIcon :icon="locationOutline" /><IonLabel>Locations</IonLabel></IonTabButton>
        <IonTabButton tab="search" href="/tabs/workers"><IonIcon :icon="searchOutline" /><IonLabel>Search</IonLabel></IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonApp>
</template>
