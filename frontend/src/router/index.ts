import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import HomePage from '@/pages/HomePage.vue'
import { useAuthStore } from '@/stores/auth'
import PrivacyPage from '@/pages/PrivacyPage.vue'
import LegalPage from '@/pages/LegalPage.vue'
import ForgotPassword from '@/pages/auth/ForgotPassword.vue'
import ResetPassword from '@/pages/auth/ResetPassword.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage, meta: { guestOnly: true } },
  { path: '/register', component: RegisterPage, meta: { guestOnly: true } },
  { path: '/forgot-password', component: ForgotPassword, meta: { guestOnly: true } },
  { path: '/reset-password', component: ResetPassword, meta: { guestOnly: true } },
  {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyPage,
  },
  {
    path: '/legal',
    name: 'legal',
    component: LegalPage,
  },
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
