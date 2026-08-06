import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The control border uses `border-control`, not `border`. WCAG 1.4.11 asks for
 * 3:1 against the adjacent surface for the boundary of a UI component, and the
 * decorative `border` token is deliberately below that — see the note on the
 * token itself.
 */
export const inputVariants = cva(
  [
    // `bg-transparent` is the reference design's: the field takes the colour of whatever it
    // sits on, so a form inside a card does not show a second white rectangle.
    'w-full border bg-transparent text-foreground shadow-xs',
    'transition-all duration-fast ease-standard',
    'placeholder:text-muted-foreground',
    'outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        // No vertical padding — height is locked by `h-*`, same as Button/Select.
        sm: 'h-7 rounded-md px-2.5 text-sm',
        md: 'h-8 rounded-md px-2.5 text-sm',
        lg: 'h-9 rounded-md px-2.5 text-sm',
      },
      invalid: {
        // The reference design's invalid treatment: the border goes destructive and the focus
        // ring is tinted to match, so the state survives being focused.
        //
        // Colour is not the only signal — the error text below the control
        // carries the message, and aria-invalid carries it to assistive tech.
        true: 'border-danger-solid ring-3 ring-danger-solid/20 focus-visible:border-danger-solid focus-visible:ring-danger-solid/20',
        false: 'border-input',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  }
)

export type InputVariants = VariantProps<typeof inputVariants>
