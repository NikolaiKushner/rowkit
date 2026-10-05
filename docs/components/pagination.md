# Pagination

**Stage:** 🟢 Stable

Page controls for a table: a range summary, a rows-per-page control, and page
numbers.

<script setup>
import PaginationBasic from '../examples/pagination/PaginationBasic.vue'
import PaginationTable from '../examples/pagination/PaginationTable.vue'
import PaginationStatusBar from '../examples/pagination/PaginationStatusBar.vue'
import PaginationSummary from '../examples/pagination/PaginationSummary.vue'
import PaginationSiblings from '../examples/pagination/PaginationSiblings.vue'
import PaginationLoading from '../examples/pagination/PaginationLoading.vue'
</script>

<DemoBox layout="stack">
  <PaginationBasic />
</DemoBox>

<<< @/examples/pagination/PaginationBasic.vue

Go to page 3 — rows 21–30 — then switch to 50 per page. You stay on page 3 and
the summary reads 101–150: a different set of rows, and deliberately so. The
component reports both changes and lets the application decide what follows,
because «reset to page 1» and «keep the person near the row they were reading»
are both right somewhere, and a component cannot know which one you meant.

On a screen narrower than 640px, «Back» and «Next» become arrows alone, so the
row fits a phone; the words stay as the buttons' names. `compact` sets it —
`true` for a narrow side panel on a wide screen, `false` to keep the words
everywhere.

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Paging a table

Slice the rows you hold by `page` and `pageSize`. The component reports a new
page size and leaves the page alone — here a watcher starts again at page 1.

<DemoBox layout="stack">
  <PaginationTable />
</DemoBox>

<<< @/examples/pagination/PaginationTable.vue

### In a status bar

`size="sm"` with `hide-page-size` and `hide-summary` fits a window's status
bar, the range in the section beside it.

<DemoBox layout="stack">
  <PaginationStatusBar />
</DemoBox>

<<< @/examples/pagination/PaginationStatusBar.vue

### Your own summary

The `summary` slot gets `from`, `to` and `total`: word it your way and format
the numbers.

<DemoBox layout="stack">
  <PaginationSummary />
</DemoBox>

<<< @/examples/pagination/PaginationSummary.vue

### How many pages to show

`sibling-count` sets how many pages show either side of the current one — `0`
for the narrowest space, `1` by default. The first and last pages always show,
so the extent of the list is never hidden.

<DemoBox layout="stack">
  <PaginationSiblings />
</DemoBox>

<<< @/examples/pagination/PaginationSiblings.vue

### While a page loads

`disabled` while the next page loads, so clicks do not pile up requests.

<DemoBox layout="stack">
  <PaginationLoading />
</DemoBox>

<<< @/examples/pagination/PaginationLoading.vue

## Look

As drawn in the Figma Home template's status bar: Windows 98 command buttons
2px apart — 17px tall at `sm`, 21px at `md`, page numbers square at their
narrowest. «◀ Back» and «Next ▶» carry their label beside an 8px triangle and
go grey and embossed on the first and last page. The current page is pressed
in, its number shifted 1px. Focus is the button's dotted ring and black frame.
Nothing animates.

## Anatomy

| Part          | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| Summary       | "1–10 of 247". Says where you are and how much there is        |
| Rows per page | A `Select`, wired to a visible label through `Field`           |
| Navigation    | A `<nav>` landmark holding prev, page numbers and next         |
| Ellipsis      | Visual gap. `aria-hidden` — the numbers either side say it all |

## When to use

- Any table long enough that the user needs to know how far it runs.
- Server-side paging, where you hold `page` and `pageSize` and refetch on change.

## When not to use

- **For an infinite feed.** Pagination implies a stable, countable set. A feed
  that grows as you scroll has no page 7 to return to.
- **When `total` is unknown.** The summary and the last-page control both need
  a count. If your API cannot give one, use prev/next alone.
- **Under about two pages of data.** Controls that never do anything are noise.
  Render nothing when `total <= pageSize`.
- **As the only way to find a row.** Paging through 25 pages to find one user is
  not navigation, it is a search that has not been built yet. Pair it with
  `FilterBar`.

## Props

<!-- @props PaginationProps -->

| Prop              | Type                | Default                   | Description                                                                 |
| ----------------- | ------------------- | ------------------------- | --------------------------------------------------------------------------- |
| `total`           | `number`            | **required**              | Total number of rows across all pages.                                      |
| `pageSizeOptions` | `number[]`          | `() => [10, 25, 50, 100]` | Choices offered in the rows-per-page control.                               |
| `siblingCount`    | `number`            | `1`                       | How many page numbers to show on each side of the current one.              |
| `showEdges`       | `boolean`           | `true`                    | Always show the first and last page, with ellipses between.                 |
| `hidePageSize`    | `boolean`           | `false`                   | Hides the rows-per-page control.                                            |
| `hideSummary`     | `boolean`           | `false`                   | Hides the "1–10 of 247" summary.                                            |
| `pageSizeLabel`   | `string`            | `'Rows per page'`         | Label for the rows-per-page control.                                        |
| `label`           | `string`            | `'Pagination'`            | Accessible name for the navigation region.                                  |
| `previousLabel`   | `string`            | `'Back'`                  | Label of the previous-page button, shown beside its ◀ and used as its name. |
| `nextLabel`       | `string`            | `'Next'`                  | Label of the next-page button, shown beside its ▶ and used as its name.     |
| `size`            | `'sm' \| 'md'`      | `'md'`                    | Button height: 17px at `sm`, 21px at `md`.                                  |
| `compact`         | `boolean \| 'auto'` | `'auto'`                  | Draws «Back» and «Next» as arrows alone, so the row fits a phone.           |
| `disabled`        | `boolean`           | `false`                   | Disables every control.                                                     |
| `class`           | `string`            | —                         | Additional classes, merged so a consumer's utility wins.                    |

<!-- /@props -->

### v-model

| Model              | Type     | Default | Description           |
| ------------------ | -------- | ------- | --------------------- |
| `v-model:page`     | `number` | `1`     | Current page, 1-based |
| `v-model:pageSize` | `number` | `10`    | Rows per page         |

### Slots

| Slot      | Props                                         | Description             |
| --------- | --------------------------------------------- | ----------------------- |
| `summary` | `{ from: number, to: number, total: number }` | Replaces the range text |

## Behaviour worth knowing

**This component never moves the page by itself.** Changing the page size emits
`update:pageSize` and nothing else; a shrinking `total` emits nothing at all.
Both are yours to respond to, because only you know whether a page change means
a refetch, a URL rewrite, or nothing.

Most applications reset to page 1 when the result set or the ordering changes,
and that is one line at the call site:

```ts
watch([search, filters, sort, pageSize], () => {
  page.value = 1
})
```

Do wire it. Without it a user who filters 247 rows down to 12 while on page 9
stays on page 9 and sees an empty table. The component could clamp that for you
— an earlier version did — but a component taking a second decision on your
behalf is how "why did my page jump" bugs happen, and it fights applications
that already handle it.

**With `total: 0` every control is disabled rather than hidden**, so the row
keeps its height and the layout does not jump when results arrive.

**`showEdges` defaults to `true`.** With
it off, a user on page 12 of 25 sees only `11 12 13`: no sense of how far the
table runs and no way to reach the end. For a table, extent is information.

**The empty case reads "0 of 0"**, not "1–0 of 0".

## Keyboard

Everything is a native button, so all of it is reachable by <kbd>Tab</kbd> and
activated with <kbd>Enter</kbd> or <kbd>Space</kbd>. There is no roving
tabstop — page numbers are links to destinations, not a composite widget, and
arrow-key navigation between them would break the expectation that
<kbd>Tab</kbd> reaches every control.

The rows-per-page control is a `Select` and follows its keyboard contract.

## Accessibility

**Give each instance a distinct `label` when there is more than one on the
page.** Pagination above and below a long table is a normal layout, and two
`<nav>` landmarks sharing the name "Pagination" is an axe violation
(`landmark-unique`) — a screen reader user listing landmarks sees two identical
entries and cannot tell them apart.

```vue
<Pagination label="Users pagination (top)" … />
<Pagination label="Users pagination (bottom)" … />
```

**The current page carries `aria-current="page"`**, and is drawn pressed in
rather than merely bolder. Weight alone is not enough to find your place in a
row of numbers. The look comes from the attribute itself, so the state a
screen reader hears and the one you see cannot disagree.

**Back and Next are named by their visible labels.** `previousLabel` and
`nextLabel` are the text on the buttons and their accessible names at once, so
what a voice-control user reads is what they can say.

**The ellipsis is `aria-hidden`.** It is a device for keeping the row short; the
page numbers either side already convey the gap.

**Page buttons are named "Page 7"**, not just "7", so they
are unambiguous when read out of context.
