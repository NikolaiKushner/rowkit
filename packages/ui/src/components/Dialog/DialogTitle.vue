<script setup lang="ts">
import { cn } from '../../utils/cn'
import { useDialogContext } from './context'
import { dialogTitleVariants } from './Dialog.variants'
import type { DialogTitleProps } from './types'

defineOptions({ name: 'RkDialogTitle' })

const props = defineProps<DialogTitleProps>()

const dialog = useDialogContext('DialogTitle')

defineSlots<{
  /** The dialog's accessible name. */
  default: () => unknown
}>()
</script>

<template>
  <h2 :id="dialog.titleId" data-slot="dialog-title" :class="cn(dialogTitleVariants(), props.class)">
    <slot />
  </h2>
</template>
