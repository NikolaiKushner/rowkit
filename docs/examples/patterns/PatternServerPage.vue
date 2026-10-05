<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  compareSortable,
  DataTable,
  FilterBar,
  Pagination,
  type DataTableColumn,
  type DataTableSort,
  type FilterChip,
} from 'rowkit'
import { people, type Person } from '../data-table/people'

const search = ref('')
const sort = ref<DataTableSort<Person>>()
const page = ref(1)
const pageSize = 8

const rows = ref<Person[]>([])
const total = ref(0)
const pending = ref(false)
// Placeholders only on the first load, and only once it has taken 150ms.
const firstLoad = ref(true)
const showSkeleton = ref(false)

const columns: DataTableColumn<Person>[] = [
  { key: 'name', header: 'Name', sortable: true, width: '11rem' },
  { key: 'team', header: 'Team', sortable: true, width: '7rem' },
  { key: 'seats', header: 'Seats', sortable: true, numeric: true, width: '5rem' },
]

/** Stands in for GET /people?q=&sort=&dir=&page= — slow, as a real network can be. */
async function fetchPeople(): Promise<{ rows: Person[]; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const term = search.value.trim().toLowerCase()
  let list = people.filter((person) => person.name.toLowerCase().includes(term))
  const active = sort.value
  if (active)
    list = [...list].sort((a, b) => compareSortable(a[active.key], b[active.key], active.direction))
  const start = (page.value - 1) * pageSize
  return { rows: list.slice(start, start + pageSize), total: list.length }
}

let request = 0
let delay: ReturnType<typeof setTimeout> | undefined
async function load(): Promise<void> {
  const id = ++request
  pending.value = true
  delay = setTimeout(() => (showSkeleton.value = firstLoad.value), 150)
  const result = await fetchPeople()
  if (id !== request) return // a newer request is on its way
  clearTimeout(delay)
  rows.value = result.rows
  total.value = result.total
  pending.value = firstLoad.value = showSkeleton.value = false
}

// Typing waits 300ms for a pause; sort and page fetch at once.
let typing: ReturnType<typeof setTimeout> | undefined
watch(search, () => {
  clearTimeout(typing)
  typing = setTimeout(() => (page.value === 1 ? void load() : (page.value = 1)), 300)
})
watch(sort, () => (page.value === 1 ? void load() : (page.value = 1)))
watch(page, load)
onMounted(load)
onBeforeUnmount(() => {
  clearTimeout(typing)
  clearTimeout(delay)
})

const chips = ref<FilterChip[]>([])
watch(search, (value) => (chips.value = value ? [{ id: 'search', label: 'Search', value }] : []))
</script>

<template>
  <div class="flex flex-col gap-2">
    <FilterBar
      v-model:search="search"
      :filters="chips"
      :result-count="total"
      label="Filter people"
      search-placeholder="Search names"
      @remove="search = ''"
      @clear="search = ''"
    />
    <!--
      A refresh keeps the rows on screen and marks the region busy; only the
      first load, with nothing to show yet, draws placeholders.
    -->
    <div
      :aria-busy="pending"
      class="flex flex-col gap-1"
      :class="pending && !firstLoad && 'opacity-80'"
    >
      <DataTable
        v-model:sort="sort"
        :rows="rows"
        :columns="columns"
        caption="People"
        :loading="showSkeleton"
        :loading-rows="pageSize"
        loading-label="Loading people"
        empty-reason="no-results"
        empty-title="Nobody matches this search"
      />
      <div class="flex flex-wrap items-center justify-between gap-2 text-ui">
        <span aria-live="polite">{{ pending ? 'Updating…' : `${total} people` }}</span>
        <Pagination
          v-model:page="page"
          :page-size="pageSize"
          :total="total"
          size="sm"
          hide-page-size
          hide-summary
          label="People pages"
        />
      </div>
    </div>
  </div>
</template>
