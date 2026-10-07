import { colorPrimitives, semanticColor } from './color'
import { duration, easing } from './motion'
import { radiusBase, radiusCss } from './radius'
import { shadow, textShadow } from './shadow'
import { size } from './size'
import { spacing, spacingBase } from './spacing'
import { style } from './style'
import { modernDarkVars, modernLightVars, modernPalette, themeRule, win98Vars } from './themes'
import { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } from './typography'
import { zIndex } from './z-index'

/**
 * Emits the Tailwind v4 `@theme` block for the rowkit token set.
 *
 * The TypeScript objects are the single source of truth; this function derives
 * the stylesheet from them, so the two cannot drift. `css.test.ts` asserts that
 * every token in every scale reaches the output.
 *
 * Two themes. Windows 98 is the default, carried by `:root`; the modern theme
 * is switched on by `data-theme="modern"` on any element, and its dark scheme
 * by the system or by `data-color-scheme="dark"` on that same element. A theme
 * is a set of custom property values and nothing else, so themes nest: a
 * region marked `data-theme="win98"` inside a modern page is Windows 98.
 *
 * One thing makes that work, and it is easy to break. A custom property whose
 * value contains `var()` is resolved on the element that declares it, and
 * descendants inherit the result. A theme therefore re-declares every token it
 * changes on its own element; repointing a primitive at `:root` would not reach
 * a semantic token that has already been resolved there.
 *
 * Shadows take one more step. Tailwind copies a `--shadow-*` value into each
 * `shadow-*` utility rather than referencing it, so a theme could never change
 * one. The `@theme` entry is therefore `var(--rk-shadow-*)`, and the value
 * lives in that variable.
 *
 * @returns The complete stylesheet, ready to write to disk.
 */
export function buildThemeCss(): string {
  return [
    header(),
    '',
    '@theme {',
    section('colour primitives — the only literal colours in rowkit'),
    ...entries(colorPrimitives, (k) => `--color-${k}`),
    '',
    section('semantic colours'),
    ...entries(semanticColor, (k) => `--color-${k}`),
    '',
    section('spacing'),
    `  --spacing: ${spacingBase};`,
    ...entries(spacing, (k) => `--spacing-${k}`),
    '',
    section('component sizes — in the spacing namespace, so h-control-md and friends exist'),
    ...entries(size, (k) => `--spacing-${k}`),
    '',
    section('typography'),
    ...entries(fontFamily, (k) => `--font-${k}`),
    ...fontSizeEntries(),
    ...entries(fontWeight, (k) => `--font-weight-${k}`),
    ...entries(letterSpacing, (k) => `--tracking-${k}`),
    ...entries(lineHeight, (k) => `--leading-${k}`),
    '',
    section('radii — multiples of --radius, declared in :root below'),
    ...entries(radiusCss, (k) => `--radius-${k}`),
    '',
    section('bevels — box shadows, each read from --rk-shadow-* so a theme can change it'),
    ...Object.keys(shadow).map((k) => `  --shadow-${k}: var(--rk-shadow-${k});`),
    ...entries(textShadow, (k) => `--text-shadow-${k}`),
    '',
    section('motion'),
    // Tailwind v4's namespaces are `--transition-duration-*` and `--ease-*`.
    // A name outside a namespace it recognises is not an error — it simply
    // generates no utility, which is why `duration-fast` silently produced
    // nothing until the compile test in packages/ui went looking for it.
    ...entries(duration, (k) => `--transition-duration-${k}`),
    ...entries(easing, (k) => `--ease-${k}`),
    '',
    section('stacking layers'),
    ...entries(zIndex, (k) => `--z-index-${k}`),
    '}',
    '',
    /*
     * Outside `@theme` on purpose.
     *
     * The radius scale is `calc(var(--radius) * f)`, so `--radius` has to
     * resolve wherever a `rounded-*` utility lands. Tailwind only emits the
     * theme variables its generated utilities reference, and nothing generates
     * a utility from a bare `--radius` — left inside `@theme` it can be dropped,
     * and every `calc()` above then references an undefined variable. That is
     * not an error in CSS: `border-radius` simply computes to nothing and every
     * corner in the library goes square, with no warning anywhere.
     *
     * Declaring it here also makes it the documented override point: a consumer
     * sets `--radius` once and the whole scale follows.
     */
    '/* The one length the radius scale multiplies. Override to retune every corner. */',
    ':root {',
    `  --radius: ${radiusBase};`,
    '}',
    '',
    "/* The values behind the shadow tokens, and the style switches. Windows 98's. */",
    ':root {',
    ...entries(shadow, (k) => `--rk-shadow-${k}`),
    ...entries(style, (k) => `--rk-${k}`),
    '}',
    '',
    '/* The modern palette. Only the modern theme references it. */',
    ':root {',
    ...entries(modernPalette, (k) => `--color-modern-${k}`),
    '}',
    '',
    '/* Windows 98 inside a page in another theme. */',
    themeRule('[data-theme="win98"]', 'light', win98Vars),
    '',
    '/* The modern theme. */',
    themeRule('[data-theme="modern"]', 'light', modernLightVars),
    '',
    '@media (prefers-color-scheme: dark) {',
    indent(
      themeRule('[data-theme="modern"]:not([data-color-scheme="light"])', 'dark', modernDarkVars)
    ),
    '}',
    '',
    themeRule('[data-theme="modern"][data-color-scheme="dark"]', 'dark', modernDarkVars),
    '',
  ].join('\n')
}

function indent(text: string): string {
  return text
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')
}

function header(): string {
  return [
    '/*',
    ' * rowkit design tokens.',
    ' *',
    ' * GENERATED FILE — DO NOT EDIT.',
    ' * Source of truth: packages/tokens/src/*.ts',
    ' * Regenerate with: pnpm --filter @rowkit/tokens build',
    ' */',
  ].join('\n')
}

function section(label: string): string {
  return `  /* ${label} */`
}

/** Renders `key: value` pairs as indented custom property declarations. */
function entries(scale: Record<string, string>, toVar: (key: string) => string): string[] {
  return Object.entries(scale).map(([key, value]) => `  ${toVar(key)}: ${value};`)
}

/**
 * Font sizes use Tailwind v4's paired form, where `--text-sm--line-height`
 * supplies the leading that ships with `text-sm`.
 */
function fontSizeEntries(): string[] {
  return Object.entries(fontSize).flatMap(([key, value]) => [
    `  --text-${key}: ${value.size};`,
    `  --text-${key}--line-height: ${value.lineHeight};`,
  ])
}
