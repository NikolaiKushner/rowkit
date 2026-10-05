<script setup lang="ts">
import { useBodyScrollLock } from '../../primitives/scrollLock'
import { useDialogContext } from './context'
import { dialogOverlayVariants } from './Dialog.variants'

/**
 * The outside-click layer: transparent, since a Windows 98 dialog draws no
 * backdrop. Internal: `DialogContent` places it, the consumer never does.
 *
 * Holds the page's scroll lock for as long as it is mounted — including its
 * exit animation — and releases it on unmount.
 */
defineOptions({ name: 'RkDialogOverlay' })

const dialog = useDialogContext('DialogOverlay')
useBodyScrollLock(true)
</script>

<template>
  <!--
    pointer-events: auto because the open dialog sets the body to none; the
    layer must still receive the click that closes the dialog. A left press on
    the layer itself is prevented so it does not move focus out of the dialog.
  -->
  <div
    data-slot="dialog-overlay"
    :data-state="dialog.open.value ? 'open' : 'closed'"
    :class="dialogOverlayVariants()"
    style="pointer-events: auto"
    @pointerdown.left.self.prevent
  />
</template>
