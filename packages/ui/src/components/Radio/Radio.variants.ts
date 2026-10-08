import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A Windows 98 option button, as in the Figma file: the 12×12 round well,
 * 4px, then the label. The whole row is the click target.
 */
export const radioVariants = cva([
  'group/radio inline-flex items-center gap-check-gap align-middle',
  'font-sans text-ui text-foreground',
  'data-disabled:text-text-disabled',
])

/**
 * The option button drawn by CSS, for a theme that does not use the pixels:
 * the pixels hide (`--rk-icon-pixels`), and a round well, a dot and an edge
 * are painted from the same `--rk-radio-well` and `--rk-radio-dot` the pixels
 * read. `--rk-radio-fill` is how much of them to paint — none in Windows 98,
 * so this draws nothing there.
 */
export const radioFace = [
  '[&>*]:[display:var(--rk-icon-pixels)]',
  '[background:radial-gradient(circle,color-mix(in_srgb,var(--rk-radio-dot)_var(--rk-radio-fill),transparent)_var(--rk-radio-dot-r),transparent_calc(var(--rk-radio-dot-r)+0.5px)),color-mix(in_srgb,var(--rk-radio-well)_var(--rk-radio-fill),transparent)]',
  'shadow-[inset_0_0_0_var(--rk-radio-edge)_var(--color-border-strong)]',
].join(' ')

/**
 * The pixel-drawn round well. It reads its well and dot colours from two
 * variables: white with a black dot; silver while held or disabled, the dot
 * grey when disabled. Held, a theme with colour fills the well with its
 * pressed control colour — the pressed blue when checked.
 */
export const radioMarkVariants = cva([
  'pointer-events-none size-radio shrink-0 rounded-pill text-on-checked',
  '[--rk-radio-well:var(--color-input)] [--rk-radio-dot:transparent]',
  'group-data-[state=checked]/radio:[--rk-radio-dot:currentColor]',
  'group-data-[state=checked]/radio:[--rk-radio-well:var(--color-checked)]',
  // Held and disabled win over checked: the extra `data-[state]` (always
  // present) makes each rule the more specific one.
  'group-active/radio:group-data-[state]/radio:[--rk-radio-well:var(--color-control-active)]',
  'group-active/radio:group-data-[state=checked]/radio:[--rk-radio-well:var(--color-control-primary-active)]',
  'group-data-disabled/radio:group-data-[state]/radio:[--rk-radio-well:var(--color-surface-disabled)]',
  'group-data-disabled/radio:text-text-disabled',
  radioFace,
])

/** The native input, invisible over the well. */
export const radioInputClass =
  'absolute inset-0 m-0 size-full cursor-default appearance-none opacity-0'

/** The label, with the dotted focus ring around it alone. */
export const radioLabelVariants = cva([
  'px-check-label-px',
  'group-has-[input:focus-visible]/radio:focus-label',
  'group-has-[input:focus-visible]/radio:-outline-offset-1',
  'group-has-[input:focus-visible]/radio:outline-ring',
  'group-data-disabled/radio:text-shadow-disabled',
])

/** Focus on the well itself, for an option without a visible label. */
export const radioMarkFocusClass = [
  'group-has-[input:focus-visible]/radio:focus-ring',
  'group-has-[input:focus-visible]/radio:outline-offset-1',
  'group-has-[input:focus-visible]/radio:outline-ring',
].join(' ')

/** The ring around the mark of a labelled option button, for a theme that rings the control. */
export const radioMarkOuterFocusClass = 'group-has-[input:focus-visible]/radio:focus-outer'

export type RadioVariants = VariantProps<typeof radioVariants>
