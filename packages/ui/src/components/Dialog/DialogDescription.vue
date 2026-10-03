<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { cn } from '../../utils/cn'
import { dialogHasDescriptionKey, useDialogContext } from './context'
import { dialogDescriptionVariants } from './Dialog.variants'
import type { DialogDescriptionProps } from './types'

defineOptions({ name: 'RkDialogDescription' })

const props = defineProps<DialogDescriptionProps>()

defineSlots<{
  /** Supporting text, wired to `aria-describedby`. */
  default: () => unknown
}>()

const dialog = useDialogContext('DialogDescription')
const hasDescription = inject(dialogHasDescriptionKey, null)

onMounted(() => {
  if (hasDescription) hasDescription.value = true
})

onBeforeUnmount(() => {
  if (hasDescription) hasDescription.value = false
})
</script>

<template>
  <p
    :id="dialog.descriptionId"
    data-slot="dialog-description"
    :class="cn(dialogDescriptionVariants(), props.class)"
  >
    <slot />
  </p>
</template>
