import { cva, type VariantProps } from 'class-variance-authority'

/**
 * `z-tooltip` is the top of the stack, and deliberately so: a toast can carry an
 * action button, and that button can have a tooltip. Asserted in the token
 * package's stacking test.
 *
 * `max-w-xs` is a hard limit rather than a suggestion. A tooltip that wraps to
 * four lines is documentation, and documentation belongs in the page.
 */
export const tooltipContentVariants = cva([
  'z-tooltip max-w-xs rounded-sm px-2 py-1',
  'bg-neutral-solid text-xs text-neutral-on-solid shadow-md',
  'motion-safe:data-[state=delayed-open]:animate-tooltip-in',
  'motion-safe:data-[state=instant-open]:animate-tooltip-in',
  'motion-safe:data-[state=closed]:animate-tooltip-out',
])

export type TooltipVariants = VariantProps<typeof tooltipContentVariants>
