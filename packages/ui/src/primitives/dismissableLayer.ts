/*
 * Adapted from Reka UI's DismissableLayer (MIT).
 * Copyright (c) 2023 UnoVue <https://github.com/unovue>
 */
import { reactive } from 'vue'

export type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

/**
 * Every open layer, in the order it opened. Shared across all layers on the
 * page so that Escape and outside clicks reach only the topmost one.
 */
export const layers = reactive({
  stack: new Set<HTMLElement>(),
  blockingOutsidePointer: new Set<HTMLElement>(),
  bodyPointerEvents: undefined as string | undefined,
})

/**
 * Whether `target` is inside `layer` or inside a layer opened after it.
 * A click in a nested popover is not a click outside the dialog under it.
 */
export function isInsideLayer(layer: HTMLElement, target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  const targetLayer = target.closest('[data-dismissable-layer]')
  if (!targetLayer) return false
  const all = Array.from(layer.ownerDocument.querySelectorAll('[data-dismissable-layer]'))
  return targetLayer === layer || all.indexOf(layer) < all.indexOf(targetLayer)
}

/**
 * Whether another dismissable layer was opened after `layer` — one later in
 * the document that `layer` does not contain.
 *
 * Read from the DOM rather than from this module's stack, so layers drawn by
 * something else that marks itself the same way (Reka UI's Select, while it
 * is still on Reka) are seen too. Overlays portal to the end of `<body>`, so
 * document order is opening order.
 */
export function hasLayerAbove(layer: HTMLElement): boolean {
  const all = Array.from(layer.ownerDocument.querySelectorAll('[data-dismissable-layer]'))
  return all.slice(all.indexOf(layer) + 1).some((other) => !layer.contains(other))
}
