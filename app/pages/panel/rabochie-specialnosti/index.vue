<template>
  <div class="panel-page">
    <h1 class="panel-page__title">Рабочие специальности</h1>

    <PanelDashboard
      :last-collected-at="stats.lastCollectedAt"
      :success-count="stats.successCount"
      :error-count="stats.errorCount"
    />

    <PanelActions
      :parsing="parsing"
      :enriching="enriching"
      :deleting="deleting"
      :parse-status="parseStatus"
      @parse="onParse"
      @enrich="onEnrich"
      @delete-all="onDeleteAll"
    />

    <PanelPostsTable
      :posts="posts"
      @edit="onEdit"
      @delete="onDelete"
    />
  </div>
</template>

<script setup>
import parserService from '~/services/parser'

definePageMeta({
  layout: 'panel',
})

// только на клиенте: cookie сессии висит на API (другой origin), SSR её не видит
const { data: listData, refresh: refreshPosts } = await useFetch(parserService.rabSpecListUrl(), {
  credentials: 'include',
  server: false,
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

const posts = computed(() => {
  const rows = listData.value?.data?.posts ?? []
  return rows.map((item) => ({
    id: item.id,
    title: item.title,
    createdAt: formatDate(item.created_at),
    updatedAt: formatDate(item.updated_at),
    log: item.parser_logs,
    url: item.url,
    parserLoad: item.parser_load,
  }))
})

const stats = computed(() => {
  const rows = listData.value?.data?.posts ?? []
  const successCount = rows.filter((item) => item.parser_load).length
  const errorCount = rows.filter((item) => !item.parser_load).length
  const last = rows[0]?.updated_at || rows[0]?.created_at || null

  return {
    lastCollectedAt: last ? formatDate(last) : '—',
    successCount,
    errorCount,
  }
})

const parseStatus = ref(null)
const enriching = ref(false)
const deleting = ref(false)
const parsing = computed(() => parseStatus.value === 'loading')

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
        await refreshPosts()
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const startStatusPolling = () => {
  stopStatusPolling()
  statusTimer = setInterval(checkParseStatus, 5000)
}

const onEdit = (post) => {
  navigateTo(`/panel/rabochie-specialnosti/${post.id}`)
}

const onDelete = (post) => {
  console.log('delete', post.id)
}

const onDeleteAll = async () => {
  if (deleting.value || parsing.value) return
  if (!confirm('Удалить все посты рабочих специальностей?')) return

  deleting.value = true
  try {
    await parserService.deleteRabSpecAll()
    await refreshPosts()
  } catch (error) {
    console.error(error)
  } finally {
    deleting.value = false
  }
}

const onParse = async () => {
  try {
    const res = await parserService.startParser('rab-spec')
    parseStatus.value = res?.data?.statusLoad ?? 'loading'

    if (parseStatus.value === 'loading') {
      startStatusPolling()
    }
  } catch (error) {
    console.error(error)
    parseStatus.value = 'error loading'
    stopStatusPolling()
  }
}

const onEnrich = () => {
  enriching.value = true
  console.log('enrich')
  setTimeout(() => {
    enriching.value = false
  }, 1000)
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
