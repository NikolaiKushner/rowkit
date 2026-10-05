<script setup lang="ts">
import { ref, watch } from 'vue'
import { Pagination } from 'rowkit'

const page = ref(1)
const loading = ref(false)

// Disabled while the next page loads, so clicks do not pile up requests.
watch(page, () => {
  loading.value = true
  setTimeout(() => (loading.value = false), 900)
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <Pagination
      v-model:page="page"
      :page-size="20"
      :total="180"
      hide-page-size
      :disabled="loading"
      label="Results pages"
    />
    <span class="text-ui" role="status">{{
      loading ? `Loading page ${page}…` : `Page ${page} loaded.`
    }}</span>
  </div>
</template>
