<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { unrefElement } from '../../primitives/dom'
import { Primitive } from '../../primitives/Primitive'
import { cn } from '../../utils/cn'
import { useTooltipContext } from './context'
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

const tooltip = useTooltipContext('TooltipTrigger')
const root = ref<InstanceType<typeof Primitive> | null>(null)

onMounted(() => {
  tooltip.trigger.value = unrefElement(root.value)
})

let pointerDown = false
let openedByPointer = false

const listeners = computed(() => {
  if (tooltip.disabled.value) return {}
  return {
    pointermove: (event: PointerEvent) => {
      // Touch has no hover; a tap focuses, and focus opens it.
      if (event.pointerType === 'touch' || openedByPointer) return
      tooltip.onTriggerEnter()
      openedByPointer = true
    },
    pointerleave: () => {
      tooltip.onTriggerLeave()
      openedByPointer = false
    },
    pointerdown: () => {
      // Pressing the control means the user has read enough.
      if (!tooltip.disableClosingTrigger.value) tooltip.onClose()
      pointerDown = true
      document.addEventListener('pointerup', () => setTimeout(() => (pointerDown = false), 1), {
        once: true,
      })
    },
    focus: (event: FocusEvent) => {
      // Focus from a click is not a request for the label.
      if (pointerDown) return
      if (
        tooltip.ignoreNonKeyboardFocus.value &&
        !(event.target as HTMLElement).matches(':focus-visible')
      ) {
        return
      }
      tooltip.onOpen()
    },
    blur: () => tooltip.onClose(),
    click: () => {
      if (!tooltip.disableClosingTrigger.value) tooltip.onClose()
    },
  }
})
</script>

<template>
  <Primitive
    ref="root"
    data-slot="tooltip-trigger"
    :as="props.as"
    :as-child="props.asChild"
    :type="props.as === 'button' ? 'button' : undefined"
    :aria-describedby="tooltip.open.value ? tooltip.contentId : undefined"
    :data-state="tooltip.state.value"
    :class="cn(props.class)"
    v-on="listeners"
  >
    <slot />
  </Primitive>
</template>
