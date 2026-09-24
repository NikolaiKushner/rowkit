<script setup lang="ts">
import { ComboboxAnchor, ComboboxInput, ComboboxTrigger } from 'reka-ui'
import { computed, inject, onBeforeUnmount, ref, useId, watch } from 'vue'
import { cn } from '../../utils/cn'
import { useFieldContext } from '../Field/context'
import { selectContextKey } from './context'
import { selectTriggerVariants } from './Select.variants'
import type { SelectTriggerProps } from './types'

defineOptions({ name: 'RkSelectTrigger', inheritAttrs: false })

const props = withDefaults(defineProps<SelectTriggerProps>(), {
  placeholder: 'Select…',
  togglerLabel: 'Show options',
})

const select = inject(selectContextKey)
if (select === undefined) {
  throw new Error('SelectTrigger must be used inside Select')
}

const field = useFieldContext()
const generatedId = useId()
const triggerId = computed(() => props.id ?? field?.controlId.value ?? generatedId)
/** Explicit `size` wins; otherwise inherit from Field, else `md`. */
const size = computed(() => props.size ?? field?.size.value ?? 'md')

/**
 * What the input shows when it is not being typed into. The label was
 * registered by `SelectItem`, so it is still known after the panel unmounts.
 */
function displayValue(): string {
  if (select === undefined || select.model.value === undefined) return ''
  return select.labels.get(String(select.model.value)) ?? ''
}

/**
 * The text in the input.
 *
 * Reka only applies `displayValue` on its own reset path — selection, blur,
 * close — never on mount, so a select given a value up front would render an
 * empty box until the user touched it.
 */
const inputValue = ref(displayValue())

watch(
  () =>
    [
      select.model.value,
      select.open.value,
      select.labels.get(String(select.model.value ?? '')),
    ] as const,
  () => {
    if (!select.open.value) inputValue.value = displayValue()
  },
  { immediate: true, flush: 'sync' }
)

// Only edits made while the panel is open are a search. Seeding the box with
// the selected label is not something a consumer should have to filter out of
// an async fetch.
watch(inputValue, (value) => {
  if (select.open.value) select.searchTerm.value = value
})

/**
 * Reka keeps its highlight when the panel closes, so the input is left holding
 * an `aria-activedescendant` that points at a list item which has been
 * unmounted. axe reports it as an invalid ARIA reference, and a screen reader
 * following the pointer finds nothing there.
 *
 * Reka binds the attribute from its own state, so a prop cannot override it,
 * and it cannot simply be removed once after closing either: selecting an
 * option moves the highlight onto the clicked item, and Reka's own deferred
 * search-term reset renders again afterwards and writes the attribute back.
 *
 * Watching the attribute for as long as the panel is shut is the one approach
 * that does not depend on winning a race. Removing it inside the callback is
 * safe — the resulting mutation finds nothing left to do.
 *
 * Worth removing once this is fixed upstream in Reka.
 */
let activeDescendantGuard: MutationObserver | undefined

function stopGuard(): void {
  activeDescendantGuard?.disconnect()
  activeDescendantGuard = undefined
}

watch(
  select.open,
  (isOpen) => {
    stopGuard()
    if (isOpen || typeof MutationObserver === 'undefined') return

    const control = document.getElementById(triggerId.value)
    if (!control) return

    control.removeAttribute('aria-activedescendant')
    activeDescendantGuard = new MutationObserver(() => {
      if (control.hasAttribute('aria-activedescendant')) {
        control.removeAttribute('aria-activedescendant')
      }
    })
    activeDescendantGuard.observe(control, {
      attributes: true,
      attributeFilter: ['aria-activedescendant'],
    })
  },
  { flush: 'post' }
)

onBeforeUnmount(stopGuard)
</script>

<template>
  <!--
    The input, not a button, is the anchor. Reka gives the trigger
    `tabindex="-1"` and `aria-label="Show popup"` on the assumption that a
    ComboboxInput is present to be the focusable combobox — without one the
    control is unreachable by keyboard and announces itself as "Show popup"
    instead of its field label.
  -->
  <ComboboxAnchor
    data-slot="select-trigger"
    :class="cn(selectTriggerVariants({ size, invalid: select.isInvalid.value }), props.class)"
  >
    <ComboboxInput
      v-bind="$attrs"
      :id="triggerId"
      v-model="inputValue"
      :placeholder="props.placeholder"
      :readonly="!select.searchable.value"
      :display-value="displayValue"
      :aria-invalid="select.isInvalid.value ? 'true' : undefined"
      :aria-describedby="select.describedBy.value"
      :class="
        cn(
          'min-w-0 flex-1 truncate bg-transparent text-inherit outline-none',
          'placeholder:text-muted-foreground disabled:cursor-not-allowed',
          !select.searchable.value && 'cursor-pointer'
        )
      "
    />
    <ComboboxTrigger
      class="flex shrink-0 cursor-pointer items-center text-muted-foreground"
      :aria-label="props.togglerLabel"
    >
      <svg
        class="size-4 transition-transform duration-fast ease-standard"
        :class="select.open.value && 'rotate-180'"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="m6 8 4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </ComboboxTrigger>
  </ComboboxAnchor>
</template>
