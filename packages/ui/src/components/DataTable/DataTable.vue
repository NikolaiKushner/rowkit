<script setup lang="ts" generic="TRow extends object">
import { computed, onBeforeUnmount, onMounted, ref, watch, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'
import EmptyState from '../EmptyState/EmptyState.vue'
import Skeleton from '../Skeleton/Skeleton.vue'
import {
  dataTableCaptionVariants,
  dataTableCellVariants,
  dataTableHeaderCellVariants,
  dataTablePinnedShadow,
  dataTableRowVariants,
  dataTableSortButtonVariants,
  dataTableSortIconVariants,
  dataTableVariants,
  dataTableWrapperVariants,
  type DataTableVariants,
} from './DataTable.variants'
import {
  columnId,
  compareSortable,
  isFieldColumn,
  nextSort,
  type DataTableColumn,
  type DataTableRowKey,
  type DataTableSort,
  type DataTableSortable,
} from './types'

defineOptions({ name: 'RkDataTable' })

const props = withDefaults(
  defineProps<{
    /** The rows to render. */
    rows: TRow[]
    /** Column definitions, in display order. */
    columns: DataTableColumn<TRow>[]
    /**
     * What makes a row unique — a field name, or a function.
     *
     * Required rather than defaulting to the array index, because an index is
     * not an identity: once the table can sort or filter, index keys make Vue
     * reuse the wrong DOM and cell state ends up on the wrong row.
     */
    rowKey: DataTableRowKey<TRow>
    /**
     * Accessible name for the table.
     *
     * Required. A table with no name is an unlabelled region, and a screen
     * reader user listing tables on a page sees only "table" repeated.
     */
    caption: string
    /** Shows the caption. It is available to assistive technology either way. */
    captionVisible?: boolean
    /** Swaps the body for placeholder rows. */
    loading?: boolean
    /** How many placeholder rows to show while loading. */
    loadingRows?: number
    /** Announced while loading. */
    loadingLabel?: string
    /** Title for the built-in empty state. */
    emptyTitle?: string
    /** Description for the built-in empty state. */
    emptyDescription?: string
    /**
     * Who does the sorting.
     *
     * `manual` reports the sort and leaves the rows alone — correct whenever
     * the server orders and pages the data, which is the case this library is
     * built for. `client` reorders `rows` in place.
     *
     * Defaults to `manual` because the wrong choice fails quietly: `client`
     * combined with server-side pagination sorts only the page you can see, and
     * a table that looks sorted but is not is worse than one that plainly is
     * not.
     */
    sortMode?: 'manual' | 'client'
    /** Row height and text size. */
    size?: NonNullable<DataTableVariants['size']>
    /** Highlights rows on hover. Only turn this on when a row does something. */
    hoverable?: boolean
    /** Additional classes for the scroll container, merged so a consumer's utility wins. */
    class?: HTMLAttributes['class']
  }>(),
  {
    captionVisible: false,
    loading: false,
    loadingRows: 5,
    loadingLabel: 'Loading',
    emptyTitle: 'Nothing to show',
    sortMode: 'manual',
    size: 'md',
    hoverable: false,
  }
)

/** The sorted column and direction. `undefined` is unsorted. */
const sort = defineModel<DataTableSort | undefined>('sort', { default: undefined })

type CellSlotProps = { row: TRow; column: DataTableColumn<TRow>; value: unknown; index: number }

defineSlots<
  {
    /** Fallback renderer for every cell. */
    cell?: (props: CellSlotProps) => unknown
    /** Replaces the built-in empty state. */
    empty?: () => unknown
  } & Record<`cell:${string}`, ((props: CellSlotProps) => unknown) | undefined>
>()

const wrapperRef = ref<HTMLElement>()
const tableRef = ref<HTMLElement>()

/**
 * Whether anything is hidden behind a pinned column. Drives the scroll shadow,
 * which is the only cue that the table continues past the left edge.
 */
const scrolledFromStart = ref(false)

function onScroll(): void {
  scrolledFromStart.value = (wrapperRef.value?.scrollLeft ?? 0) > 0
}

/**
 * Whether the container actually scrolls.
 *
 * A scrollable box that nothing inside can take focus is unreachable by
 * keyboard — there is no way to scroll it without a pointer. The fix is a tab
 * stop, but adding one unconditionally puts a stop on every table whether or
 * not it scrolls, so it is measured instead of assumed.
 */
const scrollable = ref(false)

function measure(): void {
  const el = wrapperRef.value
  if (!el) return
  scrollable.value = el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  measure()
  if (typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(measure)
  // Both: the box can change size, and so can the table inside it.
  if (wrapperRef.value) resizeObserver.observe(wrapperRef.value)
  if (tableRef.value) resizeObserver.observe(tableRef.value)
})

onBeforeUnmount(() => resizeObserver?.disconnect())

// Row and column changes alter the table's size without resizing the box.
watch(() => [props.rows.length, props.columns.length, props.loading], measure, { flush: 'post' })

function sortValueOf(row: TRow, column: DataTableColumn<TRow>): DataTableSortable {
  if (column.sortValue !== undefined) return column.sortValue(row)
  if (!isFieldColumn(column)) return undefined
  return readField(row, column.key) as DataTableSortable
}

/**
 * The rows as rendered. A copy is sorted, never `props.rows` itself — mutating
 * a prop would reorder the caller's array behind its back.
 *
 * `Array.prototype.sort` is stable, so rows that tie keep the order they
 * arrived in rather than shuffling on every re-sort.
 */
const displayRows = computed(() => {
  const active = sort.value
  if (props.sortMode !== 'client' || active === undefined) return props.rows

  const column = props.columns.find((candidate) => columnId(candidate) === active.id)
  if (column === undefined) return props.rows

  return [...props.rows].sort((a, b) =>
    compareSortable(sortValueOf(a, column), sortValueOf(b, column), active.direction)
  )
})

const isEmpty = computed(() => !props.loading && props.rows.length === 0)

function sortStateOf(
  column: DataTableColumn<TRow>
): 'ascending' | 'descending' | 'none' | undefined {
  if (column.sortable !== true) return undefined
  // `none` rather than omitted: it is what tells a screen reader the column is
  // sortable but not currently sorted.
  if (sort.value?.id !== columnId(column)) return 'none'
  return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}

function isSortedBy(column: DataTableColumn<TRow>): boolean {
  return sort.value?.id === columnId(column)
}

function toggleSort(column: DataTableColumn<TRow>): void {
  if (column.sortable !== true) return
  sort.value = nextSort(sort.value, columnId(column))
}

/**
 * Field names are widened to `string` before indexing. `keyof TRow` is still
 * generic here, so an index expression typed with it cannot be resolved — the
 * lookup is genuinely dynamic, and the widening says so rather than hiding it.
 */
function readField(row: TRow, field: string): unknown {
  return (row as Record<string, unknown>)[field]
}

function keyFor(row: TRow, index: number): PropertyKey {
  const rowKey = props.rowKey
  if (typeof rowKey === 'function') return rowKey(row, index)
  return readField(row, rowKey) as PropertyKey
}

function cellValue(row: TRow, column: DataTableColumn<TRow>): unknown {
  return isFieldColumn(column) ? readField(row, column.key) : undefined
}

/**
 * Only primitives render on their own. Anything else — a date, an object, an
 * array — returns blank rather than "[object Object]", so the missing cell
 * slot is obvious instead of shipping to production as noise.
 */
function display(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value)
  }
  return ''
}

/**
 * Optional props spread in only when set. Under `exactOptionalPropertyTypes`,
 * binding `:description="undefined"` to an optional prop is a type error rather
 * than an omission — the same reason `Select` builds its root props this way.
 */
const emptyStateProps = computed(() => ({
  title: props.emptyTitle,
  size: 'sm' as const,
  level: 3 as const,
  ...(props.emptyDescription === undefined ? {} : { description: props.emptyDescription }),
}))

function pinnedClass(column: DataTableColumn<TRow>): string | false {
  return (column.sticky ?? false) && scrolledFromStart.value && dataTablePinnedShadow
}
</script>

<template>
  <div
    ref="wrapperRef"
    :tabindex="scrollable ? 0 : undefined"
    :role="scrollable ? 'region' : undefined"
    :aria-label="scrollable ? props.caption : undefined"
    :class="cn(dataTableWrapperVariants(), props.class)"
    @scroll.passive="onScroll"
  >
    <!--
      A persistent live region. Rendering one only while loading is unreliable:
      a region added at the same moment as its content frequently goes
      unannounced, so the element stays and only its text changes.
    -->
    <p role="status" class="sr-only">{{ props.loading ? props.loadingLabel : '' }}</p>

    <table ref="tableRef" :class="dataTableVariants({ size: props.size })">
      <caption
        :class="
          cn(dataTableCaptionVariants({ size: props.size }), !props.captionVisible && 'sr-only')
        "
      >
        {{
          props.caption
        }}
      </caption>

      <thead>
        <tr>
          <th
            v-for="column in props.columns"
            :key="columnId(column)"
            scope="col"
            :aria-sort="sortStateOf(column)"
            :style="column.width === undefined ? undefined : { width: column.width }"
            :class="
              cn(
                dataTableHeaderCellVariants({
                  size: props.size,
                  align: column.align ?? 'start',
                  sticky: true,
                  pinned: column.sticky ?? false,
                }),
                pinnedClass(column),
                column.headerClass
              )
            "
          >
            <!--
              Never an empty `<th>`: a column with no name is a column a screen
              reader cannot announce.

              The label is only ever the column name. `aria-sort` on the `<th>`
              already conveys the state, so repeating "sorted ascending" in the
              button would have it announced twice.
            -->
            <button
              v-if="column.sortable === true"
              type="button"
              :class="dataTableSortButtonVariants({ align: column.align ?? 'start' })"
              @click="toggleSort(column)"
            >
              <span :class="column.headerSrOnly === true && 'sr-only'">{{ column.header }}</span>
              <svg
                :class="dataTableSortIconVariants({ active: isSortedBy(column) })"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  :d="
                    sort?.id === columnId(column) && sort.direction === 'desc'
                      ? 'm6 8 4 4 4-4'
                      : 'm6 12 4-4 4 4'
                  "
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <span v-else :class="column.headerSrOnly === true && 'sr-only'">
              {{ column.header }}
            </span>
          </th>
        </tr>
      </thead>

      <tbody :aria-busy="props.loading ? 'true' : undefined">
        <template v-if="props.loading">
          <tr v-for="row in props.loadingRows" :key="`skeleton-${row}`">
            <td
              v-for="column in props.columns"
              :key="columnId(column)"
              :class="
                cn(
                  dataTableCellVariants({
                    size: props.size,
                    align: column.align ?? 'start',
                    pinned: column.sticky ?? false,
                  }),
                  pinnedClass(column)
                )
              "
            >
              <!-- Decorative by default: one announcement above, not one per cell. -->
              <Skeleton />
            </td>
          </tr>
        </template>

        <tr v-else-if="isEmpty">
          <td :colspan="props.columns.length" class="border-t border-border-subtle">
            <slot name="empty">
              <EmptyState v-bind="emptyStateProps" />
            </slot>
          </td>
        </tr>

        <tr
          v-for="(row, index) in displayRows"
          v-else
          :key="keyFor(row, index)"
          :class="dataTableRowVariants({ interactive: props.hoverable })"
        >
          <td
            v-for="column in props.columns"
            :key="columnId(column)"
            :class="
              cn(
                dataTableCellVariants({
                  size: props.size,
                  align: column.align ?? 'start',
                  pinned: column.sticky ?? false,
                }),
                pinnedClass(column),
                column.cellClass
              )
            "
          >
            <!--
              Per-column slot first, then a general one, then the raw value.
              The fallback chain is what lets a table define twelve columns and
              only write markup for the two that need it.
            -->
            <slot
              :name="`cell:${columnId(column)}`"
              :row="row"
              :column="column"
              :value="cellValue(row, column)"
              :index="index"
            >
              <slot
                name="cell"
                :row="row"
                :column="column"
                :value="cellValue(row, column)"
                :index="index"
              >
                {{ display(cellValue(row, column)) }}
              </slot>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
