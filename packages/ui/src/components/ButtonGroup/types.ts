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
   * Layout axis. Buttons sit edge to edge along it; nested groups sit 4px
   * apart, with a `Separator` between them when they are separate units.
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
