<script setup lang="ts">
import { provide, ref, useId } from 'vue'
import { dialogContextKey } from './context'

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

provide(dialogContextKey, {
  open,
  setOpen: (value) => {
    open.value = value
  },
  triggerElement: ref<HTMLElement>(),
  contentId: useId(),
  titleId: useId(),
  descriptionId: useId(),
})
</script>

<template>
  <slot />
</template>
