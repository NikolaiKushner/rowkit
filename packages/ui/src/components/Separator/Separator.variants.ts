import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The Windows 98 etched line: 1px of bevel shadow beside 1px of bevel
 * highlight, as in the Figma file. Horizontal it divides menu groups and
 * dialog sections; vertical it divides toolbar groups, stretching to their
 * height.
 */
export const separatorVariants = cva('shrink-0 border-0', {
  variants: {
    orientation: {
      horizontal: [
        'h-[calc(1px+var(--rk-etch-width))] w-full border-t border-b-(length:--rk-etch-width)',
        'border-t-bevel-shadow border-b-bevel-highlight',
      ].join(' '),
      vertical: [
        'w-[calc(1px+var(--rk-etch-width))] self-stretch border-l border-r-(length:--rk-etch-width)',
        'border-l-bevel-shadow border-r-bevel-highlight',
      ].join(' '),
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

export type SeparatorVariants = VariantProps<typeof separatorVariants>
