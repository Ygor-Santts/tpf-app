import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const Home = () => import('@ui/views/Home.vue')
const Login = () => import('@ui/views/auth/Login.vue')
const RegisterWorker = () => import('@ui/views/auth/RegisterWorker.vue')
const Categories = () => import('@ui/views/marketplace/Categories.vue')
const Occupations = () => import('@ui/views/marketplace/Occupations.vue')
const States = () => import('@ui/views/locales/States.vue')
const Cities = () => import('@ui/views/locales/Cities.vue')
const WorkerSearch = () => import('@ui/views/worker/WorkerSearch.vue')
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/tabs/home' },
  { path: '/login', component: Login, meta: { public: true } },
  { path: '/register-worker', component: RegisterWorker, meta: { public: true } },
  { path: '/tabs', children: [
    { path: 'home', component: Home, meta: { public: true } },
    { path: 'categories', component: Categories },
    { path: 'categories/:categoryId/occupations', component: Occupations, props: true },
    { path: 'states', component: States },
    { path: 'states/:code/cities', component: Cities, props: true },
    { path: 'workers', component: WorkerSearch }
  ]}
]
const router = createRouter({ history: createWebHistory(), routes })
router.beforeEach((to, _from, next) => { const isPublic = Boolean(to.meta.public); const token = localStorage.getItem('tpf_token'); if (!isPublic && !token) return next('/login'); next() })
export default router
