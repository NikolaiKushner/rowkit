<script setup lang="ts">
import { computed, onMounted, provide, ref, watch, type ComponentPublicInstance } from 'vue'
import CloseGlyphIcon from '../../icons/CloseGlyphIcon.vue'
import DismissableLayer from '../../primitives/DismissableLayer.vue'
import {
  elementsAbove,
  isCovered,
  type Layer,
  type PointerDownOutsideEvent,
} from '../../primitives/dismissableLayer'
import { getActiveElement, unrefElement } from '../../primitives/dom'
import { moveFocus, tabbables } from '../../primitives/focus'
import FocusScope from '../../primitives/FocusScope.vue'
import { hideOthers } from '../../primitives/hideOthers'
import { Presence } from '../../primitives/Presence'
import { cn } from '../../utils/cn'
import { dialogHasDescriptionKey, useDialogContext } from './context'
import {
  dialogCloseVariants,
  dialogContentVariants,
  dialogTitleBarVariants,
} from './Dialog.variants'
import DialogOverlay from './DialogOverlay.vue'
import type { DialogContentProps } from './types'

defineOptions({ name: 'RkDialogContent', inheritAttrs: false })

const props = withDefaults(defineProps<DialogContentProps>(), {
  size: 'md',
  preventClose: false,
  closeLabel: 'Close dialog',
})

defineSlots<{
  /** Header, body, and footer, in that order. */
  default: () => unknown
}>()

const dialog = useDialogContext('DialogContent')

const hasDescription = ref(false)
provide(dialogHasDescriptionKey, hasDescription)

/*
 * Teleport only after mount, so server rendering and the first client render
 * agree, and the dialog never renders inline inside an ancestor that clips it.
 */
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

/* The rest of the page is hidden from assistive technology while open. */
const layer = ref<(ComponentPublicInstance & { layer?: Layer }) | null>(null)
watch(
  () => unrefElement(layer.value),
  (el) => {
    if (!el) return
    // Opened by script rather than the trigger: return focus to what had it.
    const active = getActiveElement()
    if (active instanceof HTMLElement && active !== document.body) {
      dialog.triggerElement.value = active
    }
  },
  { flush: 'post' }
)

/*
 * Re-run whenever the layers above change. A nested dialog opening in the
 * same tick teleports after this one has already hidden the page, and must
 * not stay hidden by it.
 */
watch(
  () => {
    const own = layer.value?.layer
    return { el: unrefElement(layer.value), above: own ? elementsAbove(own) : [] }
  },
  ({ el, above }, _, onCleanup) => {
    if (!el) return
    onCleanup(hideOthers(el, above))
  },
  { flush: 'post' }
)

/**
 * Focus opens on the first control after the title bar — the first field of a
 * form, or the default button, which leads the footer — as a Windows 98
 * dialog does. The ✕ takes it only when there is nothing else.
 */
function onMountAutoFocus(event: Event): void {
  const el = unrefElement(layer.value)
  if (!el) return
  const first = tabbables(el).find((node) => !node.closest('[data-slot="dialog-title-bar"]'))
  if (!first) return
  event.preventDefault()
  moveFocus(first, { select: true })
}

/**
 * Inactive while another modal dialog is open above this one: the title bar
 * turns grey, as a Windows 98 owner window does under its dialog.
 */
const inactive = computed(() => {
  const own = layer.value?.layer
  return own ? isCovered(own) : false
})

/** Focus returns to the trigger, not merely to whatever had it last. */
function onUnmountAutoFocus(event: Event): void {
  if (event.defaultPrevented) return
  event.preventDefault()
  dialog.triggerElement.value?.focus()
}

/**
 * A right-click outside is a context menu, not a dismissal. `preventClose`
 * cancels the dismissal rather than removing the listener, so the layer stays
 * in the stack and a nested overlay above it still behaves.
 */
function onPointerDownOutside(event: PointerDownOutsideEvent): void {
  const original = event.detail.originalEvent
  const isRightClick = original.button === 2 || (original.button === 0 && original.ctrlKey)
  if (isRightClick || props.preventClose) event.preventDefault()
}

function onEscapeKeyDown(event: KeyboardEvent): void {
  if (props.preventClose) event.preventDefault()
}

/**
 * Only bound when there is no description, and bound as an empty string: it
 * says there is deliberately no description, which stops a reader announcing
 * a blank. With one, it points at it.
 */
const describedBy = computed(() => (hasDescription.value ? dialog.descriptionId : ''))
</script>

<template>
  <Teleport v-if="mounted" to="body">
    <Presence :present="dialog.open.value">
      <DialogOverlay />
    </Presence>

    <!--
      Focus leaving a trapped dialog is pulled back by the scope, so it is
      never a reason to dismiss.
    -->
    <Presence :present="dialog.open.value">
      <FocusScope
        loop
        :trapped="dialog.open.value"
        @mount-auto-focus="onMountAutoFocus"
        @unmount-auto-focus="onUnmountAutoFocus"
      >
        <DismissableLayer
          :id="dialog.contentId"
          ref="layer"
          v-bind="$attrs"
          role="dialog"
          :aria-labelledby="dialog.titleId"
          :aria-describedby="describedBy"
          :data-state="dialog.open.value ? 'open' : 'closed'"
          data-slot="dialog-content"
          :data-inactive="inactive || undefined"
          disable-outside-pointer-events
          :class="cn(dialogContentVariants({ size: props.size }), props.class)"
          @escape-key-down="onEscapeKeyDown"
          @pointer-down-outside="onPointerDownOutside"
          @focus-outside="$event.preventDefault()"
          @dismiss="dialog.setOpen(false)"
        >
          <!--
            The title bar, drawn here rather than by the header, so replacing
            the header cannot remove the exit, and `preventClose` can never
            leave the user without one. `DialogTitle` is laid over the bar.
          -->
          <div data-slot="dialog-title-bar" :class="dialogTitleBarVariants()">
            <button
              type="button"
              data-slot="dialog-close"
              :aria-label="props.closeLabel"
              :class="dialogCloseVariants()"
              @click="dialog.setOpen(false)"
            >
              <CloseGlyphIcon />
            </button>
          </div>

          <slot />
        </DismissableLayer>
      </FocusScope>
    </Presence>
  </Teleport>
</template>
