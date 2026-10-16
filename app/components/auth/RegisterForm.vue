<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <label class="auth-field">
      <span class="auth-field__label">Email</span>
      <input
        v-model.trim="email"
        class="auth-field__input"
        type="email"
        name="email"
        autocomplete="email"
        placeholder="admin@example.com"
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
        autocomplete="new-password"
        placeholder="••••••••"
        required
      />
    </label>

    <label class="auth-field">
      <span class="auth-field__label">Ключ регистрации</span>
      <input
        v-model.trim="secretRegisterKey"
        class="auth-field__input"
        type="password"
        name="secretRegisterKey"
        autocomplete="off"
        placeholder="секретный ключ"
        required
      />
    </label>

    <p v-if="error" class="auth-form__error">{{ error }}</p>
    <p v-if="success" class="auth-form__success">{{ success }}</p>

    <button class="auth-form__submit" type="submit" :disabled="pending">
      {{ pending ? 'Создаём…' : 'Зарегистрироваться' }}
    </button>
  </form>
</template>

<script setup>
const emit = defineEmits(['success'])

const config = useRuntimeConfig()
const email = ref('')
const password = ref('')
const secretRegisterKey = ref('')
const error = ref('')
const success = ref('')
const pending = ref(false)

const onSubmit = async () => {
  error.value = ''
  success.value = ''
  pending.value = true

  try {
    await $fetch(`${config.public.apiUrl}/api/v1/admin/register`, {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        secretRegisterKey: secretRegisterKey.value,
      },
    })
    success.value = 'Аккаунт создан. Можно войти.'
    emit('success')
  } catch (e) {
    error.value = e?.data?.message || 'Не удалось зарегистрироваться'
  } finally {
    pending.value = false
  }
}
</script>
