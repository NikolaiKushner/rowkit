# rowkit

<!--
  Absolute URLs on purpose. npm does not resolve relative image paths against the
  repository, so a relative one renders here and shows nothing on the package
  page — which is the surface these images exist for.
-->

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/NikolaiKushner/rowkit/main/docs/public/readme/hero-dark.png" />
    <img src="https://raw.githubusercontent.com/NikolaiKushner/rowkit/main/docs/public/readme/hero.png" alt="rowkit — the same Users table in Windows 98, modern light, modern dark and a theme of your own, under the rowkit logo" width="100%" />
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/rowkit"><img src="https://img.shields.io/npm/v/rowkit/beta?color=D63A1F" alt="npm" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/rowkit" alt="license" /></a>
  <a href="https://bundlejs.com/?q=rowkit"><img src="https://img.shields.io/bundlejs/size/rowkit" alt="bundle size" /></a>
</p>

A professional Vue 3 toolkit — the components a product interface is built from.

**[Documentation](https://rowkit.dev)** · **[Storybook](https://storybook.rowkit.dev)** · **[Roadmap](./ROADMAP.md)**

## Why another component library

A product interface is a set of components that have to agree: controls, overlays, tables, filters, empty and loading states. rowkit is that set, built as one toolkit — typed, with its own behaviour layer, from one token package. What is published today is the part already finished. The rest of the set is the plan in the [roadmap](./ROADMAP.md), not a second library to go and find.

![DataTable side by side in Windows 98 and the modern theme: the live demo on rowkit.dev — a toolbar, a FilterBar with one chip, a sorted table with a selected row and status badges, and Pagination in the status bar](https://raw.githubusercontent.com/NikolaiKushner/rowkit/main/docs/public/readme/datatable.png)

## What it looks like

rowkit ships two themes from one set of components: **Windows 98**, the default, and **modern**, in light and dark. A theme is token values and nothing else — the same table, the same markup, one attribute apart.

![The rowkit.dev desktop switching from Windows 98 to the modern theme, light and then dark: the same Users table, About window and install command in each](https://raw.githubusercontent.com/NikolaiKushner/rowkit/main/docs/public/readme/themes.gif)

```html
<html data-theme="modern" data-color-scheme="dark">
```

Every colour, size, corner, shadow and state is a token — the bevels and the dotted focus ring of Windows 98 included — so the look is yours to change. Adjust a few variables for your brand, or define a complete theme of your own, light and dark, in one call:

```ts
import { defineTheme } from '@rowkit/tokens'

export const acme = defineTheme({
  name: 'acme', // <html data-theme="acme">
  extends: 'modern',
  light: { '--color-control-primary': '#5b3df5', '--radius-md': '10px' },
})
```

How it works, every value you can change, and a live builder: [Themes](https://rowkit.dev/foundations/themes). The modern theme's values are a draft until its Figma file is drawn.

![The same components in Windows 98 and the modern theme: buttons and a button group, inputs and a select, badges, checkboxes and radios, pagination with a progress bar and a status bar, and a field with an error](https://raw.githubusercontent.com/NikolaiKushner/rowkit/main/docs/public/readme/components.png)

The docs at [rowkit.dev](https://rowkit.dev) switch with it: in Windows 98 every page opens in an Explorer window, folder tree on the left; in the modern theme the site is a modern desktop, with a menu bar, a Dock and Finder-style windows. [`?theme=modern`](https://rowkit.dev/?theme=modern) opens it that way.

![rowkit.dev in Windows 98 and the modern theme: the DataTable page with the folder tree and a live example, as an Explorer window and as a Finder window](https://raw.githubusercontent.com/NikolaiKushner/rowkit/main/docs/public/readme/docs.png)

## Install

```bash
npm i rowkit@beta
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
  <DataTable :rows="rows" :columns="columns" caption="Team members" v-model:sort="sort">
    <template #[`cell:status`]="{ value }">
      <Badge :variant="value === 'active' ? 'success' : 'warning'" dot>{{ value }}</Badge>
    </template>
  </DataTable>
</template>
```

The table reports the sort and renders what it is handed — it never reorders its own rows, which is what keeps a server-paged table honest. `useClientSort` does the local case.

## What you get

- **Columns typed against your row.** `DataTable<TRow>` constrains every column's `key` to `keyof TRow`. Sorting names a field too, so a sort referring to a column that does not exist also fails to compile.
- **Accessibility as a build gate.** Focus traps, scroll lock, live regions and keyboard models are rowkit's own — platform features where they are good enough, otherwise its own primitives, each covered by interaction tests. Every Storybook story is scanned by axe as part of the test run — a violation fails CI rather than filling a panel nobody opens.
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
```

## License

MIT © Nikolai Kushner

The look is rowkit's own drawing of the Windows 98 interface, from its Figma file. rowkit is not affiliated with Microsoft and ships no Microsoft artwork — no Windows flag, no logos.
