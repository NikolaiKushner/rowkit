# Roadmap

Where rowkit is, what it needs before 1.0, and what is deliberately not coming.

This file is the plan of record. It is ordered, not exhaustive: an item is here
because someone can act on it.

The direction is a professional toolkit: the components a product interface is
built from. Tables, filters and empty states are part of that set. They are not
the boundary of it. What follows is the plan for the rest of the set — not a
build, yet.

Last reviewed: **2026-10-08** (1.0.0-beta.1).

---

## Where rowkit is today

Twenty-one components, published as `rowkit` in the 1.0 beta (npm `beta` tag),
with tokens split into `@rowkit/tokens`:

| Area        | Components                                                                         |
| ----------- | ---------------------------------------------------------------------------------- |
| Foundations | Button, ButtonGroup, Field, Input, Select, Checkbox, Radio, Badge, Separator        |
| Data        | DataTable, Pagination, FilterBar, EmptyState, Skeleton, ProgressBar                 |
| Overlays    | Dialog, Toast, Tooltip                                                             |
| Layout      | Window, GroupBox, StatusBar, ScrollArea                                            |

Two themes from one set of components: **Windows 98**, the default, and
**modern**, light and dark. Both follow the designer's Figma file. A theme is
token values only, so `defineTheme()` makes a third one in a single call.

The engineering baseline is healthy and should stay that way — these are gates
in CI, not aspirations:

- 1494 tests green across unit, component and real-browser story runs
- `addon-a11y` runs as a build gate, not a panel, in both themes
- A size budget in brotli for the whole library, for Button alone (2.6 kB of
  3 kB, so tree-shaking demonstrably works) and for the tokens
- Strict TypeScript with `exactOptionalPropertyTypes`, no `any`
- Releases publish from CI over OIDC with provenance, and generated docs are
  checked for drift before anything ships

What is *not* proven is the API, because it has not been under load. That is the
whole of the distance to 1.0.

---

## The road to 1.0

**1.0 means the API survived contact with real applications**, not that some
component count was reached. Concretely, before the version number changes:

1. rowkit is used in at least two applications nobody wrote for the purpose of
   using rowkit, and the friction from that is filed.
2. The documented patterns (`data-table-page`, `forms`, `loading-states`) are
   rewritten from what those applications actually needed, not from what the
   components happen to offer.
3. Public APIs are locked only after the above. Locking early is how a library
   ships a mistake with a compatibility promise attached.

Everything in **Now** serves that, or clears something out of its way.

---

## Done

- **The Windows 98 redesign** (1.0.0-beta.0): every component, the tokens,
  rowkit.dev as a Windows 98 desktop, Large Fonts sizes, rowkit's own behaviour
  layer.
- **The modern theme, the site and the brand** (1.0.0-beta.1): a second theme
  drawn by the designer, light and dark; `defineTheme()` and the token
  reference; rowkit.dev as a modern desktop as well; a brand that stands above
  the themes.

---

## Now

Ordered. Finish or deliberately drop an item before starting the next.

### 1. Which theme is the default

The plan was to make the modern theme the default and Windows 98 the second
theme (`data-theme="win98"`), in its own minor release. Decide it now that both
are finished: it changes what every consumer without the attribute sees, so
it is a breaking change with a changeset, not a token edit.

### 2. A theme made by the consumer's coding agent

A developer installs rowkit and asks their agent for a theme in their brand's
colours. The agent sees only their project and `node_modules`, so everything it
needs must ship with the package.

1. The agent finds the instructions: a ready line for the project's
   `AGENTS.md` / `CLAUDE.md` in the README and on Installation ("For rowkit,
   read `node_modules/rowkit/AGENTS.md`"), and `llms.txt` on rowkit.dev.
2. A `rowkit/theme` entry point with `defineTheme`, `checkTheme` and the token
   list, so a pnpm project needs only `rowkit` and the versions cannot drift.
3. A generated **Theming** section in `packages/ui/AGENTS.md`: a recipe per
   project type, which base to start from, the ten to fifteen tokens that make
   a brand theme, the full list, contrast rules and how to fix them, and what
   not to do. A test keeps it in step with the tokens.
4. `checkTheme()` and `npx rowkit theme check`: unknown tokens, contrast below
   AA with a suggested fix, values of the wrong kind. The contrast rules move
   from `contrast.test.ts` into the package.
5. `npx rowkit theme preview`: a page of components in the theme, light and
   dark.
6. Try it for real: a clean Vite + Vue project outside this repo, rowkit from a
   `pnpm pack` tarball, the agent given only the request. Include a
   deliberately alien theme to flush out values still written into component
   classes.
7. On rowkit.dev: an "Ask your agent" block on Themes; the theme builder shows
   `checkTheme`'s results.

Open questions: whether `color-mix()` and `var()` values can be checked without
a browser; whether `theme check` reads a TypeScript theme file or only CSS.
An MCP server is a later decision, after step 6.

### 3. Close the visual-QA blind spot

`pnpm visual:check` screenshots a default matrix in Windows 98 only, and two
entries in it — `overlay-toaster--variants` and `overlay-tooltip--placements` —
render only their trigger buttons, so the toast and the tooltip never appear in
the frame.

Give those stories a `play` function that opens the overlay before the shot,
and give the script a theme and scheme parameter. The Toaster "duplicates
coalesce" story is flaky in the modern theme (about one run in three); fix it
in the same pass.

### 4. Harden the documented patterns

The three pattern pages are currently written from the library outward. They
should be rewritten from an application inward — which requires item 1 of the
1.0 list to have happened first. Until then, keep them honest rather than
growing them.

---

## The professional set — planned, not started

A product interface is built from more than a table. This is the set to grow
into. Nothing here is being built until the items under **Now** are finished
or deliberately dropped.

- **The designer's next wave**: Switch, a menu, Tabs, Combobox, and the
  dialog's alert layout as a style switch.
- **Menus and overlays.** DropdownMenu (row actions currently force a one-off
  icon menu), Popover, Sheet / drawer, and a confirm dialog.
- **Dates.** Date and date-range pickers.
- **Finding things.** Command palette.
- **Writing.** Rich text, when a product surface needs more than `Input`.
- **Charts.** Only as a component that sits in the same tokens — not a second
  charting library.
- **`DataTable` virtualisation**, against a real workload. The reasoning is in
  [decision 004](./docs/decisions/004-datatable-performance.md).

There is no fixed count. A component belongs here when a product interface is
awkward without it.

---

## Later — not the toolkit

- **A published Figma kit. A React port.** Separate products, not components
  of this one. The Figma file drawn for the redesign is the design source for this repo;
  publishing it as a kit for others is a separate decision.

---

## Non-goals

Permanent, not "not yet".

**Not a CSS framework.** Tailwind v4 stays a peer dependency.

**Not opinionated about data fetching.** Components take props.

**Not a validation layer.** rowkit renders field state. Deciding what is invalid
is the application's job.

---

## Settled decisions

Settled for now. Revisit one when it gets in the way of a component or the design, with a reason:

- **Two themes by attribute.** `data-theme="win98" | "modern"` on any element,
  Windows 98 by default; themes nest. Windows 98 has one light scheme; the
  modern theme has light and dark through `data-color-scheme`. No `dark:`
  variant and no `.dark` class.
- **The style, not the assets.** Windows 98 is drawn in its style, with no
  Microsoft logos or original icons. Status is carried by an icon as well as a
  colour. Consumers rebrand through tokens or a theme of their own.
- **The brand stands above the themes.** The mark, the wordmark and the
  vermilion accent belong to no theme; each theme reads the mark its own way.
- **npm package, not copy-paste distribution.** shadcn-vue's model is good and
  deliberate; rowkit ships versioned.
- **No behaviour library.** rowkit's focus, dismissal, presence, scroll lock and
  positioning are its own primitives, with no runtime dependency behind them.
- **Tokens are a separate package**, consumable without importing components.
- **The consumer owns state.** Sort, selection, page, filters are all `v-model`;
  components report what happened and the application decides what follows.
- **MIT.**
