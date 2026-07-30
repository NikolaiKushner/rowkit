<script setup lang="ts">
import {
  injectTooltipProviderContext,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'
import { computed, Fragment } from 'vue'
import { tooltipContentVariants } from './Tooltip.variants'
import type { TooltipProps } from './types'

defineOptions({ name: 'RkTooltip' })

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  delay: 300,
  disabled: false,
})

/**
 * Reka's `TooltipRoot` throws without a provider above it, so a lone `<Tooltip>`
 * would be unusable — but always rendering our own would shadow a real one and
 * silently kill the behaviour that only a shared provider can give:
 * `skipDelayDuration`, the grace period that lets a pointer sweep a toolbar of
 * icon buttons without re-paying the delay at each one.
 *
 * So the provider is supplied only when there is not one already. A single
 * tooltip works with no setup; an app that mounts `TooltipProvider` keeps
 * control of the shared timing.
 */
const ancestorProvider = injectTooltipProviderContext(null)

const wrapper = computed(() => (ancestorProvider === null ? TooltipProvider : Fragment))

/** A `Fragment` takes no props; binding the delay to one would warn. */
const wrapperProps = computed(() =>
  ancestorProvider === null ? { delayDuration: props.delay } : {}
)

defineSlots<{
  /**
   * The trigger. Rendered through `as-child`, so your element *becomes* the
   * trigger rather than being wrapped — a wrapper would change the layout and
   * break the disabled-button pattern.
   */
  default: () => unknown
}>()
</script>

<template>
  <component :is="wrapper" v-bind="wrapperProps">
    <TooltipRoot :delay-duration="props.delay" :disabled="props.disabled">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>

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
        <TooltipContent :side="props.placement" :side-offset="4" :class="tooltipContentVariants()">
          {{ props.content }}
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </component>
</template>
