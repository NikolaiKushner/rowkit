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
 *
 * The mark is coloured through the foreground variable rather than the
 * `text-foreground` class: a selected DataTable row turns that class white,
 * and a white mark on the white box would vanish. The label beside it does
 * turn white, as it should on navy.
 */
export const checkboxBoxVariants = cva([
  'pointer-events-none flex size-check shrink-0 items-center justify-center',
  'rounded-xs bg-input text-(--color-foreground) shadow-sunken',
  'transition-[background-color,box-shadow] duration-(--rk-duration-control)',
  '[&_svg]:scale-(--rk-glyph-scale)',
  // Checked and indeterminate: the theme's checked fill and mark. In Windows 98
  // that is the same white well and black mark.
  'group-data-[state=checked]/checkbox:bg-checked group-data-[state=checked]/checkbox:text-on-checked',
  'group-data-[state=checked]/checkbox:shadow-checked',
  'group-data-[state=indeterminate]/checkbox:bg-checked group-data-[state=indeterminate]/checkbox:text-on-checked',
  'group-data-[state=indeterminate]/checkbox:shadow-checked',
  // Held and disabled win over checked: the extra `data-[state]` (always
  // present) makes each rule the more specific one.
  'group-active/checkbox:group-data-[state]/checkbox:bg-surface-disabled',
  'group-data-disabled/checkbox:group-data-[state]/checkbox:bg-surface-disabled',
  'group-data-disabled/checkbox:group-data-[state]/checkbox:text-text-disabled',
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
  'group-has-[input:focus-visible]/checkbox:focus-label',
  'group-has-[input:focus-visible]/checkbox:-outline-offset-1',
  'group-has-[input:focus-visible]/checkbox:outline-ring',
  'group-data-disabled/checkbox:text-shadow-disabled',
])

/** Focus on the box itself, for a check box without a visible label. */
export const checkboxBoxFocusClass = [
  'group-has-[input:focus-visible]/checkbox:focus-ring',
  'group-has-[input:focus-visible]/checkbox:outline-offset-1',
  'group-has-[input:focus-visible]/checkbox:outline-ring',
].join(' ')

/**
 * The ring around the box of a labelled check box, for a theme that rings the
 * control rather than its label. A box without a label takes
 * `checkboxBoxFocusClass` instead: one ring, never two.
 */
export const checkboxBoxOuterFocusClass = 'group-has-[input:focus-visible]/checkbox:focus-outer'

/**
 * The 7×2 bar of a partly checked box, 5px from the top as drawn. Centred
 * alone in the 13px box it would sit on a half pixel; the 1px margin below
 * makes the centring whole.
 */
export const checkboxBarClass = 'mb-px block h-[2px] w-[7px] scale-(--rk-glyph-scale) bg-current'

export type CheckboxVariants = VariantProps<typeof checkboxVariants>
