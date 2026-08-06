import { cva, type VariantProps } from 'class-variance-authority'

export const selectTriggerVariants = cva(
  [
    'flex w-full items-center justify-between gap-2 border bg-transparent text-left text-foreground shadow-xs',
    'cursor-pointer transition-colors duration-fast ease-standard',
    /*
     * `has-[:focus-visible]`, not `focus-visible`.
     *
     * These classes sit on the anchor, which is a wrapper. The element that
     * actually takes focus is the input inside it — Reka needs a real
     * `ComboboxInput` to be the focusable combobox, and the anchor is never
     * focused itself. A plain `focus-visible:` here therefore matched nothing,
     * ever: the Select had no visible focus indicator at all, while its class
     * list read exactly like every other control's.
     *
     * The input carries `outline-none`, so this is the only indicator; it has
     * to be on the box the user sees, which is the anchor.
     */
    'outline-none has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3',
    'has-[:focus-visible]:ring-ring/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-7 rounded-md px-2.5 text-sm',
        md: 'h-8 rounded-md px-2.5 text-sm',
        lg: 'h-9 rounded-md px-2.5 text-sm',
      },
      invalid: {
        true: 'border-danger-solid ring-3 ring-danger-solid/20 focus-visible:border-danger-solid focus-visible:ring-danger-solid/20',
        false: 'border-input',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  }
)

export const selectContentVariants = cva([
  'z-dropdown overflow-hidden rounded-md border border-border bg-card shadow-md',
  // Matches the trigger so the panel never renders narrower than the control
  // that opened it — a list of truncated labels is not a choice.
  'w-(--reka-combobox-trigger-width) min-w-40',
])

export const selectItemVariants = cva([
  'flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground outline-none',
  // Reka drives highlight through data-highlighted, which follows the keyboard
  // as well as the pointer. Styling :hover instead would leave keyboard users
  // with no visible cursor.
  'data-[highlighted]:bg-accent',
  'data-[state=checked]:bg-surface-selected data-[state=checked]:font-medium',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
])

export type SelectVariants = VariantProps<typeof selectTriggerVariants>
