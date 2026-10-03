<script setup lang="ts">
import { inject } from 'vue'
import { tooltipProviderKey } from './context'
import TooltipProvider from './TooltipProvider.vue'
import TooltipRoot from './TooltipRoot.vue'
import type { TooltipProps } from './types'

defineOptions({ name: 'RkTooltip' })

const props = withDefaults(defineProps<TooltipProps>(), {
  delay: 300,
  disabled: false,
})

defineSlots<{
  /** Trigger and content. */
  default: () => unknown
}>()

/*
 * A lone tooltip supplies its own provider. Inside a TooltipProvider it defers
 * to it rather than shadowing it, so the group's skip-delay sweep still works.
 */
const hasProvider = inject(tooltipProviderKey, null) !== null
</script>

<template>
  <TooltipRoot v-if="hasProvider" :delay="props.delay" :disabled="props.disabled">
    <slot />
  </TooltipRoot>
  <TooltipProvider v-else :delay-duration="props.delay">
    <TooltipRoot :delay="props.delay" :disabled="props.disabled">
      <slot />
    </TooltipRoot>
  </TooltipProvider>
</template>
