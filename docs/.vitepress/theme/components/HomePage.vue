<script setup lang="ts">
/**
 * Custom docs home — one composition: brand, one line, CTAs, live money shot.
 *
 * Replaces VitePress's stock hero/features so the first viewport reads as
 * rowkit, not as a generic VP landing with a feature-card grid.
 */
import { computed, ref } from 'vue'
import { useClientSort } from 'rowkit'
import type { DataTableColumn, DataTableSort, FilterChip } from 'rowkit'
import DemoBox from './DemoBox.vue'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'invited' | 'suspended'
  seats: number
  lastActive: string
}

const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'status', header: 'Status' },
  { key: 'seats', header: 'Seats', sortable: true, align: 'end' },
  { key: 'lastActive', header: 'Last active' },
]

const people: User[] = [
  {
    id: 1,
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    role: 'Owner',
    status: 'active',
    seats: 3,
    lastActive: '2 minutes ago',
  },
  {
    id: 2,
    name: 'Grace Hopper',
    email: 'grace@example.com',
    role: 'Admin',
    status: 'active',
    seats: 12,
    lastActive: '1 hour ago',
  },
  {
    id: 3,
    name: 'Barbara Liskov',
    email: 'barbara@example.com',
    role: 'Admin',
    status: 'active',
    seats: 7,
    lastActive: '20 minutes ago',
  },
  {
    id: 4,
    name: 'Alan Turing',
    email: 'alan@example.com',
    role: 'Member',
    status: 'invited',
    seats: 1,
    lastActive: 'never',
  },
  {
    id: 5,
    name: 'Katherine Johnson',
    email: 'katherine@example.com',
    role: 'Member',
    status: 'suspended',
    seats: 0,
    lastActive: '3 weeks ago',
  },
  {
    id: 6,
    name: 'Margaret Hamilton',
    email: 'margaret@example.com',
    role: 'Owner',
    status: 'active',
    seats: 24,
    lastActive: 'yesterday',
  },
]

const tone = {
  active: 'success',
  invited: 'warning',
  suspended: 'danger',
} as const

const roleOptions = [
  { label: 'Owner', value: 'Owner' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Member', value: 'Member' },
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Invited', value: 'invited' },
  { label: 'Suspended', value: 'suspended' },
]

const search = ref('')
const role = ref<string | undefined>('Admin')
const status = ref<string | undefined>()
const sort = ref<DataTableSort<User> | undefined>({ key: 'name', direction: 'asc' })
const selected = ref<number[]>([2])
const page = ref(1)
const pageSize = ref(5)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return people.filter((row) => {
    if (role.value && row.role !== role.value) return false
    if (status.value && row.status !== status.value) return false
    if (!q) return true
    return row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q)
  })
})

const chips = computed<FilterChip[]>(() => {
  const out: FilterChip[] = []
  if (role.value) out.push({ id: 'role', label: 'Role', value: role.value })
  if (status.value) out.push({ id: 'status', label: 'Status', value: status.value })
  return out
})

const sorted = useClientSort(filtered, sort, columns)

const pageRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sorted.value.slice(start, start + pageSize.value)
})

function removeFilter(id: string) {
  if (id === 'role') role.value = undefined
  if (id === 'status') status.value = undefined
}

function clearFilters() {
  search.value = ''
  role.value = undefined
  status.value = undefined
}
</script>

<template>
  <section class="rk-home" data-rk-home>
    <div class="rk-home__intro">
      <p class="rk-home__brand">
        <img src="/mark.svg" alt="" width="48" height="48" class="rk-home__mark" />
        <span class="rk-home__wordmark">rowkit</span>
      </p>

      <h1 class="rk-home__headline">Components for data-dense interfaces</h1>
      <p class="rk-home__lede">
        Vue&nbsp;3 tables, filters, and the states around them — built on Reka&nbsp;UI, typed
        against your row.
      </p>

      <div class="rk-home__actions">
        <a class="rk-home__cta rk-home__cta--brand" href="/installation">Get started</a>
        <a class="rk-home__cta rk-home__cta--alt" href="/components/data-table">Components</a>
      </div>
    </div>

    <div class="rk-home__preview" data-rk-home-preview>
      <DemoBox layout="stack">
        <div class="flex w-full flex-col gap-3">
          <header class="flex flex-wrap items-end justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Workspace
              </p>
              <h2 class="mt-1 text-xl font-medium tracking-tight text-foreground">Users</h2>
              <p class="mt-1 text-sm text-muted-foreground">
                {{ filtered.length }} people with access to this workspace.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="outline">Export</Button>
              <Button>Invite teammate</Button>
            </div>
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

          <div
            v-if="selected.length > 0"
            class="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-muted px-3 py-1.5"
          >
            <p class="text-sm font-medium text-foreground">{{ selected.length }} selected</p>
            <div class="flex items-center gap-2">
              <Button variant="ghost" size="sm" @click="selected = []">Clear</Button>
              <Button variant="destructive" size="sm">Suspend</Button>
            </div>
          </div>

          <DataTable
            v-model:sort="sort"
            v-model:selected="selected"
            :rows="pageRows"
            :columns="columns"
            caption="Users"
            selectable="multiple"
            :row-label="(row) => 'Select ' + row.name"
            hoverable
          >
            <template #[`cell:name`]="{ row }">
              <span class="font-medium text-foreground">{{ row.name }}</span>
            </template>
            <template #[`cell:email`]="{ row }">
              <span class="block max-w-[12rem] truncate text-muted-foreground">{{
                row.email
              }}</span>
            </template>
            <template #[`cell:status`]="{ row }">
              <Badge :variant="tone[row.status]" size="sm" dot>{{ row.status }}</Badge>
            </template>
            <template #[`cell:seats`]="{ value }">
              <span class="tabular-nums">{{ value }}</span>
            </template>
            <template #[`cell:lastActive`]="{ value }">
              <span class="tabular-nums text-muted-foreground">{{ value }}</span>
            </template>
          </DataTable>

          <Pagination
            v-model:page="page"
            v-model:page-size="pageSize"
            :total="filtered.length"
            :page-size-options="[5, 10]"
            label="Users pagination"
          />
        </div>
      </DemoBox>
    </div>

    <ul class="rk-home__points">
      <li>
        <strong>Columns typed against your row.</strong>
        <span>
          <code>key</code> is <code>keyof TRow</code> — a renamed field is a compile error, not a
          column of blanks.
        </span>
      </li>
      <li>
        <strong>Built on Reka UI.</strong>
        <span>
          Focus traps, scroll lock, and keyboard models from the primitives. axe is a build gate,
          not a panel.
        </span>
      </li>
      <li>
        <strong>Token-first theming.</strong>
        <span>
          Colour, space, radius, and layer — every value is a token. This site is styled from the
          same package.
        </span>
      </li>
    </ul>
  </section>
</template>
