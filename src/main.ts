import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@ui/router'
import App from '@ui/App.vue'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
