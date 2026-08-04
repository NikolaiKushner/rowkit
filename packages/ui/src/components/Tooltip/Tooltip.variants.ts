import { cva, type VariantProps } from 'class-variance-authority'

/**
 * `z-tooltip` is the top of the stack, and deliberately so: a toast can carry an
 * action button, and that button can have a tooltip. Asserted in the token
 * package's stacking test.
 *
 * `max-w-xs` is a hard limit rather than a suggestion. A tooltip that wraps to
 * four lines is documentation, and documentation belongs in the page.
 *
 * The fill is `primary-solid`, not `neutral-solid`. The reference design's tooltip is
 * `bg-primary` — near-black in light mode and near-white in dark — while its
 * `secondary`, which `neutral-solid` now carries, is the quiet near-white chip.
 * Left on `neutral-solid` the tooltip would render as pale grey on a pale page.
 */
export const tooltipContentVariants = cva([
  // The reference design's geometry exactly: `rounded-md px-3 py-1.5 text-xs`, and no shadow.
  // A near-black bubble does not need one, and the drop shadow was reading as a
  // second edge against a light page.
  'z-tooltip max-w-xs rounded-md px-3 py-1.5',
  'bg-primary-solid text-xs text-balance text-primary-on-solid',
  'motion-safe:data-[state=delayed-open]:animate-tooltip-in',
  'motion-safe:data-[state=instant-open]:animate-tooltip-in',
  'motion-safe:data-[state=closed]:animate-tooltip-out',
])

export type TooltipVariants = VariantProps<typeof tooltipContentVariants>
