import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The toolbar above a table, as in the Figma file: one row on the silver face
 * with 4px of padding and 4px between items, wrapping onto the next line when
 * the chips run out of room. Search, the consumer's controls, the chips, the
 * result count and «Clear filters» all sit in it.
 */
export const filterBarVariants = cva(
  'flex flex-wrap items-center gap-1 bg-card p-1 font-sans text-ui text-foreground',
  {
    variants: {
      size: {
        sm: '',
        md: '',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

/**
 * Kept for compatibility: the search box and the consumer's controls are now
 * items of the one toolbar row, so this wrapper is transparent to layout.
 */
export const filterBarControlsVariants = cva('contents')

/** The chips: also items of the toolbar row. */
export const filterBarChipsVariants = cva('contents')

/**
 * A flat filter chip: white face, 1px grey border, no bevel — quieter than a
 * Badge, because it states a condition the user set rather than a status.
 * 19px tall at `sm`, 21px at `md`. Disabled, its text is grey and embossed.
 */
export const filterBarChipVariants = cva(
  [
    'inline-flex max-w-full items-center gap-1 border border-border bg-input pl-1.5',
    'data-disabled:text-text-disabled data-disabled:text-shadow-disabled',
  ],
  {
    variants: {
      size: {
        sm: 'h-[19px]',
        md: 'h-[21px]',
      },
      /** A chip the user cannot clear is padded evenly, with no ✕. */
      removable: {
        true: 'pr-0.5',
        false: 'pr-1.5',
      },
    },
    defaultVariants: { size: 'md', removable: true },
  }
)

/**
 * The chip's ✕: a flat 13px target with the 8×7 glyph. Focus is the dotted
 * ring around it; disabled, the glyph turns grey.
 */
export const filterBarChipRemoveVariants = cva([
  'inline-flex size-[13px] shrink-0 cursor-default items-center justify-center text-foreground',
  'outline-none focus-visible:outline-1 focus-visible:-outline-offset-1',
  'focus-visible:outline-dotted focus-visible:outline-ring',
  'disabled:text-text-disabled',
])

/** The result count, with digits that do not shift as it changes. */
export const filterBarSummaryVariants = cva('tabular-nums')

export type FilterBarVariants = VariantProps<typeof filterBarVariants>
