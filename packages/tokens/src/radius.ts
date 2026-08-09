/**
 * Corner radii, derived from one variable.
 *
 * Every step is a multiple of `--radius`, following the reference scale. One
 * declaration retunes every corner in the library:
 *
 * ```css
 * :root { --radius: 0.5rem; }
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
 * `0.5rem` (8px) keeps corners decisive rather than soft — the silhouette that
 * reads as a data tool, not a marketing page. Override `--radius` in a
 * consumer to retune every corner without touching components.
 */
export const radiusBase = '0.5rem'

/**
 * Multiples of `--radius`.
 *
 * `sm`/`md`/`lg`/`xl` keep the same factors as the reference scale. `xs` is
 * rowkit's, and lands on ~3px — the radius used on checkboxes and chip remove
 * targets inside dense table chrome.
 */
export const radiusFactor = {
  /** Square. Table cells, and anything that tiles edge to edge. */
  none: 0,
  /** ~3px — checkboxes, tags inside a cell. */
  xs: 0.4,
  /** ~5px — badges, small controls. */
  sm: 0.6,
  /** ~6px — buttons, inputs, cards. The rowkit default. */
  md: 0.8,
  /** 8px — dialogs, popovers. */
  lg: 1,
  /** ~11px — large empty-state panels. */
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
  /** Pill. Status chips and avatars. */
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
