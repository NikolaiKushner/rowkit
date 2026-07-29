import type { HTMLAttributes } from 'vue'
import type { InputVariants } from './Input.variants'

/**
 * Props for `Input`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface InputProps {
  /** Control height and text size. */
  size?: NonNullable<InputVariants['size']>
  /**
   * Native input type. Deliberately excludes `checkbox`, `radio` and `file`,
   * which need different markup and a different control.
   */
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number' | 'date'
  /** Short example of the expected value. Never a substitute for a label. */
  placeholder?: string
  /** Disables the input. A surrounding disabled `Field` also disables it. */
  disabled?: boolean
  /** Marks the value invalid. A `Field` with an `error` also sets it. */
  invalid?: boolean
  /** Marks the input required. A required `Field` also sets it. */
  required?: boolean
  /** Makes the value read-only while keeping it focusable and selectable. */
  readonly?: boolean
  /** Id for the input. Inherited from a surrounding `Field` when omitted. */
  id?: string
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
