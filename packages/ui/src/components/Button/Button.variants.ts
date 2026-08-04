import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Disabled styling is expressed with the `disabled:` variant rather than a
 * separate branch, because `.disabled\:opacity-50:disabled` carries a
 * pseudo-class and therefore outranks the plain `bg-primary-solid` from the
 * variant — no ordering discipline required at the call site.
 *
 * ## The focus ring
 *
 * The reference design's recipe, and the single most recognisable detail in the language:
 * the border turns the ring colour *and* a 3px ring at 50% opacity appears
 * outside it. Both halves are load-bearing. The ring alone is translucent and
 * would not carry 3:1 against the page; the solid border is what satisfies WCAG
 * 1.4.11, and the ring is the glow that makes it read as focus rather than as a
 * hover state.
 *
 * That is why this replaced `outline-2 outline-offset-2` rather than joining
 * it: two indicators competing on the same element is noise, and the outline
 * was the one carrying no brand information.
 */
export const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 border font-medium whitespace-nowrap',
    'cursor-pointer transition-all duration-fast ease-standard',
    'outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:opacity-50',
    // A button mid-request should not look clickable, but it must stay
    // focusable so a screen reader user is not thrown out of the form.
    'aria-busy:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary:
          'border-primary-solid bg-primary-solid text-primary-on-solid hover:border-primary-solid-hover hover:bg-primary-solid-hover',
        secondary: 'border-input bg-card text-foreground hover:bg-accent active:bg-surface-active',
        ghost: 'border-transparent bg-transparent text-foreground hover:bg-accent',
        danger:
          'border-danger-solid bg-danger-solid text-danger-on-solid hover:border-danger-solid-hover hover:bg-danger-solid-hover',
      },
      // The reference design's heights and padding, and `rounded-md` at every size — its
      // buttons do not change shape as they grow, only scale. `lg` keeps
      // `text-sm`: the reference design has no larger type on a larger button, and bumping to
      // `text-base` was rowkit's own invention.
      size: {
        sm: 'h-8 rounded-md px-3 text-sm',
        md: 'h-9 rounded-md px-4 py-2 text-sm',
        lg: 'h-10 rounded-md px-6 text-sm',
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
