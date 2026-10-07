/**
 * Colour primitives and semantic mappings — the Windows 98 palette.
 *
 * ## Where the values come from
 *
 * The primitives are the sixteen-colour VGA palette Windows 98 was drawn in,
 * plus the handful of system colours the default "Windows Standard" scheme
 * added on top of it: the light bevel grey, the title-bar gradient ends and
 * the tooltip yellow. They are written as the exact sRGB hex values, not
 * converted to another space: these colours are defined by their eight-bit
 * channels, and a round trip through OKLCH would only add rounding to values
 * that are already exact.
 *
 * The names and values mirror the Figma file's `primitives` collection, and
 * the semantic map mirrors its `semantic` collection token for token, so a
 * colour picked in the design is the colour the component paints.
 *
 * Contrast for every semantic pair a component produces is asserted in
 * `contrast.test.ts` — the ratios are a build gate, not a claim in a comment.
 */

/** The sixteen-colour VGA palette, as Windows 98 used it. Only the twelve the design uses are listed. */
export const vga = {
  black: '#000000',
  white: '#ffffff',
  /** The face of every window, button and dialog. */
  silver: '#c0c0c0',
  /** Bevel shadows, disabled text, the borders of a field. */
  gray: '#808080',
  /** Selection, the active title bar, the default primary. */
  navy: '#000080',
  /** Hyperlinks. */
  blue: '#0000ff',
  /** The desktop. */
  teal: '#008080',
  green: '#008000',
  olive: '#808000',
  yellow: '#ffff00',
  maroon: '#800000',
  red: '#ff0000',
} as const

/** The system colours Windows 98 added on top of VGA. */
export const win98 = {
  /** The inner light edge of a raised bevel (`3D Light`). */
  light: '#dfdfdf',
  /** Secondary text a step lighter than black. */
  'dark-gray': '#404040',
  /** The light end of the active title-bar gradient. */
  'title-blue': '#1084d0',
  /** The light end of the inactive title-bar gradient. */
  'title-gray': '#b5b5b5',
  /** Tooltip background (`Info`). */
  info: '#ffffe1',
} as const

/**
 * Every primitive colour, keyed by the CSS custom property it becomes:
 * `--color-vga-silver`, `--color-win98-info`.
 *
 * These are the only place a literal colour value appears in rowkit. Everything
 * else — semantic tokens, component variants — references one of these.
 */
export const colorPrimitives = {
  ...prefixKeys('vga', vga),
  ...prefixKeys('win98', win98),
} as const

/** Prefixes every key of a palette with its family name. */
function prefixKeys<N extends string, S extends Record<string, string>>(
  name: N,
  scale: S
): { [K in keyof S & string as `${N}-${K}`]: S[K] } {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(scale)) out[`${name}-${key}`] = value
  return out as { [K in keyof S & string as `${N}-${K}`]: S[K] }
}

/** A reference to a primitive colour, as a CSS `var()` expression. */
export type ColorRef = `var(--color-${string})`

const ref = (token: keyof typeof colorPrimitives): ColorRef => `var(--color-${token})`

/**
 * Semantic colours.
 *
 * Semantic tokens never hold a literal colour — each one points at a primitive
 * through `var()`, so re-theming means repointing references rather than
 * hunting down hex codes. `color.test.ts` enforces this.
 *
 * Windows 98 is a grey world: most surfaces are the same silver, and depth
 * comes from bevels rather than from a lighter or darker fill. So several
 * surface tokens below share a value. They stay separate tokens because they
 * are separate override points — a theme that wants a hovered row to change
 * colour repoints `accent` without touching `muted`.
 */
export const semanticColor = {
  // Surfaces

  /** The face of a window: the page behind the content. */
  background: ref('vga-silver'),
  /** The desktop a window sits on. Docs and demo backdrops. */
  desktop: ref('vga-teal'),
  /** Panels and dialogs. Same face as the window; the bevel separates them. */
  card: ref('vga-silver'),
  /** Toolbars and table headers. */
  muted: ref('vga-silver'),
  /** Row hover. Windows 98 has none — the token is here to be repointed. */
  accent: ref('vga-silver'),
  /** A pressed row or toggle. The pressed bevel carries the state, not the fill. */
  'surface-active': ref('vga-silver'),
  /** A selected row or list item: navy, with `on-selected` text. */
  'surface-selected': ref('vga-navy'),
  /** A disabled control keeps the face colour; its text goes grey and embossed. */
  'surface-disabled': ref('vga-silver'),
  /**
   * Loading placeholder fill.
   *
   * Exempt from contrast rules: skeletons are `aria-hidden` decoration standing
   * in for content that has not arrived, so WCAG 1.4.11 does not apply.
   */
  skeleton: ref('vga-gray'),
  /** The inside of a text field, list or table body: white inside a sunken bevel. */
  input: ref('vga-white'),
  /** Tooltip bubble. */
  'tooltip-bg': ref('win98-info'),

  // Text

  /** Body and heading text. */
  foreground: ref('vga-black'),
  /**
   * Secondary text. Black, like body text: Windows 98 never greys out text
   * that can still be read and acted on — grey means disabled.
   */
  'muted-foreground': ref('vga-black'),
  /** Placeholders and de-emphasised metadata. */
  'text-subtle': ref('win98-dark-gray'),
  /** Disabled text, always drawn with {@link semanticColor['text-disabled-emboss']} under it. */
  'text-disabled': ref('vga-gray'),
  /** The white copy, one pixel right and down, that embosses disabled text. */
  'text-disabled-emboss': ref('vga-white'),
  /** Text on a selected row. */
  'on-selected': ref('vga-white'),
  /** Hyperlinks. */
  link: ref('vga-blue'),

  // Borders and bevels

  /** Separators and the frame of a group. Decorative, below 3:1 on purpose. */
  border: ref('vga-gray'),
  /** A frame that has to read as an edge: the outline of a default button. */
  'border-strong': ref('vga-black'),
  /** The faintest rule, inside a dense group. */
  'border-subtle': ref('win98-light'),
  /**
   * Focus. Drawn as a 1px dotted ring inside the control, around its label.
   * Black, so it clears 3:1 on every surface rowkit paints.
   */
  ring: ref('vga-black'),
  /** Base colour for shadows. */
  shadow: ref('vga-black'),

  /** Outer light edge of a raised bevel, inner one of a sunken bevel. */
  'bevel-highlight': ref('vga-white'),
  /** Inner light edge of a raised bevel. */
  'bevel-light': ref('win98-light'),
  /** Inner dark edge of a raised bevel. */
  'bevel-shadow': ref('vga-gray'),
  /**
   * Outer dark edge of a raised bevel. Being black, it is what gives every
   * control a boundary of well over 3:1 against the face (WCAG 1.4.11).
   */
  'bevel-dark': ref('vga-black'),

  // Window title bar

  /** Active title bar, left end of the gradient. The title text sits on this end. */
  'titlebar-from': ref('vga-navy'),
  /** Active title bar, right end of the gradient. */
  'titlebar-to': ref('win98-title-blue'),
  /** Inactive title bar, left end of the gradient. */
  'titlebar-inactive-from': ref('vga-gray'),
  /** Inactive title bar, right end of the gradient. */
  'titlebar-inactive-to': ref('win98-title-gray'),
  /** Active title text. */
  'titlebar-foreground': ref('vga-white'),
  /**
   * Inactive title text. Black, not Windows 98's silver: silver on the grey
   * gradient is about 2:1 and fails 4.5:1; black is 5.3:1 on `#808080` and
   * 11:1 on `#b5b5b5`.
   */
  'titlebar-inactive-foreground': ref('vga-black'),

  // Status families. A solid is a filled badge or a button; a subtle is a
  // white chip with coloured text. No status colour is ever used without an
  // icon or a word that says the same thing.
  //
  // `neutral` completes the family so a component's variant matrix has no
  // special case: a neutral Badge reads the same token names as a danger one.
  'neutral-solid': ref('vga-black'),
  'neutral-solid-hover': ref('vga-black'),
  'neutral-on-solid': ref('vga-white'),
  'neutral-subtle': ref('vga-white'),
  'neutral-on-subtle': ref('vga-black'),
  'neutral-border': ref('vga-gray'),

  'primary-solid': ref('vga-navy'),
  'primary-solid-hover': ref('vga-navy'),
  'primary-on-solid': ref('vga-white'),
  'primary-subtle': ref('vga-white'),
  'primary-on-subtle': ref('vga-navy'),
  'primary-border': ref('vga-navy'),

  'success-solid': ref('vga-green'),
  'success-solid-hover': ref('vga-green'),
  'success-on-solid': ref('vga-white'),
  'success-subtle': ref('vga-white'),
  'success-on-subtle': ref('vga-green'),
  'success-border': ref('vga-green'),

  /**
   * Yellow carries black, never white: white on `#ffff00` is 1.07:1. Its edge
   * is olive, because yellow on silver has almost no edge of its own.
   */
  'warning-solid': ref('vga-yellow'),
  'warning-solid-hover': ref('vga-yellow'),
  'warning-on-solid': ref('vga-black'),
  'warning-subtle': ref('vga-white'),
  'warning-on-subtle': ref('vga-black'),
  'warning-border': ref('vga-olive'),

  'danger-solid': ref('vga-maroon'),
  'danger-solid-hover': ref('vga-maroon'),
  'danger-on-solid': ref('vga-white'),
  'danger-subtle': ref('vga-white'),
  'danger-on-subtle': ref('vga-maroon'),
  'danger-border': ref('vga-maroon'),

  // Roles. Each names what a component paints rather than how Windows 98
  // paints it, so a theme can give it its own fill. In Windows 98 most of them
  // are the silver face: the bevel says pressed or default, not the colour.

  /** A plain button, a spin or drop button, a table's sort header. */
  control: ref('vga-silver'),
  'control-foreground': ref('vga-black'),
  'control-hover': ref('vga-silver'),
  'control-active': ref('vga-silver'),
  /** The default button of a form or dialog — Enter's target. */
  'control-primary': ref('vga-silver'),
  'control-primary-foreground': ref('vga-black'),
  'control-primary-hover': ref('vga-silver'),
  'control-primary-active': ref('vga-silver'),
  /** A flat toolbar button while hovered and while held. */
  'control-ghost-hover': ref('vga-silver'),
  'control-ghost-active': ref('vga-silver'),
  /** The face of a latched toggle, under its pattern. */
  'control-latched': ref('vga-silver'),
  /** A latched default button. A toggle is never the default, but if one latches it keeps its colour. */
  'control-primary-latched': ref('vga-silver'),
  /** The box of a checked checkbox or radio, and the mark inside it. */
  checked: ref('vga-white'),
  'on-checked': ref('vga-black'),
  /** A list that drops from a trigger: a select's options. */
  popover: ref('vga-white'),
  'popover-border': ref('vga-black'),
  /** The ring a theme draws around a focused control, outside its edge. */
  'focus-ring': ref('vga-black'),
  /** A window's caption buttons; one fill per button, for themes that colour them. */
  caption: ref('vga-silver'),
  'caption-foreground': ref('vga-black'),
  'caption-close': ref('vga-silver'),
  'caption-minimize': ref('vga-silver'),
  'caption-maximize': ref('vga-silver'),
  'caption-inactive': ref('vga-silver'),
  /** A data table's column headers. */
  'table-header': ref('vga-silver'),
  'table-header-foreground': ref('vga-black'),
  /** Every other row of a data table. Windows 98 does not stripe. */
  'table-stripe': ref('vga-white'),
  /** A data table row under the pointer. Windows 98 does not highlight it. */
  'table-row-hover': ref('vga-white'),
  /** The channel a progress bar or a scroll thumb runs in, and what fills it. */
  track: ref('vga-silver'),
  progress: ref('vga-navy'),
  'scroll-thumb': ref('vga-silver'),
  /** The channel a scroll bar's thumb runs in, under its pattern. */
  'scroll-track': ref('vga-silver'),
  /** The frame of a tooltip. */
  'tooltip-border': ref('vga-black'),
  /**
   * The inside of a group box's frame, and the face around it — behind the
   * legend and the frame's edge. Both the window's silver in Windows 98.
   */
  groupbox: ref('vga-silver'),
  'groupbox-face': ref('vga-silver'),
  /** A toast's ✕: the caption button's silver in Windows 98, a soft grey disc elsewhere. */
  'toast-close': ref('vga-silver'),
  'toast-close-foreground': ref('vga-black'),
  /** A pager's buttons: raised command buttons in Windows 98, flat elsewhere. */
  pager: ref('vga-silver'),
  'pager-hover': ref('vga-silver'),
  'pager-active': ref('vga-silver'),
  /** The strip a filter bar sits on. */
  'filter-bar': ref('vga-silver'),
  /** A filter chip: its face, its edge and its text. */
  chip: ref('vga-white'),
  'chip-border': ref('vga-gray'),
  'chip-foreground': ref('vga-black'),
  /** The face of a chip's ✕ at rest: the chip's own white in Windows 98. */
  'chip-remove': ref('vga-white'),
  /**
   * The value of a read-only field that holds focus — a drop-down list's —
   * highlighted the way Windows 98 marks it, and the text on it.
   */
  'field-highlight': ref('vga-navy'),
  'on-field-highlight': ref('vga-white'),
  /** The text caret in a field. */
  'field-caret': ref('vga-black'),
  /** The buttons inside a field: a select's drop button, a number's spin buttons. */
  'field-button': ref('vga-silver'),
} as const

/** Names of every semantic colour token. */
export type SemanticColorName = keyof typeof semanticColor
