# TablePagination

**Stage:** 🟢 Stable

Page controls for a table: a range summary, a rows-per-page control, and page
numbers. Built on Reka UI's `Pagination` primitive.

```vue
<TablePagination v-model:page="page" v-model:page-size="pageSize" :total="247" />
```

<script setup>
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(10)
</script>

<DemoBox layout="stack">
  <TablePagination
    v-model:page="page"
    v-model:page-size="pageSize"
    :total="247"
    label="Example pagination"
  />
  <p class="!my-0 text-sm text-text-muted">
    page {{ page }} · {{ pageSize }} per page
  </p>
</DemoBox>

Go to page 3 — rows 21–30 — then switch to 50 per page. You stay on page 3 and
the summary reads 101–150: a completely different set of rows, and deliberately
so. The component reports both changes and lets the application decide what
follows, because the right answer differs between "reset to page 1" and "keep
the user near the row they were reading", and a component cannot know which one
you meant.

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

<!-- @props TablePaginationProps -->

| Prop              | Type           | Default                   | Description                                                    |
| ----------------- | -------------- | ------------------------- | -------------------------------------------------------------- |
| `total`           | `number`       | **required**              | Total number of rows across all pages.                         |
| `pageSizeOptions` | `number[]`     | `() => [10, 25, 50, 100]` | Choices offered in the rows-per-page control.                  |
| `siblingCount`    | `number`       | `1`                       | How many page numbers to show on each side of the current one. |
| `showEdges`       | `boolean`      | `true`                    | Always show the first and last page, with ellipses between.    |
| `hidePageSize`    | `boolean`      | `false`                   | Hides the rows-per-page control.                               |
| `hideSummary`     | `boolean`      | `false`                   | Hides the "1–10 of 247" summary.                               |
| `pageSizeLabel`   | `string`       | `'Rows per page'`         | Label for the rows-per-page control.                           |
| `label`           | `string`       | `'Pagination'`            | Accessible name for the navigation region.                     |
| `previousLabel`   | `string`       | `'Previous page'`         | Accessible name for the previous-page control.                 |
| `nextLabel`       | `string`       | `'Next page'`             | Accessible name for the next-page control.                     |
| `size`            | `'sm' \| 'md'` | `'md'`                    | Control height and text size.                                  |
| `disabled`        | `boolean`      | `false`                   | Disables every control.                                        |
| `class`           | `string`       | —                         | Additional classes, merged so a consumer's utility wins.       |

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

**`showEdges` defaults to `true`, unlike the Reka primitive underneath.** With
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
<TablePagination label="Users pagination (top)" … />
<TablePagination label="Users pagination (bottom)" … />
```

**The current page carries `aria-current="page"`**, and is filled rather than
merely bolder. Weight alone is not enough to find your place in a row of
numbers, and it fails entirely for anyone who cannot perceive the difference.

**The ellipsis is `aria-hidden`.** It is a device for keeping the row short; the
page numbers either side already convey the gap.

**Page buttons are named "Page 7" by the Reka primitive**, not just "7", so they
are unambiguous when read out of context.

## Dark mode

The active page uses `primary-solid` with `primary-on-solid`, which flips with
the theme. Everything else is transparent over whatever surface contains it.
