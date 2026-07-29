import type { PrimitiveProps } from 'reka-ui'
import type { ButtonVariants } from './Button.variants'
import type { HTMLAttributes } from 'vue'

/**
 * Props for `Button`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface ButtonProps {
  /** Visual weight and intent. */
  variant?: NonNullable<ButtonVariants['variant']>
  /** Control height and text size. */
  size?: NonNullable<ButtonVariants['size']>
  /** Stretches the button to fill its container. */
  block?: boolean
  /**
   * Swaps the leading slot for a spinner and blocks activation.
   *
   * The button stays focusable and keeps its label, so the control does not
   * vanish from the tab order mid-request and the accessible name never
   * changes to "Loading".
   */
  loading?: boolean
  /** Disables the button. */
  disabled?: boolean
  /**
   * Native button type. Defaults to `button`, not `submit` — an unlabelled
   * submit inside a form is the more damaging default.
   */
  type?: 'button' | 'submit' | 'reset'
  /**
   * Announced in place of the visible label while `loading` is set. Leave
   * unset to keep the label unchanged.
   */
  loadingLabel?: string
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
  /** Element or component to render as. */
  as?: PrimitiveProps['as']
  /** Merge props onto the single child element instead of rendering a wrapper. */
  asChild?: PrimitiveProps['asChild']
}
