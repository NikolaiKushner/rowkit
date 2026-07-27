/**
 * Typography scale.
 *
 * Weighted toward the small end: a dashboard spends most of its type budget
 * between 12px and 16px, and the sizes above `xl` exist for empty states and
 * page titles rather than for data.
 */

/** Font families. Both stacks start with a system font — no webfont request. */
export const fontFamily = {
  /** UI and body text. */
  sans: [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ].join(', '),
  /** IDs, hashes, numeric columns that must align vertically. */
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Consolas',
    'Liberation Mono',
    'monospace',
  ].join(', '),
} as const

/**
 * Font sizes, each paired with the line height it should almost always use.
 *
 * Pairing them prevents the most common typographic bug in a dense table:
 * shrinking the font without shrinking leading, so rows stay tall and the
 * density gain evaporates.
 */
export const fontSize = {
  /** 12px — table metadata, badges, column headers. */
  xs: { size: '0.75rem', lineHeight: '1rem' },
  /** 14px — the default for table cells and form controls. */
  sm: { size: '0.875rem', lineHeight: '1.25rem' },
  /** 16px — body copy outside of data views. */
  base: { size: '1rem', lineHeight: '1.5rem' },
  /** 18px — card titles. */
  lg: { size: '1.125rem', lineHeight: '1.75rem' },
  /** 20px — section headings. */
  xl: { size: '1.25rem', lineHeight: '1.75rem' },
  /** 24px — page titles, empty-state headings. */
  '2xl': { size: '1.5rem', lineHeight: '2rem' },
  /** 30px — the largest size rowkit ships. */
  '3xl': { size: '1.875rem', lineHeight: '2.25rem' },
} as const

/** Font weights. */
export const fontWeight = {
  /** Body text. */
  normal: '400',
  /** Column headers, subtle emphasis. */
  medium: '500',
  /** Buttons, card titles. */
  semibold: '600',
  /** Page titles. */
  bold: '700',
} as const

/** Letter spacing. Tightening only pays off at display sizes. */
export const letterSpacing = {
  tight: '-0.015em',
  normal: '0em',
  /** For uppercase micro-labels, which need air to stay readable. */
  wide: '0.04em',
} as const

/** Standalone line heights, for when text is not using a paired {@link fontSize}. */
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
} as const

/** Names of every font size token. */
export type FontSizeName = keyof typeof fontSize
