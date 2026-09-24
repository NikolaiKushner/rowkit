<script lang="ts">
import type { FunctionalComponent } from 'vue'

/**
 * Renders its children and nothing else, for the case where a provider is
 * already mounted above us.
 *
 * This was `Fragment`, which does not work here and fails silently in the worst
 * possible way. `<component :is>` compiles its children to a **slots object**,
 * and `Fragment` expects an **array of vnodes** — so it rendered nothing at all,
 * taking the trigger with it. Every tooltip inside a `TooltipProvider`
 * disappeared from the page: no error, no warning, no element.
 *
 * Declared in a plain `<script>` block so there is one component identity for
 * the whole module rather than a fresh one per instance.
 */
const PassThrough: FunctionalComponent = (_props, { slots }) => slots.default?.()
</script>

<script setup lang="ts">
import { injectTooltipProviderContext, TooltipProvider, TooltipRoot } from 'reka-ui'
import { computed } from 'vue'
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

/**
 * Reka's `TooltipRoot` throws without a provider above it, so a lone tooltip
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

const wrapper = computed(() => (ancestorProvider === null ? TooltipProvider : PassThrough))

/** `PassThrough` takes no props; binding the delay to it would warn. */
const wrapperProps = computed(() =>
  ancestorProvider === null ? { delayDuration: props.delay } : {}
)
</script>

<template>
  <component :is="wrapper" v-bind="wrapperProps">
    <TooltipRoot data-slot="tooltip" :delay-duration="props.delay" :disabled="props.disabled">
      <slot />
    </TooltipRoot>
  </component>
</template>
