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
   * The label. A plain string, and **only** a string — there is no slot for rich
   * content, by design.
   *
   * A tooltip is hover-triggered and never holds focus, so an interactive
   * element inside one is unreachable by keyboard by construction. Typing this
   * as `string` closes that entire failure class at the API boundary. If it
   * needs a link or a button, it is a popover, which is deliberately not in v1.
   */
  content: string
  /** Preferred side. Flips automatically on collision. */
  placement?: TooltipPlacement
  /**
   * Delay before opening, in milliseconds.
   *
   * 300 rather than Reka's own 700: a label that takes three-quarters of a
   * second to appear reads as a stutter. The delay exists to stop tooltips
   * firing as the pointer crosses a toolbar, and 300 is enough for that.
   */
  delay?: number
  /** Turns the tooltip off without unwrapping the trigger. */
  disabled?: boolean
}
