import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The root: the visible caption above the frame. A consumer class lands here,
 * so a height such as `max-h-96` bounds the whole table and the body scrolls
 * inside it.
 */
export const dataTableRootVariants = cva('flex w-full min-h-0 flex-col gap-1')

/**
 * The Windows 98 list frame: a white well inside a sunken bevel, 2px in.
 *
 * The bevel is on its own element, outside the scroll container: an inset
 * shadow paints under the content, so on the scrolling element itself the rows
 * and the sticky header would slide over it.
 */
export const dataTableFrameVariants = cva(
  'flex min-h-0 flex-1 flex-col bg-input p-0.5 shadow-sunken'
)

/**
 * The scroll container. A table wider than its frame scrolls here rather than
 * pushing the page sideways, which is what makes a sticky column meaningful.
 */
export const dataTableWrapperVariants = cva([
  'scrollbar-win98 relative min-h-0 w-full flex-1 overflow-auto',
  // Focusable when it actually scrolls, so focus has to be visible.
  'outline-none focus-visible:outline-1 focus-visible:-outline-offset-1',
  'focus-visible:outline-dotted focus-visible:outline-ring',
])

/**
 * The scroll container with drawn bars (`scrollbars="drawn"`): a ScrollArea in
 * the same place, filling the frame the same way.
 */
export const dataTableScrollAreaVariants = cva('min-h-0 w-full flex-1')

export const dataTableVariants = cva(
  [
    // Report view: no grid lines between rows or columns.
    'border-collapse text-left font-sans text-ui text-foreground',
    // As wide as its columns want, and never narrower than the frame. A table
    // squeezed to the frame ignores every column's width and wraps its cells;
    // this one keeps the widths and scrolls sideways instead.
    'w-max min-w-full',
  ],
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

/** The visible caption: plain UI text on the window face, above the frame. */
export const dataTableCaptionVariants = cva('text-left font-sans text-ui text-foreground', {
  variants: {
    size: {
      sm: '',
      md: '',
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
 * A column header: a raised button face, as in a Windows 98 list view.
 *
 * Body cells need no z-index of their own: a `sticky` cell is positioned, and
 * a positioned element already paints above its static siblings.
 *
 * The face is opaque, which a sticky header needs anyway: a transparent one
 * lets the rows scroll through it.
 */
export const dataTableHeaderCellVariants = cva(
  'bg-card align-middle font-normal whitespace-nowrap text-foreground shadow-raised',
  {
    variants: {
      size: {
        // `h-*` on a table cell is the CSS minimum row height (min-height is
        // ignored on `display: table-cell`).
        sm: 'h-[18px] px-1 py-0',
        md: 'h-[22px] px-1 py-0',
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
      /** Pinned to the start edge, with a 1px edge once there is anything hidden behind it. */
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
      /** A sortable header is all button: the button brings its own padding. */
      sortable: {
        true: 'p-0',
        false: '',
      },
    },
    defaultVariants: { size: 'md', align: 'start', sticky: false, pinned: false, sortable: false },
  }
)

/**
 * The header becomes a real button when the column sorts. A `<th>` with a click
 * handler is not reachable by keyboard, and `aria-sort` describes the state
 * without providing any way to change it.
 *
 * Held down, it sinks — the pressed bevel, and the label moves 2px right and
 * 1px down without the header changing size. Focus is a dotted ring around the
 * label. No hover: Windows 98 headers had none.
 */
export const dataTableSortButtonVariants = cva(
  [
    'group/sort flex w-full cursor-pointer items-center bg-card px-1 text-inherit',
    'shadow-raised outline-none active:shadow-pressed',
  ],
  {
    variants: {
      size: {
        sm: 'h-[18px]',
        md: 'h-[22px]',
      },
      align: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
      },
    },
    defaultVariants: { size: 'md', align: 'start' },
  }
)

/** The label and the arrow, which move together when the header is pressed. */
export const dataTableSortContentVariants = cva(
  'flex min-w-0 items-center gap-1 group-active/sort:translate-x-0.5 group-active/sort:translate-y-px'
)

/** The dotted focus ring, drawn around the label only. */
export const dataTableSortLabelVariants = cva([
  'truncate px-px',
  'group-focus-visible/sort:outline-1 group-focus-visible/sort:-outline-offset-1',
  'group-focus-visible/sort:outline-dotted group-focus-visible/sort:outline-ring',
])

/** The 8×8 sort triangle. Only a sorted column shows one. */
export const dataTableSortIconVariants = cva('shrink-0')

/** A body cell. No borders: a Windows 98 report view has no grid lines. */
/*
 * `whitespace-nowrap`: a Windows 98 list never wraps a cell. A wrapped cell
 * breaks the fixed row height, and the row beside it no longer lines up.
 */
export const dataTableCellVariants = cva('px-1.5 py-0 align-middle whitespace-nowrap', {
  variants: {
    size: {
      sm: 'h-[18px]',
      md: 'h-[22px]',
    },
    align: {
      start: 'text-start',
      center: 'text-center',
      end: 'text-end',
    },
    // `bg-inherit`, so the row's own background — selected included — shows
    // through instead of being painted over.
    pinned: {
      true: 'sticky left-0 bg-inherit',
      false: '',
    },
    /** Figures in the mono face, so their digits line up down the column. */
    numeric: {
      true: 'font-mono text-mono tabular-nums',
      false: '',
    },
  },
  defaultVariants: { size: 'md', align: 'start', pinned: false, numeric: false },
})

/**
 * The row owns the background, not the cell.
 *
 * A pinned cell has to be opaque or the rows underneath show through it while
 * scrolling, but hardcoding a colour there would paint over the selected
 * state. `bg-inherit` on the cell and a real colour on the row keeps one
 * source of truth.
 */
export const dataTableRowVariants = cva(
  [
    'bg-input',
    // A focused row gets the dotted rectangle, as a Windows 98 list draws it.
    'outline-none focus-visible:outline-1 focus-visible:-outline-offset-1',
    'focus-visible:outline-dotted focus-visible:outline-ring',
  ],
  {
    variants: {
      /**
       * Kept for the API. Windows 98 rows have no hover, so an interactive row
       * looks like any other until it is selected or focused.
       */
      interactive: {
        true: 'cursor-default',
        false: '',
      },
      /**
       * Navy with white text, as a Windows 98 list draws a selected row, and
       * it stays navy when the table loses focus (Windows greyed it; navy keeps
       * the contrast). The cells, and text a cell colours with a text token,
       * turn white too, or they would be black on navy. The focus rectangle
       * turns white with them.
       */
      selected: {
        true: [
          'bg-surface-selected text-on-selected *:text-on-selected',
          '[&_:is(.text-foreground,.text-muted-foreground)]:text-on-selected',
          'focus-visible:outline-on-selected',
        ].join(' '),
        false: '',
      },
    },
    defaultVariants: { interactive: false, selected: false },
  }
)

/**
 * Row actions. Always visible: Windows 98 has no hover to reveal them on, and
 * an action that appears only under the pointer is one a keyboard or touch
 * user has to know is there. Kept as an export so existing markup still works.
 */
export const dataTableRowActionClass = ''

/** The 28px selection column, the control centred in it. */
export const dataTableSelectCellVariants = cva('w-7 min-w-7 px-0 text-center align-middle', {
  variants: {
    size: {
      sm: 'h-[18px]',
      md: 'h-[22px]',
    },
    header: {
      true: '',
      false: '',
    },
    /**
     * Pinned with the columns after it whenever the table has a pinned column,
     * so the check boxes stay beside the rows they select.
     */
    pinned: {
      true: 'sticky left-0 bg-inherit',
      false: '',
    },
  },
  defaultVariants: { size: 'md', header: false, pinned: false },
})

/**
 * The Windows 98 check box: a 13×13 sunken white box with a 7×7 check, the
 * same size at every table density. Held down or disabled, the box turns
 * silver.
 *
 * The check is coloured through the foreground variable rather than the
 * `text-foreground` class, so a selected row — which turns that class white —
 * leaves it black on its white box.
 *
 * @deprecated DataTable's selection column is the public `Checkbox` now, a
 * native input styled by `checkboxBoxVariants`. Kept so existing imports do
 * not break; nothing in rowkit uses it.
 */
export const dataTableCheckboxVariants = cva(
  [
    'inline-flex size-[13px] shrink-0 cursor-pointer items-center justify-center align-middle',
    'bg-input text-(--color-foreground) shadow-sunken',
    'active:bg-surface-disabled',
    'outline-none focus-visible:outline-1 focus-visible:outline-offset-1',
    'focus-visible:outline-dotted focus-visible:outline-ring',
    'disabled:cursor-default disabled:bg-surface-disabled disabled:text-text-disabled',
  ],
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
 * The Windows 98 option button around a native radio. The input covers the
 * 12×12 mark, invisible, so clicks, focus, keyboard and the shared `name` stay
 * native; the mark reads its state through `peer-*`.
 */
export const dataTableRadioVariants = cva('relative inline-flex size-3 align-middle', {
  variants: {
    size: {
      sm: '',
      md: '',
    },
  },
  defaultVariants: { size: 'md' },
})

export const dataTableRadioInputClass =
  'peer absolute inset-0 m-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-default'

export const dataTableRadioMarkClass = [
  'pointer-events-none text-(--color-foreground)',
  '[--rk-radio-well:var(--color-input)] [--rk-radio-dot:transparent]',
  'peer-checked:[--rk-radio-dot:currentColor]',
  'peer-active:[--rk-radio-well:var(--color-surface-disabled)]',
  'peer-disabled:[--rk-radio-well:var(--color-surface-disabled)] peer-disabled:text-text-disabled',
  'peer-focus-visible:outline-1 peer-focus-visible:outline-offset-1',
  'peer-focus-visible:outline-dotted peer-focus-visible:outline-ring',
].join(' ')

/**
 * A summary row's cell: bold, under an etched line — 1px of shadow over 1px
 * of highlight — and held at the bottom of the scroll area, as the header is
 * at the top. The line is a background rather than a shadow, so the pinned
 * column's edge shadow can still be drawn on the same cell.
 */
export const dataTableSummaryCellVariants = cva(
  [
    'sticky bottom-0 pt-0.5 font-bold',
    'bg-[linear-gradient(var(--color-bevel-shadow)_0_1px,var(--color-bevel-highlight)_1px_2px,var(--color-input)_2px)]',
  ],
  {
    variants: {
      size: {
        sm: 'h-5',
        md: 'h-6',
      },
      /** A pinned summary cell paints over the summary cells scrolling under it. */
      pinned: {
        true: 'z-1',
        false: '',
      },
    },
    defaultVariants: { size: 'md', pinned: false },
  }
)

/**
 * Applied to the last pinned column once the table is scrolled away from the
 * start: the edge the scrolled columns pass under.
 */
export const dataTablePinnedShadow = 'shadow-scroll-x'

export type DataTableVariants = VariantProps<typeof dataTableVariants>
