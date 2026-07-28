/**
 * Colour primitives and semantic mappings.
 *
 * ## How the scales were derived
 *
 * Every chromatic family shares one lightness ramp and one chroma envelope, so
 * `primary-600`, `danger-600` and `success-600` are the same perceptual weight
 * and can be swapped without relayering the design. Families differ only by
 * hue and a chroma factor.
 *
 * Chroma at each step is clamped to the sRGB gamut boundary. OKLCH can express
 * colours outside sRGB, and browsers gamut-map them per their own rules — that
 * makes a token render differently on a P3 laptop than on an sRGB monitor.
 * Clamping trades a little vividness for identical output everywhere.
 *
 * `warning` carries a lightness bump through its midtones: at a shared
 * lightness, yellow is far less saturated than blue or red, so the unbumped
 * steps read as muddy brown rather than amber.
 *
 * Contrast for every semantic pair is asserted in `contrast.test.ts` — the
 * ratios are a build gate, not a claim in a comment.
 */

/** The eleven steps every colour family provides. */
export const colorSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/** One step of a colour family. */
export type ColorStep = (typeof colorSteps)[number]

/**
 * Cool-slate neutral (hue 264). Roughly 70% of the pixels in a data table:
 * page background, row borders, muted labels, table chrome.
 */
export const neutral = {
  50: 'oklch(0.984 0.003 264)',
  100: 'oklch(0.968 0.004 264)',
  200: 'oklch(0.928 0.006 264)',
  300: 'oklch(0.869 0.01 264)',
  400: 'oklch(0.704 0.018 264)',
  500: 'oklch(0.551 0.024 264)',
  600: 'oklch(0.446 0.027 264)',
  700: 'oklch(0.373 0.028 264)',
  800: 'oklch(0.279 0.03 264)',
  900: 'oklch(0.21 0.033 264)',
  950: 'oklch(0.13 0.036 264)',
} as const

/** Brand blue (hue 259). Drives links, focus rings and primary actions. */
export const primary = {
  50: 'oklch(0.97 0.014 259)',
  100: 'oklch(0.936 0.03 259)',
  200: 'oklch(0.885 0.055 259)',
  300: 'oklch(0.809 0.095 259)',
  400: 'oklch(0.715 0.147 259)',
  500: 'oklch(0.623 0.201 259)',
  600: 'oklch(0.546 0.209 259)',
  700: 'oklch(0.488 0.187 259)',
  800: 'oklch(0.442 0.165 259)',
  900: 'oklch(0.396 0.135 259)',
  950: 'oklch(0.282 0.086 259)',
} as const

/** Green (hue 152). Reserved for successful outcomes, never for brand accent. */
export const success = {
  50: 'oklch(0.97 0.014 152)',
  100: 'oklch(0.936 0.036 152)',
  200: 'oklch(0.885 0.064 152)',
  300: 'oklch(0.809 0.097 152)',
  400: 'oklch(0.715 0.145 152)',
  500: 'oklch(0.623 0.162 152)',
  600: 'oklch(0.546 0.142 152)',
  700: 'oklch(0.488 0.127 152)',
  800: 'oklch(0.442 0.115 152)',
  900: 'oklch(0.396 0.103 152)',
  950: 'oklch(0.282 0.073 152)',
} as const

/** Amber (hue 75), lightness-bumped through the midtones. See the module note. */
export const warning = {
  50: 'oklch(0.97 0.016 75)',
  100: 'oklch(0.936 0.04 75)',
  200: 'oklch(0.885 0.071 75)',
  300: 'oklch(0.849 0.108 75)',
  400: 'oklch(0.785 0.162 75)',
  500: 'oklch(0.723 0.15 75)',
  600: 'oklch(0.616 0.128 75)',
  700: 'oklch(0.528 0.11 75)',
  800: 'oklch(0.442 0.092 75)',
  900: 'oklch(0.396 0.082 75)',
  950: 'oklch(0.282 0.059 75)',
} as const

/** Red (hue 25). Destructive actions and error states. */
export const danger = {
  50: 'oklch(0.97 0.014 25)',
  100: 'oklch(0.936 0.032 25)',
  200: 'oklch(0.885 0.06 25)',
  300: 'oklch(0.809 0.107 25)',
  400: 'oklch(0.715 0.17 25)',
  500: 'oklch(0.623 0.214 25)',
  600: 'oklch(0.546 0.218 25)',
  700: 'oklch(0.488 0.195 25)',
  800: 'oklch(0.442 0.165 25)',
  900: 'oklch(0.396 0.135 25)',
  950: 'oklch(0.282 0.086 25)',
} as const

/**
 * Every primitive colour, keyed by the CSS custom property it becomes.
 *
 * These are the only place a literal colour value appears in rowkit. Everything
 * else — semantic tokens, component variants — references one of these.
 */
export const colorPrimitives = {
  white: 'oklch(1 0 0)',
  black: 'oklch(0 0 0)',
  ...prefix('neutral', neutral),
  ...prefix('primary', primary),
  ...prefix('success', success),
  ...prefix('warning', warning),
  ...prefix('danger', danger),
} as const

function prefix<N extends string>(
  name: N,
  scale: Record<ColorStep, string>
): Record<`${N}-${ColorStep}`, string> {
  const out: Record<string, string> = {}
  for (const step of colorSteps) out[`${name}-${step}`] = scale[step]
  return out
}

/** A reference to a primitive colour, as a CSS `var()` expression. */
export type ColorRef = `var(--color-${string})`

const ref = (token: keyof typeof colorPrimitives): ColorRef => `var(--color-${token})`

/**
 * Light-mode semantic colours.
 *
 * Semantic tokens never hold a literal colour — each one points at a primitive
 * through `var()`, so re-theming means repointing references rather than
 * hunting down hex codes. `semantic.test.ts` enforces this.
 */
export const semanticColorLight = {
  /** Page background, behind all surfaces. */
  background: ref('neutral-50'),
  /** Cards, panels, table bodies — the plane content sits on. */
  surface: ref('white'),
  /** Table headers, toolbars: a surface that recedes slightly. */
  'surface-subtle': ref('neutral-100'),
  /** Row hover. */
  'surface-hover': ref('neutral-100'),
  /** Row press / active. */
  'surface-active': ref('neutral-200'),
  /** Selected table row. */
  'surface-selected': ref('primary-50'),
  /** Disabled control background. */
  'surface-disabled': ref('neutral-100'),

  /** Primary body and heading text. */
  text: ref('neutral-900'),
  /** Secondary text, column labels, help text. */
  'text-muted': ref('neutral-500'),
  /** Placeholders and de-emphasised metadata. */
  'text-subtle': ref('neutral-400'),
  /** Text on a disabled control. */
  'text-disabled': ref('neutral-400'),

  /**
   * Decorative hairline: row separators, card outlines.
   *
   * Deliberately below 3:1 against the surface. Do not use it for the boundary
   * of an interactive control — see {@link semanticColorLight['border-control']}.
   */
  border: ref('neutral-200'),
  /** Emphasised decorative border: dividers that need to read as structure. */
  'border-strong': ref('neutral-300'),
  /** Barely-there separation inside a dense group. */
  'border-subtle': ref('neutral-100'),
  /**
   * Boundary of an interactive control — text inputs, checkboxes, outlined
   * buttons.
   *
   * WCAG 1.4.11 requires 3:1 against the adjacent surface for the visual
   * boundary of a UI component. `border` manages only 1.24:1 and
   * `border-strong` 1.49:1, so neither is legal here; this token is the
   * lightest neutral that clears the bar (4.83:1 on `surface`).
   */
  'border-control': ref('neutral-500'),
  /** Focus ring. Never remove the ring — recolour it. */
  'focus-ring': ref('primary-600'),

  /** Base colour shadows are mixed from. */
  shadow: ref('neutral-950'),

  // `neutral` completes the status family so a component's variant matrix has
  // no special case: a neutral Badge reads the same token names as a danger
  // one. It is the default state — "no status" — not an absence of styling.
  'neutral-solid': ref('neutral-700'),
  'neutral-solid-hover': ref('neutral-800'),
  'neutral-on-solid': ref('white'),
  'neutral-subtle': ref('neutral-100'),
  'neutral-on-subtle': ref('neutral-700'),
  'neutral-border': ref('neutral-200'),

  'primary-solid': ref('primary-600'),
  'primary-solid-hover': ref('primary-700'),
  'primary-on-solid': ref('white'),
  'primary-subtle': ref('primary-50'),
  'primary-on-subtle': ref('primary-700'),
  'primary-border': ref('primary-200'),

  'success-solid': ref('success-600'),
  'success-solid-hover': ref('success-700'),
  'success-on-solid': ref('white'),
  'success-subtle': ref('success-50'),
  'success-on-subtle': ref('success-700'),
  'success-border': ref('success-200'),

  // Amber is squeezed from both sides in light mode. It cannot carry white text
  // at any usable weight (white on warning-600 is 3.78:1), and a bright amber
  // fill has no discernible edge against a near-white page (warning-400 vs
  // background is 1.92:1, failing WCAG 1.4.11). warning-600 is the only step
  // that satisfies both: 3.61:1 against the page, 4.69:1 for dark text.
  //
  // Hover therefore brightens rather than darkens — warning-700 would drop dark
  // text to 3.27:1.
  'warning-solid': ref('warning-600'),
  'warning-solid-hover': ref('warning-500'),
  'warning-on-solid': ref('neutral-900'),
  'warning-subtle': ref('warning-50'),
  'warning-on-subtle': ref('warning-700'),
  'warning-border': ref('warning-200'),

  'danger-solid': ref('danger-600'),
  'danger-solid-hover': ref('danger-700'),
  'danger-on-solid': ref('white'),
  'danger-subtle': ref('danger-50'),
  'danger-on-subtle': ref('danger-700'),
  'danger-border': ref('danger-200'),
} as const

/**
 * Dark-mode semantic colours, applied under `.dark`.
 *
 * Solid fills use the bright `400` step with dark text rather than mirroring
 * light mode's `600` with white text. On a near-black page a `600` fill only
 * reaches 3.6–4.4:1 against the background — the button itself becomes hard to
 * locate even though its label is legible. The `400` fill scores 7.4–8.5:1 on
 * both label and background.
 */
export const semanticColorDark = {
  background: ref('neutral-950'),
  surface: ref('neutral-900'),
  'surface-subtle': ref('neutral-800'),
  'surface-hover': ref('neutral-800'),
  'surface-active': ref('neutral-700'),
  'surface-selected': ref('primary-950'),
  'surface-disabled': ref('neutral-800'),

  text: ref('neutral-50'),
  'text-muted': ref('neutral-400'),
  'text-subtle': ref('neutral-500'),
  'text-disabled': ref('neutral-600'),

  border: ref('neutral-800'),
  'border-strong': ref('neutral-700'),
  'border-subtle': ref('neutral-900'),
  // neutral-500 is again the lightest step clearing 3:1, here against
  // `surface` (neutral-900) at 3.67:1.
  'border-control': ref('neutral-500'),
  'focus-ring': ref('primary-400'),

  shadow: ref('black'),

  'neutral-solid': ref('neutral-400'),
  'neutral-solid-hover': ref('neutral-300'),
  'neutral-on-solid': ref('neutral-950'),
  'neutral-subtle': ref('neutral-800'),
  'neutral-on-subtle': ref('neutral-200'),
  'neutral-border': ref('neutral-700'),

  'primary-solid': ref('primary-400'),
  'primary-solid-hover': ref('primary-300'),
  'primary-on-solid': ref('neutral-950'),
  'primary-subtle': ref('primary-950'),
  'primary-on-subtle': ref('primary-300'),
  'primary-border': ref('primary-800'),

  'success-solid': ref('success-400'),
  'success-solid-hover': ref('success-300'),
  'success-on-solid': ref('neutral-950'),
  'success-subtle': ref('success-950'),
  'success-on-subtle': ref('success-300'),
  'success-border': ref('success-800'),

  'warning-solid': ref('warning-400'),
  'warning-solid-hover': ref('warning-300'),
  'warning-on-solid': ref('neutral-950'),
  'warning-subtle': ref('warning-950'),
  'warning-on-subtle': ref('warning-300'),
  'warning-border': ref('warning-800'),

  'danger-solid': ref('danger-400'),
  'danger-solid-hover': ref('danger-300'),
  'danger-on-solid': ref('neutral-950'),
  'danger-subtle': ref('danger-950'),
  'danger-on-subtle': ref('danger-300'),
  'danger-border': ref('danger-800'),
} as const

/** Names of every semantic colour token. */
export type SemanticColorName = keyof typeof semanticColorLight
