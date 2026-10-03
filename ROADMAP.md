# Roadmap

Where rowkit is, what it needs before 1.0, and what is deliberately not coming.

This file is the plan of record. It is ordered, not exhaustive: an item is here
because someone can act on it.

The direction is a professional toolkit: the components a product interface is
built from. Tables, filters and empty states are part of that set. They are not
the boundary of it. What follows is the plan for the rest of the set — not a
build, yet.

Last reviewed: **2026-08-09** (v0.1.1).

---

## Where rowkit is today

Fourteen components across three areas, published as `rowkit` with tokens split
into `@rowkit/tokens`:

| Area        | Components                                                     |
| ----------- | -------------------------------------------------------------- |
| Foundations | Button, ButtonGroup, Field, Input, Select, Badge                |
| Data        | DataTable, Pagination, FilterBar, EmptyState, Skeleton          |
| Overlays    | Dialog, Toast, Tooltip                                          |

The engineering baseline is healthy and should stay that way — these are gates
in CI, not aspirations:

- 1434 tests green across unit, component and real-browser story runs
- `addon-a11y` runs as a build gate, not a panel
- 12.97 kB brotli for the full library against a 14 kB budget; Button alone is
  1.4 kB, so tree-shaking demonstrably works
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

## Now

Ordered. Finish or deliberately drop an item before starting the next.

### 1. The Windows 98 redesign (v2)

Every component, the tokens, the playground, rowkit.dev and the brand — logo,
favicon, link previews, README banner, Storybook theme — are being redrawn in
the style of Windows 98, on `refactor/v2`. Win98 replaces the current look
everywhere rowkit appears; dark mode is dropped.

1. A designer draws the Figma file first: Variables mirroring the semantic
   token names, bevel effect styles, every component in every variant and
   state, three assembled screens, and seven page templates for the docs site.
2. Tokens change value, not name, so consumers who rebrand through
   `--color-primary-*` keep working. Radii go to zero, soft shadows give way to
   bevels, Geist gives way to PT Sans, and the dark values are removed.
3. Components are restyled against the Figma file, one at a time, through the
   usual definition of done. Any API change the new style asks for (a merged
   `Button` variant, a side label on `Field`) is its own `minor` changeset.
4. rowkit.dev becomes a Win98 desktop: pages open in Explorer-style windows,
   navigation lives in a Start menu and a taskbar. That needs a custom
   VitePress layout, which overrides the earlier "default theme only" choice.

Settled for the redesign: the face is PT Sans (OFL, Latin and Cyrillic,
regular and bold; the app loads it, rowkit does not ship it). Sizes follow
Win98 on desktop (11px text, ~23px controls) and grow to ≥ 24px touch targets
on touch screens. `Button` loses `outline`; hover appears only where Win98 had
it; `background` is `#C0C0C0`, with teal `#008080` as a separate `desktop`
token. rowkit.dev gets a VitePress theme written from scratch, in English, set
in PT Sans throughout.

### 2. Close the visual-QA blind spot

`pnpm visual:check` screenshots a default matrix, and two entries in it —
`overlay-toaster--variants` and `overlay-tooltip--placements` — render only
their trigger buttons. The toast and the tooltip never appear in the frame, so
four of forty screenshots prove nothing, and the coloured toast variants have
never actually been reviewed by the process that exists to review them.

Give those stories a `play` function that opens the overlay before the shot, or
add always-open variants to the matrix.

### 3. Two inconsistencies to settle in the redesign

Both are decisions, not bugs. Win98 offers no precedent for either, so the
Figma file has to decide them rather than inherit them:

- **`Badge` `subtle` + `primary` is indistinguishable from `neutral`.** Either
  give it a distinguishing treatment in the new style or drop it.
- **Invalid `Input` is louder than the rest of the library's danger states.**
  Dark mode, where it was worst, is gone. Win98 has no invalid field at all, so
  the redesign draws one quiet treatment that matches destructive elsewhere.

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
  of this one. The Figma file drawn for v2 is the design source for this repo;
  publishing it as a kit for others is a separate decision.

The custom docs theme that used to sit here moved into **Now** as part of the
redesign.

---

## Non-goals

Permanent, not "not yet".

**Not a CSS framework.** Tailwind v4 stays a peer dependency.

**Not opinionated about data fetching.** Components take props.

**Not a validation layer.** rowkit renders field state. Deciding what is invalid
is the application's job.

---

## Settled decisions

Do not relitigate these without new information:

- **Design direction is Windows 98** — grey face, bevels, navy `#000080`
  selection, square corners, PT Sans. It replaced the earlier restrained
  look (ink-blue primary, Geist) entirely. The style, not the assets: no
  Microsoft logos or original icons. Status is carried by an icon as well as a
  colour. Consumers rebrand by pointing `--color-primary-*` at their own colour.
- **One theme, light.** Dark mode is dropped in v2.
- **npm package, not copy-paste distribution.** shadcn-vue's model is good and
  deliberate; rowkit ships versioned.
- **Reka UI as the primitive layer**, with shadcn-vue as a reference to learn
  from rather than a dependency.
- **Tokens are a separate package**, consumable without importing components.
- **The consumer owns state.** Sort, selection, page, filters are all `v-model`;
  components report what happened and the application decides what follows.
- **MIT.**
