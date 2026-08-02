import { version as pkgVersion } from '../package.json' with { type: 'json' }

export * from './components/Badge'
export * from './components/Button'
export * from './components/DataTable'
export * from './components/Dialog'
export * from './components/EmptyState'
export * from './components/FilterBar'
export * from './components/Field'
export * from './components/Input'
export * from './components/Select'
export * from './components/Skeleton'
export * from './components/TablePagination'
export * from './components/Toaster'
export * from './components/Tooltip'

export { cn } from './utils/cn'
export { useClientSort } from './composables/useClientSort'
export { useToast } from './composables/useToast'
export type {
  ToastAction,
  ToastItem,
  ToastOptions,
  ToastVariant,
  UseToastReturn,
} from './composables/useToast'

/**
 * The `rowkit` version this build was produced from.
 *
 * Read from `package.json` rather than written out. A literal here went stale
 * the moment Changesets bumped the manifest — it edits `package.json` and
 * nothing was updating the constant, so the first release broke its own test.
 * Rollup tree-shakes the JSON down to this one string, so nothing else ships.
 */
export const version: string = pkgVersion
