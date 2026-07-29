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
  'flex shrink-0 items-center justify-center text-text-subtle',
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

export const emptyStateTitleVariants = cva('font-medium text-text', {
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
 * Width-capped on purpose. An explanation that runs the full width of a table
 * is a paragraph nobody reads; the limit keeps it to a couple of lines.
 */
export const emptyStateDescriptionVariants = cva('text-balance text-text-muted', {
  variants: {
    size: {
      sm: 'max-w-xs text-xs',
      md: 'max-w-sm text-sm',
      lg: 'max-w-md text-sm',
    },
  },
  defaultVariants: { size: 'md' },
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
