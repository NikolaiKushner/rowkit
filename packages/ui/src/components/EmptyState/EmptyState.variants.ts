import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A Windows 98 system message, as in the Figma file: the 32px icon on the
 * left, then the bold title, the explanation and the buttons stacked beside
 * it. It sits on whatever holds it — the white body of a table, or a panel.
 *
 * One `size` axis drives every part: `sm` fits inside a table body, `md` and
 * `lg` fill a panel. Each caps the line length at the width drawn in Figma.
 *
 * A theme can stack the icon above centred text instead
 * (`--rk-empty-direction`, `--rk-empty-align`), as the modern theme does.
 */
export const emptyStateVariants = cva(
  [
    'flex w-full font-sans text-ui text-foreground',
    '[flex-direction:var(--rk-empty-direction)] [align-items:var(--rk-empty-align)]',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-[280px] gap-3 p-empty-p-sm',
        md: 'max-w-[360px] gap-empty-gap p-empty-p-md',
        lg: 'max-w-[440px] gap-empty-gap p-empty-p-lg',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

/** The 32×32 icon, at its own size: pixel art is never scaled. */
export const emptyStateIconVariants = cva('flex size-8 shrink-0 items-center justify-center')

/** The title, the explanation and the buttons, 6px apart. */
export const emptyStateBodyVariants = cva(
  'flex w-full min-w-0 flex-1 flex-col [align-items:var(--rk-empty-align)] gap-1.5 [text-align:var(--rk-empty-align)]'
)

/**
 * The theme's heading — 16/20 bold in Windows 98, 15/20 semibold in modern —
 * at every size: the larger sizes add room, not a larger title.
 */
export const emptyStateTitleVariants = cva('font-strong text-foreground', {
  variants: {
    size: {
      sm: 'text-heading',
      md: 'text-heading',
      lg: 'text-heading',
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
 * The explanation, in the UI face and in the muted text colour (black in
 * Windows 98) for every reason. The icon
 * says "error"; red text would shout it a second time and make the sentence
 * that says what to do harder to read.
 */
export const emptyStateDescriptionVariants = cva('text-ui text-muted-foreground', {
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
export const emptyStateActionsVariants = cva(
  'flex flex-wrap items-center [justify-content:var(--rk-empty-align)] gap-1.5 pt-1',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export type EmptyStateVariants = VariantProps<typeof emptyStateVariants>
