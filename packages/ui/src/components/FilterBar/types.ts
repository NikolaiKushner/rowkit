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
