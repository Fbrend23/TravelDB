import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import PublicMapPage from '../pages/PublicMapPage.vue'
import LoginPage from '../pages/auth/LoginPage.vue'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginPage, meta: { public: true } },
    { path: '/u/:username/map', component: PublicMapPage, meta: { public: true } },
    { path: '/', component: HomePage, meta: { public: true } },
    { path: '/app', component: DashboardPage, meta: { public: false } },
  ],
})

router.beforeEach(async (to) => {
  // Vérifie si la route est publique
  const isPublic = to.meta?.public === true
  //Token adonisJS
  const token = localStorage.getItem('token')

  if (isPublic) {
    if (to.path === '/login' && token) {
      return '/app'
    }
    return true
  }

  if (!token) {
    const next = encodeURIComponent(to.fullPath)
    return `/login?next${next}`
  }
  return true
})
export default router
