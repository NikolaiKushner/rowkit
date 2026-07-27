import { colorPrimitives, semanticColorDark, semanticColorLight } from './color'
import { duration, easing } from './motion'
import { radius } from './radius'
import { shadow } from './shadow'
import { spacing, spacingBase } from './spacing'
import { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } from './typography'
import { zIndex } from './z-index'

/**
 * Emits the Tailwind v4 `@theme` block for the rowkit token set.
 *
 * The TypeScript objects are the single source of truth; this function derives
 * the stylesheet from them, so the two cannot drift. `css.test.ts` asserts that
 * every token in every scale reaches the output.
 *
 * Dark mode works by repointing *semantic* tokens under `.dark`. Primitives are
 * emitted once and never change — `--color-primary-600` is the same colour in
 * both themes; what changes is which primitive `--color-primary-solid` points
 * at. That is why the theme can flip without a single hardcoded colour moving.
 *
 * @returns The complete stylesheet, ready to write to disk.
 */
export function buildThemeCss(): string {
  return [
    header(),
    '',
    // Tailwind v4 defaults the `dark:` variant to prefers-color-scheme. rowkit
    // uses a class so an app can offer an explicit theme switch.
    '@custom-variant dark (&:where(.dark, .dark *));',
    '',
    '@theme {',
    section('colour primitives — the only literal colours in rowkit'),
    ...entries(colorPrimitives, (k) => `--color-${k}`),
    '',
    section('semantic colours — light (defaults)'),
    ...entries(semanticColorLight, (k) => `--color-${k}`),
    '',
    section('spacing'),
    `  --spacing: ${spacingBase};`,
    ...entries(spacing, (k) => `--spacing-${k}`),
    '',
    section('typography'),
    ...entries(fontFamily, (k) => `--font-${k}`),
    ...fontSizeEntries(),
    ...entries(fontWeight, (k) => `--font-weight-${k}`),
    ...entries(letterSpacing, (k) => `--tracking-${k}`),
    ...entries(lineHeight, (k) => `--leading-${k}`),
    '',
    section('radii'),
    ...entries(radius, (k) => `--radius-${k}`),
    '',
    section('shadows'),
    ...entries(shadow, (k) => `--shadow-${k}`),
    '',
    section('motion'),
    ...entries(duration, (k) => `--duration-${k}`),
    ...entries(easing, (k) => `--ease-${k}`),
    '',
    section('stacking layers'),
    ...entries(zIndex, (k) => `--z-${k}`),
    '}',
    '',
    '/* Dark mode repoints semantic tokens only. Primitives are theme-agnostic. */',
    '.dark {',
    ...entries(semanticColorDark, (k) => `--color-${k}`),
    '}',
    '',
  ].join('\n')
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
