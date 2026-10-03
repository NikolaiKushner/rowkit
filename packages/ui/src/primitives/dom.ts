/*
 * Adapted from Reka UI's shared and FocusScope utilities (MIT).
 * Copyright (c) 2023 UnoVue <https://github.com/unovue>
 */
import type { ComponentPublicInstance } from 'vue'

/** True outside SSR. */
export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'

/** The focused element, looking through open shadow roots. */
export function getActiveElement(): Element | null {
  let active = document.activeElement
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement
  return active
}

/**
 * The DOM element behind a template ref: the element itself, or a component's
 * root element.
 */
export function unrefElement(
  value: Element | ComponentPublicInstance | null | undefined
): HTMLElement | undefined {
  if (!value) return undefined
  const el = '$el' in value ? (value.$el as unknown) : value
  return el instanceof HTMLElement ? el : undefined
}

type Focusable = HTMLElement | { focus: (options?: FocusOptions) => void }

/**
 * Focuses `element` without scrolling, and with `select` also selects the
 * text of an input it moved focus into.
 */
export function focus(element?: Focusable | null, { select = false } = {}): void {
  if (!element?.focus) return
  const previous = getActiveElement()
  element.focus({ preventScroll: true })
  if (select && element !== previous && element instanceof HTMLInputElement) element.select()
}

/** Focuses the first candidate that actually takes focus. */
export function focusFirst(candidates: HTMLElement[], { select = false } = {}): boolean {
  const previous = getActiveElement()
  for (const candidate of candidates) {
    focus(candidate, { select })
    if (getActiveElement() !== previous) return true
  }
  return false
}

/**
 * Elements inside `container` that Tab can reach, in DOM order.
 *
 * An approximation: it reads the runtime `tabIndex`, so it knows which
 * elements are focusable, but not which are invisible — {@link
 * getTabbableEdges} handles that for the two that matter.
 */
export function getTabbableCandidates(container: HTMLElement): HTMLElement[] {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const el = node as HTMLElement & { disabled?: boolean; type?: string }
      const isHiddenInput = el.tagName === 'INPUT' && el.type === 'hidden'
      if (el.disabled || el.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP
      return el.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  return nodes
}

/** The first and last visible tabbable elements in `container`. */
export function getTabbableEdges(
  container: HTMLElement
): readonly [HTMLElement | undefined, HTMLElement | undefined] {
  const candidates = getTabbableCandidates(container)
  return [findVisible(candidates, container), findVisible([...candidates].reverse(), container)]
}

function findVisible(elements: HTMLElement[], container: HTMLElement): HTMLElement | undefined {
  return elements.find((el) => !isHidden(el, container))
}

function isHidden(node: HTMLElement, upTo: HTMLElement): boolean {
  if (getComputedStyle(node).visibility === 'hidden') return true
  let current: HTMLElement | null = node
  while (current && current !== upTo) {
    if (getComputedStyle(current).display === 'none') return true
    current = current.parentElement
  }
  return false
}

/**
 * Dispatches a cancelable, non-bubbling custom event on the original event's
 * target, with `handler` attached for that one dispatch. The handler can call
 * `preventDefault()` and the caller reads `defaultPrevented` afterwards.
 */
export function dispatchCustomEvent<D extends { originalEvent: Event }>(
  name: string,
  handler: ((event: CustomEvent<D>) => void) | undefined,
  detail: D
): CustomEvent<D> {
  const target = detail.originalEvent.target as EventTarget
  const event = new CustomEvent<D>(name, { bubbles: false, cancelable: true, detail })
  if (handler) target.addEventListener(name, handler as EventListener, { once: true })
  target.dispatchEvent(event)
  return event
}
