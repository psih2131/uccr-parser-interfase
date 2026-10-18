<template>
  <aside class="panel-aside">
    <div class="panel-aside__top">
      <NuxtLink to="/" class="panel-aside__brand">
        <span class="panel-aside__logo">UCCR</span>
        <span class="panel-aside__tag">Parser</span>
      </NuxtLink>

      <nav class="panel-aside__nav">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="panel-aside__link"
          active-class="panel-aside__link--active"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>

    <div class="panel-aside__bottom">
      <p v-if="authStore.admin" class="panel-aside__user">
        {{ authStore.admin.login || authStore.admin.email }}
      </p>
      <button
        type="button"
        class="panel-aside__logout"
        :disabled="pending"
        @click="onLogout"
      >
        {{ pending ? 'Выходим…' : 'Выйти' }}
      </button>
    </div>
  </aside>
</template>

<script setup>
import authService from '~/services/auth'

const authStore = useAuthStore()
const pending = ref(false)

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/panel/rabochie-specialnosti', label: 'Рабочие специальности' },
  { to: '/panel/ohrana-truda', label: 'Охрана труда' },
]

const onLogout = async () => {
  pending.value = true
  try {
    await authService.logout()
  } catch {
    // даже если API упал — чистим локальную сессию
  } finally {
    authStore.clear()
    pending.value = false
    await navigateTo('/auth')
  }
}
</script>
