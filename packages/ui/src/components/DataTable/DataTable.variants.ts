import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The scroll container. A table wider than its parent scrolls here rather than
 * pushing the page sideways, which is what makes a sticky column meaningful.
 */
export const dataTableWrapperVariants = cva([
  'relative w-full overflow-auto rounded-md border border-border bg-surface',
  // Focusable when it actually scrolls, so the ring has to be visible.
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
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

export const dataTableCaptionVariants = cva('px-3 py-2 text-left text-text-muted', {
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
export const dataTableHeaderRowVariants = cva('relative z-sticky')

/**
 * Body cells need no z-index of their own: a `sticky` cell is positioned, and a
 * positioned element already paints above its static siblings.
 */
export const dataTableHeaderCellVariants = cva(
  'bg-surface-subtle font-medium whitespace-nowrap text-text-muted',
  {
    variants: {
      size: {
        sm: 'h-8 px-2',
        md: 'h-10 px-3',
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
    'transition-colors duration-fast ease-standard hover:text-text',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
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

export const dataTableCellVariants = cva('border-t border-border-subtle text-text', {
  variants: {
    size: {
      sm: 'h-8 px-2',
      md: 'h-10 px-3',
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
 * scrolling, but hardcoding `bg-surface` there would paint over the selected
 * and hover states. `bg-inherit` on the cell and a real colour on the row keeps
 * one source of truth.
 */
export const dataTableRowVariants = cva(
  'bg-surface transition-colors duration-fast ease-standard',
  {
    variants: {
      /**
       * Row hover is off unless the row does something. A highlight that follows
       * the pointer across static data suggests the row is clickable when it is
       * not.
       */
      interactive: {
        true: 'hover:bg-surface-hover',
        false: '',
      },
      /** Selected wins over hover — losing the highlight on hover hides the state. */
      selected: {
        true: 'bg-surface-selected hover:bg-surface-selected',
        false: '',
      },
    },
    defaultVariants: { interactive: false, selected: false },
  }
)

export const dataTableSelectCellVariants = cva('w-px border-t border-border-subtle', {
  variants: {
    size: {
      sm: 'h-8 px-2',
      md: 'h-10 px-3',
    },
  },
  defaultVariants: { size: 'md' },
})

export const dataTableCheckboxVariants = cva(
  [
    'flex shrink-0 cursor-pointer items-center justify-center rounded-xs border',
    'border-border-control bg-surface text-primary-on-solid',
    'transition-colors duration-fast ease-standard',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
    'data-[state=checked]:border-primary-solid data-[state=checked]:bg-primary-solid',
    'data-[state=indeterminate]:border-primary-solid data-[state=indeterminate]:bg-primary-solid',
    'disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-disabled',
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
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
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
