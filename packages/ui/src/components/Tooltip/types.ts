import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

/** Where the tooltip prefers to sit. Flips automatically near a viewport edge. */
export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left'

/**
 * Props for `Tooltip`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface TooltipProps {
  /**
   * Delay before opening, in milliseconds.
   *
   * 300 rather than Reka's own 700: a label that takes three-quarters of a
   * second to appear reads as a stutter. The delay exists to stop tooltips
   * firing as the pointer crosses a toolbar, and 300 is enough for that.
   *
   * When this tooltip supplies its own provider, the delay is that provider's
   * too. An ancestor `TooltipProvider` keeps its own timing.
   */
  delay?: number
  /** Turns the tooltip off without unwrapping the trigger. */
  disabled?: boolean
}

/** Props for `TooltipTrigger`. */
export interface TooltipTriggerProps {
  /** Element or component to render as. Defaults to a button. */
  as?: PrimitiveProps['as']
  /**
   * Merge props onto the single child element instead of rendering a wrapper.
   *
   * The usual case. A wrapper span changes layout and breaks the
   * `aria-disabled` pattern the docs recommend for a control that cannot
   * receive a tooltip while it is truly `disabled`.
   */
  asChild?: PrimitiveProps['asChild']
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/**
 * Props for `TooltipContent`.
 *
 * The label is the default slot, and it is text. A tooltip never holds focus,
 * so a link or a button inside one is unreachable by keyboard. If the label
 * needs either, it is a popover.
 */
export interface TooltipContentProps {
  /** Preferred side. Flips automatically on collision. */
  placement?: TooltipPlacement
  /** Additional classes for the bubble, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
