# DataTable

**Stage:** 🟡 Experimental — sorting and row selection are not built yet, and the
API for them may change what is here.

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
| `size`             | `'sm' \| 'md'`                                | `'md'`              | Row height and text size              |
| `hoverable`        | `boolean`                                     | `false`             | Highlight rows on hover               |
| `class`            | `string`                                      | —                   | Merged onto the scroll container      |

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

| Key                                                 | Action                                                                |
| --------------------------------------------------- | --------------------------------------------------------------------- |
| <kbd>Tab</kbd>                                      | Reaches the container when it scrolls, then any controls inside cells |
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> | Scroll the container while it has focus                               |

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
