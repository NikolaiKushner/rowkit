<script setup lang="ts">
import {
  Badge,
  Button,
  DataTable,
  EmptyState,
  FilterBar,
  Select,
  TablePagination,
  compareSortable,
  type DataTableColumn,
  type DataTableSort,
  type FilterChip,
  type SelectOption,
} from 'rowkit'
import { computed, ref, watch } from 'vue'

/**
 * Phase 3's acceptance criterion: a users-admin page that is filterable,
 * sortable, paginated, and has real loading and empty states.
 *
 * Filtering, sorting and paging all happen here rather than inside `DataTable`,
 * which is the shape a server-backed table actually has — the table reports
 * what the user asked for and renders what it is handed.
 */

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'invited' | 'suspended'
  seats: number
  lastActive: Date
}

const roles = ['Owner', 'Admin', 'Member', 'Billing']
const statuses: User['status'][] = ['active', 'invited', 'suspended']

const firstNames = [
  'Ada',
  'Grace',
  'Alan',
  'Katherine',
  'Barbara',
  'Edsger',
  'Margaret',
  'Donald',
  'Radia',
  'Tim',
  'Linus',
  'Anita',
]
const lastNames = [
  'Lovelace',
  'Hopper',
  'Turing',
  'Johnson',
  'Liskov',
  'Dijkstra',
  'Hamilton',
  'Knuth',
  'Perlman',
  'Berners-Lee',
  'Torvalds',
  'Borg',
]

/** Deterministic, so the page looks the same on the server and after hydration. */
const allUsers: User[] = Array.from({ length: 137 }, (_, index) => {
  const first = firstNames[index % firstNames.length] ?? 'Ada'
  const last = lastNames[(index * 5) % lastNames.length] ?? 'Lovelace'
  return {
    id: index + 1,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, '')}${index}@example.com`,
    role: roles[index % roles.length] ?? 'Member',
    status: statuses[index % statuses.length] ?? 'active',
    seats: (index * 7) % 24,
    lastActive: new Date(2026, 6, 29 - (index % 60)),
  }
})

const roleOptions: SelectOption<string>[] = roles.map((role) => ({ label: role, value: role }))
const statusOptions: SelectOption<string>[] = statuses.map((status) => ({
  label: status[0]!.toUpperCase() + status.slice(1),
  value: status,
}))

const search = ref('')
const role = ref<string>()
const status = ref<string>()
const sort = ref<DataTableSort<User>>()
const page = ref(1)
const pageSize = ref(10)
const selected = ref<PropertyKey[]>([])
const loading = ref(false)

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' })

const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name', sortable: true, sticky: true, width: '14rem' },
  { key: 'email', header: 'Email', sortable: true, width: '18rem' },
  { key: 'role', header: 'Role', sortable: true, width: '8rem' },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: '9rem',
    // Alphabetical order would put "invited" between "active" and "suspended"
    // by accident; this is the order that means something.
    sortValue: (row) => ({ active: 0, invited: 1, suspended: 2 })[row.status],
  },
  { key: 'seats', header: 'Seats', sortable: true, align: 'end', width: '7rem' },
  {
    key: 'lastActive',
    header: 'Last active',
    sortable: true,
    width: '10rem',
    sortValue: (row) => row.lastActive,
  },
  { id: 'actions', header: 'Actions', headerSrOnly: true, align: 'end', width: '5rem' },
]

const statusTone = { active: 'success', invited: 'warning', suspended: 'danger' } as const

/** What the "server" would match. */
const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return allUsers.filter((user) => {
    if (role.value !== undefined && user.role !== role.value) return false
    if (status.value !== undefined && user.status !== status.value) return false
    if (term === '') return true
    return user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
  })
})

/**
 * Sorted here rather than by the table. `DataTable` defaults to `sortMode:
 * 'manual'` precisely so this stays correct: sorting inside the table would
 * only reorder the ten rows on screen.
 */
const sorted = computed(() => {
  const active = sort.value
  if (active === undefined) return filtered.value

  const column = columns.find((candidate) => candidate.key === active.key)
  if (column === undefined) return filtered.value

  const valueOf = (row: User) =>
    column.sortValue ? column.sortValue(row) : (row[column.key as keyof User] as string | number)

  return [...filtered.value].sort((a, b) =>
    compareSortable(valueOf(a), valueOf(b), active.direction)
  )
})

const pageRows = computed(() =>
  sorted.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
)

/** Applied filters, as chips. `id` names the filter, not its current value. */
const chips = computed<FilterChip[]>(() => {
  const applied: FilterChip[] = []
  if (search.value.trim() !== '')
    applied.push({ id: 'search', label: 'Search', value: search.value })
  if (role.value !== undefined) applied.push({ id: 'role', label: 'Role', value: role.value })
  if (status.value !== undefined) {
    applied.push({
      id: 'status',
      label: 'Status',
      value: statusOptions.find((option) => option.value === status.value)?.label,
    })
  }
  return applied
})

function removeFilter(id: string) {
  if (id === 'search') search.value = ''
  if (id === 'role') role.value = undefined
  if (id === 'status') status.value = undefined
}

function clearFilters() {
  search.value = ''
  role.value = undefined
  status.value = undefined
}

/**
 * Resetting the page is the application's job, not the component's.
 *
 * `TablePagination` deliberately never moves the page itself — so narrowing the
 * results, re-sorting, or changing the page size all reset it here. Without
 * this the user lands on page 9 of a two-page result and sees nothing.
 */
watch([search, role, status, sort, pageSize], () => {
  page.value = 1
})

/** A pretend round trip, so the loading state is visible rather than theoretical. */
let pending: ReturnType<typeof setTimeout> | undefined
watch([search, role, status, sort, page, pageSize], () => {
  loading.value = true
  clearTimeout(pending)
  pending = setTimeout(() => {
    loading.value = false
  }, 450)
})

const selectedCount = computed(() => selected.value.length)
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Users</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Filterable, sortable and paginated — every piece is a rowkit component.
        </p>
      </div>
      <Button>Invite a teammate</Button>
    </header>

    <FilterBar
      v-model:search="search"
      label="User filters"
      search-placeholder="Search name or email…"
      :filters="chips"
      :result-count="filtered.length"
      @remove="removeFilter"
      @clear="clearFilters"
    >
      <template #controls>
        <Select v-model="role" :options="roleOptions" placeholder="Role" class="w-36" />
        <Select v-model="status" :options="statusOptions" placeholder="Status" class="w-36" />
      </template>
    </FilterBar>

    <!--
      A single live region for the bulk bar. It appears and disappears with the
      selection, so it announces the count changing rather than the table.
    -->
    <div
      v-if="selectedCount > 0"
      class="flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary-border bg-primary-subtle px-4 py-2"
    >
      <p class="text-sm font-medium text-primary-on-subtle">
        {{ selectedCount }} {{ selectedCount === 1 ? 'user' : 'users' }} selected
      </p>
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="sm" @click="selected = []">Clear selection</Button>
        <Button variant="danger" size="sm">Suspend</Button>
      </div>
    </div>

    <DataTable
      v-model:sort="sort"
      v-model:selected="selected"
      :rows="pageRows"
      :columns="columns"
      caption="Users"
      selectable="multiple"
      :row-label="(row: User) => `Select ${row.name}`"
      :loading="loading"
      :loading-rows="pageSize"
      loading-label="Loading users"
      hoverable
      class="max-h-[32rem]"
    >
      <template #[`cell:status`]="{ row }">
        <Badge :variant="statusTone[(row as User).status]" size="sm" dot>
          {{ (row as User).status }}
        </Badge>
      </template>

      <template #[`cell:lastActive`]="{ row }">
        <span class="tabular-nums text-muted-foreground">
          {{ dateFormat.format((row as User).lastActive) }}
        </span>
      </template>

      <template #[`cell:actions`]="{ row }">
        <Button variant="ghost" size="sm" :aria-label="`Edit ${(row as User).name}`">Edit</Button>
      </template>

      <!--
        The filtered empty state, not the first-run one: the useful action here
        is undoing the filter, never "create your first user".
      -->
      <template #empty>
        <EmptyState
          :level="2"
          size="sm"
          announce
          title="No users match those filters"
          description="Try a different search, or widen the role and status filters."
        >
          <template #actions>
            <Button variant="ghost" size="sm" @click="clearFilters">Clear filters</Button>
          </template>
        </EmptyState>
      </template>
    </DataTable>

    <TablePagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :total="filtered.length"
      label="Users pagination"
    />
  </div>
</template>
