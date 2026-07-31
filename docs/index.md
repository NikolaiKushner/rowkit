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
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'status', header: 'Status' },
  { key: 'seats', header: 'Seats', sortable: true, align: 'end' },
]

const people = [
  { id: 1, name: 'Ada Lovelace', role: 'Owner', status: 'active', seats: 3 },
  { id: 2, name: 'Grace Hopper', role: 'Admin', status: 'active', seats: 12 },
  { id: 3, name: 'Alan Turing', role: 'Member', status: 'invited', seats: 1 },
  { id: 4, name: 'Katherine Johnson', role: 'Member', status: 'suspended', seats: 0 },
]

const tone = { active: 'success', invited: 'warning', suspended: 'danger' }

const sort = ref()
const selected = ref([])
const rows = useClientSort(people, sort, columns)
</script>

## See it work

Sort a column. Select some rows. This is the real component, not a screenshot.

<DemoBox layout="stack">
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

## What this is not

A general-purpose UI kit. If you need forty components covering every case,
[Nuxt UI](https://ui.nuxt.com) and [shadcn-vue](https://www.shadcn-vue.com) are
better answers, and rowkit composes with either.

Twelve components, aimed at the part those kits leave you: the fast sortable
table, and the loading, empty and filtered states that have to agree with each
other. The scope is a decision, not a limitation — the full list, including what
was deliberately left out, is in
[the roadmap](https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md).
