# TablePagination

**Stage:** 🟢 Stable

Page controls for a table: a range summary, a rows-per-page control, and page
numbers. Built on Reka UI's `Pagination` primitive.

```vue
<TablePagination v-model:page="page" v-model:page-size="pageSize" :total="247" />
```

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

| Prop              | Type           | Default             | Description                                    |
| ----------------- | -------------- | ------------------- | ---------------------------------------------- |
| `total`           | `number`       | —                   | Required. Total rows across all pages          |
| `pageSizeOptions` | `number[]`     | `[10, 25, 50, 100]` | Choices in the rows-per-page control           |
| `siblingCount`    | `number`       | `1`                 | Page numbers shown either side of the current  |
| `showEdges`       | `boolean`      | `true`              | Always show first and last page, with ellipses |
| `showPageSize`    | `boolean`      | `true`              | Show the rows-per-page control                 |
| `showSummary`     | `boolean`      | `true`              | Show the range summary                         |
| `pageSizeLabel`   | `string`       | `'Rows per page'`   | Label for the rows-per-page control            |
| `label`           | `string`       | `'Pagination'`      | Accessible name for the navigation landmark    |
| `previousLabel`   | `string`       | `'Previous page'`   | Accessible name for the previous control       |
| `nextLabel`       | `string`       | `'Next page'`       | Accessible name for the next control           |
| `size`            | `'sm' \| 'md'` | `'md'`              | Control height and text size                   |
| `disabled`        | `boolean`      | `false`             | Disables every control                         |
| `class`           | `string`       | —                   | Merged so your utility wins                    |

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

**Changing the page size keeps your place.** Someone on page 9 of 10-row pages
is looking at row 81; switching to 25 rows puts them on page 4, which still
contains row 81. Resetting to page 1 is the common implementation and it
silently loses the user's position in a long list.

**The page is pulled back into range when the data shrinks.** Apply a filter
that cuts 247 rows to 12 while on page 9 and the page becomes 2. Without this
the table renders nothing and looks broken — the single most common pagination
bug.

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
