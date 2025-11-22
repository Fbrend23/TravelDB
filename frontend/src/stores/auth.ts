import { defineStore } from 'pinia'
import type { AxiosError } from 'axios'
import { apiLogin, apiLogout, apiRegister, apiMe } from '@/api/auth'

export interface User {
  id: number
  username: string
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  username: string
}

type AuthState = {
  user: User | null
  isLoggedIn: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoggedIn: false,
  }),

  getters: {
    /**
     * Returns true if a user is logged in
     */
    getIsLoggedIn: (state) => state.isLoggedIn,

    /**
     * Returns the current user
     */
    getUser: (state) => state.user,
  },

  actions: {
    /**
     * Logs in the user
     * Sends email and password to the backend
     * Loads the user data with /auth/me
     *
     * @param payload - email and password
     * @returns true on success
     * @throws AxiosError if login fails
     */
    async login(payload: LoginPayload) {
      try {
        await apiLogin(payload.email, payload.password)
        await this.fetchUser()
        this.isLoggedIn = true
        return true
      } catch (error: unknown) {
        throw error as AxiosError
      }
    },

    /**
     * Registers a new user
     *
     * @param payload - username, email, password
     * @returns true on success
     * @throws AxiosError if registration fails
     */
    async register(payload: RegisterPayload) {
      try {
        await apiRegister(payload)
        return true
      } catch (error: unknown) {
        throw error as AxiosError
      }
    },

    /**
     * Logs out the user
     * Resets local auth state
     *
     * @returns true on success
     */
    async logout() {
      try {
        await apiLogout()
        this.user = null
        this.isLoggedIn = false
        return true
      } catch (error: unknown) {
        throw error as AxiosError
      }
    },

    /**
     * Gets the user from /auth/me
     * Used on app start to restore the session
     *
     * @returns true if a user is logged in, false otherwise
     */
    async fetchUser() {
      try {
        const res = await apiMe()
        this.user = res.data
        this.isLoggedIn = true
        return true
      } catch {
        this.user = null
        this.isLoggedIn = false
        return false
      }
    },
  },
})
