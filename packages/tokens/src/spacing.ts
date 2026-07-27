/**
 * Spacing scale.
 *
 * Keys are multiples of the 4px base unit, matching the convention most Vue and
 * Tailwind developers already carry in their heads: `4` is 1rem, `2` is 8px.
 * Fractional steps are deliberately absent — they would need escaped CSS custom
 * property names (`--spacing-0\.5`), and Tailwind v4 already derives arbitrary
 * fractions from {@link spacingBase}.
 *
 * The low end is dense on purpose. A table cell padded at `2`/`3` is the
 * difference between a grid that shows twenty rows and one that shows twelve.
 */
export const spacing = {
  /** Zero. */
  0: '0rem',
  /** 1px — hairline offsets and optical nudges, not layout. */
  px: '1px',
  /** 4px — icon-to-label gap. */
  1: '0.25rem',
  /** 8px — dense table cell padding. */
  2: '0.5rem',
  /** 12px — default table cell padding, compact control padding. */
  3: '0.75rem',
  /** 16px — default control padding, tight card padding. */
  4: '1rem',
  /** 20px */
  5: '1.25rem',
  /** 24px — card padding, gap between form fields. */
  6: '1.5rem',
  /** 32px — section spacing. */
  8: '2rem',
  /** 40px */
  10: '2.5rem',
  /** 48px — gap between major page regions. */
  12: '3rem',
  /** 64px — page gutters. */
  16: '4rem',
  /** 80px */
  20: '5rem',
  /** 96px — empty-state vertical padding. */
  24: '6rem',
} as const

/**
 * The base unit Tailwind v4 multiplies for dynamic spacing utilities.
 *
 * Emitting this as `--spacing` keeps `p-7` and `mt-3.5` working even though
 * neither has a named token above.
 */
export const spacingBase = '0.25rem'

/** Names of every spacing token. */
export type SpacingName = keyof typeof spacing
