# DataTable

**Stage:** 🟢 Stable

A typed table. Column definitions are constrained to the row type, cells render
through per-column slots, and the loading and empty states are built in.

```vue
<DataTable :rows="users" :columns="columns" caption="Team members">
  <template #[`cell:status`]="{ value }">
    <Badge :variant="tone(value)" dot>{{ value }}</Badge>
  </template>
</DataTable>
```

<script setup>
import { computed, ref } from 'vue'
import { useClientSort } from 'rowkit'

const state = ref('rows')
const sort = ref()

const columns = [
  { key: 'name', header: 'Name', sortable: true, sticky: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'status', header: 'Status' },
  { key: 'seats', header: 'Seats', sortable: true, align: 'end' },
]

const users = [
  { id: 1, name: 'Ada Lovelace', role: 'Owner', status: 'active', seats: 3 },
  { id: 2, name: 'Grace Hopper', role: 'Admin', status: 'active', seats: 12 },
  { id: 3, name: 'Alan Turing', role: 'Member', status: 'invited', seats: 1 },
  { id: 4, name: 'Katherine Johnson', role: 'Member', status: 'suspended', seats: 0 },
]

const tone = { active: 'success', invited: 'warning', suspended: 'danger' }

const sorted = useClientSort(users, sort, columns)
const rows = computed(() => (state.value === 'empty' ? [] : sorted.value))
</script>

<DemoBox layout="stack">
  <div class="flex flex-wrap gap-2">
    <Button
      v-for="value in ['rows', 'loading', 'empty']"
      :key="value"
      size="sm"
      :variant="state === value ? 'primary' : 'secondary'"
      @click="state = value"
    >{{ value }}</Button>
  </div>
  <DataTable
    :rows="rows"
    :columns="columns"
    caption="Team members"
    :loading="state === 'loading'"
    empty-title="No people match these filters"
    v-model:sort="sort"
    hoverable
  >
    <template #[`cell:status`]="{ value }">
      <Badge :variant="tone[value]" size="sm" dot>{{ value }}</Badge>
    </template>
  </DataTable>
</DemoBox>

The three body states, on one table. Loading renders placeholder rows in the
real column layout rather than a spinner over the top, so nothing shifts when
the data lands — the header and the column widths are already correct.

Sort a column and switch to `loading`: the sort survives, because the table
never owned it.

## Anatomy

| Part      | Purpose                                                       |
| --------- | ------------------------------------------------------------- |
| Container | Scrolls in both axes. Focusable only when it actually scrolls |
| Caption   | The table's accessible name. Hidden by default                |
| Header    | Sticky. `scope="col"` on every cell                           |
| Body      | Rows, or placeholders while loading, or an empty state        |

## Columns

```ts
const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name', sticky: true },
  { key: 'seats', header: 'Seats', align: 'end' },
  { id: 'actions', header: 'Actions', headerSrOnly: true },
]
```

`key` is constrained to `keyof TRow`, so a renamed or mistyped field is a
compile error rather than a column of blanks. A column with no field behind it —
row actions, a computed total — uses `id` instead and renders from a slot.

| Field          | Type                           | Description                                           |
| -------------- | ------------------------------ | ----------------------------------------------------- |
| `key`          | `keyof TRow`                   | The field to read. Also the default slot name         |
| `id`           | `string`                       | Slot name. Required when there is no `key`            |
| `header`       | `string`                       | Heading text                                          |
| `headerSrOnly` | `boolean`                      | Hide the heading visually, keep it for screen readers |
| `sortable`     | `boolean`                      | Makes the header a sort control                       |
| `sortValue`    | `(row: TRow) => Sortable`      | What to compare, when the displayed text sorts badly  |
| `align`        | `'start' \| 'center' \| 'end'` | Use `end` for numbers                                 |
| `width`        | `string`                       | A CSS width                                           |
| `sticky`       | `boolean`                      | Pin the column to the start edge while scrolling      |
| `headerClass`  | `string`                       | Extra classes for the header cell                     |
| `cellClass`    | `string`                       | Extra classes for this column's body cells            |

## Props

<!-- @props DataTableProps -->

| Prop               | Type                                   | Default             | Description                                                                       |
| ------------------ | -------------------------------------- | ------------------- | --------------------------------------------------------------------------------- |
| `rows`             | `TRow[]`                               | **required**        | The rows to render.                                                               |
| `columns`          | `DataTableColumn<TRow>[]`              | **required**        | Column definitions, in display order.                                             |
| `caption`          | `string`                               | **required**        | Accessible name for the table.                                                    |
| `captionVisible`   | `boolean`                              | `false`             | Shows the caption. It is available to assistive technology either way.            |
| `loading`          | `boolean`                              | `false`             | Swaps the body for placeholder rows.                                              |
| `loadingRows`      | `number`                               | `5`                 | How many placeholder rows to show while loading.                                  |
| `loadingLabel`     | `string`                               | `'Loading'`         | Announced while loading.                                                          |
| `emptyTitle`       | `string`                               | `'Nothing to show'` | Title for the built-in empty state.                                               |
| `emptyDescription` | `string`                               | —                   | Description for the built-in empty state.                                         |
| `selectable`       | `'single' \| 'multiple'`               | —                   | Adds a selection column.                                                          |
| `rowLabel`         | `(row: TRow, index: number) => string` | —                   | Accessible name for each row's selection control.                                 |
| `selectionLabel`   | `string`                               | `'Select'`          | Accessible name for the selection column.                                         |
| `selectAllLabel`   | `string`                               | `'Select all rows'` | Accessible name for the select-all control.                                       |
| `size`             | `'sm' \| 'md'`                         | `'md'`              | Row height and text size.                                                         |
| `hoverable`        | `boolean`                              | `false`             | Highlights rows on hover. Only turn this on when a row does something.            |
| `class`            | `string`                               | —                   | Additional classes for the scroll container, merged so a consumer's utility wins. |

<!-- /@props -->

### v-model

| Model              | Type                               | Description                       |
| ------------------ | ---------------------------------- | --------------------------------- |
| `v-model:sort`     | `DataTableSort<TRow> \| undefined` | `{ key, direction }`, or unsorted |
| `v-model:selected` | `TRow['id'][]`                     | Selected rows, by id              |

### Slots

| Slot        | Props                           | Description                       |
| ----------- | ------------------------------- | --------------------------------- |
| `cell:<id>` | `{ row, column, value, index }` | Renders one column's cells        |
| `cell`      | `{ row, column, value, index }` | Fallback for every cell           |
| `empty`     | —                               | Replaces the built-in empty state |
| `loading`   | —                               | Replaces the placeholder rows     |

Resolution order is per-column slot, then the general `cell` slot, then the raw
value. That chain is what lets a table declare twelve columns and write markup
only for the two that need it.

## When to use

- Tabular data with a known column set.
- Anywhere the loading and empty states matter as much as the populated one.

## When not to use

- **For layout.** This renders a real `<table>` with real table semantics. If
  the data is not tabular, a screen reader user gets row and column
  announcements that mean nothing.
- **For a list of one thing per row.** A description list or plain list is
  lighter and reads better.
- **For very large sets, yet.** See the note below — there is no virtualization.
- **Where a card grid reads better.** Tables are for comparing values down a
  column. If nobody compares, a table is just a grid with lines.

## Sorting

Mark a column `sortable` and bind `v-model:sort`.

```vue
<DataTable :rows="users" :columns="columns" caption="Users" v-model:sort="sort" />
```

**The table never sorts its own rows.** It reports the sort the user asked for
and renders what it is handed. That keeps server-driven and client-driven usage
identical from the table's point of view — the moment a table sorts its own
`rows`, a server-paged one silently reorders just the page on screen and looks
sorted while being wrong.

For a table that holds every row it will ever show, `useClientSort` does the
sorting outside the component, where it is testable without mounting anything:

```ts
const sort = ref<DataTableSort<User>>()
const rows = useClientSort(users, sort, columns)
```

```vue
<DataTable :rows="rows" :columns="columns" v-model:sort="sort" caption="Users" />
```

**The cycle is ascending, descending, then unsorted.** The third step is the one
usually missing, and it matters — without it there is no way back to the order
the data arrived in, which for a server-ordered table is often the meaningful
one. A new column always restarts at ascending.

**Blanks sink in both directions.** Letting `null` float to the top on a
descending sort is the common behaviour and the wrong one: nobody sorts a column
to find the rows with nothing in it, and it buries the data they asked for.

**Numbers compare numerically and strings by locale.** So 12 sorts after 3
rather than before it, and "Ärger" files next to "Arger" rather than after "Z".
Dates compare chronologically.

Use `sortValue` when the displayed text sorts badly — a status with a meaningful
order, a formatted date, a name assembled from two fields:

```ts
{
  key: 'status',
  header: 'Status',
  sortable: true,
  sortValue: (row) => ({ active: 0, invited: 1, suspended: 2 })[row.status],
}
```

Only one column sorts at a time. Multi-column sorting would mean `sort` becoming
an array and the header showing its position in the order; the state shape is
the breaking part, so it is deliberately not modelled as a single value that
would have to change later — a future `sort` array is the intended path.

**Sorting does not reset the page.** If you page as well, reset `page` to 1 when
`sort` changes; the table has no knowledge of pagination.

## Selection

```vue
<DataTable
  :rows="users"
  :columns="columns"
  caption="Users"
  selectable="multiple"
  :row-label="(row) => `Select ${row.name}`"
  v-model:selected="selected"
/>
```

`multiple` gives checkboxes with a tri-state select-all in the header. `single`
gives radios and no select-all — there is nothing to select all of.

**`selected` is always an array**, including in `single` mode where it holds at
most one entry. Two shapes for one model would make every consumer branch on the
mode just to read their own state.

**Selection is keyed by row `id`, so it survives sorting.** Reorder the table and
the same records stay picked, rather than the same positions.

**Supply `rowLabel`.** The default is "Select row 3", and a column of those is
close to useless read out of context. Name the row.

**Select-all covers the rows on screen, and leaves the rest alone.** With
pagination that distinction matters: selecting all on page two adds to what you
picked on page one rather than replacing it, and clearing removes only what is
visible. "All" cannot mean rows the table has never been handed — if you need
"select all 4,312 matches", that is an application-level decision about a query,
not a checkbox.

## Behaviour worth knowing

**Rows must carry an `id`.** `TRow extends { id: string | number }`, so there is
no `rowKey` prop to supply — the identity is in the data, where it belongs. An
array index is not an identity: as soon as the table can sort or filter, index
keys make Vue reuse the wrong DOM and cell state lands on the wrong row.

The id must be **stable across renders** — present in your data, or assigned
once at fetch or ingest time. Never mint one in a computed: a `.map()` that adds
an id produces a fresh object per row on every change, which defeats reference
equality and churns `:key` on every render.

**Sorting names a field, not a column id.** `DataTableSort<TRow>` carries
`key: keyof TRow`, so a sort naming a column that does not exist is a compile
error. A custom (`id`-only) column therefore cannot be `sortable` — put the
`sortValue` on the field it derives from instead.

**Non-primitive values render blank.** A date or an object produces an empty cell
rather than `[object Object]`, so a missing cell slot is obvious in development
instead of shipping as noise.

**Zero and `false` render.** They are values, not absences.

**The container is focusable only when it scrolls.** A scrollable box with
nothing focusable inside cannot be scrolled by keyboard at all. It gets
`tabindex="0"`, `role="region"` and the caption as its name — but only when
there is actually overflow, measured with a `ResizeObserver`, so a table that
fits adds no pointless tab stop.

**The sticky header needs a height on the container.** `position: sticky`
resolves against the nearest scrolling ancestor, which is the component's own
wrapper. Put the height there: `<DataTable class="max-h-96" />`. An outer
scrolling div will not work.

**A pinned column grows a shadow only once something is behind it**, using the
`shadow-scroll-x` token. Without the cue, a user scrolled to the right has no
signal that the table continues past the pinned edge.

## Clickable rows

Listening for `row:click` puts rows in the tab order and activates them on
<kbd>Enter</kbd> and <kbd>Space</kbd>. Without a listener they stay out of the
tab order entirely, so a table of plain data adds no tab stops.

A click on a control inside the row — a checkbox, an Edit button — does not fire
`row:click`. Ticking a checkbox should not also open the row.

**A clickable row is an enhancement, never the only path.** Whatever the row
click does must also exist as a real control inside the row. A pointer-only
affordance is unreachable for anyone not using a pointer, and a row is not an
announced, discoverable target the way a link or a button is.

## Keyboard

| Key                                                 | Action                                                                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| <kbd>Tab</kbd>                                      | Reaches the container when it scrolls, sortable headers, rows with a `row:click` listener, and any controls inside cells |
| <kbd>Enter</kbd> / <kbd>Space</kbd>                 | Advances the sort on a focused header                                                                                    |
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> | Scroll the container while it has focus                                                                                  |

There is no grid navigation. This is a `table`, not a `grid` — cells are content
rather than composite widget children, and screen readers already provide table
navigation of their own.

## Accessibility

**`caption` is required.** A table with no accessible name leaves a screen
reader user listing tables on a page with nothing but "table" repeated. It is
visually hidden by default; showing it is a design choice, not an
accessibility one.

**Never leave a header empty.** An actions column still names itself — use
`headerSrOnly` rather than `header: ''`. An empty `<th>` means the column has no
name, so its cells are announced without context.

**Loading announces once for the table**, through a live region that is present
whether or not the table is loading. A region added at the same moment as its
content is frequently missed. The placeholder `Skeleton`s stay decorative, so a
loading table does not announce thirty times.

**The empty state's heading is an `h3`**, sitting under the page's own heading
rather than restarting the outline.

**A sortable header is a real `<button>`.** A `<th>` with a click handler cannot
be reached by keyboard at all, and `aria-sort` describes the state without
offering any way to change it.

**Selection is not `aria-selected` on the row.** That attribute is only valid
inside a `grid`, and this is a plain `table`; the checkbox's own state carries
the selection. Rows get a `data-selected` attribute for styling instead.

**Single selection uses native radios rather than Reka's `RadioGroup`.** That
primitive's root owns the roving tabstop and would have to wrap the table,
putting `role="radiogroup"` on it and destroying its table semantics. A shared
`name` groups native radios with no wrapper at all.

**The button's label is only the column name.** `aria-sort` on the `<th>` already
conveys "sorted ascending", so adding it to the label has it announced twice.
Every sortable column carries `aria-sort="none"` until it is the sorted one —
omitting the attribute would leave no signal that the column sorts at all.

## Performance

There is no virtualization, deliberately — and it is measured rather than
asserted. See [004 — DataTable performance](../decisions/004-datatable-performance.md).

The short version: **scrolling does not care how many rows there are.** Frame
times over a 10,000-row table are identical to a four-row one, because the
browser paints only what is visible. What does grow is initial render — about
640 ms for 10,000 rows against 66 ms for four, and linear in between.

So the threshold is a render-time one: **above ~500 rows, paginate** with
`TablePagination`. That is the better interaction regardless, since nobody
scrolls ten thousand rows looking for something.

## Dark mode

Header uses `surface-subtle`, body `surface`, separators `border-subtle`. Pinned
cells carry their own `surface` background so rows do not show through them
while scrolling. All of it flips with the theme.
