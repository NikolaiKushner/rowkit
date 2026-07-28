import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Disabled styling is expressed with the `disabled:` variant rather than a
 * separate branch, because `.disabled\:bg-surface-disabled:disabled` carries a
 * pseudo-class and therefore outranks the plain `bg-primary-solid` from the
 * variant — no ordering discipline required at the call site.
 */
export const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 border font-medium',
    'cursor-pointer transition-colors duration-fast ease-standard',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
    'disabled:pointer-events-none disabled:border-transparent',
    'disabled:bg-surface-disabled disabled:text-text-disabled',
    // A button mid-request should not look clickable, but it must stay
    // focusable so a screen reader user is not thrown out of the form.
    'aria-busy:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary:
          'border-primary-solid bg-primary-solid text-primary-on-solid hover:border-primary-solid-hover hover:bg-primary-solid-hover',
        secondary:
          'border-border-control bg-surface text-text hover:bg-surface-hover active:bg-surface-active',
        ghost: 'border-transparent bg-transparent text-text hover:bg-surface-hover',
        danger:
          'border-danger-solid bg-danger-solid text-danger-on-solid hover:border-danger-solid-hover hover:bg-danger-solid-hover',
      },
      size: {
        sm: 'h-8 rounded-sm px-3 text-sm',
        md: 'h-9 rounded-md px-4 text-sm',
        lg: 'h-10 rounded-md px-5 text-base',
      },
      /** Stretches the button to fill its container. */
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      block: false,
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
