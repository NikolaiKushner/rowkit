<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { computed } from 'vue'
import { cn } from '../../utils/cn'
import {
  dialogBodyVariants,
  dialogCloseVariants,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
} from './Dialog.variants'
import type { DialogProps } from './types'

defineOptions({ name: 'RkDialog' })

const props = withDefaults(defineProps<DialogProps>(), {
  size: 'md',
  preventClose: false,
  closeLabel: 'Close dialog',
})

/**
 * Visibility, controlled.
 *
 * There is no imperative `.open()` on a template ref and no internal state. The
 * consumer owns it, which is the same doctrine as the data layer and is what
 * makes "close on successful submit" a one-line flip of your own ref.
 */
const open = defineModel<boolean>('open', { default: false })

defineSlots<{
  /** Dialog body. The only scrolling region. */
  default: () => unknown
  /** Replaces the title and description row. `title` still supplies the accessible name. */
  header: () => unknown
  /** Actions. Convention is cancel first, primary last — primary nearest the corner. */
  footer: () => unknown
}>()

/**
 * `preventClose` works by cancelling Reka's dismiss events rather than by
 * dropping the handlers: the events still fire, so the layer stays in Reka's
 * dismissal stack and a nested overlay above it still behaves.
 */
function onDismissAttempt(event: Event): void {
  if (props.preventClose) event.preventDefault()
}

const hasDescription = computed(() => props.description !== undefined)

/**
 * Only bound when there is no description, and bound as an empty string.
 *
 * Reka wires `aria-describedby` to its own `DialogDescription` when one is
 * present; binding the attribute unconditionally would override that with
 * `undefined` and drop the reference entirely. The empty-string form is Reka's
 * documented way to say "there is deliberately no description", which stops it
 * pointing at an element that was never rendered.
 */
const describedByAttrs = computed(() => (hasDescription.value ? {} : { 'aria-describedby': '' }))
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay :class="dialogOverlayVariants()" />

      <DialogContent
        v-bind="describedByAttrs"
        :class="cn(dialogContentVariants({ size: props.size }), props.class)"
        @escape-key-down="onDismissAttempt"
        @pointer-down-outside="onDismissAttempt"
      >
        <!--
          The close button is outside the header slot on purpose. `preventClose`
          hardens accidental dismissal and must never be able to leave the user
          with no way out, so replacing the header cannot remove the exit.
        -->
        <DialogClose :aria-label="props.closeLabel" :class="dialogCloseVariants()">
          <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="m6 6 8 8M14 6l-8 8"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </DialogClose>

        <div :class="dialogHeaderVariants()">
          <slot name="header">
            <DialogTitle :class="dialogTitleVariants()">{{ props.title }}</DialogTitle>
            <DialogDescription v-if="hasDescription" :class="dialogDescriptionVariants()">
              {{ props.description }}
            </DialogDescription>
          </slot>
          <!--
            When the header is replaced, the title still has to exist for
            `aria-labelledby`. Rendered visually hidden rather than dropped.
          -->
          <template v-if="$slots.header">
            <DialogTitle class="sr-only">{{ props.title }}</DialogTitle>
            <DialogDescription v-if="hasDescription" class="sr-only">
              {{ props.description }}
            </DialogDescription>
          </template>
        </div>

        <div :class="dialogBodyVariants()">
          <slot />
        </div>

        <div v-if="$slots.footer" :class="dialogFooterVariants()">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
