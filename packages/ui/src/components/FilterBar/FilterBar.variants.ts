import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The toolbar above a table, as in the Figma file: one row on the silver face
 * with 4px of padding and 4px between items, wrapping onto the next line when
 * the chips run out of room. Search, the consumer's controls, the chips, the
 * result count and «Clear filters» all sit in it.
 */
export const filterBarVariants = cva(
  'flex flex-wrap items-center gap-filter-bar-gap rounded-lg bg-filter-bar p-filter-bar-p font-sans text-ui text-foreground',
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
 * 23px tall at `sm`, 26px at `md`. Disabled, its text is grey and embossed.
 */
export const filterBarChipVariants = cva(
  [
    'inline-flex max-w-full items-center gap-1 rounded-pill border border-chip-border bg-chip pl-chip-px text-chip-foreground',
    // Disabled: the neutral chip, which is the same white chip in Windows 98.
    'data-disabled:border-neutral-border data-disabled:bg-neutral-subtle',
    'data-disabled:text-text-disabled data-disabled:text-shadow-disabled',
  ],
  {
    variants: {
      size: {
        sm: 'h-chip-sm',
        md: 'h-chip-md',
      },
      /** A chip the user cannot clear is padded evenly, with no ✕. */
      removable: {
        true: 'pr-chip-pr-remove',
        false: 'pr-chip-px',
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
  'group/remove inline-flex size-check shrink-0 cursor-default items-center justify-center rounded-pill',
  'bg-chip-remove text-foreground hover:bg-control-ghost-hover',
  // A theme that rings the whole ✕ rings it outside; Windows 98's dotted ring
  // is drawn by the span inside it.
  'outline-none focus-visible:focus-outer',
  'disabled:text-text-disabled',
])

/** Fills the ✕ and carries its dotted focus ring, 1px inside its edge. */
export const filterBarChipRemoveRingVariants = cva([
  'inline-flex size-full items-center justify-center rounded-pill',
  'group-focus-visible/remove:focus-label group-focus-visible/remove:-outline-offset-1',
  'group-focus-visible/remove:outline-ring',
])

/** The result count, muted, with digits that do not shift as it changes. */
export const filterBarSummaryVariants = cva('text-muted-foreground tabular-nums')

export type FilterBarVariants = VariantProps<typeof filterBarVariants>
