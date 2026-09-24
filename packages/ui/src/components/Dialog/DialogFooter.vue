<script setup lang="ts">
import { cn } from '../../utils/cn'
import { dialogFooterVariants } from './Dialog.variants'
import type { DialogFooterProps } from './types'

defineOptions({ name: 'RkDialogFooter' })

const props = defineProps<DialogFooterProps>()

defineSlots<{
  /** Actions. Cancel first, primary last — primary nearest the corner. */
  default: () => unknown
}>()
</script>

<template>
  <div data-slot="dialog-footer" :class="cn(dialogFooterVariants(), props.class)">
    <slot />
  </div>
</template>
