<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { DataTable, Pagination, type DataTableColumn } from 'rowkit'
import { people, type Person } from '../data-table/people'

const page = ref(1)
const pageSize = ref(5)

// Rows on this page: slice the list you hold.
const rows = computed(() =>
  people.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
)

// A new page size starts again at page 1 — your choice; the component only reports it.
watch(pageSize, () => (page.value = 1))

const columns: DataTableColumn<Person>[] = [
  { key: 'id', header: 'ID', numeric: true, width: '48px' },
  { key: 'name', header: 'Name', width: '160px' },
  { key: 'team', header: 'Team' },
]
</script>

<template>
  <div class="flex flex-col gap-1">
    <DataTable :rows="rows" :columns="columns" caption="People" />
    <Pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :total="people.length"
      :page-size-options="[5, 10, 20]"
      label="People pages"
    />
  </div>
</template>
