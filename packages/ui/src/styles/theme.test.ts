import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'

/**
 * Phase 1 shipped a Tailwind `@theme` block that nothing had ever compiled.
 * These tests run the real Tailwind compiler over the real stylesheet and
 * assert that the utilities a component will reach for actually exist and
 * resolve to token variables.
 *
 * The failure mode this guards against is silent: a custom property outside a
 * namespace Tailwind recognises is not an error, it simply generates no
 * utility. `--z-modal` and `--duration-fast` both looked correct and produced
 * nothing until this file went looking for them.
 *
 * Requires `@rowkit/tokens` to be built — `packages/ui` consumes it through its
 * published `dist`, exactly as a consumer would.
 */

const require = createRequire(import.meta.url)
const stylesDir = dirname(fileURLToPath(import.meta.url))

/**
 * Resolves `@import` targets the way a bundler would. Tailwind's own entry is
 * reachable only through its `style` export condition, which Node's resolver
 * does not apply, so it is mapped to the file that condition points at.
 */
async function loadStylesheet(id: string, base: string) {
  const specifier = id === 'tailwindcss' ? 'tailwindcss/index.css' : id
  const path = specifier.startsWith('.')
    ? resolve(base, specifier)
    : require.resolve(specifier, { paths: [base] })
  return { path, base: dirname(path), content: await readFile(path, 'utf8') }
}

/** The stylesheet a consumer writes: Tailwind, then rowkit's theme layer. */
const consumerCss = `@import 'tailwindcss';\n@import './index.css';\n`

/**
 * Compiles the given candidates against a fresh compiler.
 *
 * A compiler instance accumulates candidates across `build()` calls, so reusing
 * one would let an earlier test's utilities satisfy a later assertion.
 */
async function build(...candidates: string[]): Promise<string> {
  const compiler = await compile(consumerCss, { base: stylesDir, loadStylesheet })
  return compiler.build(candidates)
}

/** [utility, the custom property its declaration must reference] */
const utilities: readonly (readonly [string, string])[] = [
  ['bg-vga-navy', '--color-vga-navy'],
  ['bg-win98-info', '--color-win98-info'],
  ['bg-desktop', '--color-desktop'],
  ['bg-surface-selected', '--color-surface-selected'],
  ['text-on-selected', '--color-on-selected'],
  ['bg-card', '--color-card'],
  ['bg-accent', '--color-accent'],
  ['text-muted-foreground', '--color-muted-foreground'],
  ['text-danger-on-solid', '--color-danger-on-solid'],
  ['bg-input', '--color-input'],
  ['outline-ring', '--color-ring'],
  ['bg-shadow', '--color-shadow'],
  ['p-4', '--spacing-4'],
  ['gap-2', '--spacing-2'],
  ['text-ui', '--text-ui'],
  ['text-heading', '--text-heading'],
  ['text-doc-h1', '--text-doc-h1'],
  ['font-bold', '--font-weight-bold'],
  ['font-mono', '--font-mono'],
  ['tracking-normal', '--tracking-normal'],
  ['leading-snug', '--leading-snug'],
  ['rounded-md', '--radius-md'],
  ['text-shadow-disabled', '--color-text-disabled-emboss'],
  ['z-modal', '--z-index-modal'],
  ['duration-fast', '--transition-duration-fast'],
  ['ease-standard', '--ease-standard'],
]

describe('rowkit tokens compile to Tailwind utilities', () => {
  it.each(utilities)('%s references %s', async (utility, property) => {
    const css = await build(utility)
    expect(css, `${utility} generated no rule — check the theme namespace`).toContain(
      `.${utility.replace(/([.:])/g, '\\$1')} {`
    )
    expect(css).toContain(`var(${property})`)
  })
})

describe('the focus ring compiles', () => {
  /*
   * the reference design writes the width as `ring-[3px]`, an arbitrary value. Tailwind v4
   * takes a bare number on `ring-*`, so `ring-3` is the same 3px through the
   * scale instead of around it — but only if v4 really does generate it, and a
   * utility that generates nothing is this project's recurring failure.
   */
  it('generates a 3px ring from the scale, not an arbitrary value', async () => {
    const css = await build('ring-3')
    expect(css, 'ring-3 produced no rule — the arbitrary `ring-[3px]` would be needed').toContain(
      '.ring-3 {'
    )
    expect(css).toContain('3px')
  })

  it('tints the ring from the focus-ring token', async () => {
    const css = await build('ring-ring/50')
    expect(css).toContain('var(--color-ring)')
  })

  it('recolours the border to match, which is the half that carries 1.4.11', async () => {
    // The ring is 50% opaque and cannot be relied on for contrast; the solid
    // border is the indicator. If this utility stops resolving, focus still
    // *looks* present in a screenshot and no longer meets the criterion.
    expect(await build('border-ring')).toContain('var(--color-ring)')
  })
})

describe('the radius scale resolves', () => {
  /*
   * Every radius is `calc(var(--radius) * f)`. Tailwind emits only the theme
   * variables its generated utilities reference, and no utility is generated
   * from a bare `--radius` — so if it lived inside `@theme` it could be dropped
   * from the output while every `rounded-*` rule still looked perfectly correct.
   *
   * A `calc()` over an undefined variable is not a CSS error. `border-radius`
   * computes to nothing and every corner in the library goes square, silently.
   * That is why `--radius` is declared in its own `:root` block, and why this
   * asserts on the compiled stylesheet rather than on the token object.
   */
  it('declares --radius, so the calc() has something to multiply', async () => {
    const css = await build('rounded-md')
    expect(css, '--radius vanished — every rounded-* utility now computes to 0').toMatch(
      /--radius:\s*0rem/
    )
  })

  it.each([
    ['rounded-xs', 0.4],
    ['rounded-sm', 0.6],
    ['rounded-md', 0.8],
    ['rounded-xl', 1.4],
  ])('%s multiplies --radius by %d', async (utility, factor) => {
    expect(await build(utility)).toContain(`calc(var(--radius) * ${factor})`)
  })

  it('leaves rounded-lg as the base, unmultiplied', async () => {
    expect(await build('rounded-lg')).toMatch(/--radius-lg:\s*var\(--radius\)/)
  })
})

describe('the scroll bar', () => {
  it('draws every part from tokens', async () => {
    const css = await build('scrollbar-themed')
    expect(css, 'scrollbar-themed generated no rule').toContain('.scrollbar-themed {')
    for (const part of ['', '-track', '-thumb', '-corner', '-button:single-button']) {
      expect(css).toContain(`&::-webkit-scrollbar${part} {`)
    }
    expect(css).toContain('box-shadow: var(--rk-shadow-scroll-thumb)')
    expect(css).toContain('display: var(--rk-scrollbar-buttons)')
    expect(css).toContain('var(--color-foreground)')
    const start = css.indexOf('.scrollbar-themed {')
    // The rule alone: the theme's palette follows the utilities in the output.
    const rule = css.slice(start, css.indexOf('\n  }\n', start))
    expect(rule, 'a hex colour bypasses the tokens').not.toMatch(/#[0-9a-f]{3,6}\b/i)
  })

  it('keeps its first name, scrollbar-win98, working', async () => {
    const css = await build('scrollbar-win98')
    expect(css).toContain('.scrollbar-win98 {')
    expect(css).toContain('&::-webkit-scrollbar-thumb {')
  })

  it('resets the standard properties that would switch the webkit parts off', async () => {
    // Chromium drops every ::-webkit-scrollbar rule once an element has a
    // standard scrollbar-color or scrollbar-width — and scrollbar-color
    // inherits, so one app-wide rule would silently restore the native bar.
    const css = await build('scrollbar-themed')
    expect(css).toContain('scrollbar-color: auto')
    expect(css).toContain('scrollbar-width: auto')
    expect(css).toMatch(/@supports not selector\(::-webkit-scrollbar\)\s*{\s*scrollbar-color:/)
  })
})

describe('shadows', () => {
  it('draws the sticky header rule as an inset shadow that keeps its token', async () => {
    // A border cannot do this job: under `border-collapse` it belongs to the
    // table grid, so a sticky header scrolls away from its own rule. The value
    // has to survive Tailwind's shadow-colour handling with the var() intact,
    // or the line stops following the border token.
    const css = await build('shadow-sticky-header')
    expect(css, 'shadow-sticky-header generated no rule').toContain('.shadow-sticky-header {')
    expect(css).toContain('inset')
    expect(css).toContain('var(--color-border)')
  })

  it.each([
    'shadow-raised',
    'shadow-window',
    'shadow-raised-default',
    'shadow-pressed',
    'shadow-sunken',
    'shadow-status',
    'shadow-etched',
    'shadow-raised-thin',
    'shadow-scroll-x',
  ])('%s is generated', async (utility) => {
    expect(await build(utility)).toContain(`.${utility} {`)
  })

  it('draws a shadow from its theme variable, not from a copied value', async () => {
    // Tailwind copies a shadow token's value into the utility. Were that the
    // bevel itself, no theme could change it; the token is `var(--rk-shadow-*)`
    // so the utility follows whatever the theme declares.
    const css = await build('shadow-raised')
    expect(css).toContain('--tw-shadow: var(--rk-shadow-raised)')
  })

  it('declares the Windows 98 bevel from hard inset lines in the bevel colours', async () => {
    const css = await build('shadow-raised')
    expect(css).toMatch(/--rk-shadow-raised: inset -1px -1px var\(--color-bevel-dark\)/)
    expect(css).toContain('inset 2px 2px var(--color-bevel-light)')
  })
})

describe('themes', () => {
  it('switch by attribute, with no dark class', async () => {
    // A `.dark` block would be a second switch beside `data-color-scheme`.
    const css = await build('bg-card')
    expect(css).not.toContain('.dark')
    expect(css).toContain('[data-theme="modern"] {')
    expect(css).toContain('[data-theme="win98"] {')
  })

  it('carry the modern icon glyphs, and only inside the modern theme', async () => {
    const css = await build('bg-card')
    expect(css).toContain("svg[data-icon='search'] {")
    expect(css).toMatch(/\[data-theme='modern'\] \{\s+--rk-icon-/)
  })
})

describe('the theme layer is additive', () => {
  it('leaves Tailwind’s own palette intact', async () => {
    // A consumer installing rowkit must not lose the utilities they already use.
    expect(await build('bg-red-500')).toContain('var(--color-red-500)')
  })

  it('does not import Tailwind itself', async () => {
    const source = await readFile(resolve(stylesDir, 'index.css'), 'utf8')
    const directives = source.replace(/\/\*[\s\S]*?\*\//g, '')
    expect(directives).not.toContain('tailwindcss')
    expect(directives).toContain(`@import '@rowkit/tokens/css'`)
  })
})
