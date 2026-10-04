import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A Windows 98 option button, as in the Figma file: the 12×12 round well,
 * 4px, then the label. The whole row is the click target.
 */
export const radioVariants = cva([
  'group/radio inline-flex items-center gap-1 align-middle',
  'font-sans text-ui text-foreground',
  'data-disabled:text-text-disabled',
])

/**
 * The pixel-drawn round well. It reads its well and dot colours from two
 * variables: white with a black dot; silver while held or disabled, the dot
 * grey when disabled.
 */
export const radioMarkVariants = cva([
  'pointer-events-none shrink-0 text-foreground',
  '[--rk-radio-well:var(--color-input)] [--rk-radio-dot:transparent]',
  'group-data-[state=checked]/radio:[--rk-radio-dot:currentColor]',
  'group-active/radio:[--rk-radio-well:var(--color-surface-disabled)]',
  'group-data-disabled/radio:[--rk-radio-well:var(--color-surface-disabled)]',
  'group-data-disabled/radio:text-text-disabled',
])

/** The native input, invisible over the well. */
export const radioInputClass =
  'absolute inset-0 m-0 size-full cursor-default appearance-none opacity-0'

/** The label, with the dotted focus ring around it alone. */
export const radioLabelVariants = cva([
  'px-px',
  'group-has-[input:focus-visible]/radio:outline-1',
  'group-has-[input:focus-visible]/radio:-outline-offset-1',
  'group-has-[input:focus-visible]/radio:outline-dotted',
  'group-has-[input:focus-visible]/radio:outline-ring',
  'group-data-disabled/radio:text-shadow-disabled',
])

/** Focus on the well itself, for an option without a visible label. */
export const radioMarkFocusClass = [
  'group-has-[input:focus-visible]/radio:outline-1',
  'group-has-[input:focus-visible]/radio:outline-offset-1',
  'group-has-[input:focus-visible]/radio:outline-dotted',
  'group-has-[input:focus-visible]/radio:outline-ring',
].join(' ')

export type RadioVariants = VariantProps<typeof radioVariants>
