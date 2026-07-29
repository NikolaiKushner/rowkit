import type { FieldVariants } from './Field.variants'
import type { HTMLAttributes } from 'vue'

/**
 * Props for `Field`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface FieldProps {
  /** Visible label. Always render one — a placeholder is not a label. */
  label?: string
  /** Help text shown below the control while it is valid. */
  hint?: string
  /**
   * Validation message. Its presence is what puts the field into the error
   * state; there is no separate `invalid` flag to keep in sync.
   */
  error?: string
  /** Marks the control required and shows the required indicator. */
  required?: boolean
  /** Disables the control inside. */
  disabled?: boolean
  /** Sizes the label, hint and error together with the control. */
  size?: NonNullable<FieldVariants['size']>
  /**
   * Id for the control. Generated when omitted — supply one only when
   * something outside the field needs to reference it.
   */
  id?: string
  /**
   * Hides the label visually while leaving it available to screen readers.
   * For a search box in a toolbar whose purpose is obvious from context.
   */
  labelSrOnly?: boolean
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
