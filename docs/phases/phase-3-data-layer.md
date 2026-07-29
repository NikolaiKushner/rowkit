# Phase 3 — Data Layer, in detail

**Components:** `DataTable`, `TablePagination`, `FilterBar`, `EmptyState`, `Skeleton`
**Estimated effort:** ~22h across 5–6 sessions
**Prerequisite:** Phases 0a, 0b, 1, 2 complete — tokens exist, four core components are Stable, Storybook and the playground run.

> **Prerequisite correction.** This originally claimed 0b was complete; it was not. Storybook and the playground existed, but Changesets, `size-limit` and `docs/conventions.md` did not — which is why "five changesets exit this phase" was unachievable from the first session. All three landed before the spec revision below. Anything here that assumes them can now be taken at face value.

This is the phase the library exists for. Everything before it was infrastructure; everything after it is polish. It's also the phase a reviewing client will judge — so the standard here is higher, not lower, than the rest.

---

## Build order

Not the intuitive order. Build the small pieces first so DataTable can compose them instead of inventing its own:

1. **Skeleton** (~2h) — needed by DataTable's loading state
2. **EmptyState** (~2h) — needed by DataTable's empty state
3. **TablePagination** (~3h) — independent, pairs with DataTable
4. **DataTable** (~10–12h, 2–3 sessions) — the centerpiece
5. **FilterBar** (~3h) — composes against the table last, when the table's needs are known

Building DataTable first and retrofitting the others produces components shaped like "whatever DataTable happened to need" rather than components that stand alone. Bottom-up keeps each one honest.

---

## 1. Skeleton (~2h)

The simplest component in the library — resist making it clever.

### API

```ts
interface SkeletonProps {
  /** Visual shape of the placeholder. @default 'text' */
  variant?: 'text' | 'circle' | 'rect'
  /** CSS width. Text variant defaults to 100%. */
  width?: string
  /**
   * CSS height. Text variant defaults to 1em, tracking font size.
   *
   * `1em` is relative sizing, not a hardcoded design value — hard rule 1
   * targets absolute values, and a placeholder that tracks its own font size is
   * doing the right thing.
   */
  height?: string
  /** Disable the pulse animation. @default false */
  static?: boolean
}
```

### Best practices baked in

- **Call it a pulse, not a shimmer.** A shimmer is a travelling gradient driven by `background-position`; this is an opacity loop. The word was wrong throughout an earlier draft and pointed at the implementation this section rejects.
- **Respect `prefers-reduced-motion`.** The pulse must drop to a static block under the media query. This is a WCAG concern, not a nicety — and it's one automated a11y scans often miss, so add an explicit story with the preference emulated.
- **`aria-hidden="true"` always.** A skeleton is decoration. The _container_ announcing loading state is the parent's job (DataTable will do this with `aria-busy`), not the skeleton's. There is no per-skeleton label prop — a loading table renders dozens of these and the announcement belongs to the region, once.
- **Animate `opacity`, not `background-position`.** Compositor-friendly, no repaints — matters when forty of them render in a table.
- Provide a convenience composite in stories (text lines of varying width mimicking a paragraph) but don't ship a `SkeletonParagraph` component — that's a component's worth of API surface for a `v-for`.

### Done when

Stories for all variants; reduced-motion story; zero a11y violations; docs page including "when not to use" (answer: for known-fast operations under ~300ms, where a skeleton flash is worse than nothing — document the flash-avoidance pattern of delaying skeleton appearance by 150–200ms).

---

## 2. EmptyState (~2h)

The screen every dashboard needs and nobody designs. Its job is to explain _why_ there's nothing here and _what to do about it_ — which means the API must distinguish causes.

### API

```ts
interface EmptyStateProps {
  /** Why the view is empty. Drives tone and default copy. @default 'no-data' */
  reason?: 'no-data' | 'no-results' | 'error'
  /** Heading. Required — an empty state without words is a rendering bug. */
  title: string
  /** Supporting copy. */
  description?: string
}
```

Slots: `#icon`, `#actions` (Buttons — "Create your first project", "Clear filters", "Retry").

> **`reason` drives tone and default copy only — never an icon.** An earlier draft had it selecting a default icon, which rowkit cannot do: there is no icon system, and `ROADMAP.md`'s twelve-component scope has no room to add one. Bundling SVGs to serve one prop would cross the scope line. The icon comes exclusively through `#icon`, supplied by the consumer.

### Why `reason` matters

`no-data` ("you haven't created anything yet") and `no-results` ("your filters matched nothing") are different situations demanding different actions — the first wants a create CTA, the second wants "clear filters." Libraries that ship one generic empty state force every consumer to rebuild this distinction. Shipping it in the API is exactly the kind of opinion a data-focused kit should have.

FilterBar will emit a clear-filters event; the docs page shows wiring `no-results` + `#actions` + that event as the canonical pattern.

### Done when

All three reasons in stories; a composed story inside a bordered container (its real habitat); docs with the no-data/no-results distinction explained.

---

## 3. TablePagination (~3h)

### API

```ts
interface TablePaginationProps {
  /** Current 1-based page. Controlled via v-model:page. */
  page: number
  /** Rows per page. Controlled via v-model:pageSize. */
  pageSize: number
  /** Total row count across all pages. */
  total: number
  /** Selectable page sizes. @default [10, 25, 50, 100] */
  pageSizeOptions?: number[]
  /** Hide the page-size selector entirely. @default false */
  hidePageSize?: boolean
  /** Disable all controls, e.g. while loading. @default false */
  disabled?: boolean
}
```

> `hidePageSize` rather than overloading `pageSizeOptions: []` as a hide flag. An empty array cannot express intent in the type, and "no options" and "do not show the control" are different statements.

```ts
defineEmits<{
  'update:page': [page: number]
  'update:pageSize': [size: number]
}>()
```

### Design decisions

- **Fully controlled, two v-models.** Pagination state lives in the consumer — it usually mirrors a URL or an API request. The component renders state and requests changes; it never owns them. This is the controlled-component doctrine and it applies to every stateful component in this phase.
- **Changing pageSize does not silently reset page.** Emit both; let the consumer decide (most will reset to 1, and the docs example shows exactly that). Components making multi-step decisions on the consumer's behalf are how "why did my page jump" bugs happen.
- **Range display, not just page numbers:** "1–25 of 312". With `total=0`, show "0 of 0" and disable everything rather than hiding — layout stability beats minimalism.
- Reuses `Select` from Phase 2 for the page-size dropdown. If `Select` can't serve this cleanly, that's a Phase 2 API bug — fix it now, while it's cheap.

### Accessibility

- Wrap in `<nav aria-label="Pagination">`
- Buttons get `aria-label` ("Next page", "Previous page") — unlabeled icon-only buttons are the most common a11y failure in pagination
- Disabled at boundaries: first page disables prev, last disables next; the `disabled` prop disables everything

### Done when

Keyboard operable end to end; boundary states in stories; interaction test that clicking next emits `update:page` with the right value; docs including the URL-sync example.

---

## 4. DataTable (~10–12h, 2–3 sessions)

The centerpiece. Split along these lines: **(a)** types + rendering + sorting, **(b)** selection + sticky header + state composition, **(c)** performance + polish + docs.

### 4.1 The type system — do this on paper first

The generic typing is the hardest and most valuable part. Write the types and get them reviewed _before_ any template exists.

```ts
// types.ts — shipped names are DataTableColumn / DataTableSort, namespaced
// because they are public exports of a library, not app-local types.

export interface DataTableColumn<TRow> {
  /** Key into the row object. Drives cell value and slot name. */
  key: keyof TRow & string
  /** Header label. */
  header: string
  /** Enable sorting on this column. @default false */
  sortable?: boolean
  /** Fixed width, e.g. '120px'. Unset columns share remaining space. */
  width?: string
  /** Horizontal alignment. @default 'start' */
  align?: 'start' | 'center' | 'end'
}

export interface DataTableSort<TRow> {
  key: Extract<keyof TRow, string>
  direction: 'asc' | 'desc'
}
```

```vue
<script setup lang="ts" generic="TRow extends { id: string | number }">
const props = defineProps<{
  /** Row data. Each row needs a stable `id` — used for keys and selection. */
  rows: TRow[]
  /** Column definitions. Order defines render order. */
  columns: DataTableColumn<TRow>[]
  /** Current sort. Controlled via v-model:sort. Undefined = unsorted. */
  sort?: DataTableSort<TRow>
  /** Selected row ids. Controlled via v-model:selected. Passing enables selection. */
  selected?: Array<TRow['id']>
  /** Show loading skeleton overlay. @default false */
  loading?: boolean
  /**
   * The header is always sticky; there is no prop. It only takes effect when
   * the scroll container has a height, which the consumer sets through `class`
   * — `position: sticky` resolves against the nearest scrolling ancestor, and
   * that is the component's own wrapper.
   */
}>()

const emit = defineEmits<{
  'update:sort': [sort: DataTableSort<TRow> | undefined]
  'update:selected': [ids: Array<TRow['id']>]
  'row:click': [row: TRow]
}>()
</script>
```

> **`undefined`, not `null`, for unsorted.** An absent Vue prop is already `undefined`, so `DataTableSort | null` gives three states for a two-state concept. Clearing the sort emits `update:sort` with `undefined`.

Decisions embedded here, each worth stating in the PR:

- **`TRow extends { id: string | number }`.** Requiring a stable id makes `:key` correct and selection unambiguous. The alternative — a `rowKey` prop — is more flexible and much worse: it makes the common case verbose to serve a rare one.

  **Ids must be stable across renders**: present in the data, or assigned once at fetch or ingest time — never derived in a computed. An id minted by a `.map()` inside a computed produces a fresh object for every row on every change, which defeats reference equality: `:key` churns and the `v-memo` in §4.6 never hits, because it compares `row` by reference. An earlier draft offered exactly that `.map()` as the escape hatch. It is the one thing not to do.

- **`key: keyof TRow & string`** is the payoff line. `columns: [{ key: 'emial' }]` fails compilation. This single constraint is what "typed column defs" means, and it's your best demo material.
- **Selection is `Array<TRow['id']>`, not `TRow[]`.** Ids survive refetches; object references don't. A refetch replacing row objects would silently orphan an object-based selection.
- **Sorting is controlled and means "request", not "behavior".** The table emits what the user asked for; the consumer sorts (or forwards it to an API). The table never sorts data itself — this keeps server-side and client-side workflows identical from the table's point of view. Ship a `useClientSort(rows, sort, columns?)` composable for the client-side case so convenience isn't lost; logic in a composable rather than baked into the component is the pattern that keeps table components maintainable.

  > Built and shipped. An interim version put client sorting **inside** the component behind a `sortMode` prop; it was removed in favour of the composable, which is testable without mounting and cannot be reached by a server-paged table by accident.

### 4.2 Slots — typed cell rendering

```ts
defineSlots<
  {
    /** Per-column cell override. Slot name = column key. */
    [K in keyof TRow & string as `cell:${K}`]?: (props: { value: TRow[K]; row: TRow }) => unknown
  } & {
    empty?: () => unknown
    loading?: () => unknown
  }
>()
```

Usage: `#cell:status="{ value, row }"` — with `value` typed as that column's actual type.

> ⚠️ **Known tooling caveat:** template-literal slot names combined with generics sit at the edge of what `vue-tsc` handles — there are open language-tools issues around exactly this pattern. Verify early in session (a) that autocomplete and type errors actually work in the playground. If the DX is broken in practice, fall back to a single `#cell="{ column, value, row }"` slot with a `column` discriminator: slightly weaker types, reliable tooling. **Working DX beats impressive types.**
>
> Whichever way it lands, the investigation is written up in `docs/decisions/003-cell-slot-typing.md` — what was tried, what `vue-tsc` did, and which way it went. Not in the PR description: a decision that lives only in a merged PR is a decision nobody will find in six months. That write-up is also your best LinkedIn post of the project.

### 4.3 Composition with the earlier components

- **Loading:** `loading=true` renders skeleton rows _matching the column layout_ (real column widths, one Skeleton per cell) — not a spinner replacing the table. Layout stability is the whole point of skeletons. The table gets `aria-busy="true"`.

  **Do not disable the sort buttons while loading.** They stay focusable and take `aria-disabled="true"`, with the handler a no-op. Disabling the control a keyboard user just activated destroys their focus mid-request and throws them to the top of the document — the same failure §5 rightly guards against for chips. Focus must survive a request cycle, and there is an interaction test asserting it does.

- **Empty:** `rows.length === 0 && !loading` renders the `#empty` slot, defaulting to `EmptyState reason="no-data"`. Docs show overriding with `no-results` + a clear-filters action when filters are active.
- **The states are exclusive and priority-ordered:** loading > empty > data. An explicit internal `state` computed with exactly one value prevents the "skeleton and empty state at once" class of bug. Write a test asserting each state is exclusive.

### 4.4 Accessibility — tables have real semantics

This is where `addon-a11y` won't catch everything; part of the checklist is manual:

- Semantic `<table>/<thead>/<th scope="col">/<tbody>` — never divs-as-grid. Screen readers navigate real tables; div grids require re-implementing everything for zero benefit here.
- **Sortable headers:** the `<th>` carries `aria-sort="ascending" | "descending" | "none"`, and contains a real `<button>` wrapping the label — keyboard operability comes from the button, not a click handler on the `th`.
- Sort cycle on activation: `asc → desc → undefined`. The third click clears — pin this in an interaction test; it's the spec detail everyone forgets.
- **Select-all checkbox** in the header, built on **Reka's `Checkbox`**, which takes `'indeterminate'` as a value directly. An earlier draft said to set `indeterminate` as a DOM property rather than an attribute — true of a native `<input type="checkbox">`, but hard rule 2 requires the Reka primitive where one exists, and that note is struck. Label it "Select all rows".
- Row checkboxes name the row they select — `"Select Ada Lovelace"`, not `"Select row 3"`. A column of positional labels is close to useless read out of context, so the labeller is a prop.
- `row:click` must not fight selection: clicking the checkbox cell doesn't fire `row:click`. Test this — it's the annoying-in-production bug.
- **`row:click` needs a keyboard path.** A row carrying a `row:click` listener gets `tabindex="0"` and activates on <kbd>Enter</kbd> and <kbd>Space</kbd>; without a listener it stays out of the tab order entirely. The docs state the rule that goes with it: **a clickable row is an enhancement, never the only path.** Whatever the row click does must also exist as an explicit control — a link or a button in the row — because a pointer-only affordance is unreachable for anyone not using a pointer.

### 4.5 Sticky header

`position: sticky` on `thead th` inside a scroll container — with two known traps handled deliberately:

- Backgrounds: sticky headers need an opaque background token, or rows show through on scroll
- `overflow-x: auto` on a wrapper for horizontal scroll, with a scroll-shadow affordance (a gradient signalling "more columns this way") driven by a small scroll listener

### 4.6 Performance — the 10,000-row question

The plan requires 10k rows without jank, and demands the approach be _documented_. The honest engineering answer:

**Don't virtualize in v1. Say so.**

Reasons, which go verbatim into the docs:

1. Virtualization conflicts with semantic `<table>` markup (row heights, sticky interplay, screen-reader row counts) — every virtualized table makes real a11y trade-offs
2. The realistic dataset for this component's audience is paginated at 25–100 rows; 10k unpaginated rows is an anti-pattern the library shouldn't optimize for at the cost of a11y
3. It's additive later (a `virtual` prop) without breaking API

What v1 _does_ instead:

- Renders 10k rows _correctly_ — no crash
- Keeps per-row cost minimal: no per-cell component wrappers, no per-cell computed, `v-memo` on rows keyed by `[row, isSelected]` (which requires stable row identity — see §4.1)
- Documents: "above ~500 rows, paginate — here's the TablePagination wiring"
- A Storybook story with 10k rows exists as the living benchmark

**The benchmark measures rendering, not sorting, and says so.** The 10k story is fed **pre-sorted** data and its description states plainly what it does and does not cover. An earlier draft claimed "sort requests still instant (the table doesn't sort)" as a property of the 10k case — true server-side, false the moment `useClientSort` is in play, where sorting 10k rows happens on the main thread. Measuring the table with the sort already done would have quietly benchmarked the easy path.

`useClientSort` carries its **own** timing note, recorded in its tests rather than in the story, so the two costs stay separate and neither hides behind the other.

Measure once with Chrome DevTools on the 10k story and record the numbers (initial render ms, scroll fps) in `docs/decisions/004-datatable-performance.md`. "Deliberately not virtualized, here's why, here are the numbers" reads as _more_ senior than a virtualization checkbox — it's a documented judgment call.

### Done when

Every item from the standard component DoD, plus: the typed-slot decision written up in `docs/decisions/003-cell-slot-typing.md`; the exclusive-state test; the sort-cycle test; the checkbox-vs-row-click test; the row-click keyboard-path test; the focus-survives-loading test; the 10k story with measured numbers in `docs/decisions/004-datatable-performance.md`.

---

## 5. FilterBar (~3h)

Deliberately the _thinnest_ component in the phase — the temptation is to build a filter engine; the job is to display applied filters.

### API

```ts
export interface FilterChip {
  /** Stable identifier, e.g. the field name. */
  id: string
  /** The field being filtered — "Role", "Status". */
  label: string
  /** The applied value — "Admin", "Active". Omit and the chip shows the label alone. */
  value?: string
  /** Defaults to true. False for a scope the user is not permitted to clear. */
  removable?: boolean
}

interface FilterBarProps {
  /** Currently applied filters. */
  filters?: FilterChip[]
  /** Matching rows. Announced politely when it changes. */
  resultCount?: number
  /** Shows a built-in search box, bound with `v-model:search`. @default true */
  searchable?: boolean
}

defineEmits<{
  /** A single chip's remove was activated. */
  remove: [id: string]
  /** Clear-all was activated. */
  clear: []
}>()
```

Slots: `#controls` (where the consumer puts their actual filter controls — selects, date pickers), `#actions` (trailing actions), `#chip="{ filter }"` (custom chip rendering), `#summary` (replaces the result count).

> **Two shipped deviations from the API above, both still open for a decision.**
>
> The chip splits `label` and `value` and formats "Role: Admin" itself, where this spec has the consumer pre-format one `label` string. The split is what lets the remove control be named after the filter — "Remove Role: Admin filter" — without the consumer having to build that string too.
>
> The bar also ships a **built-in search box** and a `resultCount` live region, where this spec puts search in `#controls` and has no count. Both earn their place — the count is the only feedback a screen reader user gets that filtering did anything — but they are outside the scope line this section draws, and `hideClearAll` was not built. If the thin-component argument wins, these come out.

> Renamed from `#leading`. The slot names a **role**, not a position — "your filter controls" — and `#leading` reads as "before the chips", which is where it happens to sit rather than what it is for.

### The scope line, drawn explicitly

FilterBar does **not** know what a filter _is_ — no operators, no field types, no filter-building UI. That's an application concern with unbounded surface area, and it's precisely where table libraries go to die. rowkit's FilterBar is: chips in, remove/clear events out, a slot for your controls. The docs "when not to use" section says this in the first sentence.

### Details

- Chips are buttons with `aria-label="Remove filter, {label}"` — a **comma, not a colon**. `label` is already a formatted `"Status: Active"`, so a colon here announces "Remove filter: Status: Active"
- Removal returns focus to a sensible place (next chip, else clear-all, else the bar) — focus loss on removal is the standard failure here
- Empty `filters` renders the `#controls` slot only; the bar doesn't reserve ghost space
- Canonical docs example: FilterBar + DataTable + EmptyState `no-results` wired together — this one example is the pattern page for the whole phase

---

## Cross-cutting practices for the phase

**Controlled state, everywhere.** Sort, selection, page, pageSize, filters — all owned by the consumer, all `v-model`. The components render state and request changes. This is the single most important architectural stance in the phase: it's what makes server-driven and client-driven usage identical, and it's the documented pattern of every serious table library.

**Logic in composables, rendering in components.** `useClientSort` ships in this phase; selection helpers too if they grow. Composables are testable without mounting and reusable without the component.

**Every stateful behavior gets an interaction test, not just a render test.** Sort cycling, selection with indeterminate, pagination boundaries, chip-removal focus. Render tests catch markup regressions; interaction tests catch the bugs users actually hit.

**The playground page is a deliverable, not a demo.** The final session ends with the users-admin page: FilterBar + DataTable + TablePagination + EmptyState + Skeleton, against generated data with artificial latency so loading states are visible. This page is what you screen-record for the Upwork portfolio — build it like someone will watch it, because someone will.

**Changeset per component,** as established. Five changesets exit this phase.

---

## Session plan

| Session | Scope                                                          | Exit                                                 |
| ------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| 3.1     | Skeleton + EmptyState                                          | Both Stable                                          |
| 3.2     | TablePagination                                                | Stable                                               |
| 3.3     | DataTable: types on paper → review → rendering + sorting       | Types locked, sorting works, slot-DX verdict reached |
| 3.4     | DataTable: selection, sticky header, loading/empty composition | Feature-complete                                     |
| 3.5     | DataTable: 10k story + measurements, docs, polish → Stable     | DataTable Stable                                     |
| 3.6     | FilterBar                                                      | FilterBar Stable                                     |
| 3.7     | Playground users-admin page; screen recording                  | Phase done                                           |

Session 3.3 starts with _you_ writing the types and the session reviewing them — not the reverse. The type design is the part that's yours.

---

## Phase Definition of Done

- [x] All five components at 🟢 Stable per the standard checklist
- [x] `useClientSort` composable shipped and tested, with its own timing note
- [x] Typed-slot approach decided, verified against the real component, written up in `docs/decisions/003-cell-slot-typing.md`
- [x] 10k-row story exists, fed pre-sorted data, with measured numbers in `docs/decisions/004-datatable-performance.md`
- [x] Virtualization decision documented in DataTable docs
- [x] Playground users-admin page: filterable, sortable, paginated, loading and empty states, built only from rowkit components
- [ ] 30-second screen capture recorded and saved — **yours to record; the page is ready**
- [x] Five changesets
- [x] Bundle budget still green — 9.6 kB brotli against a 14 kB ceiling, gated in CI

---

## Failure modes to watch

**Feature accretion on DataTable.** Column resizing, reordering, pinning, grouping, row expansion — all real features, all out of v1. Each lands in ROADMAP's "Considered, not planned" the moment it occurs to you.

**The generic-types rabbit hole.** If slot typing fights `vue-tsc` for more than ~2 hours, take the fallback and write down why. The library's value is twelve components, not one heroic type signature.

> Resolved, and the reason turned out to be sharper than "tooling". Per-column typed slots need statically-known keys; data-driven columns need a dynamic slot name. Those two requirements are in direct conflict regardless of tooling. See decision 003.

**Building FilterBar's filter engine.** The moment a filter _operator_ appears in FilterBar's props, stop — the scope line is being crossed.

**Skipping the measurements.** "Handles 10k rows" without numbers is a claim; with numbers it's evidence. Measuring takes twenty minutes and produces the most quotable line in the portfolio case study.
