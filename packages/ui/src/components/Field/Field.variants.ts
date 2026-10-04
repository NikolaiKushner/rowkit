import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Label, control, then hint or error, as in the Figma file. The gap between
 * them follows the control: 4px beside a 21px control, 6px beside 23px, 8px
 * beside 27px.
 *
 * `layout: 'left'` is the Windows 98 property-dialog arrangement: the label
 * beside the control, 8px from it, with the hint or error under the control.
 */
export const fieldVariants = cva('flex font-sans text-ui text-foreground', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    layout: {
      top: 'flex-col',
      left: 'items-start gap-2',
    },
  },
  compoundVariants: [
    { layout: 'top', size: 'sm', class: 'gap-1' },
    { layout: 'top', size: 'md', class: 'gap-1.5' },
    { layout: 'top', size: 'lg', class: 'gap-2' },
  ],
  defaultVariants: { size: 'md', layout: 'top' },
})

/**
 * The control with its hint and error. On top it is transparent to layout —
 * its children sit in the field's own column. On the left it is the column
 * beside the label.
 */
export const fieldControlVariants = cva('', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    layout: {
      top: 'contents',
      left: 'flex min-w-0 flex-1 flex-col',
    },
  },
  compoundVariants: [
    { layout: 'left', size: 'sm', class: 'gap-1' },
    { layout: 'left', size: 'md', class: 'gap-1.5' },
    { layout: 'left', size: 'lg', class: 'gap-2' },
  ],
  defaultVariants: { size: 'md', layout: 'top' },
})

/**
 * The label: regular weight, in the UI face. Disabled, it is grey and
 * embossed like the control's text.
 *
 * Beside the control it drops so its text sits level with the control's text
 * — half of the control's height less the 13px line — and takes the width in
 * `--rk-field-label-width` when a form sets one, so a column of labels lines
 * up.
 */
export const fieldLabelVariants = cva('flex gap-0.5', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    layout: {
      top: '',
      left: 'w-(--rk-field-label-width) shrink-0',
    },
    disabled: {
      true: 'text-text-disabled text-shadow-disabled',
      false: '',
    },
  },
  compoundVariants: [
    { layout: 'left', size: 'sm', class: 'pt-1' },
    { layout: 'left', size: 'md', class: 'pt-[5px]' },
    { layout: 'left', size: 'lg', class: 'pt-[7px]' },
  ],
  defaultVariants: { size: 'md', layout: 'top', disabled: false },
})

/** The required asterisk: maroon, grey once the field is disabled. */
export const fieldRequiredVariants = cva('', {
  variants: {
    disabled: {
      true: '',
      false: 'text-danger-on-subtle',
    },
  },
  defaultVariants: { disabled: false },
})

/** Help text: the subtle grey, 10:1 on the silver face. */
export const fieldHintVariants = cva('text-text-subtle')

/**
 * The error: the 16px error icon, then the message in maroon (5.5:1 on the
 * silver face). The icon is what says "error"; the colour only repeats it.
 */
export const fieldErrorVariants = cva('flex items-center gap-1 text-danger-on-subtle')

export type FieldVariants = VariantProps<typeof fieldVariants>
