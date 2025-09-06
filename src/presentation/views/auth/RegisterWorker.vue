<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonChip, IonButton } from '@ionic/vue'
import { useAuthStore } from '@app/stores/auth'
import { useTaxonomyStore } from '@app/stores/taxonomy'
const auth = useAuthStore(); const tax = useTaxonomyStore()
const form = reactive({ name: '', email: '', password: '', phone: '', jobCategoryId: 0, jobOccupationIds: [] as number[], stateCode: '', operationCitiesIds: [] as number[] })
onMounted(async () => { await tax.loadCategories(); await tax.loadStates() })
function toggle(list: number[], id: number) { const i = list.indexOf(id); if (i>=0) list.splice(i,1); else list.push(id) }
async function onCategoryChange() { if (form.jobCategoryId) await tax.loadOccupations(form.jobCategoryId) }
async function onStateChange() { if (form.stateCode) await tax.loadCities(form.stateCode) }
async function submit() { await auth.registerWorker({ name: form.name, email: form.email, password: form.password, phone: form.phone, jobOccupationIds: form.jobOccupationIds, operationCitiesIds: form.operationCitiesIds }) }
</script>
<template>
  <IonPage>
    <IonHeader translucent><IonToolbar><IonTitle>Worker Registration</IonTitle></IonToolbar></IonHeader>
    <IonContent class="ion-padding">
      <IonItem><IonLabel position="stacked">Full name</IonLabel><IonInput v-model="form.name" /></IonItem>
      <IonItem><IonLabel position="stacked">Email</IonLabel><IonInput v-model="form.email" type="email" /></IonItem>
      <IonItem><IonLabel position="stacked">Password</IonLabel><IonInput v-model="form.password" type="password" /></IonItem>
      <IonItem><IonLabel position="stacked">Phone</IonLabel><IonInput v-model="form.phone" placeholder="+55..." /></IonItem>
      <IonItem><IonLabel position="stacked">Category</IonLabel><IonSelect v-model="form.jobCategoryId" @ionChange="onCategoryChange"><IonSelectOption :value="0" disabled>Select...</IonSelectOption><IonSelectOption v-for="c in tax.categories" :key="c.id" :value="c.id">{{ c.name }}</IonSelectOption></IonSelect></IonItem>
      <div v-if="form.jobCategoryId" class="mt-2"><div class="text-sm mb-1">Occupations</div><div class="flex flex-wrap gap-2"><IonChip v-for="o in tax.occupationsByCategory[form.jobCategoryId] || []" :key="o.id" :color="form.jobOccupationIds.includes(o.id) ? 'primary' : undefined" @click="toggle(form.jobOccupationIds, o.id)">{{ o.name }}</IonChip></div></div>
      <IonItem class="mt-2"><IonLabel position="stacked">State</IonLabel><IonSelect v-model="form.stateCode" @ionChange="onStateChange"><IonSelectOption value="" disabled>Select...</IonSelectOption><IonSelectOption v-for="s in tax.states" :key="s.code" :value="s.code">{{ s.name }}</IonSelectOption></IonSelect></IonItem>
      <div v-if="form.stateCode" class="mt-2"><div class="text-sm mb-1">Cities</div><div class="flex flex-wrap gap-2"><IonChip v-for="c in tax.citiesByState[form.stateCode] || []" :key="c.id" :color="form.operationCitiesIds.includes(c.id) ? 'primary' : undefined" @click="toggle(form.operationCitiesIds, c.id)">{{ c.name }}</IonChip></div></div>
      <IonButton class="mt-4" expand="block" @click="submit" :disabled="auth.loading">{{ auth.loading ? 'Sending...' : 'Register' }}</IonButton>
      <p v-if="auth.error" class="text-red-600 text-sm">{{ auth.error }}</p>
    </IonContent>
  </IonPage>
</template>
