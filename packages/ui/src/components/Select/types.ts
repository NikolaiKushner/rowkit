import type { HTMLAttributes } from 'vue'
import type { SelectVariants } from './Select.variants'

/** One choice in a `Select`. */
export interface SelectOption<TValue = string> {
  /** Text shown in the list, and in the trigger once chosen. */
  label: string
  /** The value committed to `v-model`. */
  value: TValue
  /** Renders the option unselectable while leaving it visible. */
  disabled?: boolean
}

/**
 * Props for `Select`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface SelectProps<T extends string | number> {
  /** The available choices. */
  options: SelectOption<T>[]
  /** Text shown in the trigger while nothing is selected. */
  placeholder?: string
  /**
   * Adds a search box inside the panel.
   *
   * Worth turning on somewhere around twenty options. Below that the search
   * box costs a keystroke and saves nothing.
   */
  searchable?: boolean
  /** Accessible name for the open/close chevron. */
  togglerLabel?: string
  /** Shown when no option matches the search term. */
  emptyText?: string
  /**
   * Hands filtering to the consumer.
   *
   * Set this when options are fetched per keystroke: the list is already the
   * server's answer, so filtering it again locally would hide results that
   * matched on a field the label does not show.
   */
  manualFilter?: boolean
  /** Shows a loading row in place of the list. For async options. */
  loading?: boolean
  /** Text shown while `loading`. */
  loadingText?: string
  /** Control height and text size. */
  size?: NonNullable<SelectVariants['size']>
  /** Disables the control. A surrounding disabled `Field` also disables it. */
  disabled?: boolean
  /** Marks the value invalid. A `Field` with an `error` also sets it. */
  invalid?: boolean
  /** Marks the control required. A required `Field` also sets it. */
  required?: boolean
  /** Id for the trigger. Inherited from a surrounding `Field` when omitted. */
  id?: string
  /** Name submitted with a native form. */
  name?: string
  /** Additional classes for the trigger, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
