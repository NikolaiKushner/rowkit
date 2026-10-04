<script setup lang="ts" generic="TRow extends DataTableRow">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import CheckGlyphIcon from '../../icons/CheckGlyphIcon.vue'
import RadioMark from '../../icons/RadioMark.vue'
import TriangleDownIcon from '../../icons/TriangleDownIcon.vue'
import TriangleUpIcon from '../../icons/TriangleUpIcon.vue'
import Checkbox from '../../primitives/Checkbox.vue'
import { cn } from '../../utils/cn'
import EmptyState from '../EmptyState/EmptyState.vue'
import Skeleton from '../Skeleton/Skeleton.vue'
import {
  dataTableCaptionVariants,
  dataTableCellVariants,
  dataTableCheckboxBarClass,
  dataTableCheckboxVariants,
  dataTableFrameVariants,
  dataTableHeaderCellVariants,
  dataTableHeaderRowVariants,
  dataTablePinnedShadow,
  dataTableRadioInputClass,
  dataTableRadioMarkClass,
  dataTableRadioVariants,
  dataTableRootVariants,
  dataTableRowVariants,
  dataTableSelectCellVariants,
  dataTableSortButtonVariants,
  dataTableSortContentVariants,
  dataTableSortIconVariants,
  dataTableSortLabelVariants,
  dataTableVariants,
  dataTableWrapperVariants,
} from './DataTable.variants'
import {
  columnId,
  isFieldColumn,
  nextSort,
  type DataTableColumn,
  type DataTableProps,
  type DataTableFieldColumn,
  type DataTableRow,
  type DataTableSort,
} from './types'

defineOptions({ name: 'RkDataTable' })

const props = withDefaults(defineProps<DataTableProps<TRow>>(), {
  captionVisible: false,
  loading: false,
  loadingRows: 5,
  loadingLabel: 'Loading',
  emptyTitle: 'Nothing to show',
  selectionLabel: 'Select',
  selectAllLabel: 'Select all rows',
  size: 'md',
  hoverable: false,
})

/** The sorted column and direction. `undefined` is unsorted. */
const sort = defineModel<DataTableSort<TRow> | undefined>('sort', { default: undefined })

/**
 * The selected rows, by id.
 *
 * Always an array, including in `single` mode where it holds at most one. Two
 * different shapes for one model would mean every consumer branching on the
 * mode to read their own state.
 */
const selected = defineModel<TRow['id'][]>('selected', { default: () => [] })

type CellSlotProps = { row: TRow; column: DataTableColumn<TRow>; value: unknown; index: number }

const emit = defineEmits<{
  /**
   * A row was activated — clicked, or focused and confirmed with Enter or
   * Space.
   *
   * Adding a listener puts rows in the tab order. **A clickable row is an
   * enhancement, never the only path**: whatever it does must also exist as a
   * real control inside the row, because a pointer-only affordance is
   * unreachable for anyone not using a pointer.
   */
  'row:click': [row: TRow]
}>()

defineSlots<
  {
    /** Fallback renderer for every cell. */
    cell?: (props: CellSlotProps) => unknown
    /** Replaces the built-in empty state. */
    empty?: () => unknown
    /** Replaces the placeholder rows shown while loading. */
    loading?: () => unknown
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

/**
 * Rows are only interactive when someone is listening. Without a `row:click`
 * handler they stay out of the tab order entirely, rather than adding a tab
 * stop per row to every table in the library.
 */
const instance = getCurrentInstance()

// A declared emit is stripped from `$attrs`, so the listener has to be read off
// the vnode. The key is `onRow:click` — Vue prefixes `on` and leaves the rest,
// colon included.
const isClickable = computed(() => instance?.vnode.props?.['onRow:click'] !== undefined)

const rowsAreInteractive = computed(() => props.hoverable || isClickable.value)

function activateRow(row: TRow, event: MouseEvent | KeyboardEvent): void {
  if (!isClickable.value) return
  // A click on a control inside the row belongs to that control. Without this,
  // ticking a checkbox or pressing Edit also fires the row.
  const target = event.target
  if (target instanceof Element && target.closest('button, a, input, select, textarea, label')) {
    return
  }
  if (event instanceof KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    // Space scrolls the page otherwise.
    event.preventDefault()
  }
  emit('row:click', row)
}

/** Only a field column can be sorted — `DataTableSort` names a field of the row. */
function isSortable(column: DataTableColumn<TRow>): column is DataTableFieldColumn<TRow> {
  return isFieldColumn(column) && column.sortable === true
}

/**
 * The rows as rendered — which is exactly `props.rows`.
 *
 * The table never sorts its own data. It reports the sort the user asked for
 * and renders what it is handed, so a server-paged table cannot end up
 * reordering only the page on screen and looking sorted while being wrong.
 * `useClientSort` provides the local convenience for tables that hold
 * everything.
 */
const displayRows = computed(() => props.rows)

const isEmpty = computed(() => !props.loading && props.rows.length === 0)

function sortStateOf(
  column: DataTableColumn<TRow>
): 'ascending' | 'descending' | 'none' | undefined {
  if (!isSortable(column)) return undefined
  // `none` rather than omitted: it is what tells a screen reader the column is
  // sortable but not currently sorted.
  if (sort.value?.key !== column.key) return 'none'
  return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}

function isSortedBy(column: DataTableColumn<TRow>): boolean {
  return isFieldColumn(column) && sort.value?.key === column.key
}

function toggleSort(column: DataTableColumn<TRow>): void {
  if (!isSortable(column)) return
  sort.value = nextSort(sort.value, column.key)
}

/** Groups the radios in `single` mode without needing a wrapper element. */
const radioName = useId()

const selectedKeys = computed(() => new Set(selected.value))

/** Total columns rendered, so the empty state spans the selection column too. */
const columnCount = computed(() => props.columns.length + (props.selectable === undefined ? 0 : 1))

/** The keys on screen. Not the whole data set — see `toggleAll`. */
const visibleKeys = computed(() => displayRows.value.map((row) => row.id))

const allVisibleSelected = computed(
  () =>
    visibleKeys.value.length > 0 && visibleKeys.value.every((key) => selectedKeys.value.has(key))
)

const someVisibleSelected = computed(() =>
  visibleKeys.value.some((key) => selectedKeys.value.has(key))
)

const selectAllState = computed<boolean | 'indeterminate'>(() => {
  if (allVisibleSelected.value) return true
  return someVisibleSelected.value ? 'indeterminate' : false
})

/**
 * Select-all covers the rows on screen, and leaves any others alone.
 *
 * With pagination that distinction is the whole game: clearing the selection
 * outright would silently drop rows the user picked on page one, and selecting
 * "all" cannot mean rows the table has never been given.
 */
function toggleAll(): void {
  const visible = new Set(visibleKeys.value)
  selected.value = allVisibleSelected.value
    ? selected.value.filter((key) => !visible.has(key))
    : [...selected.value, ...visibleKeys.value.filter((key) => !selectedKeys.value.has(key))]
}

function setRowSelected(key: TRow['id'], isSelected: boolean): void {
  if (props.selectable === 'single') {
    selected.value = isSelected ? [key] : []
    return
  }
  selected.value = isSelected
    ? [...selected.value, key]
    : selected.value.filter((candidate) => candidate !== key)
}

function labelFor(row: TRow, index: number): string {
  return props.rowLabel?.(row, index) ?? `Select row ${String(index + 1)}`
}

/**
 * Field names are widened to `string` before indexing. `keyof TRow` is still
 * generic here, so an index expression typed with it cannot be resolved — the
 * lookup is genuinely dynamic, and the widening says so rather than hiding it.
 */
function readField(row: TRow, field: string): unknown {
  return (row as Record<string, unknown>)[field]
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
  ...(props.emptyReason === undefined ? {} : { reason: props.emptyReason }),
  ...(props.emptyDescription === undefined ? {} : { description: props.emptyDescription }),
}))

function pinnedClass(column: DataTableColumn<TRow>): string | false {
  return (column.sticky ?? false) && scrolledFromStart.value && dataTablePinnedShadow
}
</script>

<template>
  <div data-slot="data-table" :class="cn(dataTableRootVariants(), props.class)">
    <!--
      The visible caption sits above the frame, on the window face, as in a
      Windows 98 dialog. The table keeps its own <caption> for assistive
      technology, so this copy is hidden from it.
    -->
    <p
      v-if="props.captionVisible"
      aria-hidden="true"
      :class="dataTableCaptionVariants({ size: props.size })"
    >
      {{ props.caption }}
    </p>

    <div data-slot="data-table-frame" :class="dataTableFrameVariants()">
      <div
        ref="wrapperRef"
        data-slot="data-table-scroll"
        :tabindex="scrollable ? 0 : undefined"
        :role="scrollable ? 'region' : undefined"
        :aria-label="scrollable ? props.caption : undefined"
        :class="dataTableWrapperVariants()"
        @scroll.passive="onScroll"
      >
        <!--
      A persistent live region. Rendering one only while loading is unreliable:
      a region added at the same moment as its content frequently goes
      unannounced, so the element stays and only its text changes.
    -->
        <p role="status" class="sr-only">{{ props.loading ? props.loadingLabel : '' }}</p>

        <table ref="tableRef" :class="dataTableVariants({ size: props.size })">
          <caption class="sr-only">
            {{
              props.caption
            }}
          </caption>

          <thead>
            <tr :class="dataTableHeaderRowVariants()">
              <th
                v-if="props.selectable !== undefined"
                scope="col"
                :class="
                  cn(
                    dataTableHeaderCellVariants({ size: props.size, sticky: true }),
                    dataTableSelectCellVariants({ size: props.size, header: true })
                  )
                "
              >
                <!--
              Single selection has nothing to select all of, so the column is
              named in text instead. Either way the header is never empty.
            -->
                <Checkbox
                  v-if="props.selectable === 'multiple'"
                  :model-value="selectAllState"
                  :aria-label="props.selectAllLabel"
                  :class="dataTableCheckboxVariants({ size: props.size })"
                  @update:model-value="toggleAll"
                >
                  <span
                    v-if="selectAllState === 'indeterminate'"
                    :class="dataTableCheckboxBarClass"
                  />
                  <CheckGlyphIcon v-else />
                </Checkbox>
                <span v-else class="sr-only">{{ props.selectionLabel }}</span>
              </th>

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
                      align: column.align ?? (column.numeric === true ? 'end' : 'start'),
                      sticky: true,
                      pinned: column.sticky ?? false,
                      sortable: isSortable(column),
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
                  v-if="isSortable(column)"
                  type="button"
                  :class="
                    dataTableSortButtonVariants({
                      size: props.size,
                      align: column.align ?? (column.numeric === true ? 'end' : 'start'),
                    })
                  "
                  @click="toggleSort(column)"
                >
                  <span :class="dataTableSortContentVariants()">
                    <span
                      :class="
                        cn(dataTableSortLabelVariants(), column.headerSrOnly === true && 'sr-only')
                      "
                      >{{ column.header }}</span
                    >
                    <template v-if="isSortedBy(column)">
                      <TriangleDownIcon
                        v-if="sort?.direction === 'desc'"
                        :class="dataTableSortIconVariants()"
                      />
                      <TriangleUpIcon v-else :class="dataTableSortIconVariants()" />
                    </template>
                  </span>
                </button>
                <span v-else :class="column.headerSrOnly === true && 'sr-only'">
                  {{ column.header }}
                </span>
              </th>
            </tr>
          </thead>

          <tbody :aria-busy="props.loading ? 'true' : undefined">
            <template v-if="props.loading">
              <slot name="loading">
                <tr v-for="row in props.loadingRows" :key="`skeleton-${row}`">
                  <td
                    v-if="props.selectable !== undefined"
                    :class="dataTableSelectCellVariants({ size: props.size })"
                  >
                    <!-- Empty while loading: there is nothing to select yet. -->
                  </td>
                  <td
                    v-for="column in props.columns"
                    :key="columnId(column)"
                    :class="
                      cn(
                        dataTableCellVariants({
                          size: props.size,
                          align: column.align ?? (column.numeric === true ? 'end' : 'start'),
                          pinned: column.sticky ?? false,
                          numeric: column.numeric ?? false,
                        }),
                        pinnedClass(column)
                      )
                    "
                  >
                    <!-- Decorative by default: one announcement above, not one per cell. -->
                    <Skeleton />
                  </td>
                </tr>
              </slot>
            </template>

            <tr v-else-if="isEmpty">
              <td :colspan="columnCount">
                <slot name="empty">
                  <!-- Centred in the body with 16px above and below, as the Figma table draws it. -->
                  <EmptyState v-bind="emptyStateProps" class="mx-auto my-4" />
                </slot>
              </td>
            </tr>

            <tr
              v-for="(row, index) in displayRows"
              v-else
              :key="row.id"
              :data-selected="selectedKeys.has(row.id) ? '' : undefined"
              :tabindex="isClickable ? 0 : undefined"
              :class="
                dataTableRowVariants({
                  interactive: rowsAreInteractive,
                  selected: selectedKeys.has(row.id),
                })
              "
              @click="activateRow(row, $event)"
              @keydown="activateRow(row, $event)"
            >
              <!--
            No `aria-selected` on the row. It is only valid inside a `grid`, and
            this is a plain `table`; the control's own checked state is what
            carries the selection.
          -->
              <td
                v-if="props.selectable !== undefined"
                :class="dataTableSelectCellVariants({ size: props.size })"
              >
                <Checkbox
                  v-if="props.selectable === 'multiple'"
                  :model-value="selectedKeys.has(row.id)"
                  :aria-label="labelFor(row, index)"
                  :class="dataTableCheckboxVariants({ size: props.size })"
                  @update:model-value="setRowSelected(row.id, $event === true)"
                >
                  <CheckGlyphIcon />
                </Checkbox>
                <!--
              A native radio, not a RadioGroup component. A radio group's root owns
              the roving tabstop and would have to wrap the table, putting
              `role="radiogroup"` on it and destroying its table semantics. A
              shared `name` groups native radios with no wrapper at all.
            -->
                <span v-else :class="dataTableRadioVariants({ size: props.size })">
                  <input
                    type="radio"
                    :name="radioName"
                    :checked="selectedKeys.has(row.id)"
                    :aria-label="labelFor(row, index)"
                    :class="dataTableRadioInputClass"
                    @change="setRowSelected(row.id, true)"
                  />
                  <RadioMark :class="dataTableRadioMarkClass" />
                </span>
              </td>

              <td
                v-for="column in props.columns"
                :key="columnId(column)"
                :class="
                  cn(
                    dataTableCellVariants({
                      size: props.size,
                      align: column.align ?? (column.numeric === true ? 'end' : 'start'),
                      pinned: column.sticky ?? false,
                      numeric: column.numeric ?? false,
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
    </div>
  </div>
</template>
