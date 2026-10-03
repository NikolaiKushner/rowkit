<script setup lang="ts" generic="T extends string | number">
import { computed, provide, reactive, ref, useId, watch } from 'vue'
import { useFieldContext } from '../Field/context'
import { selectContextKey, type SelectItemRecord } from './context'
import type { SelectProps } from './types'

defineOptions({ name: 'RkSelect' })

const props = withDefaults(defineProps<SelectProps>(), {
  searchable: false,
  manualFilter: false,
  disabled: false,
  invalid: false,
  required: false,
})

defineSlots<{
  /** Trigger and content. */
  default: () => unknown
}>()

/** The selected value. `undefined` is nothing selected. */
const model = defineModel<T | undefined>({ default: undefined })

/** The current search term. Bind it to fetch options asynchronously. */
const searchTerm = defineModel<string>('searchTerm', { default: '' })

const field = useFieldContext()
const open = ref(false)

const isDisabled = computed(() => props.disabled || (field?.disabled.value ?? false))
const isInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const isRequired = computed(() => props.required || (field?.required.value ?? false))
const describedBy = computed(() => field?.describedBy.value)
const searchable = computed(() => props.searchable)
const manualFilter = computed(() => props.manualFilter)

const labels = reactive(new Map<string, string>())

function registerLabel(value: string | number, label: string): void {
  labels.set(String(value), label)
}

const items = reactive<SelectItemRecord[]>([])

function registerItem(item: SelectItemRecord): () => void {
  items.push(item)
  return () => {
    const index = items.findIndex((entry) => entry.id === item.id)
    if (index !== -1) items.splice(index, 1)
  }
}

/*
 * Accent- and case-insensitive substring match, in the user's locale. "e"
 * finds "É", "straße" finds "STRASSE".
 */
const collator = new Intl.Collator(undefined, { usage: 'search', sensitivity: 'base' })

function contains(text: string, term: string): boolean {
  if (term.length === 0) return true
  const haystack = text.normalize('NFC')
  const needle = term.normalize('NFC')
  for (let i = 0; i + needle.length <= haystack.length; i++) {
    if (collator.compare(haystack.slice(i, i + needle.length), needle) === 0) return true
  }
  return false
}

/** Local filtering only for a searchable select that has not taken it over. */
const visibleItems = computed(() =>
  props.searchable && !props.manualFilter && searchTerm.value
    ? items.filter((item) => contains(item.label, searchTerm.value))
    : items
)

const highlighted = ref<string | number>()
const listboxId = useId()

const activeDescendant = computed(() => {
  if (!open.value || highlighted.value === undefined) return undefined
  return visibleItems.value.find((item) => item.value === highlighted.value)?.id
})

function enabled(): SelectItemRecord[] {
  return visibleItems.value.filter((item) => !item.disabled)
}

function move(to: 'first' | 'last' | 'next' | 'previous'): void {
  const list = enabled()
  if (list.length === 0) {
    highlighted.value = undefined
    return
  }
  const current = list.findIndex((item) => item.value === highlighted.value)
  const index = {
    first: 0,
    last: list.length - 1,
    next: current === -1 ? 0 : Math.min(current + 1, list.length - 1),
    previous: current === -1 ? list.length - 1 : Math.max(current - 1, 0),
  }[to]
  highlighted.value = list[index]?.value
}

function setOpen(value: boolean): void {
  if (value && isDisabled.value) return
  open.value = value
}

/*
 * Opening highlights the selected option, or the first one. Closing ends the
 * search: the term resets so the next open shows the whole list again.
 */
watch(open, (isOpen) => {
  if (isOpen) {
    // Type-ahead may already have placed the highlight while opening.
    if (highlighted.value !== undefined) return
    const selected = enabled().find((item) => item.value === model.value)
    if (selected) highlighted.value = selected.value
    else move('first')
  } else {
    highlighted.value = undefined
    searchTerm.value = ''
  }
})

/* While searching, the highlight follows the first match. */
watch(visibleItems, () => {
  if (!open.value) return
  if (!enabled().some((item) => item.value === highlighted.value)) move('first')
})

function choose(value: string | number): void {
  const item = items.find((entry) => entry.value === value)
  if (!item || item.disabled) return
  // vue-tsc cannot see that a registered value is a T; eslint, reading the
  // same generic differently, calls the assertion redundant.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  model.value = value as T
  setOpen(false)
}

provide(selectContextKey, {
  open,
  model,
  searchTerm,
  searchable,
  manualFilter,
  isDisabled,
  isInvalid,
  isRequired,
  describedBy,
  labels,
  registerLabel,
  items,
  registerItem,
  visibleItems,
  highlighted,
  activeDescendant,
  listboxId,
  anchor: ref<HTMLElement>(),
  setOpen,
  choose,
  move,
})
</script>

<template>
  <div data-slot="select">
    <slot />
    <!-- Submits with a form like a native select. -->
    <input
      v-if="props.name !== undefined"
      type="hidden"
      :name="props.name"
      :value="model ?? ''"
      :disabled="isDisabled"
    />
  </div>
</template>
