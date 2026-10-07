import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The Windows 98 block progress bar, as in the Figma file: 18px tall in the
 * thin sunken status bevel, 2px of padding around the blocks.
 */
export const progressBarVariants = cva(
  'relative h-progress w-full overflow-hidden rounded-pill bg-track p-progress-inset shadow-status'
)

/**
 * The navy blocks: 8×12, 2px apart, drawn as one repeating gradient. The width
 * is the value as a percentage of the track, rounded down to whole blocks, so
 * a block appears all at once or not at all — never half drawn. A browser
 * without CSS `round()` shows the plain percentage instead.
 */
export const progressBarFillVariants = cva([
  'h-progress-fill max-w-full rounded-pill',
  'bg-[repeating-linear-gradient(to_right,var(--color-progress)_0_var(--spacing-progress-block),transparent_var(--spacing-progress-block)_var(--spacing-progress-period))]',
  'w-(--rk-progress) transition-[width] duration-(--rk-duration-control)',
  'supports-[width:round(down,1%,1px)]:w-[round(down,var(--rk-progress),var(--spacing-progress-period))]',
])

export type ProgressBarVariants = VariantProps<typeof progressBarVariants>
