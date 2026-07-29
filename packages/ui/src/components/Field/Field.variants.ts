import { cva, type VariantProps } from 'class-variance-authority'

export const fieldVariants = cva('flex flex-col', {
  variants: {
    size: {
      sm: 'gap-1',
      md: 'gap-1.5',
      lg: 'gap-2',
    },
  },
  defaultVariants: { size: 'md' },
})

export const fieldLabelVariants = cva('font-medium text-text', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
    },
    disabled: {
      true: 'text-text-disabled',
      false: '',
    },
  },
  defaultVariants: { size: 'md', disabled: false },
})

export const fieldHintVariants = cva('text-text-muted', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-xs',
      lg: 'text-sm',
    },
  },
  defaultVariants: { size: 'md' },
})

export const fieldErrorVariants = cva('font-medium text-danger-on-subtle', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-xs',
      lg: 'text-sm',
    },
  },
  defaultVariants: { size: 'md' },
})

export type FieldVariants = VariantProps<typeof fieldVariants>
