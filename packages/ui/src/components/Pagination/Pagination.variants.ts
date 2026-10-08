import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The pager row: the range summary on one side, the rows-per-page control and
 * the page buttons on the other, 16px apart, in the 13px UI face — the way the
 * Figma Home template puts it in a window's status bar.
 */
export const paginationVariants = cva(
  'flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-sans text-ui text-foreground',
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

/** The rows-per-page control and the page buttons, kept together at the end of the row. */
export const paginationControlsVariants = cva('ml-auto flex flex-wrap items-center gap-x-4 gap-y-2')

/** The page buttons, 2px apart. */
export const paginationNavVariants = cva('flex items-center gap-0.5')

/**
 * What every pager button shares: a raised command button in Windows 98, a
 * flat label in the modern theme, through the `pager` roles. The current page
 * is pressed in, or sits on the latched grey.
 */
const pagerButton = [
  'bg-pager shadow-pager hover:bg-pager-hover focus-visible:shadow-pager-focus',
  'active:bg-pager-active active:shadow-pager-pressed',
  'aria-[current=page]:bg-control-latched aria-[current=page]:shadow-pager-pressed',
  'aria-[current=page]:hover:bg-control-latched aria-[current=page]:hover:shadow-pager-pressed',
  // A disabled pager draws the current page like the rest: not pressed in,
  // no latched face. It stays the current page to assistive technology.
  'disabled:aria-[current=page]:bg-pager disabled:aria-[current=page]:shadow-pager',
  'disabled:aria-[current=page]:*:data-[slot=button-content]:p-0',
  'disabled:aria-[current=page]:*:data-[slot=button-content]:pr-(--rk-press-shift)',
  'disabled:aria-[current=page]:*:data-[slot=button-content]:pb-(--rk-press-shift)',
  // The dotted ring hugs the label: 1px out in Windows 98, flush elsewhere.
  '[&_[data-slot=button-focus]]:px-pager-focus-px',
].join(' ')

/**
 * A page number: a Windows 98 command button (21px tall at `sm`, 26px at
 * `md`). At `md` it is square at its narrowest; at `sm` Windows 98 lets it
 * hug its number (`--spacing-pager-min-sm`). The current page is pressed in.
 */
export const paginationItemVariants = cva(['px-pager-px', pagerButton], {
  variants: {
    size: {
      sm: 'min-w-pager-min-sm',
      md: 'min-w-control-sm',
    },
  },
  defaultVariants: { size: 'md' },
})

/**
 * «◀ Back» and «Next ▶»: as wide as their label, 8px in from each side.
 * Compact, the label is read but not drawn, and the arrow sits in a button
 * as narrow as a page number's.
 */
export const paginationStepVariants = cva(['min-w-0', pagerButton], {
  variants: {
    compact: {
      auto: 'px-2 max-sm:px-1',
      always: 'px-1',
      never: 'px-2',
    },
  },
  defaultVariants: { compact: 'auto' },
})

/** The words «Back» and «Next», hidden but still read when compact. */
export const paginationStepLabelVariants = cva('', {
  variants: {
    compact: {
      auto: 'max-sm:sr-only',
      always: 'sr-only',
      never: '',
    },
  },
  defaultVariants: { compact: 'auto' },
})

/** The gap in a long run of pages: the ellipsis alone, as wide as the character. */
export const paginationEllipsisVariants = cva('shrink-0 select-none', {
  variants: {
    size: {
      sm: '',
      md: '',
    },
    /** Greyed with the page buttons beside it. */
    disabled: {
      true: 'text-text-disabled text-shadow-disabled',
      false: '',
    },
  },
  defaultVariants: { size: 'md', disabled: false },
})

/** «◀» and «▶»: the pixel triangles at their own 8px in Windows 98, 10px chevrons elsewhere. */
export const paginationArrowClass = 'size-pager-arrow'

/** "1–25 of 312", with digits that do not shift as the range moves. */
export const paginationSummaryVariants = cva('text-muted-foreground tabular-nums')

export type PaginationVariants = VariantProps<typeof paginationVariants>
