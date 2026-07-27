/**
 * Stacking layers.
 *
 * Spaced by 100 so a consumer can slot their own chrome — an app header, a
 * cookie banner — between two rowkit layers without editing rowkit or starting
 * a `z-index: 99999` arms race.
 *
 * The ordering is not arbitrary. A tooltip must outrank a toast, because a
 * toast can carry an action button that itself has a tooltip. A popover must
 * outrank a modal, because a select inside a dialog opens a popover.
 */
export const zIndex = {
  /** Default flow. */
  base: '0',
  /** Sticky table header and pinned columns. */
  sticky: '100',
  /** Dropdown menus attached to page-level content. */
  dropdown: '200',
  /** Backdrop behind a modal. */
  overlay: '300',
  /** Dialog surface. */
  modal: '400',
  /** Popovers and selects — must sit above a dialog to work inside one. */
  popover: '500',
  /** Toast queue. */
  toast: '600',
  /** Tooltips outrank everything, including toasts. */
  tooltip: '700',
} as const

/** Names of every z-index token. */
export type ZIndexName = keyof typeof zIndex
