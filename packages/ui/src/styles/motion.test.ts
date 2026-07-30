import { readFile, readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from 'tailwindcss'
import { beforeAll, describe, expect, it } from 'vitest'

/**
 * Motion is opt-out at the system level, and this is the gate for it.
 *
 * Phase 4 adds three animated overlays, so the rule needs to be enforced before
 * they arrive rather than remembered while they are written.
 *
 * The rule is not "no looping animation". It is: **an ambient loop is gated
 * behind `motion-safe:`; a loop that is the only thing telling the user
 * something is happening is exempt, deliberately and by name.** Gating a
 * spinner does not reduce motion, it removes the signal — the reduced-motion
 * user gets a static ring meaning nothing.
 */

const stylesDir = dirname(fileURLToPath(import.meta.url))
const componentsDir = resolve(stylesDir, '../components')
const require = createRequire(import.meta.url)

/**
 * Animations that stay ungated, with the reason.
 *
 * Anything added here is a decision. Keep it short — a growing list means the
 * distinction has stopped being applied.
 */
const exemptions: Record<string, string> = {
  'animate-spin':
    'Button spinner. The rotation is the only visible signal that a request is in ' +
    'flight, so gating it would remove information rather than motion. Small, ' +
    'centred, non-parallax — the shapes WCAG 2.3.3 is concerned with are large-area ' +
    'and parallax. Assistive tech gets the same state through aria-busy.',
}

async function sourceFiles(): Promise<{ path: string; content: string }[]> {
  const entries = await readdir(componentsDir, { withFileTypes: true })
  const files: { path: string; content: string }[] = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const dir = join(componentsDir, entry.name)
    for (const name of await readdir(dir)) {
      if (!name.endsWith('.vue') && !name.endsWith('.variants.ts')) continue
      const path = join(dir, name)
      files.push({ path: `${entry.name}/${name}`, content: await readFile(path, 'utf8') })
    }
  }
  return files
}

describe('looping animation is gated or exempted', () => {
  it('has no ungated animation outside the exemption list', async () => {
    const offenders: string[] = []

    for (const { path, content } of await sourceFiles()) {
      for (const [lineNumber, line] of content.split('\n').entries()) {
        // Prose, not classes. The comments in these files discuss the rule.
        const trimmed = line.trimStart()
        if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*'))
          continue

        // Whole class tokens, because variants stack: the gate on
        // `motion-safe:data-[state=open]:animate-dialog-in` is not adjacent to
        // the animation, and a regex expecting it to be reports a false
        // positive. Anywhere in the token counts.
        for (const token of line.split(/[\s'"`]+/)) {
          if (!token.includes('animate-')) continue
          if (token.includes('motion-safe:') || token.includes('motion-reduce:')) continue
          const utility = /animate-[a-z0-9-]+/.exec(token)?.[0]
          if (utility !== undefined && utility in exemptions) continue
          offenders.push(`${path}:${String(lineNumber + 1)} — ${utility ?? token}`)
        }
      }
    }

    expect(
      offenders,
      `ungated animation — gate it with motion-safe:, or add it to the exemption list with a reason:\n${offenders.join('\n')}`
    ).toEqual([])
  })

  it('keeps the exemption list justified', () => {
    for (const [utility, reason] of Object.entries(exemptions)) {
      expect(reason.length, `${utility} needs a real reason, not a placeholder`).toBeGreaterThan(60)
    }
  })
})

describe('motion-safe actually compiles to the media query', () => {
  let css = ''

  beforeAll(async () => {
    const compiler = await compile(`@import 'tailwindcss';\n@import './index.css';\n`, {
      base: stylesDir,
      loadStylesheet: async (id: string, base: string) => {
        const specifier = id === 'tailwindcss' ? 'tailwindcss/index.css' : id
        const path = specifier.startsWith('.')
          ? resolve(base, specifier)
          : require.resolve(specifier, { paths: [base] })
        return { path, base: dirname(path), content: await readFile(path, 'utf8') }
      },
    })
    css = compiler.build(['motion-safe:animate-pulse'])
  })

  it('puts the gated utility behind prefers-reduced-motion: no-preference', () => {
    // The whole mechanism rests on this. If Tailwind ever changed what
    // `motion-safe:` means, every gated animation would silently ungate.
    expect(css).toContain('prefers-reduced-motion: no-preference')

    const block = css.slice(css.indexOf('prefers-reduced-motion: no-preference'))
    expect(block).toContain('animate-pulse')
  })
})
