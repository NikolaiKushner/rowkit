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
      horizontal: 'h-0.5 w-full border-t border-b border-t-bevel-shadow border-b-bevel-highlight',
      vertical:
        'w-0.5 self-stretch border-r border-l border-l-bevel-shadow border-r-bevel-highlight',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

export type SeparatorVariants = VariantProps<typeof separatorVariants>
