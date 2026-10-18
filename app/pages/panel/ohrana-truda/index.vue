<template>
  <div class="panel-page">
    <h1 class="panel-page__title">Охрана труда</h1>

    <PanelDashboard
      :last-collected-at="stats.lastCollectedAt"
      :success-count="stats.successCount"
      :error-count="stats.errorCount"
    />

    <PanelActions
      :parsing="parsing"
      :enriching="enriching"
      @parse="onParse"
      @enrich="onEnrich"
    />

    <PanelPostsTable
      :posts="posts"
      @edit="onEdit"
      @delete="onDelete"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'panel',
})

const stats = ref({
  lastCollectedAt: '17.10.2026 14:10',
  successCount: 94,
  errorCount: 1,
})

const parsing = ref(false)
const enriching = ref(false)

const posts = ref([
  {
    id: 1,
    title: 'Инструктаж по охране труда на предприятии',
    updatedAt: '17.10.2026',
    enriched: true,
  },
  {
    id: 2,
    title: 'Обучение работе на высоте',
    updatedAt: '16.10.2026',
    enriched: false,
  },
  {
    id: 3,
    title: 'Пожарная безопасность: базовый курс',
    updatedAt: '14.10.2026',
    enriched: true,
  },
])

const onEdit = (post) => {
  navigateTo(`/panel/ohrana-truda/${post.id}`)
}

const onDelete = (post) => {
  console.log('delete', post.id)
}

const onParse = () => {
  parsing.value = true
  console.log('parse')
  setTimeout(() => {
    parsing.value = false
  }, 1000)
}

const onEnrich = () => {
  enriching.value = true
  console.log('enrich')
  setTimeout(() => {
    enriching.value = false
  }, 1000)
}
</script>
