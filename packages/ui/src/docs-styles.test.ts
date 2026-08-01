import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { repoRoot } from '../scripts/component-api.mjs'

/**
 * The docs site's Tailwind import must stay `important`.
 *
 * VitePress's default theme ships an unlayered reset — `button, input, …
 * { border: 0; padding: 0 }` and `button { background-color: transparent }` —
 * and unlayered CSS beats anything in `@layer utilities` regardless of order or
 * specificity. Without `important`, every button and input in a live demo
 * renders with no background, no padding and no border, while the properties
 * the reset does not mention come through normally.
 *
 * That is the failure mode this project keeps meeting: correct classes, correct
 * stylesheet, no error anywhere, wrong pixels. It shipped once already.
 */
describe('docs stylesheet', () => {
  it('imports Tailwind as important', async () => {
    const css = await readFile(join(repoRoot, 'docs/.vitepress/theme/tokens.css'), 'utf8')
    expect(
      css,
      "VitePress's unlayered reset wins without it; demos lose their backgrounds"
    ).toContain("@import 'tailwindcss' important;")
  })

  it('sources the component library and the markdown pages', async () => {
    const css = await readFile(join(repoRoot, 'docs/.vitepress/theme/tokens.css'), 'utf8')
    // Paths resolve relative to this file, so the markdown ones climb out of
    // `.vitepress/`. A non-existent `@source` is not an error, just no CSS.
    for (const source of ['../../../packages/ui/src', '../../components', '../../*.md']) {
      expect(css, `missing @source ${source}`).toContain(`@source '${source}'`)
    }
  })
})
