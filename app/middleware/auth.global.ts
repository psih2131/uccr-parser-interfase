export default defineNuxtRouteMiddleware(async (to) => {
  // Cookie-сессия живёт в браузере — на SSR к API другого порта cookie не уйдёт
  if (import.meta.server) return

  const authStore = useAuthStore()
  const isAuthPage = to.path === '/auth' || to.path.startsWith('/auth/')

  if (!authStore.checked) {
    await authStore.fetchMe()
  }

  if (!authStore.isAuthenticated && !isAuthPage) {
    return navigateTo('/auth')
  }

  if (authStore.isAuthenticated && isAuthPage) {
    return navigateTo('/')
  }
})
