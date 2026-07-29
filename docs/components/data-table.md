# DataTable

**Stage:** 🟢 Stable

A typed table. Column definitions are constrained to the row type, cells render
through per-column slots, and the loading and empty states are built in.

```vue
<DataTable :rows="users" :columns="columns" row-key="id" caption="Team members">
  <template #[`cell:status`]="{ value }">
    <Badge :variant="tone(value)" dot>{{ value }}</Badge>
  </template>
</DataTable>
```

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

| Prop               | Type                                          | Default             | Description                           |
| ------------------ | --------------------------------------------- | ------------------- | ------------------------------------- |
| `rows`             | `TRow[]`                                      | —                   | Required                              |
| `columns`          | `DataTableColumn<TRow>[]`                     | —                   | Required, in display order            |
| `rowKey`           | `keyof TRow \| ((row, index) => PropertyKey)` | —                   | Required. What makes a row unique     |
| `caption`          | `string`                                      | —                   | Required. The table's accessible name |
| `captionVisible`   | `boolean`                                     | `false`             | Show the caption                      |
| `loading`          | `boolean`                                     | `false`             | Swap the body for placeholder rows    |
| `loadingRows`      | `number`                                      | `5`                 | How many placeholders                 |
| `loadingLabel`     | `string`                                      | `'Loading'`         | Announced while loading               |
| `emptyTitle`       | `string`                                      | `'Nothing to show'` | Title for the built-in empty state    |
| `emptyDescription` | `string`                                      | —                   | Description for the empty state       |
| `sortMode`         | `'manual' \| 'client'`                        | `'manual'`          | Who reorders the rows                 |
| `selectable`       | `'single' \| 'multiple'`                      | —                   | Adds a selection column               |
| `rowLabel`         | `(row, index) => string`                      | —                   | Accessible name for a row's control   |
| `selectionLabel`   | `string`                                      | `'Select'`          | Name for the selection column         |
| `selectAllLabel`   | `string`                                      | `'Select all rows'` | Name for the select-all control       |
| `size`             | `'sm' \| 'md'`                                | `'md'`              | Row height and text size              |
| `hoverable`        | `boolean`                                     | `false`             | Highlight rows on hover               |
| `class`            | `string`                                      | —                   | Merged onto the scroll container      |

### v-model

| Model              | Type                         | Description                       |
| ------------------ | ---------------------------- | --------------------------------- |
| `v-model:sort`     | `DataTableSort \| undefined` | `{ id, direction }`, or unsorted  |
| `v-model:selected` | `PropertyKey[]`              | Selected rows, as `rowKey` values |

### Slots

| Slot        | Props                           | Description                       |
| ----------- | ------------------------------- | --------------------------------- |
| `cell:<id>` | `{ row, column, value, index }` | Renders one column's cells        |
| `cell`      | `{ row, column, value, index }` | Fallback for every cell           |
| `empty`     | —                               | Replaces the built-in empty state |

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
<DataTable :rows="users" :columns="columns" row-key="id" caption="Users" v-model:sort="sort" />
```

**`sortMode` defaults to `manual`**, meaning the table reports the sort and
leaves `rows` untouched. That is the right default for this library: if the
server orders and pages the data, sorting locally would reorder only the page
you can see, producing a table that looks sorted and is not. Set
`sortMode="client"` when the table holds every row it will ever show.

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
  row-key="id"
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

**Selection is keyed by `rowKey`, so it survives sorting.** Reorder the table and
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

**`rowKey` is required.** An array index is not an identity: as soon as the
table can sort or filter, index keys make Vue reuse the wrong DOM and cell state
lands on the wrong row.

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

## Keyboard

| Key                                                 | Action                                                                                 |
| --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| <kbd>Tab</kbd>                                      | Reaches the container when it scrolls, sortable headers, and any controls inside cells |
| <kbd>Enter</kbd> / <kbd>Space</kbd>                 | Advances the sort on a focused header                                                  |
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> | Scroll the container while it has focus                                                |

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

There is no virtualization. Rendering is linear in rows × columns, and a few
hundred rows is comfortable. Past roughly a thousand, paginate with
`TablePagination` — which is the better interaction anyway, since nobody scrolls
through ten thousand rows looking for something. Virtualization is a candidate
for a later release; pagination is the answer today.

## Dark mode

Header uses `surface-subtle`, body `surface`, separators `border-subtle`. Pinned
cells carry their own `surface` background so rows do not show through them
while scrolling. All of it flips with the theme.
