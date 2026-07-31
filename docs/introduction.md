# Introduction

rowkit is twelve Vue 3 components for data-dense interfaces: tables, filters,
and the states around them.

That is the whole library. The number is a decision, not a stage it is passing
through on the way to forty.

## The problem it exists for

General-purpose component libraries handle the easy eighty per cent extremely
well. You get buttons, inputs, cards, modals — the parts every application
needs and nobody wants to build twice.

Then you build a users admin page, and none of that helped with the part that
actually took the week:

- A sortable table that stays fast at ten thousand rows, with column keys typed
  against your row so a renamed field is a compile error rather than a column of
  blanks
- A filter bar that makes the applied state obvious, and gives back focus
  somewhere sensible when a filter is removed
- Loading, empty, and no-results states that agree with each other — three
  screens that look nearly identical and mean completely different things

Those are the pieces a dashboard is judged on, and they are the pieces left as
an exercise. rowkit is that exercise, done once, properly.

## What you get

**Columns typed against your row.** `DataTable<TRow>` constrains every column's
`key` to `keyof TRow`. Rename a field and the compiler tells you which columns
broke, before the page renders blanks.

**Accessibility as a build gate, not a claim.** Components are built on
[Reka UI](https://reka-ui.com) primitives, so focus traps, scroll lock, live
regions and keyboard models come from code that specialises in them. Every
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

**State you own.** Sort, selection, page, filters — all `v-model`, none held
internally. A component reports what happened and your application decides what
follows, which is what makes server-driven and client-driven usage identical
from the component's point of view. See [API conventions](/conventions).

## What rowkit is not

**Not a general-purpose UI library.** If you need forty components covering
every case, use [Nuxt UI](https://ui.nuxt.com) or
[shadcn-vue](https://www.shadcn-vue.com). Both are good, and rowkit composes
with either — they share the same Reka UI foundation.

**Not a CSS framework.** Tailwind v4 is a peer dependency. rowkit does not
replace it, wrap it, or ship its own copy.

**Not opinionated about data fetching.** Components take props. Where the data
comes from, and when, is yours.

**Not a validation layer.** `Field` renders error state; deciding what is
invalid and when to say so belongs to your application, which is the only thing
that knows whether to validate on blur or on submit.

There is also a list of things deliberately left out — date pickers, a command
palette, charts — in
[the roadmap](https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md#considered-not-planned).
Recording them is how they stay out.

## Choosing between them

The honest framing, so you can route yourself correctly:

| Compared on      | rowkit                         | Nuxt UI                     | shadcn-vue                      |
| ---------------- | ------------------------------ | --------------------------- | ------------------------------- |
| **Distribution** | Versioned npm package          | Versioned npm package       | Source copied into your project |
| **Scope**        | Twelve components, one problem | Broad, general-purpose      | Broad, general-purpose          |
| **Data focus**   | The reason it exists           | One area among many         | One area among many             |
| **Upgrades**     | `semver`, you take the diff    | `semver`, you take the diff | Yours to maintain once copied   |

All three build on Reka UI, so the accessibility foundation is the same in each.
The difference is scope and who owns the code after installation.

If you are starting an application, one of the broad kits is very likely the
right first choice. rowkit is worth adding when the table is the hard part — and
it is designed to sit beside a general-purpose kit rather than replace it.

## Status

**v0.x.** The API is stabilising toward v1.0, every component has reached the
project's definition of done, and breaking changes are still possible until v1.

Nothing is on npm yet — the package name is reserved and publishing is the last
phase of the plan. Until then, the source and the full roadmap are on
[GitHub](https://github.com/NikolaiKushner/rowkit).

## Where to go next

- [Installation](/installation) — Vue and Nuxt, including the styling setup that
  is the step people miss
- [API conventions](/conventions) — the rules every component follows, decided
  once
- [DataTable](/components/data-table) — the centrepiece, and the fastest way to
  see whether this library is for you
