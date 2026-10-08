import { inject, type ComputedRef, type InjectionKey, type Ref } from 'vue'

/** One option, as `SelectItem` registers it. In render order. */
export interface SelectItemRecord {
  value: string | number
  label: string
  disabled: boolean
  /** DOM id of the option, for `aria-activedescendant`. */
  id: string
}

export interface SelectContext {
  open: Ref<boolean>
  model: Ref<string | number | undefined>
  searchTerm: Ref<string>
  searchable: ComputedRef<boolean>
  manualFilter: ComputedRef<boolean>
  isDisabled: ComputedRef<boolean>
  isInvalid: ComputedRef<boolean>
  isRequired: ComputedRef<boolean>
  describedBy: ComputedRef<string | undefined>
  /** Label per value, so the trigger can show the selected label while shut. */
  labels: Map<string, string>
  registerLabel: (value: string | number, label: string) => void

  /** Every registered option, in render order. */
  items: SelectItemRecord[]
  registerItem: (item: SelectItemRecord) => () => void
  /** Options left after the search filter. Equal to `items` unless filtering locally. */
  visibleItems: ComputedRef<SelectItemRecord[]>
  /** The option the keyboard or pointer is on. */
  highlighted: Ref<string | number | undefined>
  /** The highlighted option's DOM id, while open. */
  activeDescendant: ComputedRef<string | undefined>
  listboxId: string
  /** The box the panel is positioned against and sized to. */
  anchor: Ref<HTMLElement | undefined>
  /** The combobox in the trigger: where focus goes back to when a searchable list closes. */
  control: Ref<HTMLElement | undefined>
  /** The open panel, while it is open. */
  panel: Ref<HTMLElement | undefined>

  setOpen: (open: boolean) => void
  /**
   * True from a mouse press that opened the list until that button is
   * released: releasing over an option chooses it.
   */
  dragging: Ref<boolean>
  startDrag: () => void
  choose: (value: string | number) => void
  /** Moves the highlight to the first, last, next or previous enabled option. */
  move: (to: 'first' | 'last' | 'next' | 'previous') => void
}

export const selectContextKey: InjectionKey<SelectContext> = Symbol('select')

export function useSelectContext(part: string): SelectContext {
  const context = inject(selectContextKey, null)
  if (!context) throw new Error(`${part} must be used inside Select`)
  return context
}
