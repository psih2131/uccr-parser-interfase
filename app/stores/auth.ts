import { defineStore } from 'pinia'
import type { Admin } from '~/services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    admin: null as Admin | null,
    checked: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.admin,
  },

  actions: {
    setAdmin(admin: Admin | null) {
      this.admin = admin
      this.checked = true
    },

    clear() {
      this.admin = null
      this.checked = true
    },
  },
})
