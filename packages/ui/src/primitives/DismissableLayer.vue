<!--
  Adapted from Reka UI's DismissableLayer (MIT).
  Copyright (c) 2023 UnoVue <https://github.com/unovue>
-->

<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import {
  hasLayerAbove,
  isInsideLayer,
  layers,
  type FocusOutsideEvent,
  type PointerDownOutsideEvent,
} from './dismissableLayer'
import { dispatchCustomEvent, isClient } from './dom'

/**
 * Closes on Escape and on a pointer-down or focus outside itself, and blocks
 * pointer interaction with the page below while open.
 *
 * Layers stack: only the most recently opened one reacts to Escape or to an
 * outside click, so a Select open inside a Dialog closes before the Dialog
 * does. Each of the outside events is cancelable — call `preventDefault()` in
 * the handler to keep the layer open.
 */
const props = withDefaults(
  defineProps<{
    /** Make the page below inert to the pointer while this layer is open. */
    disableOutsidePointerEvents?: boolean
  }>(),
  { disableOutsidePointerEvents: false }
)

const emit = defineEmits<{
  /** Escape was pressed while this was the topmost layer. Cancelable. */
  escapeKeyDown: [event: KeyboardEvent]
  /** A pointer went down outside. Cancelable. */
  pointerDownOutside: [event: PointerDownOutsideEvent]
  /** Focus moved outside. Cancelable. */
  focusOutside: [event: FocusOutsideEvent]
  /** The layer should close: one of the above happened and nobody cancelled it. */
  dismiss: []
}>()

const layer = ref<HTMLElement>()

const index = computed(() => (layer.value ? Array.from(layers.stack).indexOf(layer.value) : -1))
const isTopmost = () =>
  index.value === layers.stack.size - 1 && !!layer.value && !hasLayerAbove(layer.value)

/** Whether this layer sits at or above the highest pointer-blocking layer. */
const receivesPointer = computed(() => {
  const highest = [...layers.blockingOutsidePointer].at(-1)
  return highest === undefined || index.value >= Array.from(layers.stack).indexOf(highest)
})

/* Pointer down outside ---------------------------------------------------- */

const pointerInside = ref(false)
let pendingTouchClick: (() => void) | undefined

watchEffect((onCleanup) => {
  if (!isClient) return
  const doc = layer.value?.ownerDocument ?? document

  const onPointerDown = (event: PointerEvent) => {
    const el = layer.value
    if (!el || !event.target) return
    if (isInsideLayer(el, event.target)) {
      pointerInside.value = false
      return
    }
    if (!pointerInside.value) {
      const fire = () => {
        if (!receivesPointer.value) return
        const custom = dispatchCustomEvent(
          'dismissableLayer.pointerDownOutside',
          (e: PointerDownOutsideEvent) => emit('pointerDownOutside', e),
          { originalEvent: event }
        )
        void nextTick(() => {
          if (!custom.defaultPrevented) emit('dismiss')
        })
      }
      /*
       * On touch the browser fires click ~350ms after the finger lifts. Wait
       * for it, so pointer-events are not re-enabled under a click the
       * browser is still about to deliver — and so a scroll or long press,
       * which raise no click, do not dismiss.
       */
      if (event.pointerType === 'touch') {
        if (pendingTouchClick) doc.removeEventListener('click', pendingTouchClick)
        pendingTouchClick = fire
        doc.addEventListener('click', fire, { once: true })
      } else {
        fire()
      }
    } else if (pendingTouchClick) {
      doc.removeEventListener('click', pendingTouchClick)
    }
    pointerInside.value = false
  }

  /*
   * Registered a tick late: when this layer opens from a pointerdown, that
   * same event would otherwise bubble to the document and close it at once.
   */
  const timer = window.setTimeout(() => doc.addEventListener('pointerdown', onPointerDown), 0)
  onCleanup(() => {
    window.clearTimeout(timer)
    doc.removeEventListener('pointerdown', onPointerDown)
    if (pendingTouchClick) doc.removeEventListener('click', pendingTouchClick)
  })
})

/* Focus outside ------------------------------------------------------------ */

const focusInside = ref(false)

watchEffect((onCleanup) => {
  if (!isClient) return
  const doc = layer.value?.ownerDocument ?? document
  const handleFocusIn = async (event: FocusEvent) => {
    if (!layer.value) return
    await nextTick()
    await nextTick()
    const el = layer.value
    if (!el || !event.target || isInsideLayer(el, event.target) || focusInside.value) return
    const custom = dispatchCustomEvent(
      'dismissableLayer.focusOutside',
      (e: FocusOutsideEvent) => emit('focusOutside', e),
      { originalEvent: event }
    )
    if (!custom.defaultPrevented) emit('dismiss')
  }
  const onFocusIn = (event: FocusEvent) => void handleFocusIn(event)
  doc.addEventListener('focusin', onFocusIn)
  onCleanup(() => doc.removeEventListener('focusin', onFocusIn))
})

/* Escape ------------------------------------------------------------------- */

watchEffect((onCleanup) => {
  if (!isClient) return
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !layer.value || !isTopmost()) return
    emit('escapeKeyDown', event)
    if (!event.defaultPrevented) emit('dismiss')
  }
  window.addEventListener('keydown', onKeyDown)
  onCleanup(() => window.removeEventListener('keydown', onKeyDown))
})

/* Stack membership and page pointer-blocking -------------------------------- */

watch(
  layer,
  (el, _, onCleanup) => {
    if (!el) return
    layers.stack.add(el)
    onCleanup(() => {
      layers.stack.delete(el)
      layers.blockingOutsidePointer.delete(el)
    })
  },
  { immediate: true }
)

/*
 * Only re-runs when the element or the prop changes. Reading the shared set's
 * size here must not make it reactive, or another layer closing would run this
 * cleanup and restore the body's pointer-events while this one is still open.
 */
watch(
  [layer, () => props.disableOutsidePointerEvents],
  ([el, disable], _, onCleanup) => {
    if (!el || !disable) return
    const body = el.ownerDocument.body
    if (layers.blockingOutsidePointer.size === 0) {
      layers.bodyPointerEvents = body.style.pointerEvents
      body.style.pointerEvents = 'none'
    }
    layers.blockingOutsidePointer.add(el)
    onCleanup(() => {
      layers.blockingOutsidePointer.delete(el)
      if (layers.blockingOutsidePointer.size === 0 && layers.bodyPointerEvents !== undefined) {
        body.style.pointerEvents = layers.bodyPointerEvents
      }
    })
  },
  { immediate: true }
)

const style = computed(() =>
  layers.blockingOutsidePointer.size > 0
    ? { pointerEvents: receivesPointer.value ? ('auto' as const) : ('none' as const) }
    : undefined
)
</script>

<template>
  <div
    ref="layer"
    data-dismissable-layer
    :style="style"
    @focus.capture="focusInside = true"
    @blur.capture="focusInside = false"
    @pointerdown.capture="pointerInside = true"
  >
    <slot />
  </div>
</template>
