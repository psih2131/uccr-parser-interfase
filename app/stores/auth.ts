import { defineStore } from 'pinia'

type Admin = {
  id: number
  name?: string | null
  login?: string
  email?: string | null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    admin: null as Admin | null,
    checked: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.admin,
  },

  actions: {
    async fetchMe() {
      const config = useRuntimeConfig()

      try {
        const res = await $fetch<{ success: boolean; data?: { admin?: Admin } }>(
          `${config.public.apiUrl}/api/v1/admin/me`,
          { credentials: 'include' },
        )
        this.admin = res?.data?.admin ?? null
      } catch {
        this.admin = null
      } finally {
        this.checked = true
      }
    },

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
