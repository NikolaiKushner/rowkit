import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A Windows 98 toolbar group: buttons edge to edge, each keeping its own
 * bevel — nothing is merged, as in the Figma toolbars.
 *
 * A group of groups spaces them 4px apart, the gap the Figma Home toolbar
 * leaves on each side of the etched `Separator` between groups. A
 * `Separator` placed straight between buttons in one group stays flush.
 */
export const buttonGroupVariants = cva(
  ['inline-flex w-fit', 'has-[>[data-slot=button-group]]:gap-1'],
  {
    variants: {
      orientation: {
        horizontal: 'flex-row items-center',
        vertical: 'flex-col items-stretch',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
)

export type ButtonGroupVariants = VariantProps<typeof buttonGroupVariants>
