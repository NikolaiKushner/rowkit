import type { HTMLAttributes } from 'vue'

/**
 * Props for `Radio`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface RadioProps<T extends string | number = string> {
  /** This option's value. `v-model` equals it while this option is chosen. */
  value: T
  /**
   * The group's name. Options sharing it are one group: one choice, and the
   * arrow keys move between them.
   */
  name?: string
  /** The label beside the well. The default slot replaces it. */
  label?: string
  /** Disables this option: a silver well and a grey, embossed label. */
  disabled?: boolean
  /** Marks the group required for native form validation. */
  required?: boolean
  /** Id for the input. Generated when omitted. */
  id?: string
  /** Additional classes for the row, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
