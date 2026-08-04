import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The control border uses `border-control`, not `border`. WCAG 1.4.11 asks for
 * 3:1 against the adjacent surface for the boundary of a UI component, and the
 * decorative `border` token is deliberately below that — see the note on the
 * token itself.
 */
export const inputVariants = cva(
  [
    'w-full border bg-surface text-text',
    'transition-colors duration-fast ease-standard',
    'placeholder:text-text-subtle',
    'outline-none focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50',
    'disabled:cursor-not-allowed disabled:bg-surface-disabled disabled:text-text-disabled',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 rounded-sm px-2 text-sm',
        md: 'h-9 rounded-md px-3 text-sm',
        lg: 'h-10 rounded-md px-3 text-base',
      },
      invalid: {
        // Colour is not the only signal: the error text below the control
        // carries the message, and aria-invalid carries it to assistive tech.
        true: 'border-danger-solid focus-visible:outline-danger-solid',
        false: 'border-border-control',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  }
)

export type InputVariants = VariantProps<typeof inputVariants>
