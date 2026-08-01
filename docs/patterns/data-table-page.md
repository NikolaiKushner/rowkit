# A data table page

Filter bar, table, pagination, and the empty states — wired the way a
server-backed page actually works. This is the pattern rowkit exists for; every
component below is doing one job, and the composition is where the decisions
live.

<script setup>
import { computed, ref, watch } from 'vue'
import { compareSortable } from 'rowkit'

const roles = ['Owner', 'Admin', 'Member', 'Billing']
const statuses = ['active', 'invited', 'suspended']
const firstNames = ['Ada', 'Grace', 'Alan', 'Katherine', 'Barbara', 'Edsger', 'Margaret', 'Donald', 'Radia', 'Tim']
const lastNames = ['Lovelace', 'Hopper', 'Turing', 'Johnson', 'Liskov', 'Dijkstra', 'Hamilton', 'Knuth', 'Perlman', 'Berners-Lee']

// Deterministic, so the page renders the same on the server and after hydration.
const allUsers = Array.from({ length: 137 }, (_, i) => {
  const first = firstNames[i % firstNames.length]
  const last = lastNames[(i * 3) % lastNames.length]
  return {
    id: i + 1,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, '')}${i}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    seats: (i * 7) % 24,
  }
})

const roleOptions = roles.map((role) => ({ label: role, value: role }))
const statusOptions = statuses.map((s) => ({ label: s[0].toUpperCase() + s.slice(1), value: s }))

const search = ref('')
const role = ref()
const status = ref()
const sort = ref()
const page = ref(1)
const pageSize = ref(10)
const selected = ref([])

const columns = [
  { key: 'name', header: 'Name', sortable: true, sticky: true, width: '14rem' },
  { key: 'email', header: 'Email', sortable: true, width: '20rem' },
  { key: 'role', header: 'Role', sortable: true, width: '8rem' },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: '9rem',
    sortValue: (row) => ({ active: 0, invited: 1, suspended: 2 })[row.status],
  },
  { key: 'seats', header: 'Seats', sortable: true, align: 'end', width: '7rem' },
]

const tone = { active: 'success', invited: 'warning', suspended: 'danger' }

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return allUsers.filter((user) => {
    if (role.value && user.role !== role.value) return false
    if (status.value && user.status !== status.value) return false
    if (!term) return true
    return user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
  })
})

const sorted = computed(() => {
  if (!sort.value) return filtered.value
  const column = columns.find((c) => c.key === sort.value.key)
  if (!column) return filtered.value
  const valueOf = (row) => (column.sortValue ? column.sortValue(row) : row[column.key])
  return [...filtered.value].sort((a, b) => compareSortable(valueOf(a), valueOf(b), sort.value.direction))
})

const pageRows = computed(() =>
  sorted.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
)

const chips = computed(() => {
  const applied = []
  if (search.value.trim()) applied.push({ id: 'search', label: 'Search', value: search.value })
  if (role.value) applied.push({ id: 'role', label: 'Role', value: role.value })
  if (status.value) {
    applied.push({
      id: 'status',
      label: 'Status',
      value: statusOptions.find((o) => o.value === status.value)?.label,
    })
  }
  return applied
})

function removeFilter(id) {
  if (id === 'search') search.value = ''
  if (id === 'role') role.value = undefined
  if (id === 'status') status.value = undefined
}

function clearFilters() {
  search.value = ''
  role.value = undefined
  status.value = undefined
}

// The application resets the page, not the components.
watch([search, role, status, sort, pageSize], () => {
  page.value = 1
})
</script>

<!-- prettier-ignore -->
<DemoBox layout="stack">
  <FilterBar v-model:search="search" :filters="chips" :result-count="filtered.length" label="Filter users" searchable search-placeholder="Search name or email" @remove="removeFilter" @clear="clearFilters">
    <template #controls>
      <Field label="Role" label-sr-only><Select v-model="role" :options="roleOptions" placeholder="Role" class="min-w-36" /></Field>
      <Field label="Status" label-sr-only><Select v-model="status" :options="statusOptions" placeholder="Status" class="min-w-36" /></Field>
    </template>
  </FilterBar>
  <DataTable :rows="pageRows" :columns="columns" caption="Users" selectable="multiple" :row-label="(row) => `Select ${row.name}`" v-model:sort="sort" v-model:selected="selected" hoverable>
    <template #[`cell:status`]="{ row }"><Badge :variant="tone[row.status]" size="sm" dot>{{ row.status }}</Badge></template>
    <template #empty>
      <EmptyState reason="no-results" title="No users match these filters" size="sm" :level="3" announce>
        <template #actions><Button variant="secondary" size="sm" @click="clearFilters">Clear filters</Button></template>
      </EmptyState>
    </template>
  </DataTable>
  <TablePagination v-model:page="page" v-model:page-size="pageSize" :total="filtered.length" label="Users pagination" />
</DemoBox>

Search for a name, narrow by role, sort a column, page through. Then filter down
to nothing and watch the empty state — it says the filter matched nothing, not
that you have no users.

## The code

```vue
<script setup lang="ts">
import {
  Badge, Button, DataTable, EmptyState, FilterBar, Field, Select, TablePagination,
  compareSortable,
  type DataTableColumn, type DataTableSort, type FilterChip,
} from 'rowkit'
import { computed, ref, watch } from 'vue'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'invited' | 'suspended'
  seats: number
}

const search = ref('')
const role = ref<string>()
const status = ref<string>()
const sort = ref<DataTableSort<User>>()
const page = ref(1)
const pageSize = ref(10)
const selected = ref<User['id'][]>([])

const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name', sortable: true, sticky: true, width: '14rem' },
  { key: 'email', header: 'Email', sortable: true, width: '20rem' },
  { key: 'role', header: 'Role', sortable: true, width: '8rem' },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: '9rem',
    sortValue: (row) => ({ active: 0, invited: 1, suspended: 2 })[row.status],
  },
  { key: 'seats', header: 'Seats', sortable: true, align: 'end', width: '7rem' },
]

// Whatever your data source is, it answers these four questions.
const filtered = computed(() => /* search + role + status */)
const sorted = computed(() => /* compareSortable, using column.sortValue */)
const pageRows = computed(() =>
  sorted.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
)

const chips = computed<FilterChip[]>(() => [
  ...(search.value ? [{ id: 'search', label: 'Search', value: search.value }] : []),
  ...(role.value ? [{ id: 'role', label: 'Role', value: role.value }] : []),
  ...(status.value ? [{ id: 'status', label: 'Status', value: status.value }] : []),
])

function removeFilter(id: string) {
  if (id === 'search') search.value = ''
  if (id === 'role') role.value = undefined
  if (id === 'status') status.value = undefined
}

watch([search, role, status, sort, pageSize], () => {
  page.value = 1
})
</script>
```

The template is the demo above, verbatim.

## Why it is wired this way

**The page resets the page number, not the components.** `TablePagination` never
moves the page on its own — not when the page size changes, not when the filters
narrow. That watcher is four lines and it belongs to you, because the right
answer differs: a filter change should land on page 1, while a page-size change
in a long audit log might reasonably keep the user near the row they were
reading. A component cannot know which you meant, so it reports and you decide.

Without the watcher the failure is quiet and nasty: filter 137 users down to 3
while sitting on page 9, and the table renders empty with pagination insisting
there are nine pages.

**Sorting happens outside the table.** `DataTable` renders what it is handed and
reports what was clicked; it never reorders its own rows. That is not a
limitation, it is the only correct default for a paged table — sorting inside the
table would reorder the ten rows on screen and present them as if they were the
top ten of 137. Swap `sorted` for a server call and nothing else on the page
changes.

**`sortValue` exists for statuses.** Sorted alphabetically, `invited` falls
between `active` and `suspended`, which is meaningless. Mapping the three to
`0 | 1 | 2` sorts them by severity, which is what someone clicking that header
wants.

**The empty state knows why it is empty.** `reason="no-results"` changes the copy
and the action — clear the filters, rather than create your first user. Offering
"create a user" to an admin with 137 of them and a bad filter is the failure the
prop exists to prevent. `announce` is on because the table had rows a moment ago
and a screen reader user gets no other signal that the filter did anything.

**Chip ids name the filter, not its value.** `'role'`, never `'role-admin'`. The
value changes as the user picks a different one; the identity must not, because
`@remove` hands that id back and the handler switches on it.

**Every filter control has a label.** `labelSrOnly` keeps the toolbar visually
clean without taking the name away. A placeholder is not a label — it disappears
the moment a value is chosen, which is exactly when someone asks what the control
is.

## Making it server-backed

Replace the three computeds with a request and change nothing else:

```ts
const { data } = await useFetch('/api/users', {
  query: computed(() => ({
    q: search.value,
    role: role.value,
    status: status.value,
    sort: sort.value?.key,
    direction: sort.value?.direction,
    page: page.value,
    pageSize: pageSize.value,
  })),
})

const pageRows = computed(() => data.value?.rows ?? [])
const total = computed(() => data.value?.total ?? 0)
```

That substitution being this small is the point of every "the consumer owns
state" decision in [the conventions](/conventions). The components never knew
where the rows came from.

Add `:loading="pending"` to the table and it renders placeholder rows in the real
column layout while the request is in flight — see
[loading states](/patterns/loading-states) for when that helps and when it makes
things worse.
