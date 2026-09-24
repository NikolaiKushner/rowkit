<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal } from 'reka-ui'
import { computed, provide, ref } from 'vue'
import { cn } from '../../utils/cn'
import { dialogHasDescriptionKey } from './context'
import {
  dialogCloseVariants,
  dialogContentVariants,
  dialogOverlayVariants,
} from './Dialog.variants'
import type { DialogContentProps } from './types'

defineOptions({ name: 'RkDialogContent' })

const props = withDefaults(defineProps<DialogContentProps>(), {
  size: 'md',
  preventClose: false,
  closeLabel: 'Close dialog',
})

defineSlots<{
  /** Header, body, and footer, in that order. */
  default: () => unknown
}>()

const hasDescription = ref(false)
provide(dialogHasDescriptionKey, hasDescription)

/**
 * `preventClose` works by cancelling Reka's dismiss events rather than by
 * dropping the handlers: the events still fire, so the layer stays in Reka's
 * dismissal stack and a nested overlay above it still behaves.
 */
function onDismissAttempt(event: Event): void {
  if (props.preventClose) event.preventDefault()
}

/**
 * Only bound when there is no description, and bound as an empty string.
 *
 * Reka wires `aria-describedby` to its own description id whenever content
 * mounts, even if no `DialogDescription` was rendered. Binding the attribute
 * unconditionally would override a real description. The empty-string form
 * says there is deliberately no description, which stops a reader announcing
 * a blank.
 */
const describedByAttrs = computed(() => (hasDescription.value ? {} : { 'aria-describedby': '' }))
</script>

<template>
  <DialogPortal>
    <DialogOverlay data-slot="dialog-overlay" :class="dialogOverlayVariants()" />

    <DialogContent
      data-slot="dialog-content"
      v-bind="describedByAttrs"
      :class="cn(dialogContentVariants({ size: props.size }), props.class)"
      @escape-key-down="onDismissAttempt"
      @pointer-down-outside="onDismissAttempt"
    >
      <!--
        Outside the header on purpose. Replacing the header cannot remove the
        exit, and `preventClose` must never be able to leave the user with none.
      -->
      <DialogClose
        data-slot="dialog-close"
        :aria-label="props.closeLabel"
        :class="dialogCloseVariants()"
      >
        <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="m6 6 8 8M14 6l-8 8"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </DialogClose>

      <slot />
    </DialogContent>
  </DialogPortal>
</template>
