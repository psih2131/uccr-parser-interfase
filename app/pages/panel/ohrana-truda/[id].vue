<template>
  <div class="panel-page">
    <NuxtLink to="/panel/ohrana-truda" class="panel-page__back">
      ← Назад к списку
    </NuxtLink>
    <h1 class="panel-page__title">Пост #{{ id }}</h1>
    <p class="panel-page__hint">Страница редактирования поста</p>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'panel',
})

const route = useRoute()
const id = computed(() => route.params.id)
</script>
