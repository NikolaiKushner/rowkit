import type { HTMLAttributes } from 'vue'

/**
 * Props for `ScrollArea`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface ScrollAreaProps {
  /**
   * Accessible name for the scrolling region. The region takes focus so the
   * keyboard can scroll it; give it a name whenever nothing inside is
   * focusable, so a screen reader can say what it is.
   */
  label?: string
  /**
   * When the bars show. `auto` draws a bar only on an axis whose content does
   * not fit. `always` draws both, and a bar with nothing to scroll greys its
   * arrows and has no thumb.
   */
  scrollbars?: 'auto' | 'always'
  /** Additional classes for the root — its size goes here — merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
