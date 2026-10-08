import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The Windows 98 block progress bar, as in the Figma file: 18px tall in the
 * thin sunken status bevel, 2px of padding around the blocks, which sit
 * centred in the height that is left (3px from the top).
 */
export const progressBarVariants = cva(
  'relative flex h-progress w-full items-center overflow-hidden rounded-pill bg-track p-progress-inset shadow-status'
)

/**
 * The navy blocks: 8×12, 2px apart, drawn as one repeating gradient. The width
 * is the value as a percentage of the track, rounded down to whole blocks, so
 * a block appears all at once or not at all — never half drawn. A browser
 * without CSS `round()` shows the plain percentage instead.
 */
export const progressBarFillVariants = cva(
  [
    'h-progress-fill max-w-full rounded-pill',
    'bg-[repeating-linear-gradient(to_right,var(--color-progress)_0_var(--spacing-progress-block),transparent_var(--spacing-progress-block)_var(--spacing-progress-period))]',
  ],
  {
    variants: {
      /**
       * Unknown progress: a segment (`--spacing-progress-segment`) travels
       * across the track. With reduced motion it stands still in the middle,
       * at the offset `ProgressBar` measures (`--rk-progress-middle`).
       */
      indeterminate: {
        true: [
          'w-progress-segment motion-safe:animate-(--rk-animate-progress)',
          'motion-reduce:translate-x-(--rk-progress-middle)',
        ],
        false: [
          'w-(--rk-progress) transition-[width] duration-(--rk-duration-control)',
          'supports-[width:round(down,1%,1px)]:w-[round(down,var(--rk-progress),var(--spacing-progress-period))]',
        ],
      },
    },
    defaultVariants: { indeterminate: false },
  }
)

export type ProgressBarVariants = VariantProps<typeof progressBarVariants>
