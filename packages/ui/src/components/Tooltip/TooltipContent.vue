<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'
import DismissableLayer from '../../primitives/DismissableLayer.vue'
import { unrefElement } from '../../primitives/dom'
import type { PointerDownOutsideEvent } from '../../primitives/dismissableLayer'
import { useFloating } from '../../primitives/position'
import { Presence } from '../../primitives/Presence'
import { cn } from '../../utils/cn'
import { useTooltipContext } from './context'
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

// Teleported only once mounted: there is no `body` to reach during server rendering.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const layer = ref<ComponentPublicInstance | null>(null)
const bubble = computed(() => unrefElement(layer.value))

// The root needs the bubble's box to know where the hover area ends.
watch(bubble, (element) => {
  tooltip.bubbleElement.value = element
})
onBeforeUnmount(() => {
  tooltip.bubbleElement.value = undefined
})

const { style, side } = useFloating(tooltip.triggerElement, bubble, () => ({
  side: props.placement,
  offset: 4,
  padding: 8,
}))

/**
 * A press on the trigger is the trigger's to handle — activating it may or may
 * not close the tooltip, depending on the group. Anywhere else dismisses.
 */
function onPointerDownOutside(event: PointerDownOutsideEvent): void {
  const target = event.detail.originalEvent.target
  if (target instanceof Node && tooltip.triggerElement.value?.contains(target)) {
    event.preventDefault()
  }
}
</script>

<template>
  <Teleport v-if="mounted" to="body">
    <Presence :present="tooltip.open.value">
      <!--
        The bubble is the description itself: role="tooltip", pointed at by
        the trigger's aria-describedby. No visually hidden copy of the text:
        one element is enough, and the text exists once.

        A layer for Escape and outside presses, but one that never blocks the
        page or reacts to focus moving on: the trigger's own blur decides that.
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
        @pointer-down-outside="onPointerDownOutside"
        @dismiss="tooltip.dismiss()"
      >
        <slot />
      </DismissableLayer>
    </Presence>
  </Teleport>
</template>
