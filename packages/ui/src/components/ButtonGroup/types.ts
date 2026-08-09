import type { ButtonGroupVariants } from './ButtonGroup.variants'
import type { HTMLAttributes } from 'vue'

/**
 * Props for `ButtonGroup`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface ButtonGroupProps {
  /**
   * Layout axis.
   *
   * Horizontal merges left/right edges; vertical merges top/bottom. Nest groups
   * to space separate units next to each other.
   */
  orientation?: NonNullable<ButtonGroupVariants['orientation']>
  /**
   * Accessible name for the group.
   *
   * Prefer this (or `aria-labelledby`) so assistive tech can announce what the
   * joined controls are for. In templates, `aria-label` maps to this prop.
   */
  ariaLabel?: string
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
