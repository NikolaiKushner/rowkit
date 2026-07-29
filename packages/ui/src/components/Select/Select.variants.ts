import { cva, type VariantProps } from 'class-variance-authority'

export const selectTriggerVariants = cva(
  [
    'flex w-full items-center justify-between gap-2 border bg-surface text-left text-text',
    'cursor-pointer transition-colors duration-fast ease-standard',
    'hover:bg-surface-hover',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
    'disabled:cursor-not-allowed disabled:bg-surface-disabled disabled:text-text-disabled',
    'disabled:hover:bg-surface-disabled',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 rounded-sm px-2 text-sm',
        md: 'h-9 rounded-md px-3 text-sm',
        lg: 'h-10 rounded-md px-3 text-base',
      },
      invalid: {
        true: 'border-danger-solid focus-visible:outline-danger-solid',
        false: 'border-border-control',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  }
)

export const selectContentVariants = cva([
  'z-dropdown overflow-hidden rounded-md border border-border bg-surface shadow-lg',
  // Matches the trigger so the panel never renders narrower than the control
  // that opened it — a list of truncated labels is not a choice.
  'w-(--reka-combobox-trigger-width) min-w-40',
])

export const selectItemVariants = cva([
  'flex cursor-pointer select-none items-center gap-2 px-2 py-1.5 text-sm text-text outline-none',
  // Reka drives highlight through data-highlighted, which follows the keyboard
  // as well as the pointer. Styling :hover instead would leave keyboard users
  // with no visible cursor.
  'data-[highlighted]:bg-surface-hover',
  'data-[state=checked]:bg-surface-selected data-[state=checked]:font-medium',
  'data-[disabled]:pointer-events-none data-[disabled]:text-text-disabled',
])

export type SelectVariants = VariantProps<typeof selectTriggerVariants>
