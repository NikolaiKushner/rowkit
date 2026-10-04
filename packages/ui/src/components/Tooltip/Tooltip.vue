<script setup lang="ts">
import { inject } from 'vue'
import { tooltipGroupKey } from './context'
import TooltipProvider from './TooltipProvider.vue'
import TooltipRoot from './TooltipRoot.vue'
import type { TooltipProps } from './types'

defineOptions({ name: 'RkTooltip' })

const props = withDefaults(defineProps<TooltipProps>(), {
  delay: 500,
  disabled: false,
})

defineSlots<{
  /** Trigger and content. */
  default: () => unknown
}>()

/*
 * A tooltip needs a group for its timing. On its own it brings one, carrying
 * `delay`; under an app's `TooltipProvider` it joins that group instead, so
 * the group's timing and its toolbar sweep stay intact.
 */
const inGroup = inject(tooltipGroupKey, null) !== null
</script>

<template>
  <TooltipRoot v-if="inGroup" :disabled="props.disabled">
    <slot />
  </TooltipRoot>
  <TooltipProvider v-else :delay-duration="props.delay">
    <TooltipRoot :disabled="props.disabled">
      <slot />
    </TooltipRoot>
  </TooltipProvider>
</template>
