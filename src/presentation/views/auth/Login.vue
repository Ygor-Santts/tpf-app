<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue'
import { useAuthStore } from '@app/stores/auth'
const router = useRouter(); const auth = useAuthStore(); const form = reactive({ email: '', password: '' })
async function submit() { if (await auth.login(form)) router.replace('/tabs/home') }
</script>
<template>
  <IonPage>
    <IonHeader translucent><IonToolbar><IonTitle>Login</IonTitle></IonToolbar></IonHeader>
    <IonContent class="ion-padding">
      <form @submit.prevent="submit" class="grid gap-3">
        <IonItem><IonLabel position="stacked">Email</IonLabel><IonInput v-model="form.email" type="email" required /></IonItem>
        <IonItem><IonLabel position="stacked">Password</IonLabel><IonInput v-model="form.password" type="password" required /></IonItem>
        <IonButton expand="block" type="submit" :disabled="auth.loading">{{ auth.loading ? 'Signing in...' : 'Login' }}</IonButton>
        <p v-if="auth.error" class="text-red-600 text-sm">{{ auth.error }}</p>
      </form>
    </IonContent>
  </IonPage>
</template>
