import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@ui/router'
import App from '@ui/App.vue'
import './style.css'

createApp(App).use(createPinia()).use(router).mount('#app')
