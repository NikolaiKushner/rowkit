---
layout: home

hero:
  name: rowkit
  text: Components for data-dense interfaces
  tagline: Vue 3 components for tables, filters, and the states around them. Twelve of them, built on Reka UI, typed against your row.
  actions:
    - theme: brand
      text: Get started
      link: /installation
    - theme: alt
      text: Components
      link: /components/data-table
    - theme: alt
      text: GitHub
      link: https://github.com/NikolaiKushner/rowkit

features:
  - title: Columns typed against your row
    details: >
      `key` is constrained to `keyof TRow`, so a renamed field is a compile
      error rather than a column of blanks. Sorting names a field too.
  - title: Built on Reka UI
    details: >
      Focus traps, scroll lock, live regions and keyboard models come from the
      primitives. Every story is scanned by axe as a build gate, not a panel.
  - title: Token-first theming
    details: >
      Every colour, space, radius and layer is a token. Dark mode overrides the
      semantic layer only — this site is styled from the same package.
---

<script setup>
import { ref } from 'vue'
import { useClientSort } from 'rowkit'

const columns = [
  { key: 'name', header: 'Name', sortable: true, sticky: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'team', header: 'Team', sortable: true },
  { key: 'status', header: 'Status' },
  { key: 'lastActive', header: 'Last active', sortable: true },
  { key: 'seats', header: 'Seats', sortable: true, align: 'end' },
]

const people = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', role: 'Owner', team: 'Platform', status: 'active', lastActive: '2 minutes ago', seats: 3 },
  { id: 2, name: 'Grace Hopper', email: 'grace@example.com', role: 'Admin', team: 'Platform', status: 'active', lastActive: '1 hour ago', seats: 12 },
  { id: 3, name: 'Alan Turing', email: 'alan@example.com', role: 'Member', team: 'Research', status: 'invited', lastActive: 'never', seats: 1 },
  { id: 4, name: 'Katherine Johnson', email: 'katherine@example.com', role: 'Member', team: 'Research', status: 'suspended', lastActive: '3 weeks ago', seats: 0 },
  { id: 5, name: 'Barbara Liskov', email: 'barbara@example.com', role: 'Admin', team: 'Research', status: 'active', lastActive: '20 minutes ago', seats: 7 },
  { id: 6, name: 'Margaret Hamilton', email: 'margaret@example.com', role: 'Owner', team: 'Flight', status: 'active', lastActive: 'yesterday', seats: 24 },
  { id: 7, name: 'Radia Perlman', email: 'radia@example.com', role: 'Member', team: 'Networking', status: 'active', lastActive: '4 days ago', seats: 2 },
  { id: 8, name: 'Shafi Goldwasser', email: 'shafi@example.com', role: 'Member', team: 'Research', status: 'invited', lastActive: 'never', seats: 1 },
  { id: 9, name: 'Frances Allen', email: 'frances@example.com', role: 'Admin', team: 'Compilers', status: 'active', lastActive: '6 hours ago', seats: 9 },
  { id: 10, name: 'Jean Bartik', email: 'jean@example.com', role: 'Member', team: 'Flight', status: 'suspended', lastActive: '2 months ago', seats: 0 },
]

const tone = { active: 'success', invited: 'warning', suspended: 'danger' }

const sort = ref()
const selected = ref([])
const rows = useClientSort(people, sort, columns)
</script>

## See it work

Sort a column. Select some rows. This is the real component, not a screenshot.

<DemoBox layout="stack" full>
  <DataTable
    :rows="rows"
    :columns="columns"
    caption="Team members"
    selectable="multiple"
    :row-label="(row) => `Select ${row.name}`"
    v-model:sort="sort"
    v-model:selected="selected"
    hoverable
  >
    <template #[`cell:status`]="{ row }">
      <Badge :variant="tone[row.status]" size="sm" dot>{{ row.status }}</Badge>
    </template>
  </DataTable>
  <p class="!my-0 text-sm text-text-muted">
    {{ selected.length }} selected ·
    {{ sort ? `sorted by ${sort.key}, ${sort.direction}` : 'unsorted' }}
  </p>
</DemoBox>

The table reports the sort and renders what it is handed — it never reorders its
own rows. That keeps a server-paged table honest, and
[`useClientSort`](/components/data-table#sorting) does the local case, which is
what this demo uses.

## Install

```bash
pnpm add rowkit
```

```css
@import 'tailwindcss';
@import 'rowkit/styles';
```

Both lines are required, and that second one is the step people miss — see
[installation](/installation) for why, and for the Nuxt path.

**v0.x, and not on npm yet.** The name is reserved and publishing is the last
phase of the plan, so that first command does not resolve today. Every component
above is built and tested — you are looking at them running — but the API can
still change before v1.0.

## What this is not

A general-purpose UI kit. If you need forty components covering every case,
[Nuxt UI](https://ui.nuxt.com) and [shadcn-vue](https://www.shadcn-vue.com) are
better answers, and rowkit composes with either.

Twelve components, aimed at the part those kits leave you: the fast sortable
table, and the loading, empty and filtered states that have to agree with each
other. The scope is a decision, not a limitation — the full list, including what
was deliberately left out, is in
[the roadmap](https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md).
