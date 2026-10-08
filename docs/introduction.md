# Introduction

rowkit is a professional Vue 3 toolkit: the components a product interface is
built from. What is published today — tables, filters, controls, overlays — is
the part already built. The rest of the set is the plan in
[the roadmap](/roadmap), not a build in progress.

## The problem it exists for

A product interface is one system. Controls, menus, overlays, tables, filters,
and the empty and loading states around them have to agree on type, keyboard
behaviour and tokens. Split across kits, they don't.

rowkit is that system:

- A sortable table with column keys typed against your row, so a renamed field
  is a compile error rather than a column of blanks
- A filter bar that makes the applied state obvious, and gives back focus
  somewhere sensible when a filter is removed
- Loading, empty, and no-results states that agree with each other — three
  screens that look nearly identical and mean completely different things
- And, in the plan, the rest of the components a product is built from: menus,
  dates, sheets, a command palette

The published pieces are done properly. The unpublished ones stay in the plan
until they are.

## What you get

**Columns typed against your row.** `DataTable<TRow>` constrains every column's
`key` to `keyof TRow`. Rename a field and the compiler tells you which columns
broke, before the page renders blanks.

**Accessibility as a build gate, not a claim.** Focus traps, scroll lock, live
regions and keyboard models live in one set of shared primitives, written once
and covered by interaction tests, with no behaviour library underneath. Every
Storybook story is scanned by axe as part of the test run — a violation fails
CI rather than filling a panel nobody opens.

**Three states that stay consistent.** `Skeleton`, `EmptyState` and the
`no-results` case are designed together, because the bug is never one of them in
isolation. It is an empty state that appears during a slow request, or a
first-run screen offering "create your first project" to someone with fifty and
a bad filter.

**Tokens, all the way down.** Every colour, space, radius and layer is a token
in [`@rowkit/tokens`](https://github.com/NikolaiKushner/rowkit/tree/main/packages/tokens),
which you can install on its own. Contrast pairings are asserted in that
package's tests, not eyeballed. This site is styled from the same tokens.

**Two themes, and yours.** rowkit ships Windows 98 and a modern theme in light
and dark, switched by one attribute — the components, their props and their
markup do not change. Because the whole look is tokens, you can make it yours
the same way: adjust a few values for your brand, or define a complete theme
of your own — colour, corners, density, typeface, shadows, focus, icons — with
one `defineTheme()` call. [Themes](/foundations/themes) shows how, with a live
builder.

**State you own.** Sort, selection, page, filters — all `v-model`, none held
internally. A component reports what happened and your application decides what
follows, which is what makes server-driven and client-driven usage identical
from the component's point of view. See [API conventions](/conventions).

## What rowkit is not

**Not a CSS framework.** Tailwind v4 is a peer dependency. rowkit does not
replace it, wrap it, or ship its own copy.

**Not opinionated about data fetching.** Components take props. Where the data
comes from, and when, is yours.

**Not a validation layer.** `Field` renders error state; deciding what is
invalid and when to say so belongs to your application, which is the only thing
that knows whether to validate on blur or on submit.

The components still to build — menus, dates, a command palette, and the rest —
are listed in
[the roadmap](https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md).
They are the plan. They are not in this release.

## Choosing between them

The honest framing, so you can route yourself correctly:

| Compared on      | rowkit                                        | Nuxt UI                     | shadcn-vue                      |
| ---------------- | --------------------------------------------- | --------------------------- | ------------------------------- |
| **Distribution** | Versioned npm package                         | Versioned npm package       | Source copied into your project |
| **Scope**        | A professional toolkit, still being completed | Broad, already broad        | Broad, already broad            |
| **Upgrades**     | `semver`, you take the diff                   | `semver`, you take the diff | Yours to maintain once copied   |

rowkit owns its behaviour layer and depends on no behaviour library. The other
difference is who owns the code after
installation, and how much of the set is already shipped. rowkit is the toolkit the product is built from; the
unpublished components are on the roadmap, not missing by design.

## Status

**1.0 beta.** The API is stabilising toward 1.0.0, and breaking changes are still
possible between betas. Each component page says where that component stands:
**Stable** has met every point of the project's
[definition of done](/contributing#what-a-finished-component-looks-like) — both
themes, keyboard, the accessibility gate, stories, tests, docs and a visual
check; **New** is published and usable, and has not been through all of it yet.

Version <NpmVersion /> is on npm, published from CI with provenance attestation. The source
and the working backlog are on [GitHub](https://github.com/NikolaiKushner/rowkit).

## Where to go next

- [Installation](/installation) — Vue and Nuxt, including the styling setup that
  is the step people miss
- [API conventions](/conventions) — the rules every component follows, decided
  once
- [Themes](/foundations/themes) — switch between Windows 98 and modern, and
  make a theme of your own
- [Tokens](/foundations/tokens) — every colour, space and layer, rendered live
  from the package
- [Components](/components/button) — what is already built
