<script setup lang="ts">
import { TooltipTrigger } from 'reka-ui'
import { cn } from '../../utils/cn'
import type { TooltipTriggerProps } from './types'

defineOptions({ name: 'RkTooltipTrigger' })

const props = withDefaults(defineProps<TooltipTriggerProps>(), {
  as: 'button',
  asChild: false,
})

defineSlots<{
  /** The control the tooltip describes. With `as-child`, this element becomes the trigger. */
  default: () => unknown
}>()
</script>

<template>
  <TooltipTrigger
    data-slot="tooltip-trigger"
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(props.class)"
  >
    <slot />
  </TooltipTrigger>
</template>
