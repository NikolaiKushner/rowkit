<script setup lang="ts">
import { computed, nextTick, ref, watch, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'
import Button from '../Button/Button.vue'
import Field from '../Field/Field.vue'
import Input from '../Input/Input.vue'
import {
  filterBarChipRemoveVariants,
  filterBarChipsVariants,
  filterBarChipVariants,
  filterBarControlsVariants,
  filterBarSummaryVariants,
  filterBarVariants,
  type FilterBarVariants,
} from './FilterBar.variants'
import type { FilterChip } from './types'

defineOptions({ name: 'RkFilterBar' })

const props = withDefaults(
  defineProps<{
    /**
     * The filters currently applied, shown as chips.
     *
     * Derived from your filter state rather than owned here — this component
     * displays what is applied and asks to remove it; the application decides
     * what that means.
     */
    filters?: FilterChip[]
    /**
     * Number of matching rows. Announced politely when it changes, which is
     * the only feedback a screen reader user gets that a filter did anything.
     */
    resultCount?: number
    /** Shows the search box. */
    searchable?: boolean
    /** Placeholder for the search box. */
    searchPlaceholder?: string
    /** Accessible name for the search box. Visually hidden. */
    searchLabel?: string
    /** Label for the clear-all control. */
    clearLabel?: string
    /**
     * Accessible name for the chip's remove control. `{filter}` is replaced
     * with the chip's text.
     */
    removeLabel?: string
    /**
     * Accessible name for the region.
     *
     * The bar is a `search` landmark, so it can be reached by landmark
     * navigation instead of only by tabbing through the controls. Give
     * concurrent instances distinct names — two landmarks sharing one is an
     * axe `landmark-unique` violation.
     */
    label?: string
    /** Control height and text size. */
    size?: NonNullable<FilterBarVariants['size']>
    /** Disables every control. */
    disabled?: boolean
    /** Additional classes, merged so a consumer's utility wins. */
    class?: HTMLAttributes['class']
  }>(),
  {
    filters: () => [],
    searchable: true,
    searchPlaceholder: 'Search…',
    searchLabel: 'Search',
    clearLabel: 'Clear all',
    removeLabel: 'Remove {filter} filter',
    label: 'Filters',
    size: 'md',
    disabled: false,
  }
)

const emit = defineEmits<{
  /** A chip's remove control was activated. The payload is the chip's `id`. */
  remove: [id: string]
  /** The clear-all control was activated. */
  clear: []
}>()

/** The search term. */
const search = defineModel<string>('search', { default: '' })

defineSlots<{
  /** Filter controls — `Select`s, date pickers, whatever the table needs. */
  controls: () => unknown
  /** Trailing actions, pushed to the end of the control row. */
  actions: () => unknown
  /** Replaces a chip's text. */
  chip: (props: { chip: FilterChip }) => unknown
  /** Replaces the result count. */
  summary: (props: { count: number }) => unknown
}>()

const rootRef = ref<HTMLElement>()

const hasChips = computed(() => props.filters.length > 0)
const hasCount = computed(() => props.resultCount !== undefined)

/** "Role: Admin", or just "Role" when the filter has no single value to show. */
function chipText(chip: FilterChip): string {
  return chip.value === undefined ? chip.label : `${chip.label}: ${chip.value}`
}

function removeLabelFor(chip: FilterChip): string {
  return props.removeLabel.replace('{filter}', chipText(chip))
}

const isRemovable = (chip: FilterChip): boolean => chip.removable ?? true

const resultText = computed(() =>
  props.resultCount === 1 ? '1 result' : `${String(props.resultCount)} results`
)

/**
 * Which chip was just dismissed. Recorded on click and consumed once the
 * consumer's state change flows back down as a shorter `filters` array.
 */
let pendingRemovalIndex: number | undefined

/**
 * Removing a chip destroys the element that had focus, which otherwise dumps
 * the user at the top of the document — mid-task, with no announcement, and
 * with every subsequent removal requiring them to tab back in.
 *
 * Focus goes to whatever chip took the removed one's place, or the last chip
 * if it was the final one. With no chips left the search box is the nearest
 * useful target; failing that the region itself, so at least the reading
 * position survives.
 */
async function restoreFocus(removedIndex: number): Promise<void> {
  await nextTick()
  const root = rootRef.value
  if (!root) return

  const buttons = [...root.querySelectorAll<HTMLElement>('[data-rk-chip-remove]')]
  const next = buttons[Math.min(removedIndex, buttons.length - 1)]
  if (next) {
    next.focus()
    return
  }

  const fallback = root.querySelector<HTMLElement>('input')
  ;(fallback ?? root).focus()
}

function requestRemove(chip: FilterChip, index: number): void {
  pendingRemovalIndex = index
  emit('remove', chip.id)
}

function requestClear(): void {
  // Nothing will remain, so the fallback chain does the work.
  pendingRemovalIndex = 0
  emit('clear')
}

watch(
  () => props.filters.length,
  (next, previous) => {
    const index = pendingRemovalIndex
    pendingRemovalIndex = undefined
    // Only chase focus for a removal this component asked for. A filter
    // disappearing for any other reason did not take focus with it.
    if (index === undefined || next >= previous) return
    void restoreFocus(index)
  }
)
</script>

<template>
  <div
    ref="rootRef"
    role="search"
    :aria-label="props.label"
    tabindex="-1"
    :class="cn(filterBarVariants({ size: props.size }), 'outline-none', props.class)"
  >
    <div :class="filterBarControlsVariants({ size: props.size })">
      <Field
        v-if="props.searchable"
        :label="props.searchLabel"
        label-sr-only
        size="sm"
        :disabled="props.disabled"
      >
        <Input
          v-model="search"
          type="search"
          :placeholder="props.searchPlaceholder"
          :size="props.size"
          class="w-56"
        />
      </Field>

      <slot name="controls" />

      <div v-if="$slots.actions" class="ms-auto flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <div
      v-if="hasChips || hasCount"
      class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
    >
      <div v-if="hasChips" :class="filterBarChipsVariants({ size: props.size })">
        <span
          v-for="(chip, index) in props.filters"
          :key="chip.id"
          :class="filterBarChipVariants({ size: props.size, removable: isRemovable(chip) })"
        >
          <span class="truncate">
            <slot name="chip" :chip="chip">{{ chipText(chip) }}</slot>
          </span>
          <button
            v-if="isRemovable(chip)"
            type="button"
            data-rk-chip-remove
            :disabled="props.disabled"
            :aria-label="removeLabelFor(chip)"
            :class="filterBarChipRemoveVariants({ size: props.size })"
            @click="requestRemove(chip, index)"
          >
            <svg class="size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="m3 3 6 6M9 3l-6 6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </span>

        <Button
          v-if="hasChips"
          variant="ghost"
          size="sm"
          :disabled="props.disabled"
          @click="requestClear"
        >
          {{ props.clearLabel }}
        </Button>
      </div>

      <!--
        A live region, always present while a count is shown. Live regions
        announce changes rather than their initial content, so this is silent
        on first render and speaks only when filtering actually changes the
        result — which is the one thing a sighted user sees for free.
      -->
      <p v-if="hasCount" role="status" :class="filterBarSummaryVariants({ size: props.size })">
        <slot name="summary" :count="props.resultCount ?? 0">{{ resultText }}</slot>
      </p>
    </div>
  </div>
</template>
