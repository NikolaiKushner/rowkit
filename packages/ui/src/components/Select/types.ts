/** One choice in a `Select`. */
export interface SelectOption<TValue = string> {
  /** Text shown in the list, and in the trigger once chosen. */
  label: string
  /** The value committed to `v-model`. */
  value: TValue
  /** Renders the option unselectable while leaving it visible. */
  disabled?: boolean
}
