import type { SeparatorVariants } from './Separator.variants'
import type { HTMLAttributes } from 'vue'

/**
 * Props for `Separator`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface SeparatorProps {
  /** Direction of the line. Vertical stretches to the height of its row. */
  orientation?: NonNullable<SeparatorVariants['orientation']>
  /**
   * Purely visual: hidden from assistive technology. Leave it off when the
   * line divides groups of controls a reader should hear as separate.
   */
  decorative?: boolean
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
