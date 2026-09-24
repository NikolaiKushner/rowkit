<script setup lang="ts">
import { DialogTrigger } from 'reka-ui'
import { cn } from '../../utils/cn'
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
</script>

<template>
  <DialogTrigger
    data-slot="dialog-trigger"
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(props.class)"
  >
    <slot />
  </DialogTrigger>
</template>
