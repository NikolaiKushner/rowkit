import { cva, type VariantProps } from 'class-variance-authority'

export const paginationVariants = cva(
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
export const paginationItemVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center rounded-md border font-medium',
    'cursor-pointer transition-colors duration-fast ease-standard',
    'outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:border-transparent',
    'disabled:bg-transparent disabled:text-muted-foreground',
  ],
  {
    variants: {
      size: {
        // 32px square at `md`, matching Button/Input/Select. The earlier bump to
        // `h-9` chased Button's height, but a page number is not a button
        // you press once — a row of them reads as a strip, and 36px squares
        // make that strip heavier than the table it pages through.
        sm: 'h-7 min-w-7 px-2 text-xs',
        md: 'h-8 min-w-8 px-2 text-sm',
      },
      /**
       * The current page: outlined, not filled.
       *
       * A filled dark square was the loudest thing in the footer and competed
       * with the primary action above it. An outline still finds your place in
       * a row of numbers because it is the only bordered item there — weight
       * alone would not have been enough, but a border is not weight.
       *
       * `border-input`, not the decorative `border`. This border is the sole
       * visual carrier of "you are here", so it has to clear 3:1 against the
       * surface; the hairline token is deliberately below that. `aria-current`
       * carries the same state to assistive tech, so the colour is never
       * alone — but a sighted keyboard user still needs to see it.
       */
      active: {
        true: 'border-input bg-card text-foreground',
        false: 'border-transparent bg-transparent text-foreground hover:bg-accent',
      },
    },
    defaultVariants: { size: 'md', active: false },
  }
)

export const paginationEllipsisVariants = cva(
  'inline-flex shrink-0 select-none items-center justify-center text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'h-7 min-w-6',
        md: 'h-8 min-w-8',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export const paginationSummaryVariants = cva('text-muted-foreground tabular-nums', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
    },
  },
  defaultVariants: { size: 'md' },
})

export type PaginationVariants = VariantProps<typeof paginationVariants>
