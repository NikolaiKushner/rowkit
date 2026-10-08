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
 * nothing turns red — unless the theme frames it (`--rk-invalid-width`).
 */
export const selectTriggerVariants = cva(
  [
    'relative flex w-full items-center gap-1 py-0.5 pr-0.5',
    'rounded-md bg-input font-sans text-ui text-foreground shadow-sunken',
    'has-[input:focus-visible]:focus-outer',
    'transition-[box-shadow,outline-color] duration-(--rk-duration-control)',
    'has-[input:disabled]:bg-surface-disabled has-[input:disabled]:text-text-disabled',
    'has-[input:disabled]:text-shadow-disabled',
    'has-[input[aria-invalid=true]]:field-invalid',
  ],
  {
    variants: {
      size: {
        sm: 'h-control-sm pl-field-px',
        md: 'h-control-md pl-field-px',
        lg: 'h-control-lg pl-field-px-lg',
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
 * Windows 98 marks the drop-down list that holds the keyboard. Not while the
 * list is open: then the highlight is in the list.
 */
export const selectInputVariants = cva([
  'h-full min-w-0 flex-1 truncate bg-transparent p-px text-inherit caret-field-caret',
  'outline-none focus-visible:focus-label focus-visible:-outline-offset-1',
  'focus-visible:outline-ring',
  'placeholder:text-text-subtle',
  'read-only:cursor-default disabled:cursor-default',
  // Tabbing in selects the text; in a read-only box that is the browser's
  // blue on top of the navy highlight below.
  'read-only:selection:bg-transparent',
  'read-only:focus:not-placeholder-shown:aria-[expanded=false]:bg-field-highlight',
  'read-only:focus:not-placeholder-shown:aria-[expanded=false]:text-on-field-highlight',
  'read-only:focus:not-placeholder-shown:aria-[expanded=false]:outline-on-field-highlight',
])

/**
 * The drop button: 16px wide, as tall as the well, raised, with the 8px
 * triangle. Held, or while the list is open, it sinks. A theme can stack an
 * up arrow over the down one (`--rk-select-up`), as a pop-up menu's control.
 */
export const selectButtonVariants = cva([
  'flex w-4 shrink-0 cursor-default flex-col items-center justify-center self-stretch',
  '[&_svg]:size-select-arrow',
  '[&>[data-arrow=up]]:[display:var(--rk-select-up)]!',
  '[&>[data-arrow=up]+[data-arrow=down]]:-mt-(--spacing-select-arrow-overlap)',
  'rounded-xs bg-field-button text-control-foreground shadow-field-button',
  'data-pressed:shadow-field-button-pressed',
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
  'z-popover w-(--rk-select-trigger-width) rounded-lg border-solid border-popover-border bg-popover [border-width:var(--rk-popover-border-width)]',
  'p-popover-inset font-sans text-ui text-foreground shadow-popover',
  '[backdrop-filter:var(--rk-popover-backdrop)] motion-safe:animate-(--rk-animate-overlay-in)',
])

/**
 * The scrolling list inside the frame: eight 22px rows, then it scrolls.
 */
export const selectListVariants = cva('scrollbar-themed max-h-44 overflow-y-auto')

/**
 * One option: a row with a column for the check mark the selected option
 * carries, then its text. Highlighted — by the keyboard or the pointer — it
 * turns navy with white text. Disabled is grey embossed text.
 */
export const selectItemVariants = cva([
  'flex h-item cursor-default select-none items-center gap-item-gap rounded-sm pr-item-pr pl-item-pl outline-none',
  'data-highlighted:bg-surface-selected data-highlighted:text-on-selected',
  'data-disabled:pointer-events-none data-disabled:text-text-disabled',
  'data-disabled:text-shadow-disabled',
])

/** The check mark's column, empty unless the option is the selected one. */
export const selectItemCheckVariants = cva(
  'flex size-item-check shrink-0 items-center justify-center [&_svg]:size-item-check-glyph'
)

/** The loading and empty rows: a line of subtle text in the list. */
export const selectMessageVariants = cva(
  'flex items-center gap-select-message-gap px-select-message-px py-select-message-py',
  {
    variants: {
      /** «Loading…» is plain text in Windows 98; «No results found» is grey in every theme. */
      tone: { loading: 'text-loading-foreground', empty: 'text-text-subtle' },
    },
    defaultVariants: { tone: 'empty' },
  }
)

export type SelectVariants = VariantProps<typeof selectTriggerVariants>
