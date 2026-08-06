import type { HTMLAttributes } from 'vue'
import type { PaginationVariants } from './Pagination.variants'

/**
 * Props for `Pagination`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface PaginationProps {
  /** Total number of rows across all pages. */
  total: number
  /** Choices offered in the rows-per-page control. */
  pageSizeOptions?: number[]
  /** How many page numbers to show on each side of the current one. */
  siblingCount?: number
  /**
   * Always show the first and last page, with ellipses between.
   *
   * On by default, unlike the Reka primitive underneath. Without it a user on
   * page 12 of 25 sees only `11 12 13` — no indication of how far the table
   * runs and no way to reach the end. For a table that extent is information,
   * not decoration.
   */
  showEdges?: boolean
  /** Hides the rows-per-page control. */
  hidePageSize?: boolean
  /** Hides the "1–10 of 247" summary. */
  hideSummary?: boolean
  /** Label for the rows-per-page control. */
  pageSizeLabel?: string
  /** Accessible name for the navigation region. */
  label?: string
  /** Accessible name for the previous-page control. */
  previousLabel?: string
  /** Accessible name for the next-page control. */
  nextLabel?: string
  /** Control height and text size. */
  size?: NonNullable<PaginationVariants['size']>
  /** Disables every control. */
  disabled?: boolean
  /** Additional classes, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
