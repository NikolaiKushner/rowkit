# rowkit

[![npm](https://img.shields.io/npm/v/rowkit?color=3b5bdb)](https://www.npmjs.com/package/rowkit)
[![license](https://img.shields.io/npm/l/rowkit)](./LICENSE)
[![bundle size](https://img.shields.io/bundlejs/size/rowkit)](https://bundlejs.com/?q=rowkit)

Vue 3 components for data-dense interfaces — tables, filters, and the states around them.

Twelve components, built on [Reka UI](https://reka-ui.com), typed against your row.

**[Documentation](https://rowkit.dev)** · **[Storybook](https://storybook.rowkit.dev)** · **[Roadmap](./ROADMAP.md)**

<!--
  Absolute URL on purpose. npm does not resolve relative image paths against the
  repository, so a relative one renders here and shows nothing on the package
  page — which is the surface this image exists for.
-->

![A rowkit DataTable being filtered, sorted and paged](https://raw.githubusercontent.com/NikolaiKushner/rowkit/main/docs/public/rowkit-demo.gif)

## Why another component library

General-purpose kits handle the easy eighty per cent extremely well — buttons, inputs, cards. Then you build a users admin page, and none of it helped with the part that actually took the week: a sortable table that stays fast at ten thousand rows with column keys typed against your row, a filter bar that makes applied state obvious, and loading, empty and no-results states that agree with each other.

rowkit is that part, done once.

## Install

```bash
npm i rowkit
```

Then, in your stylesheet — **both lines, in this order**:

```css
@import 'tailwindcss';
@import 'rowkit/styles';
```

The second line is the step people miss. Tailwind does not scan `node_modules`, so without it every component renders unstyled, with nothing in the console. `vue` and `tailwindcss` are peer dependencies.

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
- **Tokens all the way down.** Every colour, space, radius and layer lives in [`@rowkit/tokens`](./packages/tokens), installable on its own. Contrast pairings are asserted in tests, not eyeballed.
- **State you own.** Sort, selection, page and filters are all `v-model`. Components report what happened; your application decides what follows.

## What rowkit is not

A general-purpose UI kit. If you need forty components covering every case, [Nuxt UI](https://ui.nuxt.com) and [shadcn-vue](https://www.shadcn-vue.com) are better answers — and rowkit composes with either, since all three build on Reka UI. The scope is a decision, not a limitation; the full list, including what was deliberately left out, is in [ROADMAP.md](./ROADMAP.md).

## For coding agents

`AGENTS.md` ships inside the package. After installing, `node_modules/rowkit/AGENTS.md` describes every component's props, `v-model`s, events and slots — generated from the source, so it describes the version you installed.

## Status

**v0.x.** The API is stabilising toward v1.0 and breaking changes are still possible until then. Releases are cut from CI with provenance attestation, and the changelog is [changesets](https://github.com/changesets/changesets)-driven: [rowkit](./packages/ui/CHANGELOG.md) · [@rowkit/tokens](./packages/tokens/CHANGELOG.md).

## Contributing

See [docs/contributing](https://rowkit.dev/contributing) for setup, the definition of done, and the changeset requirement.

```bash
pnpm install
pnpm build        # run first — workspace packages resolve through dist
pnpm dev          # playground app
pnpm storybook    # component workshop
pnpm test         # unit, component and browser tests
pnpm docs:dev     # documentation site
```

## License

MIT © Nikolai Kushner

Design language based on [shadcn/ui](https://ui.shadcn.com) by shadcn, adapted for Vue. shadcn/ui is MIT licensed; rowkit adopts its token values and class recipes, not its code.
