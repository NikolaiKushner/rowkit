<script setup lang="ts">
import { computed } from 'vue'
import { pageCount, pageItems } from '../../primitives/pagination'
import { cn } from '../../utils/cn'
import Field from '../Field/Field.vue'
import Select from '../Select/Select.vue'
import SelectContent from '../Select/SelectContent.vue'
import SelectItem from '../Select/SelectItem.vue'
import SelectTrigger from '../Select/SelectTrigger.vue'
import type { SelectOption } from '../Select/types'
import TriangleLeftIcon from '../../icons/TriangleLeftIcon.vue'
import TriangleRightIcon from '../../icons/TriangleRightIcon.vue'
import Button from '../Button/Button.vue'
import {
  paginationEllipsisVariants,
  paginationItemVariants,
  paginationNavVariants,
  paginationStepVariants,
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
  previousLabel: 'Back',
  nextLabel: 'Next',
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

const lastPage = computed(() => pageCount(props.total, pageSize.value))

const items = computed(() =>
  pageItems(page.value, lastPage.value, props.siblingCount, props.showEdges)
)

/** The page buttons are Button at its two smallest sizes: 17px and 21px. */
const buttonSize = computed(() => (props.size === 'sm' ? 'xs' : 'sm'))

function goTo(target: number): void {
  if (!isDisabled.value) page.value = target
}
</script>

<template>
  <div data-slot="pagination" :class="cn(paginationVariants({ size: props.size }), props.class)">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <p v-if="!props.hideSummary" :class="paginationSummaryVariants()">
        <slot name="summary" :from="from" :to="to" :total="props.total">
          <!-- Reads "0 of 0" when empty rather than the nonsensical "1–0 of 0". -->
          <template v-if="props.total === 0">0 of 0</template>
          <template v-else>{{ from }}–{{ to }} of {{ props.total }}</template>
        </slot>
      </p>

      <Field
        v-if="!props.hidePageSize"
        layout="left"
        :label="props.pageSizeLabel"
        :size="props.size"
        :disabled="isDisabled"
        class="[&>label]:whitespace-nowrap"
      >
        <Select v-model="pageSize">
          <SelectTrigger :size="props.size" class="w-16" />
          <SelectContent>
            <SelectItem
              v-for="option in pageSizeChoices"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </SelectContent>
        </Select>
      </Field>
    </div>

    <nav :aria-label="props.label" :class="paginationNavVariants()">
      <!-- The visible label is the accessible name: "Back", not an unseen "Previous page". -->
      <Button
        variant="secondary"
        :size="buttonSize"
        data-type="previous"
        :disabled="isDisabled || page === 1"
        :class="paginationStepVariants()"
        @click="goTo(page - 1)"
      >
        <template #leading><TriangleLeftIcon /></template>
        {{ props.previousLabel }}
      </Button>

      <template v-for="(item, index) in items" :key="index">
        <Button
          v-if="item.type === 'page'"
          variant="secondary"
          :size="buttonSize"
          data-type="page"
          :aria-label="`Page ${item.value}`"
          :aria-current="item.value === page ? 'page' : undefined"
          :data-selected="item.value === page ? 'true' : undefined"
          :disabled="isDisabled"
          :class="paginationItemVariants({ size: props.size })"
          @click="goTo(item.value)"
        >
          {{ item.value }}
        </Button>
        <!--
          Hidden from assistive technology: the gap is a visual device for
          keeping the row short, and the page numbers either side already say
          everything a reader needs.
        -->
        <div
          v-else
          data-type="ellipsis"
          aria-hidden="true"
          :class="paginationEllipsisVariants({ size: props.size })"
        >
          …
        </div>
      </template>

      <Button
        variant="secondary"
        :size="buttonSize"
        data-type="next"
        :disabled="isDisabled || page === lastPage"
        :class="paginationStepVariants()"
        @click="goTo(page + 1)"
      >
        {{ props.nextLabel }}
        <template #trailing><TriangleRightIcon /></template>
      </Button>
    </nav>
  </div>
</template>
