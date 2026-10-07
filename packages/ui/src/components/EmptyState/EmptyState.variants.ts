import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A Windows 98 system message, as in the Figma file: the 32px icon on the
 * left, then the bold title, the explanation and the buttons stacked beside
 * it. It sits on whatever holds it — the white body of a table, or a panel.
 *
 * One `size` axis drives every part: `sm` fits inside a table body, `md` and
 * `lg` fill a panel. Each caps the line length at the width drawn in Figma.
 */
export const emptyStateVariants = cva('flex w-full items-start font-sans text-ui text-foreground', {
  variants: {
    size: {
      sm: 'max-w-[280px] gap-3 p-3',
      md: 'max-w-[360px] gap-4 p-6',
      lg: 'max-w-[440px] gap-4 p-6',
    },
  },
  defaultVariants: { size: 'md' },
})

/** The 32×32 icon, at its own size: pixel art is never scaled. */
export const emptyStateIconVariants = cva('flex size-8 shrink-0 items-center justify-center')

/** The title, the explanation and the buttons, 6px apart. */
export const emptyStateBodyVariants = cva('flex min-w-0 flex-1 flex-col items-start gap-1.5')

/** Bold: 13/16 at `sm` and `md`, 14/18 at `lg`. */
export const emptyStateTitleVariants = cva('font-strong text-foreground', {
  variants: {
    size: {
      sm: 'text-heading',
      md: 'text-heading',
      lg: 'text-doc-h3',
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
 * The explanation, in the UI face and in black for every reason. The icon
 * says "error"; red text would shout it a second time and make the sentence
 * that says what to do harder to read.
 */
export const emptyStateDescriptionVariants = cva('text-ui text-foreground', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    reason: {
      'no-data': '',
      'no-results': '',
      error: '',
    },
  },
  defaultVariants: { size: 'md', reason: 'no-data' },
})

/** The buttons, 4px below the text and 6px apart, as in a Windows 98 dialog. */
export const emptyStateActionsVariants = cva('flex flex-wrap items-center gap-1.5 pt-1', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: { size: 'md' },
})

export type EmptyStateVariants = VariantProps<typeof emptyStateVariants>
