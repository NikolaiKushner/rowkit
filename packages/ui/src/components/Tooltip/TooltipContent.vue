<!--
  Adapted from Reka UI's TooltipContent (MIT).
  Copyright (c) 2023 UnoVue <https://github.com/unovue>
-->
<script setup lang="ts">
import { computed, onMounted, ref, watchEffect, type ComponentPublicInstance } from 'vue'
import DismissableLayer from '../../primitives/DismissableLayer.vue'
import { isClient, unrefElement } from '../../primitives/dom'
import { useFloating } from '../../primitives/position'
import { Presence } from '../../primitives/Presence'
import { cn } from '../../utils/cn'
import { TOOLTIP_OPEN, useTooltipContext } from './context'
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

const tooltip = useTooltipContext('TooltipContent')

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const layer = ref<ComponentPublicInstance | null>(null)
const content = computed(() => unrefElement(layer.value))

/*
 * 4px clear of the trigger, so the bubble never covers what it labels; the
 * gap is bridged below, so the pointer can still travel onto it (WCAG 1.4.13).
 * `placement` is a preference: near a viewport edge the bubble flips to the
 * opposite side and slides along it rather than being clipped.
 */
const { style, side } = useFloating(tooltip.trigger, content, () => ({
  side: props.placement,
  offset: 4,
  padding: 8,
}))

/* Close when the trigger scrolls away, or when another tooltip opens. */
watchEffect((onCleanup) => {
  if (!isClient || !tooltip.open.value) return
  const onScroll = (event: Event) => {
    const target = event.target
    if (target instanceof Node && tooltip.trigger.value && target.contains(tooltip.trigger.value)) {
      tooltip.onClose()
    }
  }
  const onOtherOpen = () => tooltip.onClose()
  window.addEventListener('scroll', onScroll, { capture: true })
  // Registered after this tooltip's own open event has been dispatched.
  const timer = window.setTimeout(() => document.addEventListener(TOOLTIP_OPEN, onOtherOpen), 0)
  onCleanup(() => {
    window.removeEventListener('scroll', onScroll, { capture: true })
    window.clearTimeout(timer)
    document.removeEventListener(TOOLTIP_OPEN, onOtherOpen)
  })
})

/*
 * Hoverable content. Once the pointer leaves the trigger the tooltip stays
 * open while the pointer is over the trigger, the bubble, or the box spanning
 * both — so the 4px gap is crossable — and closes the moment it leaves that
 * box. Reka traces a polygon for the same job; the bounding box is simpler and
 * a little more forgiving.
 */
watchEffect((onCleanup) => {
  if (!isClient || !tooltip.open.value || tooltip.disableHoverableContent.value) return
  const trigger = tooltip.trigger.value
  const bubble = content.value
  if (!trigger || !bubble) return

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    const a = trigger.getBoundingClientRect()
    const b = bubble.getBoundingClientRect()
    const inside =
      event.clientX >= Math.min(a.left, b.left) &&
      event.clientX <= Math.max(a.right, b.right) &&
      event.clientY >= Math.min(a.top, b.top) &&
      event.clientY <= Math.max(a.bottom, b.bottom)
    if (!inside) tooltip.onClose()
  }
  const onLeaveTrigger = () => document.addEventListener('pointermove', onPointerMove)
  trigger.addEventListener('pointerleave', onLeaveTrigger)
  onCleanup(() => {
    trigger.removeEventListener('pointerleave', onLeaveTrigger)
    document.removeEventListener('pointermove', onPointerMove)
  })
})
</script>

<template>
  <Teleport v-if="mounted" to="body">
    <Presence :present="tooltip.open.value">
      <!--
        The bubble is the description itself: role="tooltip", pointed at by
        the trigger's aria-describedby. Reka renders a visually hidden copy of
        the text inside the bubble for that job, so the text exists twice; one
        element is enough.

        A layer for Escape and outside clicks, but one that never blocks the
        page or reacts to focus moving on.
      -->
      <DismissableLayer
        :id="tooltip.contentId"
        ref="layer"
        role="tooltip"
        data-slot="tooltip-content"
        :data-state="tooltip.state.value"
        :data-side="side"
        data-align="center"
        :style="style"
        :class="cn(tooltipContentVariants(), props.class)"
        @focus-outside="$event.preventDefault()"
        @pointer-down-outside="
          tooltip.disableClosingTrigger.value &&
          tooltip.trigger.value?.contains($event.target as Node) &&
          $event.preventDefault()
        "
        @dismiss="tooltip.onClose()"
      >
        <slot />
      </DismissableLayer>
    </Presence>
  </Teleport>
</template>
