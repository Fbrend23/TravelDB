import { api } from './axios'

/**
 * POST /auth/login
 * Sends email and password to log in the user
 */
export function apiLogin(email: string, password: string) {
  return api.post('/auth/login', {
    email,
    password,
  })
}

/**
 * POST /auth/logout
 * Logs out the current user
 */
export function apiLogout() {
  return api.post('/auth/logout')
}

/**
 * GET /auth/me
 * Returns the current user if the session is valid
 */
export function apiMe() {
  return api.get('/auth/me')
}

/**
 * POST /auth/register
 * Creates a new account with email, username and password
 */
export function apiRegister(payload: { email: string; username: string; password: string }) {
  return api.post('/auth/register', payload)
}
