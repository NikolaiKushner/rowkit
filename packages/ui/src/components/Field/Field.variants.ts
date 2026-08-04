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

export const fieldLabelVariants = cva('font-medium text-foreground', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
    },
    disabled: {
      true: 'opacity-50',
      false: '',
    },
  },
  defaultVariants: { size: 'md', disabled: false },
})

export const fieldHintVariants = cva('text-muted-foreground', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
    },
  },
  defaultVariants: { size: 'md' },
})

export const fieldErrorVariants = cva('font-medium text-danger-solid', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
    },
  },
  defaultVariants: { size: 'md' },
})

export type FieldVariants = VariantProps<typeof fieldVariants>
