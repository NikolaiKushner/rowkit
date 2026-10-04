import type { HTMLAttributes } from 'vue'
import type { InputVariants } from './Input.variants'

/**
 * Props for `Input`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface InputProps {
  /**
   * Control height: `sm` 21px, `md` 23px, `lg` 27px — the same as Button's
   * `sm`, `default` and `lg`, so a field and its button line up. Inherited from
   * a surrounding `Field` when omitted.
   */
  size?: NonNullable<InputVariants['size']>
  /**
   * Native input type. `search` adds the magnifier and clears on Escape,
   * `number` the spin buttons, `date` the drop button that opens the picker.
   * Deliberately excludes `checkbox`, `radio` and `file`, which need different
   * markup and a different control.
   */
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number' | 'date'
  /** Short example of the expected value. Never a substitute for a label. */
  placeholder?: string
  /** Disables the input. A surrounding disabled `Field` also disables it. */
  disabled?: boolean
  /**
   * Marks the value invalid: `aria-invalid` and the error mark at the end of
   * the field. Quiet on purpose — the message belongs in Field. A `Field` with
   * an `error` also sets it.
   */
  invalid?: boolean
  /** Marks the input required. A required `Field` also sets it. */
  required?: boolean
  /** Makes the value read-only while keeping it focusable and selectable. */
  readonly?: boolean
  /** Id for the input. Inherited from a surrounding `Field` when omitted. */
  id?: string
  /**
   * Additional classes for the frame — the visible box with the bevel — merged
   * so a consumer's utility wins. Width goes here. Other attributes (`name`,
   * `autocomplete`, listeners) go to the native `<input>`.
   */
  class?: HTMLAttributes['class']
}
