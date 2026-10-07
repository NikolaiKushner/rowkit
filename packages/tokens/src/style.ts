/**
 * Style switches: how a theme draws a state, beyond its colours and sizes.
 *
 * Windows 98 and a modern theme differ in more than values. One marks focus
 * with a dotted rectangle around a button's label, the other with a ring
 * around the whole button; one shifts a held button's label a pixel, the other
 * darkens its face; one fills a latched toggle with a checker pattern. Each of
 * those differences is a variable here, emitted as `--rk-<name>`, and the
 * components are written against the variables. A theme sets them; no
 * component knows which theme it is drawn in.
 *
 * They are not Tailwind theme tokens — nothing generates a utility from them —
 * so they are declared on `:root` and read with arbitrary values
 * (`pr-(--rk-press-shift)`) or by the utilities in `rowkit/styles`.
 *
 * The values here are Windows 98's.
 */

/** The Windows 98 checker: white and silver, one pixel each, white in the top-left. */
const dither = [
  'conic-gradient(',
  'var(--color-card) 0 25%, var(--color-bevel-highlight) 0 50%, ',
  'var(--color-card) 0 75%, var(--color-bevel-highlight) 0)',
].join('')

export const style = {
  // Focus. Three rings, for three places a ring can go; a theme turns each on
  // or off by its width. The colours are `--color-ring` and `--color-focus-ring`.

  /** The ring drawn around a control's label, inside it. Windows 98's dotted rectangle. */
  'focus-label-width': '1px',
  /** The ring drawn on the focused element itself — a row, a scrolling region, a toast. */
  'focus-ring-width': '1px',
  'focus-ring-style': 'dotted',
  /** The ring drawn around a control's edge, outside it. Windows 98 has none. */
  'focus-outer-width': '0px',
  'focus-outer-offset': '0px',

  // Pressing.

  /** How far a held button's label moves down and right. */
  'press-shift': '1px',
  /** A brightness filter on a held caption button. `1` leaves it alone. */
  'press-brightness': '1',

  // Patterns and motion.

  /** The pattern over a latched toggle and a scroll track. */
  'dither-image': dither,
  /** The pattern of a loading placeholder, and how it moves. */
  'loading-image': dither,
  'animate-loading': 'rk-dither 800ms steps(1) infinite',
  /**
   * The busy mark in a loading button: Windows 98's hourglass stands still; a
   * theme with a spinner glyph turns it.
   */
  'animate-busy': 'none',
  /** An indeterminate progress bar's segment travelling across the track. */
  'animate-progress': 'rk-progress-slide 2s steps(20) infinite',
  /** How long a control takes to change state. Windows 98 changes instantly. */
  'duration-control': '0ms',
  /** How a dialog, a list or a toast arrives. */
  'animate-overlay-in': 'none',

  // Edges.

  /** The light second line of an etched separator. Zero leaves a single line. */
  'etch-width': '1px',

  // Windows.

  /** Where the caption buttons sit in the title bar: `0` after the title, `-1` before it. */
  'caption-order': '0',
  /** Where the close button sits among them: `0` last, `-1` first. */
  'close-order': '0',
  /** Whether a window shows its icon in the title bar: `flex`, or `none`. */
  'titlebar-icon': 'flex',
  /** Where the title sits: `start`, or `center`. */
  'titlebar-align': 'start',
  /** Space kept clear opposite the caption buttons, so a centred title is centred on the bar. */
  'titlebar-balance': '0px',
  /** The opacity of a caption button's glyph at rest; hovering the title bar shows it. */
  'caption-glyph-opacity': '1',

  // Group boxes.

  /** The weight of a group box's legend. */
  'legend-weight': '400',

  // Links.

  /** The line under a link-styled button: `underline`, or `none`. */
  'link-decoration': 'underline',

  // Fields.

  /** The red frame inside an invalid field. Windows 98 marks it with the error icon only. */
  'invalid-width': '0px',
  /** Where a field's error icon sits beside a message that wraps: `center`, or `start`. */
  'field-error-align': 'center',

  /** Whether a select's drop button shows an up arrow over its down arrow: `block`, or `none`. */
  'select-up': 'none',

  // Dialogs and empty views.

  /**
   * The order of a dialog footer's buttons, written primary first: `row` keeps
   * it, as Windows 98 does; `row-reverse` puts the primary button last.
   */
  'footer-direction': 'row',
  /**
   * How an empty view lays out its icon and text: `row` puts the icon beside
   * the text, `column` above it; `start` or `center` aligns the text.
   */
  'empty-direction': 'row',
  'empty-align': 'start',

  // Lists and scroll bars.

  /** What a modal dialog lays over the page behind it. */
  'overlay-bg': 'transparent',

  /** A backdrop filter behind a dropped list. */
  'popover-backdrop': 'none',
  /** Whether a scroll bar has arrow buttons: `block`, or `none`. */
  'scrollbar-buttons': 'block',

  // Check boxes and option buttons.

  /** A multiplier on small glyphs — a check mark, a caption glyph — for a theme whose glyphs are not pixel art. */
  'glyph-scale': '1',
  /**
   * An option button drawn by CSS rather than by its pixels: how much of the
   * well and the dot to paint (`0%` paints neither), the dot's radius and the
   * edge's width.
   */
  'radio-fill': '0%',
  'radio-dot-r': '0px',
  'radio-edge': '0px',

  // Icons. A theme can draw its own icon set over rowkit's pixel icons: it
  // hides the pixels, fills the icon's box and masks it with its own glyph.

  /** `display` of a pixel icon's pixels. */
  'icon-pixels': 'inline',
  /**
   * Whether the glyphs mask the icons at all. `initial` makes every glyph mask
   * invalid, so a Windows 98 icon has no mask and nothing of it is clipped;
   * an empty value lets them through. It is prepended to each mask image.
   */
  'icon-glyphs': 'initial',
  /** The fill a theme's own glyph is painted in; transparent draws nothing. */
  'icon-fill': 'transparent',
  /**
   * The fills of the glyphs that keep a colour: status icons and folders.
   * Transparent in Windows 98, whose pixel icons carry their own colours.
   */
  'icon-tone-danger': 'transparent',
  'icon-tone-warning': 'transparent',
  'icon-tone-info': 'transparent',
  'icon-tone-success': 'transparent',
  'icon-tone-folder': 'transparent',
} as const

/** Names of every style switch. */
export type StyleName = keyof typeof style
