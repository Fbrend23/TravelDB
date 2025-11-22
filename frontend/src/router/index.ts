import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import HomePage from '@/pages/HomePage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
