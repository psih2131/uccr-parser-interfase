<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-card__brand">
        <span class="auth-card__logo">UCCR</span>
        <p class="auth-card__subtitle">Parser Admin</p>
      </div>

      <div class="auth-tabs" role="tablist">
        <button
          type="button"
          class="auth-tabs__btn"
          :class="{ 'auth-tabs__btn--active': mode === 'login' }"
          role="tab"
          :aria-selected="mode === 'login'"
          @click="mode = 'login'"
        >
          Вход
        </button>
        <button
          type="button"
          class="auth-tabs__btn"
          :class="{ 'auth-tabs__btn--active': mode === 'register' }"
          role="tab"
          :aria-selected="mode === 'register'"
          @click="mode = 'register'"
        >
          Регистрация
        </button>
        <span
          class="auth-tabs__indicator"
          :class="{ 'auth-tabs__indicator--register': mode === 'register' }"
        />
      </div>

      <AuthLoginForm v-if="mode === 'login'" @success="onAuthSuccess" />
      <AuthRegisterForm v-else @success="mode = 'login'" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth',
})

const mode = ref('login')

const onAuthSuccess = () => {
  navigateTo('/')
}
</script>
