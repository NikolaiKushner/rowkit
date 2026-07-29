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
 * Header cells outrank body cells in the stacking order so a sticky header
 * paints over a pinned column as the body scrolls under it.
 *
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
        true: 'sticky top-0 z-sticky',
        false: '',
      },
      /** Pinned to the start edge, with a shadow once there is anything hidden behind it. */
      pinned: {
        true: 'sticky left-0 z-sticky',
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
    pinned: {
      true: 'sticky left-0 bg-surface',
      false: '',
    },
  },
  defaultVariants: { size: 'md', align: 'start', pinned: false },
})

export const dataTableRowVariants = cva('transition-colors duration-fast ease-standard', {
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
  },
  defaultVariants: { interactive: false },
})

/** Applied to pinned cells once the table is scrolled away from the start. */
export const dataTablePinnedShadow = 'shadow-scroll-x'

export type DataTableVariants = VariantProps<typeof dataTableVariants>
