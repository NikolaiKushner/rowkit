<script setup lang="ts">
import { computed, onMounted, ref, useId } from 'vue'
import ErrorIcon from '../../icons/ErrorIcon.vue'
import TriangleDownIcon from '../../icons/TriangleDownIcon.vue'
import TriangleUpIcon from '../../icons/TriangleUpIcon.vue'
import { cn } from '../../utils/cn'
import { useFieldContext } from '../Field/context'
import { useSelectContext } from './context'
import { selectButtonVariants, selectInputVariants, selectTriggerVariants } from './Select.variants'
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
  select.control.value = input.value
})

/*
 * The box always shows the selected label. A searchable select is searched in
 * a box at the top of its list, which takes focus while the list is open, so
 * the control itself is never typed into.
 */
const inputValue = computed(() =>
  select.model.value === undefined ? '' : (select.labels.get(String(select.model.value)) ?? '')
)

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
      if (!isOpen) return
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
      if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return
      if (!select.searchable.value) {
        typeAhead(event.key)
        return
      }
      // A letter typed on a searchable control opens the list and starts the
      // search with it; the search box takes the rest.
      if (event.key === ' ' && !isOpen) {
        event.preventDefault()
        select.setOpen(true)
        return
      }
      event.preventDefault()
      select.searchTerm.value = event.key
      select.setOpen(true)
  }
}

function toggle(): void {
  select.setOpen(!select.open.value)
}

/*
 * A mouse opens the list on press, as Windows 98 does, so the user can drag
 * straight onto an option and release to choose it. Touch and pen keep the
 * tap: a press that opens a list under a finger mid-scroll is a misfire.
 */
let lastPointer = ''

function onPointerDown(event: PointerEvent): void {
  lastPointer = event.pointerType
  if (event.pointerType !== 'mouse' || event.button !== 0 || select.isDisabled.value) return
  // Focus stays where the user pressed, and nothing selects text in the box.
  event.preventDefault()
  input.value?.focus()
  const opening = !select.open.value
  toggle()
  if (opening) select.startDrag()
}

function onClick(): void {
  if (lastPointer !== 'mouse') toggle()
  lastPointer = ''
}

/* The drop button opens the list and hands focus to the control, as a native select would. */
const pressed = ref(false)

function onButtonDown(event: PointerEvent): void {
  if (event.button !== 0 || select.isDisabled.value) return
  pressed.value = true
  window.addEventListener('pointerup', () => (pressed.value = false), { once: true })
  onPointerDown(event)
  if (event.pointerType !== 'mouse') {
    event.preventDefault()
    input.value?.focus()
    toggle()
  }
}

/* A click with no press before it — from script or assistive technology. */
function onButtonClick(): void {
  if (lastPointer === '') {
    toggle()
    input.value?.focus()
  }
  lastPointer = ''
}
</script>

<template>
  <!--
    The input is the combobox; the drop button is an extra pointer target, kept
    out of the tab order so the control is one stop and keeps the field's label.
  -->
  <div
    ref="anchor"
    data-slot="select-trigger"
    :data-disabled="select.isDisabled.value ? '' : undefined"
    :class="cn(selectTriggerVariants({ size }), props.class)"
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
      aria-autocomplete="none"
      :aria-activedescendant="select.searchable.value ? undefined : select.activeDescendant.value"
      :aria-invalid="select.isInvalid.value ? 'true' : undefined"
      :aria-describedby="select.describedBy.value"
      :aria-required="select.isRequired.value ? 'true' : undefined"
      :value="inputValue"
      :placeholder="props.placeholder"
      readonly
      :disabled="select.isDisabled.value"
      :class="selectInputVariants()"
      @keydown="onKeyDown"
      @pointerdown="onPointerDown"
      @click="onClick"
    />
    <ErrorIcon v-if="select.isInvalid.value" data-slot="select-error-icon" class="shrink-0" />
    <button
      type="button"
      tabindex="-1"
      data-slot="select-button"
      :class="selectButtonVariants({ size })"
      :data-pressed="pressed || select.open.value ? '' : undefined"
      :aria-label="props.togglerLabel"
      :disabled="select.isDisabled.value"
      @pointerdown="onButtonDown"
      @click="onButtonClick"
    >
      <TriangleUpIcon data-arrow="up" />
      <TriangleDownIcon data-arrow="down" />
    </button>
  </div>
</template>
