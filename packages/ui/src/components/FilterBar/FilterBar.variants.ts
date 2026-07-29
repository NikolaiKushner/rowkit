import { cva, type VariantProps } from 'class-variance-authority'

export const filterBarVariants = cva('flex flex-col', {
  variants: {
    size: {
      sm: 'gap-2',
      md: 'gap-3',
    },
  },
  defaultVariants: { size: 'md' },
})

/** The row holding the search box, the consumer's controls and the actions. */
export const filterBarControlsVariants = cva('flex flex-wrap items-center', {
  variants: {
    size: {
      sm: 'gap-1.5',
      md: 'gap-2',
    },
  },
  defaultVariants: { size: 'md' },
})

/** The applied-filter row. Only rendered when something is applied. */
export const filterBarChipsVariants = cva('flex flex-wrap items-center', {
  variants: {
    size: {
      sm: 'gap-1.5',
      md: 'gap-2',
    },
  },
  defaultVariants: { size: 'md' },
})

/**
 * Deliberately quieter than `Badge`.
 *
 * A chip states a condition the user set themselves; it is not a status that
 * needs to catch the eye. A row of coloured chips above a table competes with
 * the data for attention and makes the filters look like alerts.
 */
export const filterBarChipVariants = cva(
  'inline-flex max-w-full items-center border border-border bg-surface-subtle text-text',
  {
    variants: {
      size: {
        sm: 'gap-1 rounded-xs py-0.5 pl-1.5 text-xs',
        md: 'gap-1 rounded-sm py-0.5 pl-2 text-sm',
      },
      /** A chip the user cannot clear keeps the trailing padding the button would occupy. */
      removable: {
        true: '',
        false: 'pr-2',
      },
    },
    defaultVariants: { size: 'md', removable: true },
  }
)

export const filterBarChipRemoveVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xs',
    'text-text-muted transition-colors duration-fast ease-standard',
    'hover:bg-surface-active hover:text-text',
    'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring',
    'disabled:pointer-events-none disabled:text-text-disabled',
  ],
  {
    variants: {
      size: {
        sm: 'mr-0.5 size-4',
        md: 'mr-1 size-5',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export const filterBarSummaryVariants = cva('text-text-muted tabular-nums', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
    },
  },
  defaultVariants: { size: 'md' },
})

export type FilterBarVariants = VariantProps<typeof filterBarVariants>
