<script setup lang="ts">
import { cn } from '../../utils/cn'
import { dialogBodyVariants } from './Dialog.variants'
import type { DialogBodyProps } from './types'

defineOptions({ name: 'RkDialogBody' })

const props = defineProps<DialogBodyProps>()

defineSlots<{
  /** Dialog body. The only scrolling region. */
  default: () => unknown
}>()
</script>

<template>
  <div data-slot="dialog-body" :class="cn(dialogBodyVariants(), props.class)">
    <slot />
  </div>
</template>
