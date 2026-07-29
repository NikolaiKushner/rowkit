import type { HTMLAttributes } from 'vue'

/**
 * The minimum a row must provide.
 *
 * Requiring an `id` rather than taking a `rowKey` prop makes `:key` correct and
 * selection unambiguous without asking every caller to restate the obvious. It
 * also makes `keyof TRow` non-empty while `TRow` is still generic, which is
 * what lets the column and sort types resolve at all.
 *
 * The id must be **stable across renders** — present in the data, or assigned
 * once at fetch or ingest time. Never derived in a computed: an id minted by a
 * `.map()` produces a fresh object per row on every change, which defeats
 * reference equality, churns `:key`, and would stop any row-level memoisation
 * from ever hitting.
 */
export interface DataTableRow {
  id: string | number
}

/** Horizontal alignment of a column's header and cells. */
export type DataTableAlign = 'start' | 'center' | 'end'

/** Which way a sorted column is ordered. */
export type DataTableSortDirection = 'asc' | 'desc'

/**
 * The sorted column, and which way. `undefined` means unsorted.
 *
 * Keyed by a field of the row, not a free string: a sort naming a column that
 * does not exist is a compile error rather than a table that quietly ignores
 * it.
 */
export interface DataTableSort<TRow> {
  key: Extract<keyof TRow, string>
  direction: DataTableSortDirection
}

/** A value the table knows how to compare. */
export type DataTableSortable = string | number | boolean | Date | null | undefined

interface DataTableColumnBase {
  /** Column heading text. */
  header: string
  /**
   * Hides the heading visually while leaving it available to assistive
   * technology.
   *
   * For a column with nothing to say in the header — row actions, an avatar.
   * An empty `<th>` is a real defect: the column has no name, so a screen
   * reader user hears nothing when they reach its cells.
   */
  headerSrOnly?: boolean
  /**
   * Alignment. Use `end` for numbers — a column of right-aligned figures can be
   * compared down the page, a left-aligned one cannot.
   */
  align?: DataTableAlign
  /** A CSS width, applied to the column. Omit to let the content size it. */
  width?: string
  /**
   * Pins the column to the start edge while the table scrolls sideways.
   *
   * For the column that identifies the row — a name or an id. Without it, a
   * user scrolled to the right has no idea which row they are reading.
   */
  sticky?: boolean
  /** Extra classes for the header cell. */
  headerClass?: HTMLAttributes['class']
  /** Extra classes for every body cell in this column. */
  cellClass?: HTMLAttributes['class']
}

/**
 * A column that reads a field off the row.
 *
 * `key` is constrained to the row's own keys, so renaming a field or mistyping
 * one is a compile error rather than a column of blanks.
 */
export interface DataTableFieldColumn<TRow> extends DataTableColumnBase {
  key: Extract<keyof TRow, string>
  /** Overrides the slot name, which defaults to `key`. */
  id?: string
  /** Makes the header a sort control. */
  sortable?: boolean
  /**
   * What to compare when sorting this column, instead of the raw field.
   *
   * For a column whose displayed text sorts badly: a formatted date, a status
   * with a meaningful order, a name assembled from two fields.
   */
  sortValue?: (row: TRow) => DataTableSortable
}

/**
 * A column with no field behind it — row actions, a computed total, an avatar
 * assembled from several fields. Render it through the `cell:<id>` slot.
 *
 * Not sortable: `DataTableSort` names a field of the row, so there would be
 * nothing to put in it. A derived column that needs sorting belongs on the
 * field it derives from, with a `sortValue`.
 */
export interface DataTableCustomColumn extends DataTableColumnBase {
  id: string
  key?: never
  sortable?: never
  sortValue?: never
}

export type DataTableColumn<TRow> = DataTableFieldColumn<TRow> | DataTableCustomColumn

/**
 * Whether a column reads a field off the row.
 *
 * A type predicate rather than an inline check: "no `key` implies an `id`" is
 * an invariant across two properties, which TypeScript cannot infer from a
 * union whose row type is still generic.
 */
export function isFieldColumn<TRow>(
  column: DataTableColumn<TRow>
): column is DataTableFieldColumn<TRow> {
  return column.key !== undefined
}

/** The slot name and list key for a column. */
export function columnId<TRow>(column: DataTableColumn<TRow>): string {
  return isFieldColumn(column) ? (column.id ?? column.key) : column.id
}

function toComparableNumber(value: string | number | boolean | Date): number {
  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? 1 : 0
  if (value instanceof Date) return value.getTime()
  return Number(value)
}

/**
 * Orders two cell values.
 *
 * Blanks always sink, in both directions. Letting them flip to the top on a
 * descending sort is the usual behaviour and the wrong one: nobody sorts a
 * column to see which rows have no value there, and it buries the data they
 * did ask for under a block of empties.
 *
 * Strings use `localeCompare`, so "Ä" files next to "A" rather than after "Z".
 */
export function compareSortable(
  a: DataTableSortable,
  b: DataTableSortable,
  direction: DataTableSortDirection
): number {
  const aBlank = a === null || a === undefined
  const bBlank = b === null || b === undefined
  if (aBlank || bBlank) return aBlank && bBlank ? 0 : aBlank ? 1 : -1

  const factor = direction === 'asc' ? 1 : -1
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b) * factor

  const left = toComparableNumber(a)
  const right = toComparableNumber(b)
  if (left < right) return -factor
  if (left > right) return factor
  return 0
}

/**
 * The next state in the sort cycle: ascending, descending, then unsorted.
 *
 * The third step matters. Without it there is no way back to the order the data
 * arrived in, which for a server-ordered table is often the meaningful one —
 * most recent first, or a ranking the application computed.
 */
export function nextSort<TRow>(
  current: DataTableSort<TRow> | undefined,
  key: Extract<keyof TRow, string>
): DataTableSort<TRow> | undefined {
  if (current?.key !== key) return { key, direction: 'asc' }
  if (current.direction === 'asc') return { key, direction: 'desc' }
  return undefined
}
