<script setup lang="ts">
import { DialogDescription } from 'reka-ui'
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { cn } from '../../utils/cn'
import { dialogHasDescriptionKey } from './context'
import { dialogDescriptionVariants } from './Dialog.variants'
import type { DialogDescriptionProps } from './types'

defineOptions({ name: 'RkDialogDescription' })

const props = defineProps<DialogDescriptionProps>()

defineSlots<{
  /** Supporting text, wired to `aria-describedby`. */
  default: () => unknown
}>()

const hasDescription = inject(dialogHasDescriptionKey, null)

onMounted(() => {
  if (hasDescription) hasDescription.value = true
})

onBeforeUnmount(() => {
  if (hasDescription) hasDescription.value = false
})
</script>

<template>
  <DialogDescription
    data-slot="dialog-description"
    :class="cn(dialogDescriptionVariants(), props.class)"
  >
    <slot />
  </DialogDescription>
</template>
