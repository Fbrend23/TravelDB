import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeMode>((localStorage.getItem('user-theme') as ThemeMode) || 'dark')

  function applyTheme(theme: ThemeMode) {
    let themeToApply = theme

    if (theme === 'auto') {
      themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    document.documentElement.setAttribute('data-bs-theme', themeToApply)

    if (currentTheme.value !== theme) {
      currentTheme.value = theme
    }
  }

  function setTheme(newTheme: ThemeMode) {
    applyTheme(newTheme)
    localStorage.setItem('user-theme', newTheme)
  }

  function toggleTheme() {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  function initTheme() {
    applyTheme(currentTheme.value)
  }

  return {
    currentTheme,
    setTheme,
    toggleTheme,
    initTheme,
  }
})
