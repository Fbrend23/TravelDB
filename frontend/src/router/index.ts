import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import HomePage from '@/pages/HomePage.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage, meta: { guestOnly: true } },
  { path: '/register', component: RegisterPage, meta: { guestOnly: true } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Check if user is connected
  if (!auth.isLoggedIn) {
    await auth.fetchUser()
  }

  // If connected, stays on homepage
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return '/'
  }
})
