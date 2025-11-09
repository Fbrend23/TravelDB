import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import PublicMapPage from '../pages/PublicMapPage.vue'
import LoginPage from '../pages/auth/LoginPage.vue'
import HomePage from '@/pages/HomePage.vue'
import { useAuthStore } from '@/stores/auth.ts'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginPage, meta: { public: true } },
    { path: '/u/:username/map', component: PublicMapPage, meta: { public: true } },
    { path: '/', component: HomePage, meta: { public: true } },
    { path: '/app', component: DashboardPage, meta: { public: false } },
  ],
})

let triedHydrate = false
router.beforeEach(async (to) => {
  // Vérifie si la route est publique
  const isPublic = to.meta?.public === true
  //Token adonisJS
  const token = localStorage.getItem('token')
  // pinia
  const auth = useAuthStore()

  if (isPublic) {
    if (to.path === '/login' && token) {
      return '/app'
    }
    return true
  }

  if (!token) {
    const next = encodeURIComponent(to.fullPath)
    return `/login?next=${next}`
  }

  if (!auth.user && !triedHydrate) {
    triedHydrate = true
    const ok = await auth.loadMe()
    if (!ok) {
      const next = encodeURIComponent(to.fullPath)
      return `/login?next=${next}`
    }
  }
  return true
})
export default router
