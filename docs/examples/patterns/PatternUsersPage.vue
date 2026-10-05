<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Badge,
  Button,
  DataTable,
  EmptyState,
  Field,
  FilterBar,
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  useClientSort,
  type DataTableColumn,
  type DataTableSort,
  type FilterChip,
} from 'rowkit'
import { people, type Person } from '../data-table/people'

type Role = Person['role']
type Status = Person['status']

const roles: Role[] = ['Owner', 'Admin', 'Member', 'Billing']
const statuses: Status[] = ['active', 'invited', 'suspended']

const search = ref('')
const role = ref<Role>()
const status = ref<Status>()
const sort = ref<DataTableSort<Person>>()
const page = ref(1)
const pageSize = ref(10)
const selected = ref<number[]>([])

const columns: DataTableColumn<Person>[] = [
  { key: 'name', header: 'Name', sortable: true, sticky: true, width: '11rem' },
  { key: 'email', header: 'Email', sortable: true, width: '16rem' },
  { key: 'role', header: 'Role', sortable: true, width: '6rem' },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: '7rem',
    // By severity, not alphabetically.
    sortValue: (row) => ({ active: 0, invited: 1, suspended: 2 })[row.status],
  },
  { key: 'seats', header: 'Seats', sortable: true, numeric: true, width: '5rem' },
]
const tone = { active: 'success', invited: 'warning', suspended: 'danger' } as const

// Whatever your data source is, it answers these three questions.
const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return people.filter(
    (person) =>
      (role.value === undefined || person.role === role.value) &&
      (status.value === undefined || person.status === status.value) &&
      (term === '' || `${person.name} ${person.email}`.toLowerCase().includes(term))
  )
})
const sorted = useClientSort(filtered, sort, columns)
const pageRows = computed(() =>
  sorted.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
)

// A chip per applied filter. Ids name the filter, not its value.
const chips = computed<FilterChip[]>(() => [
  ...(search.value.trim() ? [{ id: 'search', label: 'Search', value: search.value }] : []),
  ...(role.value ? [{ id: 'role', label: 'Role', value: role.value }] : []),
  ...(status.value ? [{ id: 'status', label: 'Status', value: status.value }] : []),
])

function removeFilter(id: string): void {
  if (id === 'search') search.value = ''
  if (id === 'role') role.value = undefined
  if (id === 'status') status.value = undefined
}

function clearFilters(): void {
  search.value = ''
  role.value = undefined
  status.value = undefined
}

// The application resets the page, not the components.
watch([search, role, status, sort, pageSize], () => (page.value = 1))
</script>

<template>
  <div class="flex flex-col gap-2">
    <FilterBar
      v-model:search="search"
      :filters="chips"
      :result-count="filtered.length"
      label="Filter users"
      search-placeholder="Search name or email"
      @remove="removeFilter"
      @clear="clearFilters"
    >
      <template #controls>
        <Field label="Role" label-sr-only>
          <Select v-model="role">
            <SelectTrigger placeholder="Role" class="w-28" />
            <SelectContent>
              <SelectItem v-for="value in roles" :key="value" :value="value" :label="value" />
            </SelectContent>
          </Select>
        </Field>
        <Field label="Status" label-sr-only>
          <Select v-model="status">
            <SelectTrigger placeholder="Status" class="w-28" />
            <SelectContent>
              <SelectItem v-for="value in statuses" :key="value" :value="value" :label="value" />
            </SelectContent>
          </Select>
        </Field>
      </template>
    </FilterBar>

    <DataTable
      v-model:sort="sort"
      v-model:selected="selected"
      :rows="pageRows"
      :columns="columns"
      caption="Users"
      selectable="multiple"
      :row-label="(row) => row.name"
    >
      <template #[`cell:status`]="{ row }">
        <Badge :variant="tone[row.status]" size="sm" dot>{{ row.status }}</Badge>
      </template>
      <!-- Empty because the filters matched nothing — so the way out is to clear them. -->
      <template #empty>
        <EmptyState
          reason="no-results"
          title="No users match these filters"
          size="sm"
          :level="3"
          announce
        >
          <template #actions>
            <Button variant="secondary" size="sm" @click="clearFilters">Clear filters</Button>
          </template>
        </EmptyState>
      </template>
    </DataTable>

    <Pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :total="filtered.length"
      label="Users pages"
    />
  </div>
</template>
