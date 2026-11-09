<template>
  <div class="panel-page">
    <h1 class="panel-page__title">Профпереподготовка</h1>

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
      :enrich-status="enrichStatus"
      :enrich-limit="20"
      @parse="onParse"
      @parse-missing="onParseMissing"
      @enrich="onEnrich"
      @enrich-limit="onEnrichLimit"
      @delete-all="onDeleteAll"
      @download="onDownload"
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
import aiService from '~/services/ai'
import profPereService from '~/services/profPere'

definePageMeta({
  layout: 'panel',
})

// только на клиенте: cookie сессии висит на API (другой origin), SSR её не видит
const { data: listData, refresh: refreshPosts } = await useFetch(parserService.profPereListUrl(), {
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
    aiLoad: item.ai_load,
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
const enrichStatus = ref(null)
const deleting = ref(false)
const parsing = computed(() => parseStatus.value === 'loading')
const enriching = computed(() => enrichStatus.value === 'loading')

let statusTimer = null
let enrichTimer = null

const stopStatusPolling = () => {
  if (!statusTimer) return
  clearInterval(statusTimer)
  statusTimer = null
}

const stopEnrichPolling = () => {
  if (!enrichTimer) return
  clearInterval(enrichTimer)
  enrichTimer = null
}

const checkParseStatus = async () => {
  try {
    const res = await parserService.getParserStatus()
    const status = res?.data?.['prof-pere']?.statusLoad ?? null
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

const checkEnrichStatus = async () => {
  try {
    const res = await aiService.getProfPereEnrichStatus()
    const status = res?.data?.['prof-pere']?.statusLoad ?? null
    enrichStatus.value = status

    if (status !== 'loading') {
      stopEnrichPolling()
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

const startEnrichPolling = () => {
  stopEnrichPolling()
  enrichTimer = setInterval(checkEnrichStatus, 5000)
}

const onEdit = (post) => {
  navigateTo(`/panel/profperepodgotovka/${post.id}`)
}

const onDelete = (post) => {
  console.log('delete', post.id)
}

const onDeleteAll = async () => {
  if (deleting.value || parsing.value) return
  if (!confirm('Удалить все посты профпереподготовки?')) return

  deleting.value = true
  try {
    await profPereService.deleteAll()
    await refreshPosts()
  } catch (error) {
    console.error(error)
  } finally {
    deleting.value = false
  }
}

const onDownload = async () => {
  try {
    const res = await profPereService.getExport()
    const posts = res?.data?.posts ?? []
    const text = JSON.stringify(posts, null, 2)
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'profperepodgotovka.json'
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
  }
}

const onParse = async () => {
  try {
    const res = await parserService.startParser('prof-pere')
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

const onParseMissing = async () => {
  try {
    const res = await parserService.startMissingParser('prof-pere')
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

const onEnrich = async () => {
  if (enriching.value || parsing.value) return

  try {
    const res = await aiService.enrichProfPereAll()
    enrichStatus.value = res?.data?.statusLoad ?? 'loading'

    if (enrichStatus.value === 'loading') {
      startEnrichPolling()
    }
  } catch (error) {
    console.error(error)
    enrichStatus.value = 'error loading'
    stopEnrichPolling()
  }
}

const onEnrichLimit = async (count) => {
  if (enriching.value || parsing.value) return

  try {
    const res = await aiService.enrichProfPereCount(count)
    enrichStatus.value = res?.data?.statusLoad ?? 'loading'

    if (enrichStatus.value === 'loading') {
      startEnrichPolling()
    }
  } catch (error) {
    console.error(error)
    enrichStatus.value = 'error loading'
    stopEnrichPolling()
  }
}

onMounted(async () => {
  await checkParseStatus()
  if (parseStatus.value === 'loading') {
    startStatusPolling()
  }

  await checkEnrichStatus()
  if (enrichStatus.value === 'loading') {
    startEnrichPolling()
  }
})

onUnmounted(() => {
  stopStatusPolling()
  stopEnrichPolling()
})
</script>
