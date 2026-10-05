/**
 * Corner radii, derived from one variable.
 *
 * Every step is a multiple of `--radius`, following the reference scale. One
 * declaration retunes every corner in the library:
 *
 * ```css
 * :root { --radius: 0.25rem; }
 * ```
 *
 * The factors are the source of truth, not the resulting lengths. Two things
 * are generated from them and cannot drift: {@link radius}, which resolves to
 * real `rem` values so a TypeScript consumer gets a number it can use, and
 * {@link radiusCss}, which keeps the `calc()` so a consumer's override of
 * `--radius` still cascades through the whole scale.
 */

/**
 * The single length the scale multiplies.
 *
 * Zero: Windows 98 has no rounded corners, and every `radius/*` token in the
 * design is 0. The scale is kept rather than deleted so that corners stay one
 * decision away — set `--radius` in a consumer and every control follows,
 * without touching a component.
 */
export const radiusBase = '0rem'

/**
 * Multiples of `--radius`. All of them compute to 0 with the default base;
 * the factors decide how a consumer's own `--radius` spreads across controls.
 */
export const radiusFactor = {
  /** Always square, whatever `--radius` is: table cells, anything that tiles. */
  none: 0,
  /** Checkboxes and tags inside a cell. */
  xs: 0.4,
  /** Badges and small controls. */
  sm: 0.6,
  /** Buttons, inputs and panels. */
  md: 0.8,
  /** Windows, dialogs and popovers. */
  lg: 1,
  /** Large empty-state panels. */
  xl: 1.4,
} as const

/** A radius that is not a multiple of the base. */
const PILL = '9999px'

/**
 * Resolved lengths, for TypeScript consumers and for the contrast of reading
 * an actual size in the docs table.
 */
export const radius = {
  ...(Object.fromEntries(
    Object.entries(radiusFactor).map(([name, factor]) => [name, resolve(factor)])
  ) as { [K in keyof typeof radiusFactor]: string }),
  /** Circle. The only rounded shape Windows 98 draws: radio buttons, and a round skeleton. */
  full: PILL,
} as const

/**
 * The same scale as CSS expressions, for the emitted `@theme` block.
 *
 * `lg` is bare `var(--radius)` rather than `calc(var(--radius) * 1)` because
 * the multiplication is noise at a factor of one.
 */
export const radiusCss = {
  ...(Object.fromEntries(
    Object.entries(radiusFactor).map(([name, factor]) => [name, expression(factor)])
  ) as { [K in keyof typeof radiusFactor]: string }),
  full: PILL,
} as const

/** Names of every radius token. */
export type RadiusName = keyof typeof radius

function resolve(factor: number): string {
  if (factor === 0) return '0rem'
  const base = Number.parseFloat(radiusBase)
  // Six places, then trailing zeros stripped: 0.5 * 1.4 is clean in decimal
  // but floating point still needs the round-trip so docs stay readable.
  return `${Number((base * factor).toFixed(6))}rem`
}

function expression(factor: number): string {
  if (factor === 0) return '0rem'
  if (factor === 1) return 'var(--radius)'
  return `calc(var(--radius) * ${factor})`
}
