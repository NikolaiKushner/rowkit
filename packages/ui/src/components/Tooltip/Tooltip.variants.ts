import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A Windows 98 tooltip: the pale yellow info face, a 1px black border, the
 * UI face at 11px. No arrow, no shadow, no corners, no motion — it appears
 * after the delay and goes instantly.
 *
 * `z-tooltip` is the top of the stack, and deliberately so: a toast can carry
 * an action button, and that button can have a tooltip. Asserted in the token
 * package's stacking test.
 *
 * 240px is a hard limit rather than a suggestion. A tooltip that wraps past a
 * few lines is documentation, and documentation belongs in the page.
 */
export const tooltipContentVariants = cva([
  'z-tooltip max-w-[240px] border border-border-strong bg-tooltip-bg px-1 py-px',
  'font-sans text-ui text-foreground break-words',
])

export type TooltipVariants = VariantProps<typeof tooltipContentVariants>
