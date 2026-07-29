import { cva, type VariantProps } from 'class-variance-authority'

export const tablePaginationVariants = cva(
  'flex flex-wrap items-center justify-between gap-x-4 gap-y-2',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

/**
 * Shared by the page numbers and the prev/next controls so they sit on one
 * baseline and share a hit area.
 *
 * The disabled treatment is a `disabled:` variant rather than a branch, for the
 * specificity reason spelled out in `Button.variants.ts`.
 */
export const tablePaginationItemVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center rounded-sm border font-medium',
    'cursor-pointer transition-colors duration-fast ease-standard',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
    'disabled:pointer-events-none disabled:border-transparent',
    'disabled:bg-transparent disabled:text-text-disabled',
  ],
  {
    variants: {
      size: {
        sm: 'h-7 min-w-7 px-1.5 text-xs',
        md: 'h-8 min-w-8 px-2 text-sm',
      },
      /**
       * The current page. Filled rather than merely bolder — in a row of
       * numbers, weight alone is not a strong enough signal to find your place.
       */
      active: {
        true: 'border-primary-solid bg-primary-solid text-primary-on-solid',
        false: 'border-transparent bg-transparent text-text hover:bg-surface-hover',
      },
    },
    defaultVariants: { size: 'md', active: false },
  }
)

export const tablePaginationEllipsisVariants = cva(
  'inline-flex shrink-0 select-none items-center justify-center text-text-subtle',
  {
    variants: {
      size: {
        sm: 'h-7 min-w-7',
        md: 'h-8 min-w-8',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export const tablePaginationSummaryVariants = cva('text-text-muted tabular-nums', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
    },
  },
  defaultVariants: { size: 'md' },
})

export type TablePaginationVariants = VariantProps<typeof tablePaginationVariants>
