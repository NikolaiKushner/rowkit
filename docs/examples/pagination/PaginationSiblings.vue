<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from 'rowkit'

const page = ref(40)
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- No neighbours: the narrowest, for a phone or a status bar. -->
    <Pagination
      v-model:page="page"
      :page-size="10"
      :total="1000"
      :sibling-count="0"
      hide-page-size
      label="Compact pages"
    />
    <!-- One either side, the default. The first and last pages always show. -->
    <Pagination
      v-model:page="page"
      :page-size="10"
      :total="1000"
      :sibling-count="1"
      hide-page-size
      label="Wider pages"
    />
  </div>
</template>
