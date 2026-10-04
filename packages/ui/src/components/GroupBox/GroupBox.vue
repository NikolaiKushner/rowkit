<script setup lang="ts">
import { computed, useId } from 'vue'
import { cn } from '../../utils/cn'
import {
  groupBoxFrameVariants,
  groupBoxLegendVariants,
  groupBoxVariants,
} from './GroupBox.variants'
import type { GroupBoxProps } from './types'

defineOptions({ name: 'RkGroupBox' })

const props = withDefaults(defineProps<GroupBoxProps>(), {
  as: 'fieldset',
})

const slots = defineSlots<{
  /** The grouped content. */
  default: () => unknown
  /** Replaces the `legend` text, for a legend that needs markup. */
  legend: () => unknown
}>()

const legendId = useId()
const isFieldset = computed(() => props.as === 'fieldset')
const hasLegend = computed(() => props.legend !== undefined || slots.legend !== undefined)

/*
 * A fieldset is named by its first legend. Any other element is given the
 * group role and pointed at the legend, so it is named the same way.
 */
const groupAttrs = computed(() =>
  isFieldset.value
    ? {}
    : { role: 'group', 'aria-labelledby': hasLegend.value ? legendId : undefined }
)
</script>

<template>
  <component
    :is="props.as"
    data-slot="group-box"
    v-bind="groupAttrs"
    :class="cn(groupBoxVariants(), props.class)"
  >
    <span aria-hidden="true" :class="groupBoxFrameVariants()" />
    <component
      :is="isFieldset ? 'legend' : 'span'"
      v-if="hasLegend"
      :id="legendId"
      data-slot="group-box-legend"
      :class="groupBoxLegendVariants()"
    >
      <slot name="legend">{{ props.legend }}</slot>
    </component>
    <slot />
  </component>
</template>
