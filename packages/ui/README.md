# rowkit

[![npm](https://img.shields.io/npm/v/rowkit?color=3b5bdb)](https://www.npmjs.com/package/rowkit)
[![license](https://img.shields.io/npm/l/rowkit)](https://github.com/NikolaiKushner/rowkit/blob/main/LICENSE)

Vue 3 components for data-dense interfaces — tables, filters, and the states around them.

Twelve components, built on [Reka UI](https://reka-ui.com), typed against your row.

**[Documentation](https://rowkit.dev)** · **[Storybook](https://storybook.rowkit.dev)** · **[GitHub](https://github.com/NikolaiKushner/rowkit)**

![A rowkit DataTable being filtered, sorted and paged](https://raw.githubusercontent.com/NikolaiKushner/rowkit/main/docs/public/rowkit-demo.gif)

## Install

```bash
npm i rowkit
```

Then, in your stylesheet — **both lines, in this order**:

```css
@import 'tailwindcss';
@import 'rowkit/styles';
```

The second line is the step people miss. Tailwind does not scan `node_modules`, so without it every component renders unstyled, with nothing in the console. `vue` and `tailwindcss` are peer dependencies — rowkit uses the copies you already have.

Under Nuxt, wrap `<Toaster />` in `<ClientOnly>`. Nothing else needs special handling. Full setup, including troubleshooting, is at [rowkit.dev/installation](https://rowkit.dev/installation).

## Usage

```vue
<script setup lang="ts">
import { DataTable, Badge, useClientSort, type DataTableColumn } from 'rowkit'
import { ref } from 'vue'

interface User {
  id: number
  name: string
  role: string
  status: 'active' | 'invited' | 'suspended'
}

// `key` is constrained to keyof User — a renamed field is a compile error,
// not a column of blanks.
const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name', sortable: true, sticky: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'status', header: 'Status' },
]

const users = ref<User[]>([
  { id: 1, name: 'Ada Lovelace', role: 'Owner', status: 'active' },
  { id: 2, name: 'Grace Hopper', role: 'Admin', status: 'invited' },
])

const sort = ref()
const rows = useClientSort(users, sort, columns)
</script>

<template>
  <DataTable :rows="rows" :columns="columns" caption="Team members" v-model:sort="sort" hoverable>
    <template #[`cell:status`]="{ value }">
      <Badge :variant="value === 'active' ? 'success' : 'warning'" dot>{{ value }}</Badge>
    </template>
  </DataTable>
</template>
```

The table reports the sort and renders what it is handed — it never reorders its own rows, which is what keeps a server-paged table honest. `useClientSort` does the local case.

## What you get

- **Columns typed against your row.** `DataTable<TRow>` constrains every column's `key` to `keyof TRow`. Sorting names a field too, so a sort referring to a column that does not exist also fails to compile.
- **Accessibility as a build gate.** Focus traps, scroll lock, live regions and keyboard models come from Reka UI primitives. Every Storybook story is scanned by axe as part of the test run — a violation fails CI rather than filling a panel nobody opens.
- **Three states that agree.** `Skeleton`, `EmptyState` and the no-results case are designed together, because the bug is never one of them alone.
- **Tokens all the way down.** Every colour, space, radius and layer lives in [`@rowkit/tokens`](https://www.npmjs.com/package/@rowkit/tokens), installable on its own.
- **State you own.** Sort, selection, page and filters are all `v-model`. Components report what happened; your application decides what follows.

## The components

`Button` · `Field` · `Input` · `Select` · `Badge` · `DataTable` · `Pagination` · `FilterBar` · `EmptyState` · `Skeleton` · `Dialog` · `Toast` · `Tooltip`

That is the whole library. If you need forty components covering every case, [Nuxt UI](https://ui.nuxt.com) and [shadcn-vue](https://www.shadcn-vue.com) are better answers — and rowkit composes with either, since all three build on Reka UI.

## For coding agents

`AGENTS.md` ships inside this package. After installing, `node_modules/rowkit/AGENTS.md` describes every component's props, `v-model`s, events and slots — generated from the source, so it describes the version you installed.

## Status

**v0.x.** The API is stabilising toward v1.0 and breaking changes are still possible until then. Releases are cut from CI with provenance attestation. [Changelog](https://github.com/NikolaiKushner/rowkit/blob/main/packages/ui/CHANGELOG.md) · [Roadmap](https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md)

## License

MIT © Nikolai Kushner

Design language based on [shadcn/ui](https://ui.shadcn.com) by shadcn, adapted for Vue. shadcn/ui is MIT licensed; rowkit adopts its token values and class recipes, not its code.
