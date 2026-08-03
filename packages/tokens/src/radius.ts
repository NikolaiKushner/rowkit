/**
 * Corner radii, derived from one variable.
 *
 * Every step is a multiple of `--radius`, following the shadcn/ui scale. One
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
 *
 * Design language based on shadcn/ui by shadcn, adapted for Vue.
 */

/** The single length the scale multiplies. shadcn/ui's default. */
export const radiusBase = '0.625rem'

/**
 * Multiples of `--radius`.
 *
 * `sm`/`md`/`lg`/`xl` are shadcn's published factors. `xs` is rowkit's, and
 * lands on 4px — the radius shadcn hardcodes on its Checkbox, which is the
 * control this step exists for.
 */
export const radiusFactor = {
  /** Square. Table cells, and anything that tiles edge to edge. */
  none: 0,
  /** 4px — checkboxes, tags inside a cell. */
  xs: 0.4,
  /** 6px — badges, small controls. */
  sm: 0.6,
  /** 8px — buttons, inputs, cards. The rowkit default. */
  md: 0.8,
  /** 10px — dialogs, popovers. */
  lg: 1,
  /** 14px — large empty-state panels. */
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
  // Six places, then trailing zeros stripped: 0.625 * 1.4 is 0.8749999… in
  // binary floating point, and `0.875rem` is the value that belongs in the docs.
  return `${Number((base * factor).toFixed(6))}rem`
}

function expression(factor: number): string {
  if (factor === 0) return '0rem'
  if (factor === 1) return 'var(--radius)'
  return `calc(var(--radius) * ${factor})`
}
