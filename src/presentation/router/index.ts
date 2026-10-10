import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@app/stores/auth'

const AppLayout = () => import('@ui/components/AppLayout.vue')
const Home = () => import('@ui/views/Home.vue')
const Login = () => import('@ui/views/auth/Login.vue')
const RegisterWorker = () => import('@ui/views/auth/RegisterWorker.vue')
const RegisterClient = () => import('@ui/views/auth/RegisterClient.vue')
const ForgotPassword = () => import('@ui/views/auth/ForgotPassword.vue')
const ResetPassword = () => import('@ui/views/auth/ResetPassword.vue')
const DeleteAccount = () => import('@ui/views/account/DeleteAccount.vue')
const Privacy = () => import('@ui/views/Privacy.vue')
const HowItWorks = () => import('@ui/views/HowItWorks.vue')
const Categories = () => import('@ui/views/marketplace/Categories.vue')
const Occupations = () => import('@ui/views/marketplace/Occupations.vue')
const States = () => import('@ui/views/locales/States.vue')
const Cities = () => import('@ui/views/locales/Cities.vue')
const WorkerSearch = () => import('@ui/views/worker/WorkerSearch.vue')
const WorkerPublicProfile = () => import('@ui/views/worker/WorkerPublicProfile.vue')
const WorkerDashboard = () => import('@ui/views/worker/WorkerDashboard.vue')
const WorkerEditProfile = () => import('@ui/views/worker/WorkerEditProfile.vue')
const WorkerPortfolio = () => import('@ui/views/worker/WorkerPortfolio.vue')
const WorkerRatings = () => import('@ui/views/worker/WorkerRatings.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/tabs/home' },
  { path: '/login', component: Login, meta: { public: true } },
  { path: '/register-worker', component: RegisterWorker, meta: { public: true } },
  { path: '/register-client', component: RegisterClient, meta: { public: true } },
  { path: '/forgot-password', component: ForgotPassword, meta: { public: true } },
  { path: '/reset-password', component: ResetPassword, meta: { public: true } },
  { path: '/become-worker', component: RegisterWorker, props: { upgrade: true } },
  { path: '/delete-account', component: DeleteAccount },
  { path: '/privacidade', component: Privacy, meta: { public: true } },
  {
    path: '/tabs',
    component: AppLayout,
    children: [
      { path: 'home', component: Home, meta: { public: true } },
      { path: 'como-funciona', component: HowItWorks, meta: { public: true } },
      // Browsing is open to visitors as a preview; contacting needs an account.
      { path: 'categories', component: Categories, meta: { public: true } },
      { path: 'categories/:categoryId/occupations', component: Occupations, props: true, meta: { public: true } },
      { path: 'states', component: States, meta: { public: true } },
      { path: 'states/:code/cities', component: Cities, props: true, meta: { public: true } },
      { path: 'workers', component: WorkerSearch, meta: { public: true } },
      { path: 'workers/:id', component: WorkerPublicProfile, props: true, meta: { public: true } },
    ],
  },
  {
    path: '/worker',
    component: AppLayout,
    meta: { workerOnly: true },
    children: [
      { path: 'dashboard', component: WorkerDashboard, meta: { workerOnly: true } },
      { path: 'profile/edit', component: WorkerEditProfile, meta: { workerOnly: true } },
      { path: 'portfolio', component: WorkerPortfolio, meta: { workerOnly: true } },
      { path: 'ratings', component: WorkerRatings, meta: { workerOnly: true } },
    ],
  },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, _from, next) => {
  const isPublic = Boolean(to.meta.public)
  const isWorkerOnly = Boolean(to.meta.workerOnly)
  const auth = useAuthStore()
  const token = auth.token

  if (!isPublic && !token) return next('/login')
  if (token && auth.isWorker && to.path === '/login') return next(auth.home)
  if (to.path === '/become-worker' && auth.isWorker) return next('/worker/dashboard')
  if (isWorkerOnly && !auth.isWorker) return next('/tabs/home')
  // A worker opening a worker page (e.g. a bookmarked link) switches to worker mode.
  if (isWorkerOnly && !auth.inWorkerMode) auth.setMode('worker')

  next()
})

export default router
