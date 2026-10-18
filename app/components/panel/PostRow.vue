<template>
  <li class="panel-post-row">
    <span class="panel-post-row__id">{{ post.id }}</span>
    <span class="panel-post-row__title" :title="post.title || ''">
      {{ shortTitle }}
    </span>
    <span class="panel-post-row__url" :title="post.url || ''">
      {{ post.url || '—' }}
    </span>
    <span class="panel-post-row__date">{{ post.createdAt }}</span>
    <span class="panel-post-row__date">{{ post.updatedAt }}</span>
    <span
      class="panel-post-row__status"
      :class="post.parserLoad ? 'panel-post-row__status--ok' : 'panel-post-row__status--fail'"
    >
      {{ post.parserLoad ? 'Успех' : 'Ошибка' }}
    </span>

    <div class="panel-post-row__log">
      <span
        v-if="post.log"
        class="panel-post-row__log-icon"
        tabindex="0"
        aria-label="Лог парсера"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <span class="panel-post-row__log-tip">{{ post.log }}</span>
      </span>
      <span v-else class="panel-post-row__log-empty">—</span>
    </div>

    <div class="panel-post-row__actions">
      <button
        type="button"
        class="panel-post-row__btn panel-post-row__btn--edit"
        aria-label="Редактировать"
        @click="emit('edit', post)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
      <button
        type="button"
        class="panel-post-row__btn panel-post-row__btn--delete"
        aria-label="Удалить"
        @click="emit('delete', post)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  </li>
</template>

<script setup>
const TITLE_MAX_LENGTH = 48

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit', 'delete'])

const shortTitle = computed(() => {
  const title = props.post.title?.trim()
  if (!title) return '—'
  if (title.length <= TITLE_MAX_LENGTH) return title
  return `${title.slice(0, TITLE_MAX_LENGTH)}…`
})
</script>
