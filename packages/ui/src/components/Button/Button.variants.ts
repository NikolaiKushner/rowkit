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
    // An icon passed as a bare <svg> has no intrinsic size in a flex row and
    // collapses. Sized here so a caller never has to remember, and skipped when
    // the caller has already said what size they want.
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
      // Shared control geometry with Input and Select: same height band, same
      // corner. `rounded-md` (not `rounded-lg`) so a filled primary does not
      // read as a pill next to an outlined field.
      size: {
        xs: 'h-6 gap-1 rounded-md px-2 text-xs',
        sm: 'h-7 gap-1 rounded-md px-2.5 text-xs',
        md: 'h-8 gap-1.5 rounded-md px-2.5 text-sm',
        lg: 'h-9 gap-1.5 rounded-md px-2.5 text-sm',
      },
      /**
       * Square, for a button whose whole label is an icon.
       *
       * Width follows height rather than content, so a row of icon buttons is a
       * row of squares instead of a ragged line — and the padding presets above
       * would leave a lone glyph off-centre. The accessible name still has to
       * come from `aria-label`; nothing here supplies one.
       */
      icon: {
        true: 'px-0',
        false: '',
      },
      /** Stretches the button to fill its container. */
      block: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      { icon: true, size: 'xs', class: 'size-6' },
      { icon: true, size: 'sm', class: 'size-7' },
      { icon: true, size: 'md', class: 'size-8' },
      { icon: true, size: 'lg', class: 'size-9' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      icon: false,
      block: false,
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
