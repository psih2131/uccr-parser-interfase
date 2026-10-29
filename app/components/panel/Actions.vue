<template>
  <section class="panel-actions">
    <div class="panel-actions__card">
      <h2 class="panel-actions__title">Парсинг</h2>
      <p class="panel-actions__hint">Сбор данных со страниц</p>
      <div class="panel-actions__row">
        <button
          type="button"
          class="panel-actions__btn panel-actions__btn--parse"
          :disabled="parsing"
          @click="emit('parse')"
        >
          {{ parsing ? 'Парсинг…' : 'Запустить парсер' }}
        </button>
        <button
          type="button"
          class="panel-actions__btn panel-actions__btn--secondary"
          :disabled="parsing"
          @click="emit('parse-missing')"
        >
          {{ parsing ? 'Парсинг…' : 'Спарсить недостающие' }}
        </button>
        <div class="panel-actions__status" :class="`panel-actions__status--${parseStatusKey}`">
          <span v-if="parseStatusKey === 'loading'" class="panel-actions__spinner" aria-hidden="true" />
          <span v-else class="panel-actions__status-dot" />
          <span class="panel-actions__status-label">{{ parseStatusLabel }}</span>
        </div>
      </div>
    </div>

    <div class="panel-actions__card">
      <h2 class="panel-actions__title">Нейросеть</h2>
      <p class="panel-actions__hint">Обогащение собранных данных</p>
      <div class="panel-actions__row">
        <button
          type="button"
          class="panel-actions__btn panel-actions__btn--enrich"
          :disabled="enriching"
          @click="emit('enrich')"
        >
          {{ enriching ? 'Обогащение…' : 'Обогатить нейросетью' }}
        </button>
        <div class="panel-actions__status" :class="`panel-actions__status--${enrichStatusKey}`">
          <span v-if="enrichStatusKey === 'loading'" class="panel-actions__spinner" aria-hidden="true" />
          <span v-else class="panel-actions__status-dot" />
          <span class="panel-actions__status-label">{{ enrichStatusLabel }}</span>
        </div>
      </div>
    </div>

    <div class="panel-actions__card">
      <h2 class="panel-actions__title">Данные</h2>
      <p class="panel-actions__hint">Очистка и выгрузка таблицы</p>
      <div class="panel-actions__row">
        <button
          type="button"
          class="panel-actions__btn panel-actions__btn--danger"
          :disabled="deleting || parsing"
          @click="emit('delete-all')"
        >
          {{ deleting ? 'Удаление…' : 'Удалить все' }}
        </button>
        <button
          type="button"
          class="panel-actions__btn panel-actions__btn--download"
          @click="emit('download')"
        >
          Скачать таблицу
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  parsing: {
    type: Boolean,
    default: false,
  },
  enriching: {
    type: Boolean,
    default: false,
  },
  deleting: {
    type: Boolean,
    default: false,
  },
  parseStatus: {
    type: String,
    default: null,
  },
  enrichStatus: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['parse', 'parse-missing', 'enrich', 'delete-all', 'download'])

const statusMap = {
  loading: { key: 'loading', label: 'В работе' },
  'everything is loaded': { key: 'done', label: 'Готово' },
  'error loading': { key: 'error', label: 'Ошибка' },
}

const resolveStatus = (value, active) => {
  if (value && statusMap[value]) return statusMap[value]
  if (active) return { key: 'loading', label: 'В работе' }
  return { key: 'idle', label: 'Ожидание' }
}

const parseStatusKey = computed(() => resolveStatus(props.parseStatus, props.parsing).key)
const parseStatusLabel = computed(() => resolveStatus(props.parseStatus, props.parsing).label)
const enrichStatusKey = computed(() => resolveStatus(props.enrichStatus, props.enriching).key)
const enrichStatusLabel = computed(() => resolveStatus(props.enrichStatus, props.enriching).label)
</script>
