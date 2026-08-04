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
 * Zero-chroma greys, the shadcn/ui neutral.
 *
 * Named by lightness rather than by a 50…950 position: the step *is* its OKLCH
 * lightness × 1000, so `gray-922` is `oklch(0.922 0 0)` and the table above can
 * be checked against ui.shadcn.com by reading it. A ramp position would have
 * been a lie here — shadcn's greys are not evenly spaced and do not fill a
 * ramp, and two of the steps below exist only because a shadcn value failed
 * contrast and had to be darkened.
 *
 * Pure neutral is the point. rowkit's own `neutral` ramp carries a trace of
 * blue (hue 264); the shadcn look is the absence of that.
 *
 * Design language based on shadcn/ui by shadcn, adapted for Vue.
 */
export const gray = {
  /** shadcn `--primary-foreground`, `--foreground` (dark). */
  985: 'oklch(0.985 0 0)',
  /** shadcn `--secondary`, `--muted`, `--accent`. */
  970: 'oklch(0.97 0 0)',
  /** shadcn `--border`. Decorative hairline — deliberately below 3:1. */
  922: 'oklch(0.922 0 0)',
  /** Emphasised hairline. rowkit's; shadcn has no "strong border". */
  870: 'oklch(0.87 0 0)',
  /** shadcn `--muted-foreground` (dark), where it clears AA at 7.63:1. */
  708: 'oklch(0.708 0 0)',
  /**
   * rowkit's correction to shadcn `--ring` and `--input` in light mode.
   *
   * shadcn puts them at 0.708 and 0.922, which measure 2.59:1 and 1.26:1
   * against a white page — a focus ring and a control boundary that both fail
   * WCAG 1.4.11.
   *
   * Not the mathematical minimum. Solving in floating point gave 0.669 and a
   * tidy 3.00:1; the browser paints `#959595` and axe measured **2.995:1**,
   * because a colour is quantised to eight bits per channel before anyone sees
   * it. Anything solved exactly onto a threshold lands on whichever side the
   * rounding chooses. 0.635 is 3.45:1 against the page and 3.17:1 against
   * `surface-subtle`, which clears the bar on both sides of the rounding.
   */
  635: 'oklch(0.635 0 0)',
  /** shadcn `--ring` (dark), 4.18:1 against the dark page. */
  556: 'oklch(0.556 0 0)',
  /**
   * rowkit's correction to shadcn `--muted-foreground` in light mode.
   *
   * shadcn's 0.556 is 4.73:1 on white but only 4.34:1 on `--muted`, the
   * recessed surface a table header sits on — and a table header is the single
   * most common use this token has.
   *
   * 0.547 was the first attempt and shipped 4.51:1 in floating point; axe,
   * reading the painted `#717171`, called it 4.47:1 and failed twenty-four
   * stories. See {@link gray[635]} — same lesson, same cause. 0.535 measures
   * 4.75:1 on `--muted` and 5.17:1 on the page.
   */
  535: 'oklch(0.535 0 0)',
  /** Pressed row in dark mode. */
  371: 'oklch(0.371 0 0)',
  /** shadcn `--secondary`, `--muted`, `--accent` (dark). */
  269: 'oklch(0.269 0 0)',
  /** shadcn `--primary` (light), `--card` and `--popover` (dark). */
  205: 'oklch(0.205 0 0)',
  /** shadcn `--foreground` (light), `--background` (dark). */
  145: 'oklch(0.145 0 0)',
} as const

/**
 * shadcn's destructive red, clamped into sRGB. Keyed by lightness, like `gray`.
 *
 * shadcn publishes `oklch(0.577 0.245 27.325)`, and that chroma **does not fit
 * in sRGB** — 0.235 is the maximum at this lightness and hue. The difference is
 * invisible; what it buys is a colour that renders identically on an sRGB
 * monitor and a P3 laptop, instead of one each browser gamut-maps by its own
 * rules. rowkit clamps every chromatic primitive for this reason, and
 * `color.test.ts` enforces it.
 *
 * One red serves both themes. shadcn's dark `--destructive` is a lighter
 * `oklch(0.704 …)`, which carries its white label at **2.86:1** — the single
 * worst failure in shadcn's default set. Reusing the light value gives 4.90:1
 * on the label in both themes and still clears 4.04:1 against the dark page.
 */
export const red = {
  /** Destructive fill. shadcn's lightness, chroma clamped. */
  577: 'oklch(0.577 0.235 27.325)',
  /** Destructive hover — darkens in both themes, so the white label improves. */
  520: 'oklch(0.52 0.212 27.325)',
} as const

/**
 * Success and warning, at shadcn's weight. Keyed by lightness, like `gray`.
 *
 * shadcn has no equivalent to copy, so the rule is consistency rather than
 * fidelity: the solid step sits at the same lightness band as `red-577` and
 * carries a white label, so a success, a warning and a destructive button are
 * the same perceptual weight and only differ in hue.
 *
 * That is a real change for warning, which used to be bright amber with dark
 * text. Bright amber is the loudest thing on a shadcn page — the language is
 * built on restraint, and one saturated chip undoes it. Chroma is clamped to
 * the sRGB boundary at every step, as everywhere else.
 */
export const green = {
  /** Badge fill, light. */
  950: 'oklch(0.95 0.05 152)',
  /** Badge border, light. */
  880: 'oklch(0.88 0.05 152)',
  /** Badge text, dark. */
  850: 'oklch(0.85 0.12 152)',
  /** Solid fill, both themes. White label at 4.56:1. */
  550: 'oklch(0.55 0.144 152)',
  /** Solid hover — darkens, so the white label improves. */
  520: 'oklch(0.52 0.136 152)',
  /** Badge text, light. */
  400: 'oklch(0.4 0.105 152)',
  /** Badge border, dark. */
  350: 'oklch(0.35 0.092 152)',
  /** Badge fill, dark. */
  260: 'oklch(0.26 0.068 152)',
} as const

/** Warning, mirroring {@link green} step for step. */
export const amber = {
  950: 'oklch(0.95 0.04 75)',
  880: 'oklch(0.88 0.05 75)',
  850: 'oklch(0.85 0.12 75)',
  /** Solid fill, both themes. White label at 4.96:1. */
  550: 'oklch(0.55 0.116 75)',
  520: 'oklch(0.52 0.109 75)',
  400: 'oklch(0.4 0.084 75)',
  350: 'oklch(0.35 0.074 75)',
  260: 'oklch(0.26 0.055 75)',
} as const

/**
 * White at a fraction of opacity, for dark-mode borders.
 *
 * shadcn's dark borders are white at 10% and inputs at 15%, not a solid grey.
 * That is why they read as soft against every surface instead of drawing a hard
 * line on the darkest ones — a solid grey tuned for `--background` is too
 * bright on `--card`. Keep the alpha; it is doing work no ramp step can.
 */
export const whiteAlpha = {
  10: 'oklch(1 0 0 / 10%)',
  15: 'oklch(1 0 0 / 15%)',
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
  ...prefixKeys('gray', gray),
  ...prefixKeys('red', red),
  ...prefixKeys('green', green),
  ...prefixKeys('amber', amber),
  ...prefixKeys('white-alpha', whiteAlpha),
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

/**
 * The same, for a scale that is not an eleven-step ramp.
 *
 * `gray` and `whiteAlpha` are keyed by lightness and by opacity, so they cannot
 * go through {@link prefix}, which walks {@link colorSteps}.
 */
function prefixKeys<N extends string, S extends Record<string | number, string>>(
  name: N,
  scale: S
): { [K in keyof S & (string | number) as `${N}-${K}`]: string } {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(scale)) out[`${name}-${key}`] = value
  return out as { [K in keyof S & (string | number) as `${N}-${K}`]: string }
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
  /** Page background, behind all surfaces. shadcn `--background`. */
  background: ref('white'),
  /** Cards, panels, table bodies — the plane content sits on. shadcn `--card`. */
  card: ref('white'),
  /**
   * Table headers, toolbars: a surface that recedes slightly. shadcn `--muted`.
   *
   * Identical to `surface-hover`: shadcn gives `--muted` and `--accent` the same
   * value, and the distinction survives here because the two are separate
   * override points, not because they differ out of the box.
   */
  muted: ref('gray-970'),
  /** Row hover. shadcn `--accent`. */
  accent: ref('gray-970'),
  /** Row press / active. One step past hover; shadcn has no press token. */
  'surface-active': ref('gray-922'),
  /**
   * Selected table row. shadcn's `data-[state=selected]` is `bg-muted`.
   *
   * No longer tinted with the brand: shadcn's neutral is zero-chroma
   * throughout, and a blue selected row was the loudest thing on the page.
   */
  'surface-selected': ref('gray-970'),
  /** Disabled control background. */
  'surface-disabled': ref('gray-970'),
  /**
   * Loading placeholder fill.
   *
   * Its own token rather than a reuse of `surface-active`, which means "this
   * row is being pressed". A skeleton is never interactive, so borrowing an
   * interaction token would tie the two together for any future re-theme.
   *
   * Exempt from contrast rules: skeletons are `aria-hidden` decoration
   * standing in for content that has not arrived, so there is nothing for a
   * reader to perceive and WCAG 1.4.11 does not apply.
   */
  skeleton: ref('gray-970'),

  /** Primary body and heading text. shadcn `--foreground`. */
  foreground: ref('gray-145'),
  /**
   * Secondary text, column labels, help text. shadcn `--muted-foreground`.
   *
   * `gray-535`, not shadcn's 0.556. The same trap the old `neutral-500` fell
   * into: a table header is muted text on `surface-subtle`, and shadcn's value
   * reaches 4.73:1 on white but only 4.34:1 on the recessed surface this token
   * is most often used against. Nine thousandths of lightness buy the pass.
   */
  'muted-foreground': ref('gray-535'),
  /** Placeholders and de-emphasised metadata. */
  'text-subtle': ref('gray-635'),
  /** Text on a disabled control. */
  'text-disabled': ref('gray-708'),

  /**
   * Decorative hairline: row separators, card outlines.
   *
   * Deliberately below 3:1 against the surface. Do not use it for the boundary
   * of an interactive control — see {@link semanticColorLight['input']}.
   */
  border: ref('gray-922'),
  /** Emphasised decorative border: dividers that need to read as structure. */
  'border-strong': ref('gray-870'),
  /** Barely-there separation inside a dense group. */
  'border-subtle': ref('gray-970'),
  /**
   * Boundary of an interactive control — text inputs, checkboxes, outlined
   * buttons.
   *
   * WCAG 1.4.11 requires 3:1 against the adjacent surface for the visual
   * boundary of a UI component. `border` manages only 1.24:1 and
   * `border-strong` 1.49:1, so neither is legal here; this token is the
   * lightest neutral that clears the bar.
   *
   * shadcn's `--input` is 0.922 — the same value as its `--border` — which
   * measures 1.26:1 and is not a legal control boundary. `gray-635` clears 3:1
   * against the page, a card and a toolbar alike, and it applies only to
   * controls: `border` keeps shadcn's value exactly, so the hairlines between
   * table rows and around cards are pixel-identical to shadcn.
   */
  input: ref('gray-635'),
  /**
   * Focus ring. Never remove the ring — recolour it. shadcn `--ring`.
   *
   * Neutral now, not brand blue: shadcn's ring is grey, and the whole look is
   * the absence of chroma. shadcn's own 0.708 is 2.59:1 against the page and
   * fails 1.4.11, so this is the darkened step.
   */
  ring: ref('gray-635'),

  /** Base colour shadows are mixed from. */
  shadow: ref('black'),

  // `neutral` completes the status family so a component's variant matrix has
  // no special case: a neutral Badge reads the same token names as a danger
  // one. It is the default state — "no status" — not an absence of styling.
  // shadcn `--secondary`: the quiet chip, a near-white fill with dark text.
  'neutral-solid': ref('gray-970'),
  'neutral-solid-hover': ref('gray-922'),
  'neutral-on-solid': ref('gray-205'),
  'neutral-subtle': ref('gray-970'),
  'neutral-on-subtle': ref('gray-205'),
  'neutral-border': ref('gray-922'),

  // shadcn `--primary`: near-black in light mode, and it inverts under `.dark`.
  // There is no brand hue in this design language — the default action is the
  // darkest thing on the page, not the bluest.
  'primary-solid': ref('gray-205'),
  'primary-solid-hover': ref('gray-269'),
  'primary-on-solid': ref('gray-985'),
  'primary-subtle': ref('gray-970'),
  'primary-on-subtle': ref('gray-205'),
  'primary-border': ref('gray-922'),

  'success-solid': ref('green-550'),
  'success-solid-hover': ref('green-520'),
  'success-on-solid': ref('white'),
  'success-subtle': ref('green-950'),
  'success-on-subtle': ref('green-400'),
  'success-border': ref('green-880'),

  // Amber is squeezed from both sides in light mode. It cannot carry white text
  // at any usable weight (white on warning-600 is 3.78:1), and a bright amber
  // fill has no discernible edge against a near-white page (warning-400 vs
  // background is 1.92:1, failing WCAG 1.4.11). warning-600 is the only step
  // that satisfies both: 3.61:1 against the page, 4.69:1 for dark text.
  //
  // Hover therefore brightens rather than darkens — warning-700 would drop dark
  // text to 3.27:1.
  'warning-solid': ref('amber-550'),
  'warning-solid-hover': ref('amber-520'),
  'warning-on-solid': ref('white'),
  'warning-subtle': ref('amber-950'),
  'warning-on-subtle': ref('amber-400'),
  'warning-border': ref('amber-880'),

  'danger-solid': ref('red-577'),
  'danger-solid-hover': ref('red-520'),
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
  background: ref('gray-145'),
  card: ref('gray-205'),
  muted: ref('gray-269'),
  accent: ref('gray-269'),
  'surface-active': ref('gray-371'),
  'surface-selected': ref('gray-269'),
  'surface-disabled': ref('gray-269'),
  // Lifts off `surface` rather than receding. On a dark page a placeholder
  // darker than its card reads as a hole in the layout.
  skeleton: ref('gray-269'),

  foreground: ref('gray-985'),
  // shadcn's own value, kept: 7.63:1 on the page and 5.83:1 on `--muted`, so
  // dark mode needs none of the correction light mode did.
  'muted-foreground': ref('gray-708'),
  'text-subtle': ref('gray-556'),
  'text-disabled': ref('gray-556'),

  // White at alpha, not a solid grey — see `whiteAlpha`. A grey tuned against
  // `background` draws too hard a line once the same border sits on `surface`.
  border: ref('white-alpha-10'),
  'border-strong': ref('white-alpha-15'),
  'border-subtle': ref('white-alpha-10'),
  // shadcn's `--input`, unchanged: composited over the page it measures
  // 3.82:1, and 3.54:1 over a card, so both clear 1.4.11 without help.
  input: ref('white-alpha-15'),
  ring: ref('gray-556'),

  shadow: ref('black'),

  'neutral-solid': ref('gray-269'),
  'neutral-solid-hover': ref('gray-371'),
  'neutral-on-solid': ref('gray-985'),
  'neutral-subtle': ref('gray-269'),
  'neutral-on-subtle': ref('gray-985'),
  'neutral-border': ref('gray-371'),

  // The inversion. A primary button in dark mode is near-white with near-black
  // text, not a brighter version of a colour. Keeping this is most of what
  // makes a dark shadcn interface recognisable.
  'primary-solid': ref('gray-922'),
  'primary-solid-hover': ref('gray-985'),
  'primary-on-solid': ref('gray-205'),
  'primary-subtle': ref('gray-269'),
  'primary-on-subtle': ref('gray-985'),
  'primary-border': ref('gray-371'),

  'success-solid': ref('green-550'),
  'success-solid-hover': ref('green-520'),
  'success-on-solid': ref('white'),
  'success-subtle': ref('green-260'),
  'success-on-subtle': ref('green-850'),
  'success-border': ref('green-350'),

  'warning-solid': ref('amber-550'),
  'warning-solid-hover': ref('amber-520'),
  'warning-on-solid': ref('white'),
  'warning-subtle': ref('amber-260'),
  'warning-on-subtle': ref('amber-850'),
  'warning-border': ref('amber-350'),

  // The same red as light mode, with a white label. See `red`.
  'danger-solid': ref('red-577'),
  'danger-solid-hover': ref('red-520'),
  'danger-on-solid': ref('white'),
  'danger-subtle': ref('danger-950'),
  'danger-on-subtle': ref('danger-300'),
  'danger-border': ref('danger-800'),
} as const

/** Names of every semantic colour token. */
export type SemanticColorName = keyof typeof semanticColorLight
