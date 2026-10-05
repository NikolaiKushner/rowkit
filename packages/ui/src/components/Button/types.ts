import type { PrimitiveProps } from '../../primitives/Primitive'
import type { ButtonVariants } from './Button.variants'
import type { HTMLAttributes } from 'vue'

/**
 * Props for `Button`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface ButtonProps {
  /**
   * Visual weight and intent.
   *
   * Omit for the default button of a form or dialog — the one Enter
   * activates, drawn with a black frame. `secondary` for every other command,
   * `ghost` for a flat toolbar button, `destructive` for an action that opens
   * a confirmation (maroon label), `link` for text that acts.
   */
  variant?: NonNullable<ButtonVariants['variant']>
  /**
   * Control height: `xs` 21px, `sm` 26px, `default` 28px (Windows 98's own,
   * in Large Fonts), `lg` 33px. Icon sizes render a square of 25, 27, 30 or
   * 34px — supply
   * `aria-label` yourself.
   */
  size?: NonNullable<ButtonVariants['size']>
  /** Stretches the button to fill its container. */
  block?: boolean
  /**
   * Makes the button a toggle and sets whether it is on (`aria-pressed`).
   * On is drawn pressed in, over the dither. Leave unset for a plain command
   * button; `false` still announces a toggle that is off.
   */
  pressed?: boolean | undefined
  /**
   * Swaps the leading slot for the hourglass and blocks activation.
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
