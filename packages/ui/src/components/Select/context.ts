import type { ComputedRef, InjectionKey, Ref } from 'vue'

/**
 * Shared select state. The root owns it; the trigger, the panel, and each
 * item read it. Labels outlive the panel, which unmounts while closed.
 */
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
  labels: Map<string, string>
  registerLabel: (value: string | number, label: string) => void
}

export const selectContextKey: InjectionKey<SelectContext> = Symbol('select')
