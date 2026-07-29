<script setup lang="ts">
import { Label } from 'reka-ui'
import { computed, toRef, useId, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'
import { provideFieldContext } from './context'
import {
  fieldErrorVariants,
  fieldHintVariants,
  fieldLabelVariants,
  fieldVariants,
  type FieldVariants,
} from './Field.variants'

defineOptions({ name: 'RkField' })

const props = withDefaults(
  defineProps<{
    /** Visible label. Always render one — a placeholder is not a label. */
    label?: string
    /** Help text shown below the control while it is valid. */
    hint?: string
    /**
     * Validation message. Its presence is what puts the field into the error
     * state; there is no separate `invalid` flag to keep in sync.
     */
    error?: string
    /** Marks the control required and shows the required indicator. */
    required?: boolean
    /** Disables the control inside. */
    disabled?: boolean
    /** Sizes the label, hint and error together with the control. */
    size?: NonNullable<FieldVariants['size']>
    /**
     * Id for the control. Generated when omitted — supply one only when
     * something outside the field needs to reference it.
     */
    id?: string
    /**
     * Hides the label visually while leaving it available to screen readers.
     * For a search box in a toolbar whose purpose is obvious from context.
     */
    labelSrOnly?: boolean
    /** Additional classes, merged so a consumer's utility wins. */
    class?: HTMLAttributes['class']
  }>(),
  {
    required: false,
    disabled: false,
    size: 'md',
    labelSrOnly: false,
  }
)

defineSlots<{
  /** The control. Receives the generated id through the field context. */
  default: () => unknown
  /** Replaces the `hint` text, for help that needs markup. */
  hint: () => unknown
  /** Replaces the `error` text. */
  error: () => unknown
}>()

const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)
const hintId = computed(() => `${controlId.value}-hint`)
const errorId = computed(() => `${controlId.value}-error`)

const hasHint = computed(() => props.hint !== undefined)
const hasError = computed(() => props.error !== undefined)

/**
 * The error is listed after the hint so a screen reader reads the guidance
 * before the correction. Both are announced; the hint does not disappear just
 * because the value is currently wrong.
 */
const describedBy = computed(() => {
  const ids = [hasHint.value ? hintId.value : undefined, hasError.value ? errorId.value : undefined]
  const present = ids.filter((id): id is string => id !== undefined)
  return present.length > 0 ? present.join(' ') : undefined
})

provideFieldContext({
  controlId,
  describedBy,
  invalid: hasError,
  disabled: toRef(props, 'disabled'),
  required: toRef(props, 'required'),
})
</script>

<template>
  <div :class="cn(fieldVariants({ size: props.size }), props.class)">
    <Label
      v-if="props.label"
      :for="controlId"
      :class="
        cn(
          fieldLabelVariants({ size: props.size, disabled: props.disabled }),
          props.labelSrOnly && 'sr-only'
        )
      "
    >
      {{ props.label }}
      <!--
        aria-hidden because `required` is already on the control itself. A
        screen reader announcing "required" twice per field is noise, and the
        asterisk alone has never been a reliable signal.
      -->
      <span v-if="props.required" aria-hidden="true" class="text-danger-on-subtle">*</span>
    </Label>

    <slot />

    <p v-if="hasHint || $slots.hint" :id="hintId" :class="fieldHintVariants({ size: props.size })">
      <slot name="hint">{{ props.hint }}</slot>
    </p>

    <!--
      role="alert" so a validation message that appears after submit is
      announced without the user having to go looking for it.
    -->
    <p
      v-if="hasError || $slots.error"
      :id="errorId"
      role="alert"
      :class="fieldErrorVariants({ size: props.size })"
    >
      <slot name="error">{{ props.error }}</slot>
    </p>
  </div>
</template>
