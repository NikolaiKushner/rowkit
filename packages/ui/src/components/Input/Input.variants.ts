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
 * and the message lives in Field. A theme can add a red frame inside the well
 * (`--rk-invalid-width`).
 */
export const inputFrameVariants = cva(
  [
    'relative flex w-full items-center gap-1 py-0.5',
    'rounded-md bg-input font-sans text-ui text-foreground shadow-sunken',
    // A theme that rings the whole field rings the frame, not the input in it.
    'has-[input:focus-visible]:focus-outer',
    'transition-[box-shadow,outline-color] duration-(--rk-duration-control)',
    // Disabled: silver well, grey embossed text. Read-only: silver well,
    // black text that can still be selected and copied.
    'has-[input:disabled]:bg-surface-disabled has-[input:disabled]:text-text-disabled',
    'has-[input:disabled]:text-shadow-disabled',
    'has-[input:read-only]:bg-muted',
    'has-[input[aria-invalid=true]]:field-invalid',
  ],
  {
    variants: {
      size: {
        sm: 'h-control-sm px-field-px',
        md: 'h-control-md px-field-px',
        lg: 'h-control-lg px-field-px-lg',
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
  'h-full min-w-0 flex-1 bg-transparent p-px text-inherit caret-field-caret',
  'outline-none focus-visible:focus-label focus-visible:-outline-offset-1',
  'focus-visible:outline-ring',
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
 * and the drop button of a date field. Pressed sinks the bevel. The glyph is
 * the muted text colour (black in Windows 98) at the select's arrow size.
 */
export const inputButtonVariants = cva(
  [
    'flex w-4 shrink-0 items-center justify-center rounded-xs bg-field-button text-muted-foreground',
    '[&_svg]:size-select-arrow',
    'shadow-field-button data-pressed:shadow-pressed',
    'data-disabled:pointer-events-none data-disabled:text-text-disabled',
  ],
  {
    variants: {
      part: {
        // The buttons fill the well's height (19px at md). The two spin halves
        // split it unevenly when it is odd — 9px over 10px, as drawn.
        increment: 'h-[calc(50%-0.5px)]',
        decrement: 'flex-1',
        // A theme with glyphs shows a calendar here; Windows 98 keeps its arrow.
        drop: [
          'h-field-button-h self-center',
          '[&_svg]:size-field-drop-icon! [--rk-icon-triangle-down:var(--rk-icon-calendar)]',
        ],
      },
    },
  }
)

export type InputVariants = VariantProps<typeof inputFrameVariants>
