<script setup lang="ts">
import { TooltipContent, TooltipPortal } from 'reka-ui'
import { cn } from '../../utils/cn'
import { tooltipContentVariants } from './Tooltip.variants'
import type { TooltipContentProps } from './types'

defineOptions({ name: 'RkTooltipContent' })

const props = withDefaults(defineProps<TooltipContentProps>(), {
  placement: 'top',
})

defineSlots<{
  /**
   * The label. Plain text.
   *
   * A tooltip is hover-triggered and never holds focus, so a link or a button
   * in here is unreachable by keyboard. If the label needs either, it is a
   * popover.
   */
  default: () => unknown
}>()
</script>

<template>
  <TooltipPortal>
    <!--
      `side-offset` keeps the tooltip clear of the trigger without a gap the
      pointer can fall through: WCAG 1.4.13 requires the content stay visible
      while the pointer moves onto it, and Reka's hoverable bridge covers the
      4px.

      `avoid-collisions` is Reka's default and left on — `placement` is a
      preference, and a tooltip clipped by the viewport edge is worse than one
      that flipped.
    -->
    <TooltipContent
      data-slot="tooltip-content"
      :side="props.placement"
      :side-offset="4"
      :class="cn(tooltipContentVariants(), props.class)"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
