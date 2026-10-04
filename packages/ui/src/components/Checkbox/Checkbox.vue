<script setup lang="ts">
import { computed, useId, useSlots } from 'vue'
import CheckGlyphIcon from '../../icons/CheckGlyphIcon.vue'
import { cn } from '../../utils/cn'
import {
  checkboxBarClass,
  checkboxBoxFocusClass,
  checkboxBoxVariants,
  checkboxInputClass,
  checkboxLabelVariants,
  checkboxVariants,
} from './Checkbox.variants'
import type { CheckboxProps } from './types'

defineOptions({ name: 'RkCheckbox', inheritAttrs: false })

const props = withDefaults(defineProps<CheckboxProps>(), {
  indeterminate: false,
  disabled: false,
  required: false,
})

/** Whether the box is checked. */
const model = defineModel<boolean>({ default: false })

defineSlots<{
  /** The label, for one that needs markup. Replaces `label`. */
  default: () => unknown
}>()

const slots = useSlots()
const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const hasLabel = computed(() => props.label !== undefined || slots.default !== undefined)
</script>

<template>
  <label
    data-slot="checkbox"
    :for="inputId"
    :data-state="props.indeterminate ? 'indeterminate' : model ? 'checked' : 'unchecked'"
    :data-disabled="props.disabled ? '' : undefined"
    :class="cn(checkboxVariants(), props.class)"
  >
    <span class="relative inline-flex">
      <!--
        Attributes the consumer passes — aria-label for a check box with no
        visible label, aria-describedby — belong on the input, not the row.
      -->
      <input
        v-bind="$attrs"
        :id="inputId"
        v-model="model"
        type="checkbox"
        :indeterminate="props.indeterminate"
        :disabled="props.disabled"
        :name="props.name"
        :value="props.value"
        :required="props.required"
        :class="checkboxInputClass"
      />
      <span
        aria-hidden="true"
        data-slot="checkbox-box"
        :class="cn(checkboxBoxVariants(), !hasLabel && checkboxBoxFocusClass)"
      >
        <span v-if="props.indeterminate" :class="checkboxBarClass" />
        <CheckGlyphIcon v-else-if="model" />
      </span>
    </span>
    <span v-if="hasLabel" data-slot="checkbox-label" :class="checkboxLabelVariants()">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>
