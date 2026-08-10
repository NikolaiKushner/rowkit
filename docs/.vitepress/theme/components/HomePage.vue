<script setup lang="ts">
/**
 * Custom docs home — one composition: brand, one line, CTAs, live money shot.
 *
 * Replaces VitePress's stock hero/features so the first viewport reads as
 * rowkit, not as a generic VP landing with a feature-card grid.
 */
import { computed, ref, watch } from 'vue'
import { useClientSort } from 'rowkit'
import type { DataTableColumn, DataTableSort, FilterChip } from 'rowkit'
import DemoBox from './DemoBox.vue'
import { homeUsers, type HomeUser as User } from './home-users'

const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'status', header: 'Status' },
  { key: 'seats', header: 'Seats', sortable: true, align: 'end' },
  { key: 'lastActive', header: 'Last active' },
]

const people: User[] = homeUsers

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
const role = ref<string | undefined>()
// Seeded so the hero shows a chip without cutting the roster down to one page.
const status = ref<string | undefined>('active')
const sort = ref<DataTableSort<User> | undefined>({ key: 'name', direction: 'asc' })
// Ada Lovelace and Alan Turing — both on page one under the seeded name sort,
// so the selection the footer counts is a selection you can actually see.
const selected = ref<number[]>([1, 3])
const page = ref(1)
const pageSize = ref(10)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return people.filter((row) => {
    if (role.value && row.role !== role.value) return false
    if (status.value && row.status !== status.value) return false
    if (!q) return true
    return row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q)
  })
})

/*
 * Narrowing the roster returns to page 1.
 *
 * `Pagination` never does this itself — it reports what the user asked for and
 * leaves the follow-on decision to the application, which is the convention
 * this site documents. So the application makes it: without this, filtering
 * from 70 rows down to 3 while on page 3 leaves a correct component rendering
 * an empty table.
 */
watch([search, role, status], () => {
  page.value = 1
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
              <span class="block max-w-[15rem] truncate text-muted-foreground">{{
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

          <!--
            Bulk actions sit *below* the table, not between the filters and it.
            Above, every tick of a checkbox inserted or removed a band and shoved
            the table down or up under the cursor — the row you were aiming at
            moved because you selected the one before it. Below, the table never
            moves; only the footer does.
          -->
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

          <Pagination
            v-model:page="page"
            v-model:page-size="pageSize"
            :total="filtered.length"
            :page-size-options="[10, 25, 50]"
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
