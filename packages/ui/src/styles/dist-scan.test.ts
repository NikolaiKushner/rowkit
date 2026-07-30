import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from 'tailwindcss'
import { beforeAll, describe, expect, it } from 'vitest'

/**
 * The shipped stylesheet has to make Tailwind find the shipped components.
 *
 * `variants.test.ts` compiles against `src`, which cannot catch this: the
 * `@source` directive in `dist/styles.css` is written by `emit-styles.mjs`
 * against the *built* layout, and if it points at the wrong thing a consumer
 * gets the tokens, no utilities, and no error anywhere. That is precisely what
 * happened when the build moved to one file per module and the directive still
 * named the entry — which only re-exports and contains no classes at all.
 */

const require = createRequire(import.meta.url)
const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../dist')

/** Classes that appear only inside rowkit's own components. */
const probes = ['bg-primary-solid', 'z-modal', 'shadow-scroll-x', 'duration-fast', 'bg-skeleton']

let css = ''

beforeAll(async () => {
  expect(
    existsSync(resolve(distDir, 'styles.css')),
    'dist is missing — run `pnpm build` before this test'
  ).toBe(true)

  const compiler = await compile(`@import 'tailwindcss';\n@import './styles.css';\n`, {
    base: distDir,
    loadStylesheet: async (id: string, from: string) => {
      const specifier = id === 'tailwindcss' ? 'tailwindcss/index.css' : id
      const path = specifier.startsWith('.')
        ? resolve(from, specifier)
        : require.resolve(specifier, { paths: [from] })
      return { path, base: dirname(path), content: await readFile(path, 'utf8') }
    },
  })
  css = compiler.build(probes)
})

describe('the shipped stylesheet scans the shipped bundle', () => {
  it.each(probes)('generates %s', (probe) => {
    const selector = `.${probe.replace(/[:./[\]]/g, (char) => `\\${char}`)}`
    expect(
      css.includes(selector),
      `no CSS for ${probe} — the @source in dist/styles.css is not reaching the built modules`
    ).toBe(true)
  })
})
