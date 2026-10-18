<template>
  <section class="panel-dashboard">
    <div class="panel-dashboard__item">
      <span class="panel-dashboard__label">Последний сбор</span>
      <span class="panel-dashboard__value">{{ lastCollectedAt }}</span>
    </div>
    <div class="panel-dashboard__item">
      <span class="panel-dashboard__label">Успешно собрано</span>
      <span class="panel-dashboard__value panel-dashboard__value--success">
        {{ successCount }}
      </span>
    </div>
    <div class="panel-dashboard__item">
      <span class="panel-dashboard__label">Ошибок</span>
      <span class="panel-dashboard__value panel-dashboard__value--error">
        {{ errorCount }}
      </span>
    </div>
  </section>
</template>

<script setup>
defineProps({
  lastCollectedAt: {
    type: String,
    default: '—',
  },
  successCount: {
    type: [Number, String],
    default: 0,
  },
  errorCount: {
    type: [Number, String],
    default: 0,
  },
})
</script>
