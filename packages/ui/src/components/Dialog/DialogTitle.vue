<script setup lang="ts">
import { DialogTitle } from 'reka-ui'
import { cn } from '../../utils/cn'
import { dialogTitleVariants } from './Dialog.variants'
import type { DialogTitleProps } from './types'

defineOptions({ name: 'RkDialogTitle' })

const props = defineProps<DialogTitleProps>()

defineSlots<{
  /** The dialog's accessible name. */
  default: () => unknown
}>()
</script>

<template>
  <DialogTitle data-slot="dialog-title" :class="cn(dialogTitleVariants(), props.class)">
    <slot />
  </DialogTitle>
</template>
