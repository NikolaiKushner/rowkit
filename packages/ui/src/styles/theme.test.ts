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
  ['bg-primary-600', '--color-primary-600'],
  ['bg-neutral-50', '--color-neutral-50'],
  ['bg-surface', '--color-surface'],
  ['bg-surface-hover', '--color-surface-hover'],
  ['text-text-muted', '--color-text-muted'],
  ['text-danger-on-solid', '--color-danger-on-solid'],
  ['border-border-control', '--color-border-control'],
  ['ring-focus-ring', '--color-focus-ring'],
  ['p-4', '--spacing-4'],
  ['gap-2', '--spacing-2'],
  ['text-sm', '--text-sm'],
  ['font-medium', '--font-weight-medium'],
  ['font-mono', '--font-mono'],
  ['tracking-wide', '--tracking-wide'],
  ['leading-snug', '--leading-snug'],
  ['rounded-md', '--radius-md'],
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

describe('shadows', () => {
  it.each(['shadow-xs', 'shadow-md', 'shadow-scroll-x'])('%s is generated', async (utility) => {
    expect(await build(utility)).toContain(`.${utility} {`)
  })

  it('carries the geometry from the token', async () => {
    // Shadows are the one scale Tailwind inlines rather than referencing, so
    // the assertion is on the value instead of on a var().
    expect(await build('shadow-scroll-x')).toContain('8px 0 8px -8px')
  })

  it('keeps the shadow colour a variable, so .dark repoints it', async () => {
    // Worth pinning, because the first thing Tailwind emits looks like it
    // breaks the theming model: it resolves --color-shadow to a literal for an
    // sRGB fallback. The live declaration sits in the @supports block below it
    // and keeps the var() intact, so a browser that can do color-mix — which
    // is every browser that can read these oklch tokens — still picks up the
    // dark override.
    const css = await build('shadow-md')
    const rule = css.slice(css.indexOf('.shadow-md {'))
    const supports = rule.slice(rule.indexOf('@supports'))
    expect(supports).toContain('var(--color-shadow)')
  })
})

describe('dark mode', () => {
  it('is driven by the .dark class, not the OS setting', async () => {
    const css = await build('dark:bg-surface')
    expect(css).toContain('.dark')
    // Tailwind's stock `dark` variant is prefers-color-scheme. The token
    // stylesheet redefines it so an app can offer an explicit theme switch.
    expect(css).not.toContain('prefers-color-scheme')
  })

  it('repoints semantic colours without redefining primitives', async () => {
    const css = await build('bg-surface')
    const darkBlock = css.slice(css.indexOf('.dark'))
    expect(darkBlock).toContain('--color-surface:')
    expect(darkBlock).not.toContain('--color-neutral-900:')
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
