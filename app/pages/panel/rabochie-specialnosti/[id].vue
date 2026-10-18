<template>
  <div class="panel-page">
    <NuxtLink to="/panel/rabochie-specialnosti" class="panel-page__back">
      ← Назад к списку
    </NuxtLink>

    <template v-if="pending">
      <p class="panel-page__hint">Загрузка поста…</p>
    </template>

    <template v-else-if="error || !post">
      <h1 class="panel-page__title">Пост не найден</h1>
      <p class="panel-page__hint">Не удалось загрузить данные поста</p>
    </template>

    <template v-else>
      <div class="post-detail__header">
        <div>
          <h1 class="panel-page__title">{{ post.title || `Пост #${post.id}` }}</h1>
          <p class="panel-page__hint">ID {{ post.id }}</p>
        </div>
        <div class="panel-actions__row">
          <button
            type="button"
            class="panel-actions__btn panel-actions__btn--parse"
            :disabled="reparsing || enriching || !post.url"
            @click="onReparse"
          >
            {{ reparsing ? 'Парсинг…' : 'Спарсить заново' }}
          </button>
          <button
            type="button"
            class="panel-actions__btn panel-actions__btn--enrich"
            :disabled="reparsing || enriching"
            @click="onEnrich"
          >
            {{ enriching ? 'Нейросеть…' : 'Запустить нейронку' }}
          </button>
          <div class="panel-actions__status" :class="`panel-actions__status--${parseStatusKey}`">
            <span v-if="parseStatusKey === 'loading'" class="panel-actions__spinner" aria-hidden="true" />
            <span v-else class="panel-actions__status-dot" />
            <span class="panel-actions__status-label">{{ parseStatusLabel }}</span>
          </div>
        </div>
      </div>

      <section class="post-detail">
        <div class="post-detail__card post-detail__card--main">
          <div class="post-detail__card-top">
            <h2 class="post-detail__heading">Основное</h2>
            <span
              class="post-detail__badge"
              :class="post.parser_load ? 'post-detail__badge--ok' : 'post-detail__badge--fail'"
            >
              {{ post.parser_load ? 'Успех' : 'Ошибка' }}
            </span>
          </div>

          <div class="post-detail__meta">
            <div class="post-detail__meta-item">
              <span class="post-detail__meta-label">ID</span>
              <span class="post-detail__meta-value">{{ post.id }}</span>
            </div>
            <div class="post-detail__meta-item">
              <span class="post-detail__meta-label">Создан</span>
              <span class="post-detail__meta-value">{{ formatDate(post.created_at) }}</span>
            </div>
            <div class="post-detail__meta-item">
              <span class="post-detail__meta-label">Обновлён</span>
              <span class="post-detail__meta-value">{{ formatDate(post.updated_at) }}</span>
            </div>
          </div>

          <div class="post-detail__field">
            <span class="post-detail__field-label">Title</span>
            <p class="post-detail__field-value">{{ post.title || '—' }}</p>
          </div>

          <div class="post-detail__field">
            <span class="post-detail__field-label">URL</span>
            <a
              v-if="post.url"
              class="post-detail__link"
              :href="post.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ post.url }}
            </a>
            <p v-else class="post-detail__field-value">—</p>
          </div>

          <div class="post-detail__field">
            <span class="post-detail__field-label">Лог</span>
            <div class="post-detail__log" :class="{ 'post-detail__log--empty': !post.parser_logs }">
              {{ post.parser_logs || 'Лог пуст' }}
            </div>
          </div>
        </div>

        <div class="post-detail__card">
          <h2 class="post-detail__heading">post_data (JSON)</h2>
          <pre class="post-detail__json">{{ jsonText }}</pre>
        </div>

        <div class="post-detail__card">
          <h2 class="post-detail__heading">Обогащённые данные нейронкой</h2>
          <div class="post-detail__empty">Пока пусто</div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import parserService from '~/services/parser'

definePageMeta({
  layout: 'panel',
})

const route = useRoute()
const id = computed(() => route.params.id)

const { data, pending, error, refresh } = await useFetch(
  () => parserService.rabSpecByIdUrl(id.value),
  {
    credentials: 'include',
    server: false,
  },
)

const post = computed(() => data.value?.data?.post ?? null)

const parseStatus = ref(null)
const enriching = ref(false)
const reparsing = computed(() => parseStatus.value === 'loading')

const statusMap = {
  loading: { key: 'loading', label: 'В работе' },
  'everything is loaded': { key: 'done', label: 'Готово' },
  'error loading': { key: 'error', label: 'Ошибка' },
}

const parseStatusResolved = computed(() => {
  if (parseStatus.value && statusMap[parseStatus.value]) {
    return statusMap[parseStatus.value]
  }
  if (reparsing.value) return { key: 'loading', label: 'В работе' }
  return { key: 'idle', label: 'Ожидание' }
})

const parseStatusKey = computed(() => parseStatusResolved.value.key)
const parseStatusLabel = computed(() => parseStatusResolved.value.label)

let statusTimer = null

const stopStatusPolling = () => {
  if (!statusTimer) return
  clearInterval(statusTimer)
  statusTimer = null
}

const checkParseStatus = async () => {
  try {
    const res = await parserService.getParserStatus()
    const status = res?.data?.['rab-spec']?.statusLoad ?? null
    parseStatus.value = status

    if (status !== 'loading') {
      stopStatusPolling()
      if (status === 'everything is loaded') {
        await refresh()
      }
    }
  } catch (err) {
    console.error(err)
  }
}

const startStatusPolling = () => {
  stopStatusPolling()
  statusTimer = setInterval(checkParseStatus, 5000)
}

const onReparse = async () => {
  if (!post.value?.url || reparsing.value || enriching.value) return

  try {
    const res = await parserService.startOneParser('rab-spec', post.value.url)
    parseStatus.value = res?.data?.statusLoad ?? 'loading'

    if (parseStatus.value === 'loading') {
      startStatusPolling()
    }
  } catch (err) {
    console.error(err)
    parseStatus.value = 'error loading'
    stopStatusPolling()
  }
}

const onEnrich = () => {
  if (enriching.value || reparsing.value) return
  enriching.value = true
  console.log('enrich', post.value?.id)
  setTimeout(() => {
    enriching.value = false
  }, 1000)
}

const jsonText = computed(() => {
  const raw = post.value?.post_data
  if (raw == null) return '—'
  try {
    return JSON.stringify(raw, null, 2)
  } catch {
    return String(raw)
  }
})

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  await checkParseStatus()
  if (parseStatus.value === 'loading') {
    startStatusPolling()
  }
})

onUnmounted(() => {
  stopStatusPolling()
})
</script>
