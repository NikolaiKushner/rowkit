import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The scroll container. A table wider than its parent scrolls here rather than
 * pushing the page sideways, which is what makes a sticky column meaningful.
 */
export const dataTableWrapperVariants = cva([
  'relative w-full overflow-auto rounded-md border border-border bg-card',
  // Focusable when it actually scrolls, so the ring has to be visible.
  'outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
])

export const dataTableVariants = cva('w-full border-collapse text-left', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
    },
  },
  defaultVariants: { size: 'md' },
})

export const dataTableCaptionVariants = cva('px-3 py-2 text-left text-muted-foreground', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
    },
  },
  defaultVariants: { size: 'md' },
})

/**
 * The header row is one layer, and its own stacking context.
 *
 * `z-sticky` sits on the row rather than on each cell so the header as a whole
 * paints over the body — including over a pinned column, which is positioned and
 * would otherwise rise above static header cells. Inside that context the cells
 * only have to be ordered against each other, which takes a plain offset rather
 * than another step on the token scale.
 */
export const dataTableHeaderRowVariants = cva('relative z-sticky border-b border-border')

/**
 * Body cells need no z-index of their own: a `sticky` cell is positioned, and a
 * positioned element already paints above its static siblings.
 *
 * `bg-card`, not `bg-muted`, and `text-foreground` rather than muted.
 *
 * The reference design's header is transparent with a hairline beneath it — the column labels
 * are full-strength foreground, not a recessed grey band with quiet text. The
 * fill stays opaque here only because the header can be sticky, and a
 * transparent sticky header lets the rows scroll through it.
 */
export const dataTableHeaderCellVariants = cva(
  'bg-card align-middle font-medium whitespace-nowrap text-foreground',
  {
    variants: {
      size: {
        sm: 'h-8 px-2',
        md: 'h-10 px-2',
      },
      align: {
        start: 'text-start',
        center: 'text-center',
        end: 'text-end',
      },
      sticky: {
        true: 'sticky top-0',
        false: '',
      },
      /** Pinned to the start edge, with a shadow once there is anything hidden behind it. */
      pinned: {
        /**
         * `z-1` orders this cell against the other header cells, inside the
         * stacking context the header row establishes — not against the page.
         *
         * Without it every header cell sat on the same layer, so the later ones
         * in the DOM painted over the pinned one: scrolling right slid `Email`
         * straight across `Name` while the pinned body cells below stayed put,
         * and the column lost its own heading.
         */
        true: 'sticky left-0 z-1',
        false: '',
      },
    },
    defaultVariants: { size: 'md', align: 'start', sticky: false, pinned: false },
  }
)

/**
 * The header becomes a real button when the column sorts. A `<th>` with a click
 * handler is not reachable by keyboard, and `aria-sort` describes the state
 * without providing any way to change it.
 */
export const dataTableSortButtonVariants = cva(
  [
    'group inline-flex w-full cursor-pointer items-center gap-1',
    'rounded-xs font-medium text-inherit',
    'transition-colors duration-fast ease-standard hover:text-foreground',
    'outline-none focus-visible:ring-3 focus-visible:ring-ring',
  ],
  {
    variants: {
      align: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
      },
    },
    defaultVariants: { align: 'start' },
  }
)

/**
 * Present but transparent when the column is unsorted, so revealing it on hover
 * does not shift the header text sideways.
 */
export const dataTableSortIconVariants = cva(
  'size-3.5 shrink-0 transition-opacity duration-fast ease-standard',
  {
    variants: {
      active: {
        true: 'opacity-100',
        false: 'opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60',
      },
    },
    defaultVariants: { active: false },
  }
)

// `border-border`, not `border-border-subtle`: the reference design's row separator is its
// standard hairline, and the fainter one disappeared entirely once the header
// stopped being a grey band to anchor the grid.
export const dataTableCellVariants = cva('border-t border-border align-middle text-foreground', {
  variants: {
    size: {
      sm: 'h-8 px-2',
      md: 'h-10 p-2',
    },
    align: {
      start: 'text-start',
      center: 'text-center',
      end: 'text-end',
    },
    // `bg-inherit`, so the row's own background — including selected and hover —
    // shows through instead of being painted over.
    pinned: {
      true: 'sticky left-0 bg-inherit',
      false: '',
    },
  },
  defaultVariants: { size: 'md', align: 'start', pinned: false },
})

/**
 * The row owns the background, not the cell.
 *
 * A pinned cell has to be opaque or the rows underneath show through it while
 * scrolling, but hardcoding `bg-card` there would paint over the selected
 * and hover states. `bg-inherit` on the cell and a real colour on the row keeps
 * one source of truth.
 */
export const dataTableRowVariants = cva('bg-card transition-colors duration-fast ease-standard', {
  variants: {
    /**
     * Row hover is off unless the row does something. A highlight that follows
     * the pointer across static data suggests the row is clickable when it is
     * not.
     */
    interactive: {
      // `/50` is the reference design's: the hover tint is half-strength so it reads as a
      // pointer follow rather than as selection, which is the full tint.
      true: 'hover:bg-accent/50',
      false: '',
    },
    /** Selected wins over hover — losing the highlight on hover hides the state. */
    selected: {
      true: 'bg-surface-selected hover:bg-surface-selected',
      false: '',
    },
  },
  defaultVariants: { interactive: false, selected: false },
})

// Matches the body cell: same hairline, same padding. The reference design drops the right
// padding on a checkbox cell so the control sits tight against its column.
export const dataTableSelectCellVariants = cva('w-px border-t border-border pr-0 align-middle', {
  variants: {
    size: {
      sm: 'h-8 px-2',
      md: 'h-10 p-2',
    },
  },
  defaultVariants: { size: 'md' },
})

/*
 * `rounded-xs` is the reference `rounded-[4px]` — the radius scale now lands exactly
 * there, which is the whole reason `xs` exists at 0.4 × `--radius`.
 */
export const dataTableCheckboxVariants = cva(
  [
    'flex shrink-0 cursor-pointer items-center justify-center rounded-xs border shadow-xs',
    'border-input bg-card text-primary-on-solid',
    'transition-all duration-fast ease-standard',
    'outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'data-[state=checked]:border-primary-solid data-[state=checked]:bg-primary-solid',
    'data-[state=indeterminate]:border-primary-solid data-[state=indeterminate]:bg-primary-solid',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'size-3.5',
        md: 'size-4',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export const dataTableRadioVariants = cva(
  [
    'cursor-pointer accent-primary-solid',
    'outline-none focus-visible:ring-3 focus-visible:ring-ring',
  ],
  {
    variants: {
      size: {
        sm: 'size-3.5',
        md: 'size-4',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

/** Applied to pinned cells once the table is scrolled away from the start. */
export const dataTablePinnedShadow = 'shadow-scroll-x'

export type DataTableVariants = VariantProps<typeof dataTableVariants>
