<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
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

// The element the bubble is placed against, and half of the hover area.
onMounted(() => {
  tooltip.triggerElement.value = unrefElement(root.value)
})
onBeforeUnmount(() => {
  tooltip.triggerElement.value = undefined
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
    v-on="tooltip.triggerListeners"
  >
    <slot />
  </Primitive>
</template>
