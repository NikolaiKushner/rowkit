import { cva, type VariantProps } from 'class-variance-authority'

/**
 * One `size` axis drives every part, so a small empty state inside a table cell
 * and a large one filling a page are the same component rather than two.
 */
export const emptyStateVariants = cva('flex flex-col items-center justify-center text-center', {
  variants: {
    size: {
      sm: 'gap-2 px-4 py-6',
      md: 'gap-3 px-6 py-10',
      lg: 'gap-4 px-6 py-16',
    },
  },
  defaultVariants: { size: 'md' },
})

/**
 * Muted rather than full-strength: the illustration is supporting material. If
 * it competes with the title for attention, the user reads the picture and
 * misses the sentence telling them what to do.
 */
export const emptyStateIconVariants = cva(
  'flex shrink-0 items-center justify-center text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-12',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export const emptyStateTitleVariants = cva('font-medium text-foreground', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: { size: 'md' },
})

/**
 * Why the view is empty. Three situations that look identical and demand
 * different actions.
 */
export type EmptyStateReason = 'no-data' | 'no-results' | 'error'

/**
 * Width-capped on purpose. An explanation that runs the full width of a table
 * is a paragraph nobody reads; the limit keeps it to a couple of lines.
 *
 * `reason` tints the explanation rather than the title. A red heading reads as
 * an alert and pulls the eye away from the sentence that says what to do; the
 * failure needs to be legible, not loud.
 */
export const emptyStateDescriptionVariants = cva('text-balance', {
  variants: {
    size: {
      sm: 'max-w-xs text-xs',
      md: 'max-w-sm text-sm',
      lg: 'max-w-md text-sm',
    },
    reason: {
      'no-data': 'text-muted-foreground',
      'no-results': 'text-muted-foreground',
      error: 'text-danger-on-subtle',
    },
  },
  defaultVariants: { size: 'md', reason: 'no-data' },
})

export const emptyStateActionsVariants = cva('flex flex-wrap items-center justify-center', {
  variants: {
    size: {
      sm: 'gap-2 pt-1',
      md: 'gap-2 pt-1',
      lg: 'gap-3 pt-2',
    },
  },
  defaultVariants: { size: 'md' },
})

export type EmptyStateVariants = VariantProps<typeof emptyStateVariants>
