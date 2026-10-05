import type { HTMLAttributes } from 'vue'

/**
 * Props for `Checkbox`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface CheckboxProps {
  /** The label beside the box. The default slot replaces it. */
  label?: string
  /**
   * Partly checked: some of a group, not all. Shows the bar and is announced
   * as "mixed". Checking it clears this; owning that is the caller's.
   */
  indeterminate?: boolean
  /** Disables the control: a silver box and a grey, embossed label. */
  disabled?: boolean
  /** Name submitted with a native form. */
  name?: string
  /** Value submitted with a native form while checked. */
  value?: string
  /** Marks the control required for native form validation. */
  required?: boolean
  /** Id for the input. Generated when omitted. */
  id?: string
  /** Additional classes for the row, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
