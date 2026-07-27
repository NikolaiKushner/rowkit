/**
 * Motion durations and easing curves.
 *
 * Durations are short. In a data-dense interface an animation is feedback, not
 * decoration: the user is scanning rows, and anything past ~200ms reads as the
 * interface lagging rather than responding.
 *
 * Every consumer of these tokens is still responsible for honouring
 * `prefers-reduced-motion` — a token cannot express that.
 */
export const duration = {
  /** No transition. */
  instant: '0ms',
  /** Hover and focus states — must feel immediate. */
  fast: '120ms',
  /** Dropdowns, popovers, most enter/exit transitions. */
  normal: '200ms',
  /** Dialogs and large surfaces, where more travel needs more time. */
  slow: '320ms',
} as const

/** Easing curves. */
export const easing = {
  /** Linear. Progress indicators only. */
  linear: 'linear',
  /**
   * The default for anything that both enters and leaves. Fast out of the
   * gate, gentle at rest.
   */
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  /** Entering the screen: decelerate into place. */
  enter: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Leaving the screen: accelerate away. */
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
} as const

/** Names of every duration token. */
export type DurationName = keyof typeof duration
/** Names of every easing token. */
export type EasingName = keyof typeof easing
