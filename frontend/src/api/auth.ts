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

/**
 * GET /verify-email/:id
 * verify user's email
 */
export async function apiVerifyEmail(id: string, queryParams: Record<string, string>) {
  const response = await api.get(`/auth/verify-email/${id}`, {
    params: queryParams,
  })
  return response
}
/**
 * GET/resend-verification
 */
export function apiResendVerification(email: string) {
  return api.post('/auth/resend-verification', { email })
}

export function apiForgotPassword(email: string) {
  return api.post('/auth/forgot-password', { email })
}

export function apiResetPassword(payload: { token: string; password: string; email: string }) {
  return api.post('/auth/reset-password', payload)
}

export function apiVerifyResetToken(email: string, token: string) {
  return api.get('/auth/verify-reset-token', {
    params: { email, token },
  })
}
