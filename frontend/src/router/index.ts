import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import MapPage from '@/pages/MapPage.vue'

const routes = [
  { path: '/', component: MapPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
