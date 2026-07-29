import type { FilterBarVariants } from './FilterBar.variants'
import type { HTMLAttributes } from 'vue'

/**
 * One applied filter, shown as a removable chip.
 *
 * Declared here rather than in the SFC because `<script setup>` cannot export
 * types.
 */
export interface FilterChip {
  /**
   * Stable identity. Used as the list key and handed back on `remove`, so it
   * should identify the filter rather than its current value.
   */
  id: string
  /** The field being filtered — "Role", "Status", "Created". */
  label: string
  /** The applied value — "Admin", "Active", "Last 7 days". */
  value?: string
  /**
   * Whether this chip can be removed. Off for a filter the user is not allowed
   * to clear, such as a tenant scope applied by the application itself.
   */
  removable?: boolean
}

/**
 * Props for `FilterBar`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface FilterBarProps {
  /**
   * The filters currently applied, shown as chips.
   *
   * Derived from your filter state rather than owned here — this component
   * displays what is applied and asks to remove it; the application decides
   * what that means.
   */
  filters?: FilterChip[]
  /**
   * Number of matching rows. Announced politely when it changes, which is
   * the only feedback a screen reader user gets that a filter did anything.
   */
  resultCount?: number
  /** Shows the search box. */
  searchable?: boolean
  /** Placeholder for the search box. */
  searchPlaceholder?: string
  /** Accessible name for the search box. Visually hidden. */
  searchLabel?: string
  /** Label for the clear-all control. */
  clearLabel?: string
  /**
   * Accessible name for the chip's remove control. `{filter}` is replaced
   * with the chip's text.
   */
  removeLabel?: string
  /**
   * Accessible name for the region.
   *
   * The bar is a `search` landmark, so it can be reached by landmark
   * navigation instead of only by tabbing through the controls. Give
   * concurrent instances distinct names — two landmarks sharing one is an
   * axe `landmark-unique` violation.
   */
  label?: string
  /** Control height and text size. */
  size?: NonNullable<FilterBarVariants['size']>
  /** Disables every control. */
  disabled?: boolean
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
