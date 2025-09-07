import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@ui/router'
import App from '@ui/App.vue'
import './style.css'
import { i18n } from './i18n'
createApp(App).use(createPinia()).use(router).use(i18n).mount('#app')
