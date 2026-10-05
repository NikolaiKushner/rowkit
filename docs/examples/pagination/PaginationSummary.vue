<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from 'rowkit'

const page = ref(4)
const number = new Intl.NumberFormat('en-GB')
</script>

<template>
  <!-- The summary slot gets from, to and total: say it your way, and format the numbers. -->
  <Pagination v-model:page="page" :page-size="50" :total="12840" hide-page-size label="Log pages">
    <template #summary="{ from, to, total }">
      Entries {{ number.format(from) }} to {{ number.format(to) }} of {{ number.format(total) }}
    </template>
  </Pagination>
</template>
