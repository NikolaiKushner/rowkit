/**
 * Bevels, and the two structural shadows a data table needs.
 *
 * Windows 98 has no elevation. Depth is drawn with bevels: two 1px lines on
 * each side of a box, light on the top-left and dark on the bottom-right for a
 * raised surface, the other way round for a sunken one. Each bevel here is a
 * stack of hard inset shadows — no blur, no spread — built from the four
 * `bevel-*` colours, so the frame lives inside the box and never changes its
 * size.
 *
 * The first shadow in the list paints on top, so the 1px outer edge is listed
 * before the 2px inner one it overlaps. The values match the effect styles in
 * the Figma file one for one.
 */

const hl = 'var(--color-bevel-highlight)'
const light = 'var(--color-bevel-light)'
const sh = 'var(--color-bevel-shadow)'
const dark = 'var(--color-bevel-dark)'

/** Builds an inset bevel from its outer and inner edge colours. */
function bevel(outer: [string, string], inner?: [string, string]): string {
  const [outerTopLeft, outerBottomRight] = outer
  const layers = [`inset -1px -1px ${outerBottomRight}`, `inset 1px 1px ${outerTopLeft}`]
  if (inner) {
    const [innerTopLeft, innerBottomRight] = inner
    layers.push(`inset -2px -2px ${innerBottomRight}`, `inset 2px 2px ${innerTopLeft}`)
  }
  return layers.join(', ')
}

export const shadow = {
  /** No bevel. */
  none: 'none',
  /** Buttons and raised panels. */
  raised: bevel([hl, dark], [light, sh]),
  /** A window's frame: like `raised`, with the bright white on the inner edge. */
  window: bevel([light, dark], [hl, sh]),
  /**
   * The default button of a dialog: a 1px black frame around a raised bevel,
   * so Enter's target is visible before anyone presses it.
   */
  'raised-default': [
    `inset -1px -1px ${dark}`,
    `inset 1px 1px ${dark}`,
    `inset -2px -2px ${dark}`,
    `inset 2px 2px ${hl}`,
    `inset -3px -3px ${sh}`,
    `inset 3px 3px ${light}`,
  ].join(', '),
  /** A button held down, or a toggle that is on. */
  pressed: bevel([dark, hl], [sh, light]),
  /** Text fields, lists and table bodies: the white well a value sits in. */
  sunken: bevel([sh, hl], [dark, light]),
  /** A thin sunken edge: status-bar sections, counters, Badge. */
  status: bevel([sh, hl]),
  /** An etched groove: group boxes and separators. */
  etched: bevel([sh, hl], [hl, sh]),
  /** A thin raised edge: a flat toolbar button while hovered. */
  'raised-thin': bevel([hl, sh]),

  // Roles. In Windows 98 each is one of the bevels above, or nothing; they are
  // separate tokens so a theme without bevels can draw each part its own way.

  /** A list dropped from a trigger. Windows 98 frames it with a border, not a shadow. */
  popover: 'none',
  /** A data table's frame: the sunken well its rows sit in. */
  table: bevel([sh, hl], [dark, light]),
  /** A data table's column header: a raised button. */
  header: bevel([hl, dark], [light, sh]),
  /** A window's caption button. */
  caption: bevel([hl, dark], [light, sh]),
  /** The strip of a status bar, behind its sections. */
  statusbar: 'none',
  /** The edge between a title bar and the window under it. */
  titlebar: 'none',
  /** A checked check box: the same sunken well as an unchecked one, in Windows 98. */
  checked: bevel([sh, hl], [dark, light]),
  /** A button inside a field: raised, in Windows 98. */
  'field-button': bevel([hl, dark], [light, sh]),
  /** A scroll bar's thumb. */
  'scroll-thumb': bevel([hl, dark], [light, sh]),

  /** The edge of a sticky table column while rows scroll under it. */
  'scroll-x': `inset -1px 0 ${sh}`,
  /**
   * The rule under a sticky table header, drawn as a shadow rather than a
   * border.
   *
   * Under `border-collapse` a border belongs to the table's grid, not to any
   * cell, so a `position: sticky` header leaves its border behind and scrolls
   * away from it — the rows then slide under a header with nothing between
   * them, which is the one thing a sticky header exists to prevent. A shadow
   * belongs to the element and travels with it.
   */
  'sticky-header': 'inset 0 -1px 0 var(--color-border)',
} as const

/** Names of every shadow token. */
export type ShadowName = keyof typeof shadow

/**
 * Text shadows. One: the emboss that makes disabled text read as disabled
 * rather than as faint — grey text with a white copy one pixel right and
 * down. Windows 98 never fades a disabled control with opacity.
 */
export const textShadow = {
  disabled: '1px 1px 0 var(--color-text-disabled-emboss)',
} as const

/** Names of every text shadow token. */
export type TextShadowName = keyof typeof textShadow
