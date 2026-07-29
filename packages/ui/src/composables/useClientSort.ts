import { computed, toValue, type MaybeRefOrGetter, type ComputedRef } from 'vue'
import {
  compareSortable,
  type DataTableColumn,
  type DataTableSort,
  type DataTableSortable,
} from '../components/DataTable/types'

/**
 * Sorts rows locally, for a table that holds every row it will ever show.
 *
 * `DataTable` deliberately does not do this itself. It reports the sort the
 * user asked for and renders whatever it is handed, which keeps server-driven
 * and client-driven usage identical from the table's point of view — the moment
 * the table sorts its own `rows`, a server-paged table silently reorders only
 * the page on screen and looks sorted while being wrong.
 *
 * So the convenience lives here instead, where it is testable without mounting
 * anything:
 *
 * ```ts
 * const sort = ref<DataTableSort<User>>()
 * const sorted = useClientSort(users, sort, columns)
 * ```
 *
 * ```vue
 * <DataTable :rows="sorted" :columns="columns" v-model:sort="sort" caption="Users" />
 * ```
 *
 * **Cost.** Sorting is `Array.prototype.sort` over a copy — O(n log n) with a
 * comparator call per pair. Fine into the low thousands of rows; past that,
 * paginate and let the server order. The 10k benchmark story deliberately
 * measures rendering with pre-sorted data, so it does not hide this.
 */
export function useClientSort<TRow>(
  rows: MaybeRefOrGetter<TRow[]>,
  sort: MaybeRefOrGetter<DataTableSort<TRow> | undefined>,
  columns?: MaybeRefOrGetter<DataTableColumn<TRow>[]>
): ComputedRef<TRow[]> {
  return computed(() => {
    const source = toValue(rows)
    const active = toValue(sort)
    if (active === undefined) return source

    // A column is only needed for its `sortValue`; without one the field is
    // read directly, so `columns` stays optional.
    const column = toValue(columns)?.find(
      (candidate) => candidate.key !== undefined && candidate.key === active.key
    )

    const valueOf = (row: TRow): DataTableSortable =>
      column?.sortValue?.(row) ??
      ((row as Record<string, unknown>)[active.key] as DataTableSortable)

    // A copy, never `rows` itself — sorting a prop in place reorders the
    // caller's array behind its back. `sort` is stable, so ties hold their
    // original order instead of shuffling on every re-sort.
    return [...source].sort((a, b) => compareSortable(valueOf(a), valueOf(b), active.direction))
  })
}
