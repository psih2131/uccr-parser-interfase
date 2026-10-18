import authService from '~/services/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  const isAuthPage = to.path === '/auth' || to.path.startsWith('/auth/')

  if (!authStore.checked) {
    const admin = await authService.checkAuth()
    if (admin) {
      authStore.setAdmin(admin)
    } else {
      authStore.clear()
    }
  }

  if (!authStore.isAuthenticated && !isAuthPage) {
    return navigateTo('/auth')
  }

  if (authStore.isAuthenticated && isAuthPage) {
    return navigateTo('/')
  }
})
