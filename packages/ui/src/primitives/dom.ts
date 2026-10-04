import type { ComponentPublicInstance } from 'vue'

/** False during server rendering, where there is no `window` or `document`. */
export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'

/**
 * The element that really has focus. `document.activeElement` stops at the
 * host of a shadow tree; this follows open shadow roots down to the element
 * inside.
 */
export function getActiveElement(): Element | null {
  let current = document.activeElement
  let inner = current?.shadowRoot?.activeElement
  while (inner) {
    current = inner
    inner = inner.shadowRoot?.activeElement
  }
  return current
}

/**
 * Resolves a template ref to an element. A ref on a plain element is the
 * element; a ref on a component is its instance, whose root element is `$el`.
 * Anything that is not an HTML element — nothing mounted yet, or a component
 * whose root is a fragment — gives `undefined`.
 */
export function unrefElement(
  value: Element | ComponentPublicInstance | null | undefined
): HTMLElement | undefined {
  // Nothing mounted yet — and on the server, where `HTMLElement` does not exist.
  if (!value) return undefined
  const candidate: unknown = '$el' in value ? value.$el : value
  return candidate instanceof HTMLElement ? candidate : undefined
}
