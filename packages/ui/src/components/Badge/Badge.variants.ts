import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Colour is the product of `variant` × `appearance`, so it lives in
 * `compoundVariants` rather than in either axis alone.
 *
 * Every class is written out in full. Tailwind finds utilities by scanning for
 * literal strings, so a generated name like `bg-${variant}-subtle` would be
 * correct TypeScript and produce no CSS at all.
 */
export const badgeVariants = cva(
  // Windows 98 has no badge. This is a flat label in the system palette: a
  // 1px border, no bevel, square corners, the UI face at its regular weight.
  // Not interactive — no hover, no focus.
  'inline-flex max-w-full items-center gap-1 rounded-pill border align-middle font-sans text-ui font-normal',
  {
    variants: {
      /** Status family. */
      variant: {
        neutral: '',
        primary: '',
        success: '',
        warning: '',
        danger: '',
      },
      /** How much visual weight the badge carries. */
      appearance: {
        subtle: '',
        solid: '',
        outline: 'bg-transparent',
      },
      // 15px and 17px tall: the 13px line plus the border, and 1px of air at
      // `md`. `sm` fits a table row without pushing its height up.
      size: {
        sm: 'px-1 py-0',
        md: 'px-1.5 py-px',
      },
    },
    compoundVariants: [
      {
        variant: 'neutral',
        appearance: 'subtle',
        class: 'border-neutral-border bg-neutral-subtle text-neutral-on-subtle',
      },
      {
        variant: 'neutral',
        appearance: 'solid',
        class: 'border-neutral-solid bg-neutral-solid text-neutral-on-solid',
      },
      {
        variant: 'neutral',
        appearance: 'outline',
        class: 'border-neutral-border text-foreground',
      },

      // Soft chip: tinted fill + matching hairline. Same recipe as neutral —
      // colour lives in the wash, not in a solid pill or bare coloured text.
      {
        variant: 'primary',
        appearance: 'subtle',
        class: 'border-primary-border bg-primary-subtle text-primary-on-subtle',
      },
      {
        variant: 'primary',
        appearance: 'solid',
        class: 'border-primary-solid bg-primary-solid text-primary-on-solid',
      },
      {
        variant: 'primary',
        appearance: 'outline',
        class: 'border-primary-border text-foreground',
      },

      {
        variant: 'success',
        appearance: 'subtle',
        class: 'border-success-border bg-success-subtle text-success-on-subtle',
      },
      {
        variant: 'success',
        appearance: 'solid',
        class: 'border-success-solid bg-success-solid text-success-on-solid',
      },
      {
        variant: 'success',
        appearance: 'outline',
        class: 'border-success-border text-foreground',
      },

      {
        variant: 'warning',
        appearance: 'subtle',
        class: 'border-warning-border bg-warning-subtle text-warning-on-subtle',
      },
      {
        variant: 'warning',
        appearance: 'solid',
        class: 'border-warning-solid bg-warning-solid text-warning-on-solid',
      },
      {
        variant: 'warning',
        appearance: 'outline',
        class: 'border-warning-border text-foreground',
      },

      {
        variant: 'danger',
        appearance: 'subtle',
        class: 'border-danger-border bg-danger-subtle text-danger-on-subtle',
      },
      {
        variant: 'danger',
        appearance: 'solid',
        class: 'border-danger-solid bg-danger-solid text-danger-on-solid',
      },
      {
        variant: 'danger',
        appearance: 'outline',
        class: 'border-danger-border text-foreground',
      },
    ],
    defaultVariants: {
      variant: 'neutral',
      appearance: 'subtle',
      size: 'md',
    },
  }
)

/**
 * The dot: a 5×5 square in the variant's colour. On a solid badge it takes
 * the text colour instead, so it shows against the fill. Yellow on white or
 * silver is too faint to see, so the warning dot gets a black outline.
 */
export const badgeDotVariants = cva('size-[5px] shrink-0 rounded-pill', {
  variants: {
    variant: {
      neutral: 'bg-neutral-solid',
      primary: 'bg-primary-solid',
      success: 'bg-success-solid',
      warning: 'border border-border-strong bg-warning-solid',
      danger: 'bg-danger-solid',
    },
    appearance: {
      subtle: '',
      solid: 'border-0 bg-current',
      outline: '',
    },
  },
  defaultVariants: { variant: 'neutral', appearance: 'subtle' },
})

export type BadgeVariants = VariantProps<typeof badgeVariants>
