<script setup lang="ts">
import {
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'reka-ui'
import { computed, watch, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'
import Field from '../Field/Field.vue'
import Select from '../Select/Select.vue'
import type { SelectOption } from '../Select/types'
import {
  tablePaginationEllipsisVariants,
  tablePaginationItemVariants,
  tablePaginationSummaryVariants,
  tablePaginationVariants,
  type TablePaginationVariants,
} from './TablePagination.variants'

defineOptions({ name: 'RkTablePagination' })

const props = withDefaults(
  defineProps<{
    /** Total number of rows across all pages. */
    total: number
    /** Choices offered in the rows-per-page control. */
    pageSizeOptions?: number[]
    /** How many page numbers to show on each side of the current one. */
    siblingCount?: number
    /**
     * Always show the first and last page, with ellipses between.
     *
     * On by default, unlike the Reka primitive underneath. Without it a user on
     * page 12 of 25 sees only `11 12 13` — no indication of how far the table
     * runs and no way to reach the end. For a table that extent is information,
     * not decoration.
     */
    showEdges?: boolean
    /** Shows the rows-per-page control. */
    showPageSize?: boolean
    /** Shows the "1–10 of 247" summary. */
    showSummary?: boolean
    /** Label for the rows-per-page control. */
    pageSizeLabel?: string
    /** Accessible name for the navigation region. */
    label?: string
    /** Accessible name for the previous-page control. */
    previousLabel?: string
    /** Accessible name for the next-page control. */
    nextLabel?: string
    /** Control height and text size. */
    size?: NonNullable<TablePaginationVariants['size']>
    /** Disables every control. */
    disabled?: boolean
    /** Additional classes, merged so a consumer's utility wins. */
    class?: HTMLAttributes['class']
  }>(),
  {
    pageSizeOptions: () => [10, 25, 50, 100],
    siblingCount: 1,
    showEdges: true,
    showPageSize: true,
    showSummary: true,
    pageSizeLabel: 'Rows per page',
    label: 'Pagination',
    previousLabel: 'Previous page',
    nextLabel: 'Next page',
    size: 'md',
    disabled: false,
  }
)

/** The current page, 1-based. */
const page = defineModel<number>('page', { default: 1 })

/** Rows per page. */
const pageSize = defineModel<number>('pageSize', { default: 10 })

defineSlots<{
  /** Replaces the range summary. */
  summary: (props: { from: number; to: number; total: number }) => unknown
}>()

/**
 * Never below 1. A zero-page table would leave the controls in a state with no
 * valid page to be on, and `page` is 1-based with no meaningful zero.
 */
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / pageSize.value)))

/** First row shown, 1-based. Zero only when there is nothing at all. */
const from = computed(() => (props.total === 0 ? 0 : (page.value - 1) * pageSize.value + 1))

/** Last row shown. Clamped, because the final page is usually partial. */
const to = computed(() => Math.min(page.value * pageSize.value, props.total))

const pageSizeChoices = computed<SelectOption<number>[]>(() =>
  props.pageSizeOptions.map((value) => ({ label: String(value), value }))
)

/**
 * Changing the page size keeps the first currently-visible row visible instead
 * of resetting to page 1.
 *
 * Someone on page 9 who switches from 10 rows to 25 is looking for more context
 * on what they are already reading, not asking to start over — and a reset
 * silently loses their place in a long list.
 */
watch(pageSize, (next, previous) => {
  if (previous === undefined || next === previous) return
  const firstVisibleIndex = (page.value - 1) * previous
  page.value = Math.min(Math.floor(firstVisibleIndex / next) + 1, pageCount.value)
})

/**
 * A filter that shrinks the result set can strand the user past the end, where
 * the table renders nothing and looks broken. Watching `pageCount` covers both
 * causes — fewer rows, or more rows per page.
 */
watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})
</script>

<template>
  <div :class="cn(tablePaginationVariants({ size: props.size }), props.class)">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <p v-if="props.showSummary" :class="tablePaginationSummaryVariants({ size: props.size })">
        <slot name="summary" :from="from" :to="to" :total="props.total">
          <!-- Reads "0 of 0" when empty rather than the nonsensical "1–0 of 0". -->
          <template v-if="props.total === 0">0 of 0</template>
          <template v-else>{{ from }}–{{ to }} of {{ props.total }}</template>
        </slot>
      </p>

      <Field
        v-if="props.showPageSize"
        :label="props.pageSizeLabel"
        size="sm"
        :disabled="props.disabled"
        class="flex-row items-center gap-2"
      >
        <Select v-model="pageSize" :options="pageSizeChoices" size="sm" class="w-20" />
      </Field>
    </div>

    <PaginationRoot
      v-model:page="page"
      as="nav"
      :aria-label="props.label"
      :items-per-page="pageSize"
      :total="props.total"
      :sibling-count="props.siblingCount"
      :show-edges="props.showEdges"
      :disabled="props.disabled"
      class="flex items-center gap-1"
    >
      <PaginationPrev
        :aria-label="props.previousLabel"
        :class="tablePaginationItemVariants({ size: props.size })"
      >
        <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="m12 5-5 5 5 5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </PaginationPrev>

      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <template v-for="(item, index) in items" :key="index">
          <PaginationListItem
            v-if="item.type === 'page'"
            :value="item.value"
            :aria-current="item.value === page ? 'page' : undefined"
            :class="tablePaginationItemVariants({ size: props.size, active: item.value === page })"
          >
            {{ item.value }}
          </PaginationListItem>
          <!--
            Hidden from assistive technology: the gap is a visual device for
            keeping the row short, and the page numbers either side already say
            everything a reader needs.
          -->
          <PaginationEllipsis
            v-else
            aria-hidden="true"
            :class="tablePaginationEllipsisVariants({ size: props.size })"
          >
            …
          </PaginationEllipsis>
        </template>
      </PaginationList>

      <PaginationNext
        :aria-label="props.nextLabel"
        :class="tablePaginationItemVariants({ size: props.size })"
      >
        <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="m8 5 5 5-5 5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </PaginationNext>
    </PaginationRoot>
  </div>
</template>
