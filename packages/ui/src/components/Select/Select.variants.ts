import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A Windows 98 drop-down list: the edit box's white well in a sunken bevel,
 * with the raised drop button at its end — the same frame as Input's date
 * field, so a form of inputs and selects lines up to the pixel.
 *
 * The well stays white although the input inside is read-only: in a select,
 * read-only means "choose, don't type", not "locked". Disabled is the silver
 * well with grey embossed text, as on Input.
 *
 * Invalid is quiet, as on Input: the error mark at the end of the well, and
 * nothing turns red.
 */
export const selectTriggerVariants = cva(
  [
    'relative flex w-full items-center gap-1 py-0.5 pr-0.5',
    'bg-input font-sans text-ui text-foreground shadow-sunken',
    'has-[input:disabled]:bg-surface-disabled has-[input:disabled]:text-text-disabled',
    'has-[input:disabled]:text-shadow-disabled',
  ],
  {
    variants: {
      size: {
        sm: 'h-[21px] pl-1',
        md: 'h-[23px] pl-1',
        lg: 'h-[27px] pl-1.5',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

/**
 * The input that is the combobox. Its 1px padding is where the dotted focus
 * ring is drawn, inset, as on Input.
 *
 * A read-only select with a value shows that value highlighted while it has
 * focus — navy, white text, the ring drawn in white over it — which is how
 * Windows 98 marks the drop-down list that holds the keyboard.
 */
export const selectInputVariants = cva([
  'h-full min-w-0 flex-1 truncate bg-transparent p-px text-inherit',
  'outline-none focus-visible:outline-1 focus-visible:-outline-offset-1',
  'focus-visible:outline-dotted focus-visible:outline-ring',
  'placeholder:text-text-subtle',
  'read-only:cursor-default disabled:cursor-default',
  // Tabbing in selects the text; in a read-only box that is the browser's
  // blue on top of the navy highlight below.
  'read-only:selection:bg-transparent',
  'read-only:focus:not-placeholder-shown:bg-surface-selected',
  'read-only:focus:not-placeholder-shown:text-on-selected',
  'read-only:focus:not-placeholder-shown:outline-on-selected',
])

/**
 * The drop button: 16px wide, as tall as the well, raised, with the 8px
 * triangle. Held, it sinks.
 */
export const selectButtonVariants = cva([
  'flex w-4 shrink-0 cursor-default items-center justify-center self-stretch',
  'bg-card text-foreground shadow-raised data-pressed:shadow-pressed',
  'disabled:text-text-disabled',
])

/**
 * The list: white, a 1px black frame, attached to the bottom of the field and
 * as wide as it — the Windows 98 drop-down, not a floating menu. It appears
 * instantly.
 *
 * `z-popover`, not `z-dropdown`: a select inside a dialog must paint above the
 * dialog (`z-modal`), or the list opens underneath it.
 */
export const selectContentVariants = cva([
  'z-popover w-(--rk-select-trigger-width) border border-bevel-dark bg-input',
  'font-sans text-ui text-foreground',
])

/**
 * The scrolling list inside the frame: eight 16px rows, then it scrolls.
 */
export const selectListVariants = cva('scrollbar-win98 max-h-32 overflow-y-auto')

/**
 * One option: a 16px row with the text where the field's text sits.
 * Highlighted — by the keyboard or the pointer — it turns navy with white
 * text; there is no check mark, because the highlight starts on the selected
 * option. Disabled is grey embossed text.
 */
export const selectItemVariants = cva([
  'flex h-4 cursor-default select-none items-center px-1 outline-none',
  'data-highlighted:bg-surface-selected data-highlighted:text-on-selected',
  'data-disabled:pointer-events-none data-disabled:text-text-disabled',
  'data-disabled:text-shadow-disabled',
])

/** The loading and empty rows: a line of subtle text in the list. */
export const selectMessageVariants = cva('flex h-4 items-center px-1 text-text-subtle')

export type SelectVariants = VariantProps<typeof selectTriggerVariants>
