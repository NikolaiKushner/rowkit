/**
 * What the Tab key can reach inside a container, and how to move focus there.
 */

/** Elements that take focus without a `tabindex`, plus anything given one. */
const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button',
  'input',
  'select',
  'textarea',
  'iframe',
  'summary',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',')

function isDisabled(element: Element): boolean {
  return (
    (element as HTMLButtonElement).disabled === true ||
    element.closest('fieldset:disabled') !== null
  )
}

/**
 * Whether the element is drawn at all. Browsers answer this directly; where
 * that API is missing (jsdom), the `hidden` attribute is the only signal there
 * is, since nothing has a layout.
 */
function isRendered(element: HTMLElement): boolean {
  if (element.closest('[hidden], [inert]')) return false
  if (typeof element.checkVisibility === 'function') {
    return element.checkVisibility({ visibilityProperty: true })
  }
  return true
}

/**
 * Elements inside `container` that the Tab key stops on, in document order.
 *
 * Positive `tabindex` values are not reordered: rowkit never sets one, and an
 * order that differs from the reading order is an accessibility bug of its own.
 */
export function tabbables(container: HTMLElement): HTMLElement[] {
  const found: HTMLElement[] = []
  for (const element of container.querySelectorAll<HTMLElement>(FOCUSABLE)) {
    if (element.tabIndex < 0) continue
    if (element instanceof HTMLInputElement && element.type === 'hidden') continue
    if (isDisabled(element) || !isRendered(element)) continue
    found.push(element)
  }
  return found
}

/**
 * Moves focus to `element` without scrolling the page to it. With `select`,
 * the text of a text field that receives focus is selected, so typing
 * replaces it.
 *
 * @returns Whether focus actually landed there.
 */
export function moveFocus(
  element: HTMLElement | null | undefined,
  { select = false } = {}
): boolean {
  if (!element) return false
  element.focus({ preventScroll: true })
  if (document.activeElement !== element) return false
  if (select && element instanceof HTMLInputElement) element.select()
  return true
}

/** Trapping scopes that are open, innermost last. */
const traps: object[] = []

/**
 * Enters the stack of trapping focus scopes. A dialog opened from a dialog
 * traps focus inside itself; the outer one must stop pulling focus back until
 * the inner one closes, so only the innermost scope acts.
 */
export function enterTrap(): { innermost: () => boolean; leave: () => void } {
  const token = {}
  traps.push(token)
  return {
    innermost: () => traps[traps.length - 1] === token,
    leave: () => {
      const index = traps.indexOf(token)
      if (index !== -1) traps.splice(index, 1)
    },
  }
}
