<script setup lang="ts">
import { computed, onMounted, ref, useId, watch } from 'vue'
import { cn } from '../../utils/cn'
import { useFieldContext } from '../Field/context'
import { useSelectContext } from './context'
import { selectTriggerVariants } from './Select.variants'
import type { SelectTriggerProps } from './types'

defineOptions({ name: 'RkSelectTrigger', inheritAttrs: false })

const props = withDefaults(defineProps<SelectTriggerProps>(), {
  placeholder: 'Select…',
  togglerLabel: 'Show options',
})

const select = useSelectContext('SelectTrigger')

const field = useFieldContext()
const generatedId = useId()
const triggerId = computed(() => props.id ?? field?.controlId.value ?? generatedId)
/** Explicit `size` wins; otherwise inherit from Field, else `md`. */
const size = computed(() => props.size ?? field?.size.value ?? 'md')

const anchor = ref<HTMLElement>()
const input = ref<HTMLInputElement>()
onMounted(() => {
  select.anchor.value = anchor.value
})

function displayValue(): string {
  if (select.model.value === undefined) return ''
  return select.labels.get(String(select.model.value)) ?? ''
}

/*
 * The box shows the selected label while shut. While open and searchable it
 * holds what the user is typing, and closing puts the label back — Escape or
 * a click away leaves the value as it was.
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

function onInput(event: Event): void {
  inputValue.value = (event.target as HTMLInputElement).value
  select.setOpen(true)
  // Only edits made while open are a search; seeding the box with the label
  // is not something a consumer should have to filter out of a fetch.
  select.searchTerm.value = inputValue.value
}

/* Type-ahead for the read-only select: letters jump to the matching option. */
let typed = ''
let typedTimer: number | undefined

function typeAhead(key: string): void {
  window.clearTimeout(typedTimer)
  typed += key.toLowerCase()
  typedTimer = window.setTimeout(() => (typed = ''), 500)
  select.setOpen(true)
  const match = select.visibleItems.value.find(
    (item) => !item.disabled && item.label.toLowerCase().startsWith(typed)
  )
  if (match) select.highlighted.value = match.value
}

function onKeyDown(event: KeyboardEvent): void {
  if (select.isDisabled.value) return
  const isOpen = select.open.value

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp':
      event.preventDefault()
      if (!isOpen) select.setOpen(true)
      else select.move(event.key === 'ArrowDown' ? 'next' : 'previous')
      return
    case 'Home':
    case 'End':
      // In a searchable box these move the text cursor; leave them alone.
      if (!isOpen || select.searchable.value) return
      event.preventDefault()
      select.move(event.key === 'Home' ? 'first' : 'last')
      return
    case 'Enter':
      if (!isOpen) return
      // Choosing must not also submit the surrounding form.
      event.preventDefault()
      if (select.highlighted.value !== undefined) select.choose(select.highlighted.value)
      return
    case 'Escape':
      if (!isOpen) return
      // Closes the list, not the dialog the select sits in.
      event.preventDefault()
      select.setOpen(false)
      return
    case 'Tab':
      if (isOpen) select.setOpen(false)
      return
    default:
      if (
        !select.searchable.value &&
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        typeAhead(event.key)
      }
  }
}

function toggle(): void {
  select.setOpen(!select.open.value)
}

/* The chevron opens the list and hands focus to the control, as a native select would. */
function onChevron(): void {
  toggle()
  input.value?.focus()
}
</script>

<template>
  <!--
    The input is the combobox; the chevron is an extra pointer target, kept out
    of the tab order so the control is one stop and keeps the field's label.
  -->
  <div
    ref="anchor"
    data-slot="select-trigger"
    :data-disabled="select.isDisabled.value ? '' : undefined"
    :class="cn(selectTriggerVariants({ size, invalid: select.isInvalid.value }), props.class)"
  >
    <input
      v-bind="$attrs"
      :id="triggerId"
      ref="input"
      role="combobox"
      type="text"
      autocomplete="off"
      aria-haspopup="listbox"
      :aria-expanded="select.open.value"
      :aria-controls="select.open.value ? select.listboxId : undefined"
      :aria-autocomplete="select.searchable.value ? 'list' : 'none'"
      :aria-activedescendant="select.activeDescendant.value"
      :aria-invalid="select.isInvalid.value ? 'true' : undefined"
      :aria-describedby="select.describedBy.value"
      :aria-required="select.isRequired.value ? 'true' : undefined"
      :value="inputValue"
      :placeholder="props.placeholder"
      :readonly="!select.searchable.value"
      :disabled="select.isDisabled.value"
      :class="
        cn(
          'min-w-0 flex-1 truncate bg-transparent text-inherit outline-none',
          'placeholder:text-muted-foreground disabled:cursor-not-allowed',
          !select.searchable.value && 'cursor-pointer'
        )
      "
      @input="onInput"
      @keydown="onKeyDown"
      @click="toggle"
    />
    <button
      type="button"
      tabindex="-1"
      class="flex shrink-0 cursor-pointer items-center text-muted-foreground"
      :aria-label="props.togglerLabel"
      :disabled="select.isDisabled.value"
      @click="onChevron"
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
    </button>
  </div>
</template>
