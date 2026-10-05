<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from 'rowkit'

const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <Pagination v-model:page="page" v-model:page-size="pageSize" :total="247" label="Orders pages" />
</template>
