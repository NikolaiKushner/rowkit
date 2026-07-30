import type { HTMLAttributes } from 'vue'
import type { DialogVariants } from './Dialog.variants'

/**
 * Props for `Dialog`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface DialogProps {
  /**
   * Accessible name, rendered as the heading.
   *
   * Required, and a prop rather than only a slot. A slot-only title makes the
   * accessible name optional in practice, and optional means missing — this way
   * `aria-labelledby` is always wired, and `#header` customises the presentation
   * without being able to break the contract.
   */
  title: string
  /**
   * Supporting text under the title, wired to `aria-describedby`.
   *
   * Omit it and no description is announced — better than an empty reference,
   * which some readers announce as a blank.
   */
  description?: string
  /** Width preset. Height is content-driven, capped to the viewport. */
  size?: NonNullable<DialogVariants['size']>
  /**
   * Blocks Escape and clicking the scrim, for a flow where dismissing by
   * accident loses work.
   *
   * **Never removes the close button.** A dialog with no exit is hostile; this
   * hardens accidental dismissal, not intentional exit.
   */
  preventClose?: boolean
  /** Accessible name for the close button. */
  closeLabel?: string
  /** Additional classes for the dialog surface, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
