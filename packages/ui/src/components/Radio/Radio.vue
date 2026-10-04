<script setup lang="ts" generic="T extends string | number">
import { computed, useId, useSlots } from 'vue'
import RadioMark from '../../icons/RadioMark.vue'
import { cn } from '../../utils/cn'
import {
  radioInputClass,
  radioLabelVariants,
  radioMarkFocusClass,
  radioMarkVariants,
  radioVariants,
} from './Radio.variants'
import type { RadioProps } from './types'

defineOptions({ name: 'RkRadio', inheritAttrs: false })

const props = withDefaults(defineProps<RadioProps<T>>(), {
  disabled: false,
  required: false,
})

/** The chosen value of the group. Bind the same ref on every option in it. */
const model = defineModel<T | undefined>({ default: undefined })

defineSlots<{
  /** The label, for one that needs markup. Replaces `label`. */
  default: () => unknown
}>()

const slots = useSlots()
const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const checked = computed(() => model.value === props.value)
const hasLabel = computed(() => props.label !== undefined || slots.default !== undefined)

function onChange(): void {
  model.value = props.value
}
</script>

<template>
  <label
    data-slot="radio"
    :for="inputId"
    :data-state="checked ? 'checked' : 'unchecked'"
    :data-disabled="props.disabled ? '' : undefined"
    :class="cn(radioVariants(), props.class)"
  >
    <span class="relative inline-flex">
      <input
        v-bind="$attrs"
        :id="inputId"
        type="radio"
        :checked="checked"
        :value="props.value"
        :name="props.name"
        :disabled="props.disabled"
        :required="props.required"
        :class="radioInputClass"
        @change="onChange"
      />
      <RadioMark :class="cn(radioMarkVariants(), !hasLabel && radioMarkFocusClass)" />
    </span>
    <span v-if="hasLabel" data-slot="radio-label" :class="radioLabelVariants()">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>
