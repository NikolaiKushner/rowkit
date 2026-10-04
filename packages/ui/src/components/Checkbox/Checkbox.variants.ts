import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A Windows 98 check box, as in the Figma file: the 13×13 box, 4px, then the
 * label. The whole row is the click target, as a `<label>` makes it.
 */
export const checkboxVariants = cva([
  'group/checkbox inline-flex items-center gap-1 align-middle',
  'font-sans text-ui text-foreground',
  'data-disabled:text-text-disabled',
])

/**
 * The box: white in the sunken bevel. Held down, or disabled, it turns
 * silver; disabled, the mark turns grey.
 */
export const checkboxBoxVariants = cva([
  'pointer-events-none flex size-[13px] shrink-0 items-center justify-center',
  'bg-input text-foreground shadow-sunken',
  'group-active/checkbox:bg-surface-disabled',
  'group-data-disabled/checkbox:bg-surface-disabled group-data-disabled/checkbox:text-text-disabled',
])

/**
 * The native input, invisible over the box: clicks, focus, Space, the form
 * value and `indeterminate` all stay the browser's.
 */
export const checkboxInputClass =
  'absolute inset-0 m-0 size-full cursor-default appearance-none opacity-0'

/**
 * The label: grey and embossed when disabled. Focus is the dotted ring around
 * the label alone, as Windows 98 draws it; with no label it goes round the box.
 */
export const checkboxLabelVariants = cva([
  'px-px',
  'group-has-[input:focus-visible]/checkbox:outline-1',
  'group-has-[input:focus-visible]/checkbox:-outline-offset-1',
  'group-has-[input:focus-visible]/checkbox:outline-dotted',
  'group-has-[input:focus-visible]/checkbox:outline-ring',
  'group-data-disabled/checkbox:text-shadow-disabled',
])

/** Focus on the box itself, for a check box without a visible label. */
export const checkboxBoxFocusClass = [
  'group-has-[input:focus-visible]/checkbox:outline-1',
  'group-has-[input:focus-visible]/checkbox:outline-offset-1',
  'group-has-[input:focus-visible]/checkbox:outline-dotted',
  'group-has-[input:focus-visible]/checkbox:outline-ring',
].join(' ')

/**
 * The 7×2 bar of a partly checked box, 5px from the top as drawn. Centred
 * alone in the 13px box it would sit on a half pixel; the 1px margin below
 * makes the centring whole.
 */
export const checkboxBarClass = 'mb-px block h-[2px] w-[7px] bg-current'

export type CheckboxVariants = VariantProps<typeof checkboxVariants>
