<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../utils/cn'
import { useFieldContext } from '../Field/context'
import { inputVariants } from './Input.variants'

import type { InputProps } from './types'

defineOptions({ name: 'RkInput', inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
  size: 'md',
  type: 'text',
  readonly: false,
})

/** The input's value. */
const model = defineModel<string | number | undefined>({ default: undefined })

defineSlots<{
  /** Content rendered before the input, inside the control's border. */
  leading: () => unknown
  /** Content rendered after the input — a unit, a clear button, a spinner. */
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
</script>

<template>
  <div class="relative flex items-center">
    <span
      v-if="$slots.leading"
      class="pointer-events-none absolute left-3 flex items-center text-text-muted"
    >
      <slot name="leading" />
    </span>

    <input
      v-bind="$attrs"
      :id="inputId"
      v-model="model"
      :type="props.type"
      :placeholder="props.placeholder"
      :disabled="isDisabled"
      :required="isRequired"
      :readonly="props.readonly"
      :aria-invalid="isInvalid ? 'true' : undefined"
      :aria-describedby="describedBy"
      :class="
        cn(
          inputVariants({ size: props.size, invalid: isInvalid }),
          $slots.leading && 'pl-9',
          $slots.trailing && 'pr-9',
          props.class
        )
      "
    />

    <span v-if="$slots.trailing" class="absolute right-3 flex items-center text-text-muted">
      <slot name="trailing" />
    </span>
  </div>
</template>
