# rowkit

<p align="center">
  <img src="docs/public/logo.svg" alt="rowkit" width="200" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/rowkit"><img src="https://img.shields.io/npm/v/rowkit?color=0c335f" alt="npm" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/rowkit" alt="license" /></a>
  <a href="https://bundlejs.com/?q=rowkit"><img src="https://img.shields.io/bundlejs/size/rowkit" alt="bundle size" /></a>
</p>

A professional Vue 3 toolkit — the components a product interface is built from. Built on [Reka UI](https://reka-ui.com).

**[Documentation](https://rowkit.dev)** · **[Storybook](https://storybook.rowkit.dev)** · **[Roadmap](./ROADMAP.md)**

<!--
  Absolute URL on purpose. npm does not resolve relative image paths against the
  repository, so a relative one renders here and shows nothing on the package
  page — which is the surface this image exists for.
-->

![rowkit docs homepage — brand, CTAs, and a live Users table](https://raw.githubusercontent.com/NikolaiKushner/rowkit/main/docs/public/home.png)

## Why another component library

A product interface is a set of components that have to agree: controls, overlays, tables, filters, empty and loading states. rowkit is that set, built as one toolkit — typed, on Reka UI, from one token package. What is published today is the part already finished. The rest of the set is the plan in the [roadmap](./ROADMAP.md), not a second library to go and find.

![A filtered, sorted Users table with selection — the rowkit money shot](https://raw.githubusercontent.com/NikolaiKushner/rowkit/main/docs/public/datatable-page.png)

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

## Where this is going

The published components are the start of a professional toolkit, not a specialist for tables. The full set — menus, dates, overlays, and the rest a product interface needs — is planned in the [roadmap](./ROADMAP.md). It is not being built ahead of that plan.

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
pnpm docs:shots   # refresh README homepage screenshots (docs:dev must be running)
```

## License

MIT © Nikolai Kushner

Design language based on [shadcn/ui](https://ui.shadcn.com) by shadcn, adapted for Vue. shadcn/ui is MIT licensed; rowkit adopts its token values and class recipes, not its code.
