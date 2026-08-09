---
layout: home
---

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

**<NpmVersion /> is on npm.** Every component above is built, tested and published — you
are looking at them running. The API is stabilising toward v1.0, so breaking
changes are still possible until then.

## What this is not

A general-purpose UI kit. If you need forty components covering every case,
[Nuxt UI](https://ui.nuxt.com) and [shadcn-vue](https://www.shadcn-vue.com) are
better answers, and rowkit composes with either.

rowkit aims at the part those kits leave you: the fast sortable table, and the
loading, empty and filtered states that have to agree with each other. The scope
is a decision, not a limitation — what ships next, and what stays out on purpose,
is in [the roadmap](/roadmap).
