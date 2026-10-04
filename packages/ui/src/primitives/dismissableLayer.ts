import { shallowReactive } from 'vue'

/**
 * The stack of open dismissable layers — dialogs, listboxes, tooltips — and
 * the page-wide listeners they share.
 *
 * One set of listeners serves every layer, so the order of events never
 * depends on which layer happened to mount first:
 *
 * - **Escape** goes to the topmost layer only. One press closes one layer.
 * - **A pointer going down** is "outside" for every layer from the top down
 *   to the one it landed in. A layer that blocks outside pointer events ends
 *   the walk: nothing under a modal layer can be reached, so nothing under it
 *   reacts.
 * - **Focus moving** is walked the same way.
 *
 * Elements marked `data-dismissable-layer-branch` count as inside every layer:
 * clicking a toast while a dialog is open does not close the dialog.
 */

/** A pointer went down outside a layer. `detail.originalEvent` is the pointer event. */
export type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
/** Focus moved outside a layer. `detail.originalEvent` is the focus event. */
export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

export interface Layer {
  /** The layer's element; unset until it mounts. */
  element: HTMLElement | undefined
  /** Whether the page below is inert to the pointer while this layer is open. */
  blocking: boolean
  onEscape: (event: KeyboardEvent) => void
  onPointerOutside: (event: PointerDownOutsideEvent) => void
  onFocusOutside: (event: FocusOutsideEvent) => void
}

/** Open layers, bottom first. Reactive so every layer's pointer style follows the stack. */
const stack = shallowReactive<Layer[]>([])

export function createLayer(
  handlers: Omit<Layer, 'element' | 'blocking'>,
  blocking: boolean
): Layer {
  return shallowReactive({ ...handlers, element: undefined, blocking })
}

/**
 * Puts a layer on top of the stack. Called before the layer's children mount,
 * so a layer that opens inside another one still ends up above it.
 */
export function openLayer(layer: Layer): void {
  if (stack.length === 0) listen(true)
  stack.push(layer)
  syncPageBlocking()
}

export function closeLayer(layer: Layer): void {
  const index = stack.indexOf(layer)
  if (index === -1) return
  stack.splice(index, 1)
  syncPageBlocking()
  if (stack.length === 0) listen(false)
}

/**
 * Whether this layer must opt back in to the pointer: it is the modal layer
 * that made the page inert, or it was opened above that one.
 */
export function receivesPointer(layer: Layer): boolean {
  const index = stack.indexOf(layer)
  return index !== -1 && stack.slice(0, index + 1).some((each) => each.blocking)
}

/**
 * Whether a modal layer is open above this one: a dialog opened from a
 * dialog. A listbox or tooltip opened from it does not count — a Windows 98
 * window stays active while its own drop-down list is open.
 */
export function isCovered(layer: Layer): boolean {
  const index = stack.indexOf(layer)
  return index !== -1 && stack.slice(index + 1).some((each) => each.blocking)
}

/** The elements of the layers open above this one, top last. */
export function elementsAbove(layer: Layer): HTMLElement[] {
  const index = stack.indexOf(layer)
  if (index === -1) return []
  return stack
    .slice(index + 1)
    .map((each) => each.element)
    .filter((element): element is HTMLElement => element !== undefined)
}

/** The page's own `pointer-events` before a blocking layer replaced it. */
let pageBefore: string | undefined

/** Makes the page inert while any blocking layer is open, and puts it back after. */
export function syncPageBlocking(): void {
  const blocked = stack.some((layer) => layer.blocking)
  const { style } = document.body
  if (blocked && pageBefore === undefined) {
    pageBefore = style.pointerEvents
    style.pointerEvents = 'none'
  } else if (!blocked && pageBefore !== undefined) {
    style.pointerEvents = pageBefore
    pageBefore = undefined
  }
}

function listen(on: boolean): void {
  if (on) {
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('focusin', onFocusIn, true)
  } else {
    window.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('pointerdown', onPointerDown, true)
    document.removeEventListener('focusin', onFocusIn, true)
  }
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || event.isComposing) return
  stack[stack.length - 1]?.onEscape(event)
}

/**
 * Builds the cancelable event a layer reports, dispatched at the element the
 * original event was aimed at so `event.target` reads the same on both.
 */
function outside<E extends Event>(name: string, original: E): CustomEvent<{ originalEvent: E }> {
  const event = new CustomEvent(name, { cancelable: true, detail: { originalEvent: original } })
  const target = original.target instanceof EventTarget ? original.target : document
  target.dispatchEvent(event)
  return event
}

/** Calls `report` on every layer the target is outside of, top down. */
function walk(target: EventTarget | null, report: (layer: Layer) => void): void {
  if (!(target instanceof Node)) return
  if (target instanceof Element && target.closest('[data-dismissable-layer-branch]')) return
  // A copy: a layer that closes in response must not shift the walk.
  for (const layer of stack.slice().reverse()) {
    if (!layer.element) continue
    if (layer.element.contains(target)) return
    report(layer)
    if (layer.blocking) return
  }
}

function onPointerDown(event: PointerEvent): void {
  walk(event.target, (layer) => layer.onPointerOutside(outside('rowkit.pointerDownOutside', event)))
}

function onFocusIn(event: FocusEvent): void {
  walk(event.target, (layer) => layer.onFocusOutside(outside('rowkit.focusOutside', event)))
}
