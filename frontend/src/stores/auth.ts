import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | {
      id: number
      username: string
      email: string
    },
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    username: (state) => state.user?.username || '',
    hasUserLoaded: (state) => state.user !== null,
  },

  actions: {
    //Enregistre/efface le token dans le state + le stockage persistant.
    setToken(token: string | null) {
      this.token = token
      if (token) localStorage.setItem('token', token)
      else localStorage.removeItem('token')
    },

    //Nettoyage d'erreurs sur l'UI
    clearError() {
      this.error = null
    },

    // POST /auth/login
    // stockage du token et de l'utilisateur
    async login(payload: { email: string; password: string }) {
      this.loading = true
      this.clearError()

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'applications/json' },
          body: JSON.stringify(payload),
        })
        //gestion des erreur http
        if (!response.ok) {
          let msg = 'Echec de la connexion'
          try {
            const error = await response.json()
            msg = error?.message ?? error?.errors?.[0].message ?? msg
          } catch {
            throw new Error(msg)
          }
        }

        const data = await response.json()
        const token: string | null = data?.token?.token ?? data?.token ?? null

        if (!token) {
          throw new Error("Le serveur n'as pas renvoyé le token d'authentification")
        }
        // Stcokage du token
        this.setToken(token)
        // Donnée de l'API ou hydrate depuis /auth/me
        if (data.user) {
          this.user = {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
          }
        } else {
          await this.loadMe()
        }
      } catch (e: unknown) {
        const error = e as Error
        this.error = error.message ?? 'Erreur réseau'
        this.setToken(null)
        this.user = null
        throw error
      } finally {
        this.loading = false
      }
    },
    //Hydrate la session
    // Regarde si un token est présent
    // retourne si l'utilisateur est chargé
    // purge le token si invalide
    async loadMe(): Promise<boolean> {
      if (!this.token) return false

      this.loading = true
      this.clearError()

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })

        if (response.status === 401 || response.status === 403) {
          //Purge un token expiré ou invalide
          this.setToken(null)
          this.user = null
          return false
        }

        if (!response.ok) {
          let msg = 'Impossible de charger la session'
          try {
            const error = await response.json()
            msg = error?.message ?? msg
          } catch {}
          throw new Error(msg)
        }
        const me = await response.json()
        this.user = {
          id: me.id,
          username: me.username,
          email: me.email,
        }
        return true
      } catch (e: unknown) {
        const error = e as Error
        this.error = error?.message ?? 'Erreur réseau'
        return false
      } finally {
        this.loading = false
      }
    },

    //Déconnexion
    async logout() {
      this.loading = true
      this.clearError()
      try {
        if (this.token) {
          await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.token}`,
            },
          }).catch(() => {})
        }
      } finally {
        this.setToken(null)
        this.user = null
        this.loading = false
      }
    },
  },
})
