import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The pager row: the range summary and rows-per-page control on one side, the
 * page buttons on the other, in the 11px UI face — the way the Figma Home
 * template puts it in a window's status bar.
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

/** The page buttons, 2px apart. */
export const paginationNavVariants = cva('flex items-center gap-0.5')

/**
 * A page number: a Windows 98 command button (17px at `sm`, 21px at `md`),
 * square at its narrowest. The current page is pressed in — `Button` draws
 * `aria-current="page"` that way.
 */
export const paginationItemVariants = cva('px-1', {
  variants: {
    size: {
      sm: 'min-w-[17px]',
      md: 'min-w-[21px]',
    },
  },
  defaultVariants: { size: 'md' },
})

/** «◀ Back» and «Next ▶»: as wide as their label, 8px in from each side. */
export const paginationStepVariants = cva('min-w-0 px-2')

/** The gap in a long run of pages: an ellipsis in a page-button-sized box. */
export const paginationEllipsisVariants = cva(
  'inline-flex shrink-0 select-none items-center justify-center',
  {
    variants: {
      size: {
        sm: 'h-[17px] min-w-[17px]',
        md: 'h-[21px] min-w-[21px]',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

/** "1–25 of 312", with digits that do not shift as the range moves. */
export const paginationSummaryVariants = cva('tabular-nums')

export type PaginationVariants = VariantProps<typeof paginationVariants>
