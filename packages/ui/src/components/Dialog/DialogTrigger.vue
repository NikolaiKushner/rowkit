<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { unrefElement } from '../../primitives/dom'
import { Primitive } from '../../primitives/Primitive'
import { cn } from '../../utils/cn'
import { useDialogContext } from './context'
import type { DialogTriggerProps } from './types'

defineOptions({ name: 'RkDialogTrigger' })

const props = withDefaults(defineProps<DialogTriggerProps>(), {
  as: 'button',
  asChild: false,
})

defineSlots<{
  /** The control that opens the dialog. With `as-child`, this element becomes the trigger. */
  default: () => unknown
}>()

const dialog = useDialogContext('DialogTrigger')
const root = ref<InstanceType<typeof Primitive> | null>(null)

// Focus returns here when the dialog closes.
onMounted(() => {
  dialog.triggerElement.value = unrefElement(root.value)
})
</script>

<template>
  <Primitive
    ref="root"
    data-slot="dialog-trigger"
    :as="props.as"
    :as-child="props.asChild"
    :type="props.as === 'button' ? 'button' : undefined"
    aria-haspopup="dialog"
    :aria-expanded="dialog.open.value"
    :aria-controls="dialog.open.value ? dialog.contentId : undefined"
    :data-state="dialog.open.value ? 'open' : 'closed'"
    :class="cn(props.class)"
    @click="dialog.setOpen(!dialog.open.value)"
  >
    <slot />
  </Primitive>
</template>
