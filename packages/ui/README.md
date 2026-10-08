# rowkit

[![npm](https://img.shields.io/npm/v/rowkit/beta?color=D63A1F)](https://www.npmjs.com/package/rowkit)
[![license](https://img.shields.io/npm/l/rowkit)](https://github.com/NikolaiKushner/rowkit/blob/main/LICENSE)

A professional Vue 3 toolkit — the components a product interface is built from.

No behaviour library underneath — focus, dismissal and positioning are rowkit's own. What is published is the part already finished; the rest of the set is the plan in the [roadmap](https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md).

**[Documentation](https://rowkit.dev)** · **[Storybook](https://storybook.rowkit.dev)** · **[GitHub](https://github.com/NikolaiKushner/rowkit)**

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/NikolaiKushner/rowkit/main/docs/public/readme/hero-dark.png" />
    <img src="https://raw.githubusercontent.com/NikolaiKushner/rowkit/main/docs/public/readme/hero.png" alt="rowkit — the same Users table in Windows 98, modern light, modern dark and a theme of your own, under the rowkit logo" width="100%" />
  </picture>
</p>

## Install

```bash
npm i rowkit@beta
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
  <DataTable :rows="rows" :columns="columns" caption="Team members" v-model:sort="sort">
    <template #[`cell:status`]="{ value }">
      <Badge :variant="value === 'active' ? 'success' : 'warning'" dot>{{ value }}</Badge>
    </template>
  </DataTable>
</template>
```

The table reports the sort and renders what it is handed — it never reorders its own rows, which is what keeps a server-paged table honest. `useClientSort` does the local case.

## Themes

Two themes from one set of components: **Windows 98**, the default, and **modern**, in light and dark. A theme is token values and nothing else — the same components, the same props, the same markup, one attribute apart.

```html
<html data-theme="modern" data-color-scheme="dark"></html>
```

`data-theme` works on any element, and themes nest. Without `data-color-scheme` the modern theme follows the system's light or dark setting. Every colour, size, corner, shadow and state is a token, so the look is yours to change — adjust a few variables, or define a complete theme of your own, light and dark, in one call:

```ts
import { defineTheme } from '@rowkit/tokens'

export const acme = defineTheme({
  name: 'acme', // <html data-theme="acme">
  extends: 'modern',
  light: { '--color-control-primary': '#5b3df5', '--radius-md': '10px' },
})
```

How it works, every value you can change, and a live builder: [Themes](https://rowkit.dev/foundations/themes).

## What you get

- **Columns typed against your row.** `DataTable<TRow>` constrains every column's `key` to `keyof TRow`. Sorting names a field too, so a sort referring to a column that does not exist also fails to compile.
- **Accessibility as a build gate.** Focus traps, scroll lock, live regions and keyboard models live in shared primitives with their own interaction tests. Every Storybook story is scanned by axe as part of the test run — a violation fails CI rather than filling a panel nobody opens.
- **Three states that agree.** `Skeleton`, `EmptyState` and the no-results case are designed together, because the bug is never one of them alone.
- **Tokens all the way down.** Every colour, space, radius and layer lives in [`@rowkit/tokens`](https://www.npmjs.com/package/@rowkit/tokens), installable on its own.
- **State you own.** Sort, selection, page and filters are all `v-model`. Components report what happened; your application decides what follows.

## The components

- **Foundations:** `Button` · `ButtonGroup` · `Separator` · `Window` · `GroupBox` · `StatusBar` · `ProgressBar` · `ScrollArea`
- **Forms:** `Field` · `Input` · `Select` · `Checkbox` · `Radio` · `Badge`
- **Data:** `DataTable` · `Pagination` · `FilterBar` · `EmptyState` · `Skeleton`
- **Overlays:** `Dialog` · `Toast` · `Tooltip`
- **Icons:** the Windows 98 pixel set, 42 icons at 8, 16 and 32px. The modern theme draws its own outline glyph over each one.

That is what is published today. Menus, dates, sheets, a command palette and the rest of a product interface are not in this release yet — they are the plan in the [roadmap](https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md), built to the same standard before they ship.

## For coding agents

`AGENTS.md` ships inside this package. After installing, `node_modules/rowkit/AGENTS.md` describes every component's props, `v-model`s, events and slots — generated from the source, so it describes the version you installed.

## Status

**1.0 beta**, published under the npm `beta` tag. The API is stabilising toward 1.0.0 and breaking changes are still possible between betas. Releases are cut from CI with provenance attestation. [Changelog](https://github.com/NikolaiKushner/rowkit/blob/main/packages/ui/CHANGELOG.md) · [Roadmap](https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md)

## License

MIT © Nikolai Kushner

The Windows 98 theme is rowkit's own drawing of the Windows 98 interface, from its Figma file. rowkit is not affiliated with Microsoft and ships no Microsoft artwork — no Windows flag, no logos.
