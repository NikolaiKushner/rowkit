<script setup lang="ts">
import { cn } from '../../utils/cn'
import { dialogHeaderVariants } from './Dialog.variants'
import type { DialogHeaderProps } from './types'

defineOptions({ name: 'RkDialogHeader' })

const props = defineProps<DialogHeaderProps>()

defineSlots<{
  /** Title, and a description when there is one. */
  default: () => unknown
}>()
</script>

<template>
  <div data-slot="dialog-header" :class="cn(dialogHeaderVariants(), props.class)">
    <slot />
  </div>
</template>
