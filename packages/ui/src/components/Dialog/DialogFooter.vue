<script setup lang="ts">
import { cn } from '../../utils/cn'
import { dialogFooterVariants } from './Dialog.variants'
import type { DialogFooterProps } from './types'

defineOptions({ name: 'RkDialogFooter' })

const props = defineProps<DialogFooterProps>()

defineSlots<{
  /**
   * Actions, primary first, as Windows 98 orders them. A theme may reverse
   * them on screen: the modern theme puts the primary button last.
   */
  default: () => unknown
}>()
</script>

<template>
  <div data-slot="dialog-footer" :class="cn(dialogFooterVariants(), props.class)">
    <slot />
  </div>
</template>
