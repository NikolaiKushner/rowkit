<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  compareSortable,
  DataTable,
  Pagination,
  type DataTableColumn,
  type DataTableSort,
} from 'rowkit'
import { people, type Person } from './people'

const columns: DataTableColumn<Person>[] = [
  { key: 'name', header: 'Name', sortable: true, width: '160px' },
  { key: 'team', header: 'Team', sortable: true, width: '110px' },
  { key: 'joined', header: 'Joined', sortable: true, width: '110px' },
  { key: 'seats', header: 'Seats', sortable: true, numeric: true, width: '80px' },
]

const rows = ref<Person[]>([])
const total = ref(0)
const loading = ref(true)
const sort = ref<DataTableSort<Person>>()
const page = ref(1)
const pageSize = 8

/*
 * Stands in for your API: GET /people?sort=name&dir=asc&page=2. The server
 * sorts and pages; the table only shows the page it is given, so it never
 * sorts rows itself.
 */
async function fetchPeople(): Promise<{ rows: Person[]; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  const active = sort.value
  const ordered = active
    ? [...people].sort((a, b) => compareSortable(a[active.key], b[active.key], active.direction))
    : people
  const start = (page.value - 1) * pageSize
  return { rows: ordered.slice(start, start + pageSize), total: people.length }
}

async function load(): Promise<void> {
  loading.value = true
  const result = await fetchPeople()
  rows.value = result.rows
  total.value = result.total
  loading.value = false
}

// A new sort starts again at page 1; either change fetches.
watch(sort, () => {
  if (page.value === 1) void load()
  else page.value = 1
})
watch(page, load)
onMounted(load)
</script>

<template>
  <div class="flex flex-col">
    <DataTable
      v-model:sort="sort"
      :rows="rows"
      :columns="columns"
      caption="People"
      :loading="loading"
      :loading-rows="pageSize"
    />
    <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
      <span class="text-ui" aria-live="polite">{{ loading ? 'Loading…' : `${total} people` }}</span>
      <Pagination
        v-model:page="page"
        :page-size="pageSize"
        :total="total"
        size="sm"
        hide-page-size
        hide-summary
        label="People pages"
        :disabled="loading"
      />
    </div>
  </div>
</template>
