/**
 * Typography.
 *
 * Two registers, as in the design: the interface at Windows 98's own 11px —
 * 8pt, the size every dialog, menu and button was set in — and long text for
 * documentation at a size meant for reading paragraphs. The sizes are named
 * after the Figma text styles (`ui/body` is `text-ui`, `doc/h1` is
 * `text-doc-h1`), so a style picked in the design maps to one utility.
 *
 * Sizes are in `rem`, so a reader who raised their browser's base size gets
 * larger text; at the default 16px base they land on the design's pixels.
 */

/**
 * Font families.
 *
 * The interface face is **PT Sans** (ParaType, OFL): the closest open match
 * to Tahoma, which succeeded MS Sans Serif, and compact enough for dense
 * tables. It covers Latin and Cyrillic in regular and bold. The fixed-width
 * face is **VT323** (OFL), drawn after the Fixedsys terminal font.
 *
 * rowkit does not ship either font file: the app loads them, one import each
 * from `@fontsource/pt-sans` and `@fontsource/vt323`. Without them the stacks
 * fall through to Tahoma and the faces operating systems already ship.
 */
export const fontFamily = {
  /** UI and body text. */
  sans: [
    '"PT Sans"',
    'Tahoma',
    '"Microsoft Sans Serif"',
    '"MS Sans Serif"',
    'Verdana',
    'Arial',
    'sans-serif',
  ].join(', '),
  /** Code, IDs and numbers that must align in a column. */
  mono: ['VT323', '"Lucida Console"', '"Courier New"', 'ui-monospace', 'monospace'].join(', '),
} as const

/**
 * Font sizes, each paired with the line height the design sets it in.
 *
 * Pairing them prevents the most common typographic bug in a dense table:
 * changing the size without the leading, so rows stay tall and the density
 * the size was meant to buy evaporates.
 */
export const fontSize = {
  /** 11/13 — every control, label, menu and table cell. Bold for titles and the default button. */
  ui: { size: '0.6875rem', lineHeight: '0.8125rem' },
  /** 13/16, bold — the heading of an empty state or a group. */
  heading: { size: '0.8125rem', lineHeight: '1rem' },
  /**
   * 16/16 — the fixed-width face. VT323 is drawn small for its size, so it
   * sits at 16px to match the x-height of 11px PT Sans beside it.
   */
  mono: { size: '1rem', lineHeight: '1rem' },
  /** 15/24 — documentation paragraphs, about seventy characters to a line. */
  doc: { size: '0.9375rem', lineHeight: '1.5rem' },
  /** 24/28, bold — a documentation page title. */
  'doc-h1': { size: '1.5rem', lineHeight: '1.75rem' },
  /** 18/22, bold — a documentation section. */
  'doc-h2': { size: '1.125rem', lineHeight: '1.375rem' },
  /** 14/18, bold — a documentation subsection. */
  'doc-h3': { size: '0.875rem', lineHeight: '1.125rem' },
} as const

/**
 * Font weights. Two, because PT Sans has two: anything in between would be
 * synthesised by the browser, and a faked weight is blurrier than either real
 * one.
 */
export const fontWeight = {
  /** Body text. */
  normal: '400',
  /** Window titles, headings, the default button. */
  bold: '700',
} as const

/** Letter spacing. Windows 98 sets every size at the face's own spacing. */
export const letterSpacing = {
  normal: '0em',
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
