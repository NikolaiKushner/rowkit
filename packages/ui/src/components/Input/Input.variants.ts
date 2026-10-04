import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A Windows 98 edit box: a white well inside a sunken bevel.
 *
 * The bevel and the fill live on the frame, a wrapper around the native
 * `<input>`, because the frame also holds the icons and buttons a type brings
 * with it — the magnifier, the spin buttons, the drop button, the error mark —
 * and those sit inside the bevel, beside the text.
 *
 * Invalid is quiet: the bevel does not change and nothing turns red. The field
 * shows the error mark at its end, `aria-invalid` tells assistive technology,
 * and the message lives in Field.
 */
export const inputFrameVariants = cva(
  [
    'relative flex w-full items-center gap-1 py-0.5',
    'bg-input font-sans text-ui text-foreground shadow-sunken',
    // Disabled: silver well, grey embossed text. Read-only: silver well,
    // black text that can still be selected and copied.
    'has-[input:disabled]:bg-surface-disabled has-[input:disabled]:text-text-disabled',
    'has-[input:disabled]:text-shadow-disabled',
    'has-[input:read-only]:bg-card',
  ],
  {
    variants: {
      size: {
        sm: 'h-[21px] px-1',
        md: 'h-[23px] px-1',
        lg: 'h-[27px] px-1.5',
      },
      // Spin and drop buttons sit 2px from the bevel, not 4px.
      hasButtons: {
        true: 'pr-0.5',
        false: '',
      },
    },
    defaultVariants: { size: 'md', hasButtons: false },
  }
)

/**
 * The native input, filling the frame. Its 1px padding is where the dotted
 * focus ring is drawn — an outline pulled 1px inward, so focus moves nothing.
 *
 * The ring is not Windows 98's — it showed only the caret — but a caret alone
 * is not a visible enough focus indicator, and rowkit checks for one.
 */
export const inputVariants = cva([
  'h-full min-w-0 flex-1 bg-transparent p-px text-inherit',
  'outline-none focus-visible:outline-1 focus-visible:-outline-offset-1',
  'focus-visible:outline-dotted focus-visible:outline-ring',
  // #404040: 10:1 on white. The Windows 98 grey (#808080) reads as disabled
  // and fails 4.5:1.
  'placeholder:text-text-subtle',
  'disabled:cursor-default',
  // The frame draws its own spin and drop buttons.
  'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
  '[-moz-appearance:textfield]',
  '[&::-webkit-calendar-picker-indicator]:hidden',
  '[&::-webkit-search-cancel-button]:appearance-none',
])

/**
 * A small raised button inside the frame: the spin arrows of a number field
 * and the drop button of a date field. Pressed sinks the bevel.
 */
export const inputButtonVariants = cva(
  [
    'flex w-4 shrink-0 items-center justify-center bg-card text-foreground',
    'shadow-raised data-pressed:shadow-pressed',
    'data-disabled:pointer-events-none data-disabled:text-text-disabled',
  ],
  {
    variants: {
      part: {
        // The buttons fill the well's height (19px at md). The two spin halves
        // split it unevenly when it is odd — 9px over 10px, as drawn.
        increment: 'h-[calc(50%-0.5px)]',
        decrement: 'flex-1',
        drop: 'self-stretch',
      },
    },
  }
)

export type InputVariants = VariantProps<typeof inputFrameVariants>
