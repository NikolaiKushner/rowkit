import type { HTMLAttributes } from 'vue'
import type { SelectVariants } from './Select.variants'

/**
 * One choice, for callers who keep their list in data and render `SelectItem`
 * from it. The component itself takes `value` and `label` on the item.
 */
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
export interface SelectProps {
  /**
   * Lets the trigger accept text and filters the list.
   *
   * Worth turning on somewhere around twenty options. Below that the search
   * box costs a keystroke and saves nothing.
   */
  searchable?: boolean
  /**
   * Hands filtering to the consumer.
   *
   * Set this when options are fetched per keystroke: the list is already the
   * server's answer, so filtering it again locally would hide results that
   * matched on a field the label does not show.
   */
  manualFilter?: boolean
  /** Disables the control. A surrounding disabled `Field` also disables it. */
  disabled?: boolean
  /** Marks the value invalid. A `Field` with an `error` also sets it. */
  invalid?: boolean
  /** Marks the control required. A required `Field` also sets it. */
  required?: boolean
  /** Name submitted with a native form. */
  name?: string
}

/** Props for `SelectTrigger`. */
export interface SelectTriggerProps {
  /** Text shown while nothing is selected. */
  placeholder?: string
  /** Accessible name for the open/close chevron. */
  togglerLabel?: string
  /** Control height and text size. Inherited from a surrounding `Field` when omitted. */
  size?: NonNullable<SelectVariants['size']>
  /** Id for the combobox input. Inherited from a surrounding `Field` when omitted. */
  id?: string
  /** Additional classes for the control, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/** Props for `SelectContent`. */
export interface SelectContentProps {
  /** Shown when no option matches the search term. */
  emptyText?: string
  /** Shows a loading row in place of the list. For async options. */
  loading?: boolean
  /** Text shown while `loading`. */
  loadingText?: string
  /** Additional classes for the panel, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}

/**
 * Props for `SelectItem`.
 *
 * `label` is what the closed trigger shows. The panel unmounts while shut, so
 * the label has to be a prop rather than text read back out of the row.
 */
export interface SelectItemProps<T extends string | number> {
  /** The value committed to `v-model`. */
  value: T
  /** Text shown in the trigger once this item is chosen. */
  label: string
  /** Renders the option unselectable while leaving it visible. */
  disabled?: boolean
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
