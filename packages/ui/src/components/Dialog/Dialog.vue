<script setup lang="ts">
import { DialogRoot } from 'reka-ui'

defineOptions({ name: 'RkDialog' })

defineSlots<{
  /** Trigger and content. */
  default: () => unknown
}>()

/**
 * Visibility.
 *
 * Optional. With no `v-model`, the root holds the open state and the trigger
 * still toggles it. Bind it when the page needs to open or close the dialog.
 */
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <DialogRoot v-model:open="open" data-slot="dialog">
    <slot />
  </DialogRoot>
</template>
