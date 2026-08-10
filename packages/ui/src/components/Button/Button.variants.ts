import { cva, type VariantProps } from 'class-variance-authority'

const focusRing =
  'outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

/**
 * Disabled styling is expressed with the `disabled:` variant rather than a
 * separate branch, because `.disabled\:opacity-50:disabled` carries a
 * pseudo-class and therefore outranks the plain `bg-primary-solid` from the
 * variant — no ordering discipline required at the call site.
 *
 * ## The focus ring
 *
 * Soft silver border + a 3px ring at 50% opacity — except `link`, which stays
 * typographic (underline only). Recolour `--color-ring`, do not replace the
 * recipe with `outline-*`.
 */
export const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 border font-medium whitespace-nowrap',
    // An icon passed as a bare <svg> has no intrinsic size in a flex row and
    // collapses. Sized here so a caller never has to remember, and skipped when
    // the caller has already said what size they want.
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'cursor-pointer transition-all duration-fast ease-standard',
    'disabled:pointer-events-none disabled:opacity-50',
    // A button mid-request should not look clickable, but it must stay
    // focusable so a screen reader user is not thrown out of the form.
    'aria-busy:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-primary-solid bg-primary-solid text-primary-on-solid',
          'hover:border-primary-solid-hover hover:bg-primary-solid-hover',
          focusRing,
        ].join(' '),
        outline: [
          'border-input bg-card text-foreground shadow-xs hover:bg-accent hover:text-foreground',
          focusRing,
        ].join(' '),
        // Gray wash that must read next to outline — `surface-active`, not muted.
        secondary: [
          'border-transparent bg-surface-active text-foreground shadow-xs hover:bg-border-strong',
          focusRing,
        ].join(' '),
        ghost: [
          'border-transparent bg-transparent text-foreground hover:bg-accent',
          focusRing,
        ].join(' '),
        destructive: [
          'border-danger-border bg-danger-subtle text-danger-on-subtle hover:bg-danger-border',
          focusRing,
        ].join(' '),
        // Text that acts — underline on hover/focus, never a focus chip.
        link: 'h-auto rounded-none border-transparent bg-transparent px-0 text-foreground underline-offset-4 shadow-none outline-none hover:underline focus-visible:underline',
      },
      size: {
        default: 'h-8 gap-1.5 rounded-md px-2.5 text-sm',
        xs: 'h-6 gap-1 rounded-md px-2 text-xs',
        sm: 'h-7 gap-1 rounded-md px-2.5 text-sm',
        lg: 'h-9 gap-1.5 rounded-md px-2.5 text-sm',
        icon: 'size-8 rounded-md p-0',
        'icon-xs': 'size-6 rounded-md p-0',
        'icon-sm': 'size-7 rounded-md p-0',
        'icon-lg': 'size-9 rounded-md p-0',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      // Link sizes stay text-height — ignore the control `h-*` presets.
      { variant: 'link', size: 'default', class: 'h-auto px-0' },
      { variant: 'link', size: 'xs', class: 'h-auto px-0' },
      { variant: 'link', size: 'sm', class: 'h-auto px-0' },
      { variant: 'link', size: 'lg', class: 'h-auto px-0' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      block: false,
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
