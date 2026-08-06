<script setup lang="ts">
import {
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'reka-ui'
import { computed } from 'vue'
import { cn } from '../../utils/cn'
import Field from '../Field/Field.vue'
import Select from '../Select/Select.vue'
import type { SelectOption } from '../Select/types'
import {
  paginationEllipsisVariants,
  paginationItemVariants,
  paginationSummaryVariants,
  paginationVariants,
} from './Pagination.variants'

import type { PaginationProps } from './types'

defineOptions({ name: 'RkPagination' })

const props = withDefaults(defineProps<PaginationProps>(), {
  pageSizeOptions: () => [10, 25, 50, 100],
  siblingCount: 1,
  showEdges: true,
  hidePageSize: false,
  hideSummary: false,
  pageSizeLabel: 'Rows per page',
  label: 'Pagination',
  previousLabel: 'Previous page',
  nextLabel: 'Next page',
  size: 'md',
  disabled: false,
})

/** The current page, 1-based. */
const page = defineModel<number>('page', { default: 1 })

/** Rows per page. */
const pageSize = defineModel<number>('pageSize', { default: 10 })

defineSlots<{
  /** Replaces the range summary. */
  summary: (props: { from: number; to: number; total: number }) => unknown
}>()

/** First row shown, 1-based. Zero only when there is nothing at all. */
const from = computed(() => (props.total === 0 ? 0 : (page.value - 1) * pageSize.value + 1))

/** Last row shown. Clamped, because the final page is usually partial. */
const to = computed(() => Math.min(page.value * pageSize.value, props.total))

const pageSizeChoices = computed<SelectOption<number>[]>(() =>
  props.pageSizeOptions.map((value) => ({ label: String(value), value }))
)

/**
 * This component never moves the page by itself.
 *
 * Changing the page size emits `update:pageSize` and nothing else; a shrinking
 * `total` emits nothing at all. Both are the application's to respond to,
 * because only it knows whether a page change means a refetch, a URL rewrite,
 * or nothing.
 *
 * An earlier version clamped an out-of-range page and re-anchored the page on a
 * size change. It read as helpful and was not: a component making a second
 * decision on the consumer's behalf is how "why did my page jump" bugs happen,
 * and it fought applications that had already handled it. Resetting to page 1
 * when the result set changes is one line at the call site — see the docs.
 */

/** Nothing to page through, so nothing should look operable. */
const isDisabled = computed(() => props.disabled || props.total === 0)
</script>

<template>
  <div :class="cn(paginationVariants({ size: props.size }), props.class)">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <p v-if="!props.hideSummary" :class="paginationSummaryVariants({ size: props.size })">
        <slot name="summary" :from="from" :to="to" :total="props.total">
          <!-- Reads "0 of 0" when empty rather than the nonsensical "1–0 of 0". -->
          <template v-if="props.total === 0">0 of 0</template>
          <template v-else>{{ from }}–{{ to }} of {{ props.total }}</template>
        </slot>
      </p>

      <Field
        v-if="!props.hidePageSize"
        :label="props.pageSizeLabel"
        :size="props.size"
        :disabled="isDisabled"
        class="flex-row items-center gap-2 [&>label]:whitespace-nowrap"
      >
        <Select v-model="pageSize" :options="pageSizeChoices" :size="props.size" class="w-20" />
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
      :disabled="isDisabled"
      class="flex items-center gap-1"
    >
      <PaginationPrev
        :aria-label="props.previousLabel"
        :class="paginationItemVariants({ size: props.size })"
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
            :class="paginationItemVariants({ size: props.size, active: item.value === page })"
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
            :class="paginationEllipsisVariants({ size: props.size })"
          >
            …
          </PaginationEllipsis>
        </template>
      </PaginationList>

      <PaginationNext
        :aria-label="props.nextLabel"
        :class="paginationItemVariants({ size: props.size })"
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
