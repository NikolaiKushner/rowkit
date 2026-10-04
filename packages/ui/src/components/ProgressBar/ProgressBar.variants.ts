import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The Windows 98 block progress bar, as in the Figma file: 18px tall in the
 * thin sunken status bevel, 2px of padding around the blocks.
 */
export const progressBarVariants = cva('relative h-[18px] w-full bg-card p-0.5 shadow-status')

/**
 * The navy blocks: 8×12, 2px apart, drawn as one repeating gradient. The width
 * is the value as a percentage of the track, rounded down to whole blocks, so
 * a block appears all at once or not at all — never half drawn. A browser
 * without CSS `round()` shows the plain percentage instead.
 */
export const progressBarFillVariants = cva([
  'h-3 max-w-full',
  'bg-[repeating-linear-gradient(to_right,var(--color-surface-selected)_0_8px,transparent_8px_10px)]',
  'w-(--rk-progress)',
  'supports-[width:round(down,1%,1px)]:w-[round(down,var(--rk-progress),10px)]',
])

export type ProgressBarVariants = VariantProps<typeof progressBarVariants>
