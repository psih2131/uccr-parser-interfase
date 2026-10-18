<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <label class="auth-field">
      <span class="auth-field__label">Логин</span>
      <input
        v-model.trim="loginValue"
        class="auth-field__input"
        type="text"
        name="login"
        autocomplete="username"
        placeholder="email или логин"
        required
      />
    </label>

    <label class="auth-field">
      <span class="auth-field__label">Пароль</span>
      <input
        v-model="password"
        class="auth-field__input"
        type="password"
        name="password"
        autocomplete="current-password"
        placeholder="••••••••"
        required
      />
    </label>

    <p v-if="error" class="auth-form__error">{{ error }}</p>

    <button class="auth-form__submit" type="submit" :disabled="pending">
      {{ pending ? 'Входим…' : 'Войти' }}
    </button>
  </form>
</template>

<script setup>
import authService from '~/services/auth'

const emit = defineEmits(['success'])

const authStore = useAuthStore()
const loginValue = ref('')
const password = ref('')
const error = ref('')
const pending = ref(false)

const onSubmit = async () => {
  error.value = ''
  pending.value = true

  try {
    const res = await authService.login(loginValue.value, password.value)
    authStore.setAdmin(res?.data?.admin ?? null)
    emit('success')
  } catch (e) {
    authStore.clear()
    error.value = e?.data?.message || 'Не удалось войти'
  } finally {
    pending.value = false
  }
}
</script>
