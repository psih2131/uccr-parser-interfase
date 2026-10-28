<template>
  <section class="panel-posts-table">
    <div class="panel-posts-table__toolbar">
      <p class="panel-posts-table__count">
        Постов в таблице: <span>{{ posts.length }}</span>
      </p>
      <label class="panel-posts-table__search">
        <span class="visually-hidden">Поиск по постам</span>
        <input
          v-model="searchQuery"
          type="search"
          class="panel-posts-table__search-input"
          placeholder="Поиск по постам…"
        />
      </label>
    </div>

    <div class="panel-posts-table__head">
      <span class="panel-posts-table__col panel-posts-table__col--id">ID</span>
      <span class="panel-posts-table__col panel-posts-table__col--title">Название</span>
      <span class="panel-posts-table__col panel-posts-table__col--url">URL</span>
      <span class="panel-posts-table__col panel-posts-table__col--date">Создан</span>
      <span class="panel-posts-table__col panel-posts-table__col--date">Обновлён</span>
      <span class="panel-posts-table__col panel-posts-table__col--status">Парсинг</span>
      <span class="panel-posts-table__col panel-posts-table__col--status">Нейросеть</span>
      <span class="panel-posts-table__col panel-posts-table__col--log">Лог</span>
      <span class="panel-posts-table__col panel-posts-table__col--actions">Действия</span>
    </div>

    <ul v-if="posts.length" class="panel-posts-table__list">
      <PanelPostRow
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </ul>

    <p v-else class="panel-posts-table__empty">Постов пока нет</p>
  </section>
</template>

<script setup>
defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['edit', 'delete'])

const searchQuery = ref('')
</script>
