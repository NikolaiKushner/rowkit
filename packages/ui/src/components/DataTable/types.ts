import type { HTMLAttributes } from 'vue'

/** Horizontal alignment of a column's header and cells. */
export type DataTableAlign = 'start' | 'center' | 'end'

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
}

/**
 * A column with no field behind it — row actions, a computed total, an avatar
 * assembled from several fields. Render it through the `cell:<id>` slot.
 */
export interface DataTableCustomColumn extends DataTableColumnBase {
  id: string
  key?: never
}

export type DataTableColumn<TRow> = DataTableFieldColumn<TRow> | DataTableCustomColumn

/**
 * What makes a row unique: a field name, or a function.
 *
 * The field form collapses to `never` while `TRow` is still generic, since
 * `keyof object` has no members. It resolves the moment the table is used with
 * a real row type — `DataTable.test.ts` pins that down.
 */
export type DataTableRowKey<TRow> =
  Extract<keyof TRow, string> | ((row: TRow, index: number) => PropertyKey)

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
