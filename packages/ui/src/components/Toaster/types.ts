import type { HTMLAttributes } from 'vue'
import type { ToasterVariants } from './Toaster.variants'

/**
 * Props for `Toaster`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface ToasterProps {
  /** Which corner or edge the stack grows from. */
  position?: NonNullable<ToasterVariants['position']>
  /**
   * How many toasts are on screen at once. The rest wait, FIFO.
   *
   * Three is enough to show a burst without burying the page. A queued toast
   * has no countdown until it appears, so nothing expires unseen.
   */
  max?: number
  /**
   * Announced by a screen reader before each toast, to associate the
   * interruption with the notification region.
   */
  label?: string
  /** Accessible name for each toast's close button. */
  closeLabel?: string
  /** Additional classes for the viewport, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
