import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Joins sibling buttons into one control — shared edges, outer corners only.
 *
 * Join rules target `data-slot=button` only. Nested `ButtonGroup` children are
 * separate units and pick up `gap-2` from the `has-` rule below.
 */
export const buttonGroupVariants = cva(
  [
    'inline-flex w-fit items-stretch',
    '[&_[data-slot=button]]:focus-visible:relative [&_[data-slot=button]]:focus-visible:z-10',
    // Nested groups are separate units — space them clearly so the layout
    // reads as clusters, not one long sausage.
    'has-[>[data-slot=button-group]]:gap-3',
  ],
  {
    variants: {
      orientation: {
        horizontal: [
          'flex-row',
          '[&>[data-slot=button]:not(:first-child)]:rounded-l-none [&>[data-slot=button]:not(:first-child)]:-ml-px',
          '[&>[data-slot=button]:not(:last-child)]:rounded-r-none',
        ],
        vertical: [
          'flex-col',
          '[&>[data-slot=button]:not(:first-child)]:rounded-t-none [&>[data-slot=button]:not(:first-child)]:-mt-px',
          '[&>[data-slot=button]:not(:last-child)]:rounded-b-none',
        ],
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
)

export type ButtonGroupVariants = VariantProps<typeof buttonGroupVariants>
