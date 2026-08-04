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
  'inline-flex max-w-full items-center gap-1 border align-middle font-medium',
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
      // shadcn's badge is `rounded-md px-2 py-0.5 text-xs`. `sm` keeps a tighter
      // inline size for badges that live inside a table cell, where `md`'s
      // padding pushes the row height up.
      size: {
        sm: 'rounded-md px-1.5 py-0.5 text-xs',
        md: 'rounded-md px-2 py-0.5 text-xs',
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
        class: 'border-neutral-border text-neutral-on-subtle',
      },

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
        class: 'border-primary-border text-primary-on-subtle',
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
        class: 'border-success-border text-success-on-subtle',
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
        class: 'border-warning-border text-warning-on-subtle',
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
        class: 'border-danger-border text-danger-on-subtle',
      },
    ],
    defaultVariants: {
      variant: 'neutral',
      appearance: 'subtle',
      size: 'md',
    },
  }
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
