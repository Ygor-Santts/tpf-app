import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '@ui/views/Login.vue'
import Dashboard from '@ui/views/Dashboard.vue'
import Health from '@ui/views/Health.vue'
import RegisterWorker from '@ui/views/RegisterWorker.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'login', component: Login, meta: { public: true } },
  { path: '/register-worker', name: 'register-worker', component: RegisterWorker, meta: { public: true } },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/health', name: 'health', component: Health }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const isPublic = to.meta.public
  const token = localStorage.getItem('tpf_token')
  if (!isPublic && !token) {
    return next({ name: 'login' })
  }
  next()
})

export default router
