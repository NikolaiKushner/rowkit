<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import ErrorIcon from '../../icons/ErrorIcon.vue'
import SearchIcon from '../../icons/SearchIcon.vue'
import TriangleDownIcon from '../../icons/TriangleDownIcon.vue'
import TriangleUpIcon from '../../icons/TriangleUpIcon.vue'
import { cn } from '../../utils/cn'
import { useFieldContext } from '../Field/context'
import { inputButtonVariants, inputFrameVariants, inputVariants } from './Input.variants'

import type { InputProps } from './types'

defineOptions({ name: 'RkInput', inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  readonly: false,
})

/** The input's value. */
const model = defineModel<string | number | undefined>({ default: undefined })

defineSlots<{
  /** Content inside the frame, before the text. Replaces the magnifier of a search field. */
  leading: () => unknown
  /** Content inside the frame, after the text — a unit, a clear button. */
  trailing: () => unknown
}>()

const field = useFieldContext()

/**
 * The prop and the surrounding `Field` combine with OR, so a `Field` can turn
 * these on but a control cannot turn them back off.
 *
 * This mirrors `<fieldset disabled>`, where a descendant has no way to
 * re-enable itself, and it sidesteps a Vue trap: an absent boolean prop is
 * cast to `false`, not `undefined`, so a `??` chain here would read the prop's
 * default and never consult the field at all.
 */
const inputId = computed(() => props.id ?? field?.controlId.value)
const isDisabled = computed(() => props.disabled || (field?.disabled.value ?? false))
const isInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const isRequired = computed(() => props.required || (field?.required.value ?? false))
const describedBy = computed(() => field?.describedBy.value)
/** Explicit `size` wins; otherwise inherit from Field, else `md`. */
const size = computed(() => props.size ?? field?.size.value ?? 'md')
const hasButtons = computed(() => props.type === 'number' || props.type === 'date')
/** Spin and drop buttons do nothing while the value cannot change. */
const isLocked = computed(() => isDisabled.value || props.readonly)

const inputEl = ref<HTMLInputElement | null>(null)

/*
 * Spin buttons.
 *
 * They are decoration for the pointer: spans, hidden from assistive
 * technology and never focused. The native input is already a spinbutton to a
 * screen reader and steps with the arrow keys, so the keyboard path needs
 * nothing from them. Pressing one keeps focus in the field, steps once, and —
 * held — repeats, as Windows does.
 */
const pressed = ref<'increment' | 'decrement' | 'drop' | null>(null)
let repeatDelay: ReturnType<typeof setTimeout> | undefined
let repeatTimer: ReturnType<typeof setInterval> | undefined

/** Steps the value the way the native control would, and tells v-model. */
function step(direction: 'increment' | 'decrement'): void {
  const input = inputEl.value
  if (!input) return
  try {
    if (direction === 'increment') input.stepUp()
    else input.stepDown()
  } catch {
    // A value the browser cannot parse as a number has nothing to step from.
    return
  }
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
}

function stopRepeat(): void {
  clearTimeout(repeatDelay)
  clearInterval(repeatTimer)
  repeatDelay = undefined
  repeatTimer = undefined
  pressed.value = null
  window.removeEventListener('pointerup', stopRepeat)
  window.removeEventListener('pointercancel', stopRepeat)
}

/** The press ends wherever the button is released, inside the field or not. */
function press(part: 'increment' | 'decrement' | 'drop'): void {
  pressed.value = part
  window.addEventListener('pointerup', stopRepeat)
  window.addEventListener('pointercancel', stopRepeat)
}

function onSpinDown(event: PointerEvent, direction: 'increment' | 'decrement'): void {
  if (isLocked.value || event.button !== 0) return
  inputEl.value?.focus()
  press(direction)
  step(direction)
  repeatDelay = setTimeout(() => {
    repeatTimer = setInterval(() => step(direction), 50)
  }, 400)
}

/** The drop button of a date field opens the browser's own picker. */
function onDropDown(event: PointerEvent): void {
  if (isLocked.value || event.button !== 0) return
  press('drop')
  const input = inputEl.value
  input?.focus()
  try {
    input?.showPicker()
  } catch {
    // Not every browser lets a script open the picker; focus is the fallback.
  }
}

/** Escape empties a search field — and only then claims the key. */
function onKeydown(event: KeyboardEvent): void {
  if (props.type !== 'search' || event.key !== 'Escape' || isLocked.value) return
  if (model.value === undefined || model.value === '') return
  event.preventDefault()
  event.stopPropagation()
  model.value = ''
}

onBeforeUnmount(stopRepeat)
</script>

<template>
  <div data-slot="input-frame" :class="cn(inputFrameVariants({ size, hasButtons }), props.class)">
    <span v-if="$slots.leading" class="flex shrink-0 items-center">
      <slot name="leading" />
    </span>
    <SearchIcon v-else-if="props.type === 'search'" class="shrink-0" />

    <input
      v-bind="$attrs"
      :id="inputId"
      ref="inputEl"
      v-model="model"
      data-slot="input"
      :type="props.type"
      :placeholder="props.placeholder"
      :disabled="isDisabled"
      :required="isRequired"
      :readonly="props.readonly"
      :aria-invalid="isInvalid ? 'true' : undefined"
      :aria-describedby="describedBy"
      :class="inputVariants()"
      @keydown="onKeydown"
    />

    <span v-if="$slots.trailing" class="flex shrink-0 items-center">
      <slot name="trailing" />
    </span>

    <ErrorIcon v-if="isInvalid" data-slot="input-error-icon" class="shrink-0" />

    <span
      v-if="props.type === 'number'"
      data-slot="input-spin"
      class="flex flex-col self-stretch"
      aria-hidden="true"
    >
      <span
        :class="inputButtonVariants({ part: 'increment' })"
        :data-pressed="pressed === 'increment' ? '' : undefined"
        :data-disabled="isLocked ? '' : undefined"
        @pointerdown.prevent="onSpinDown($event, 'increment')"
        @pointerleave="stopRepeat"
      >
        <TriangleUpIcon />
      </span>
      <span
        :class="inputButtonVariants({ part: 'decrement' })"
        :data-pressed="pressed === 'decrement' ? '' : undefined"
        :data-disabled="isLocked ? '' : undefined"
        @pointerdown.prevent="onSpinDown($event, 'decrement')"
        @pointerleave="stopRepeat"
      >
        <TriangleDownIcon />
      </span>
    </span>

    <span
      v-if="props.type === 'date'"
      data-slot="input-drop"
      aria-hidden="true"
      :class="inputButtonVariants({ part: 'drop' })"
      :data-pressed="pressed === 'drop' ? '' : undefined"
      :data-disabled="isLocked ? '' : undefined"
      @pointerdown.prevent="onDropDown"
    >
      <TriangleDownIcon />
    </span>
  </div>
</template>
