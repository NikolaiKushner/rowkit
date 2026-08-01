import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { repoRoot } from '../scripts/component-api.mjs'

/**
 * The docs stylesheet has to keep winning against VitePress's own reset.
 *
 * VitePress's default theme ships an unlayered reset — `button, input, …
 * { border: 0; padding: 0 }` and `button { background-color: transparent }` —
 * and unlayered CSS beats anything in `@layer utilities` regardless of order or
 * specificity. Left alone, every button and input in a live demo renders with no
 * background, no padding and no border, while the properties the reset does not
 * name come through normally.
 *
 * That is the failure mode this project keeps meeting: correct classes, correct
 * stylesheet, no error anywhere, wrong pixels. It shipped once already.
 */
describe('docs stylesheet', () => {
  it("restores demo controls from under VitePress's reset", async () => {
    const css = await readFile(join(repoRoot, 'docs/.vitepress/theme/tokens.css'), 'utf8')
    expect(
      css,
      'without this every button and input in a demo loses its background, padding and border'
    ).toMatch(/\.rk-demo :is\(button, input[^)]*\)\s*\{\s*all: revert-layer/)
  })

  it('does not reach for `important` mode', async () => {
    /*
     * The blunt fix for the same problem, and it backfires: every utility
     * becomes important, Tailwind's own `container` utility then collides with
     * the class VitePress uses for its layout, and because layer order is
     * reversed for important declarations a layered `!important` beats an
     * unlayered one — so the collision cannot be overridden.
     */
    const css = await readFile(join(repoRoot, 'docs/.vitepress/theme/tokens.css'), 'utf8')
    // Anchored to a line start: the comment above explains why not to do this,
    // and matching prose would fail the assertion on its own explanation.
    expect(css).not.toMatch(/^@import 'tailwindcss' important/m)
  })

  it("keeps a demo's sticky header below VitePress's chrome", async () => {
    /*
     * `--z-index-sticky` is 100 because rowkit's scale assumes rowkit is the
     * page's chrome; here it is the guest, and a sticky table header at 100
     * scrolled over the navbar, which sits at 30.
     *
     * Lower the header inside demos rather than raising VitePress's variables.
     * Raising them looked right and broke the site title on every page with a
     * sidebar: VitePress mixes those variables with hardcoded z-index values, so
     * scaling the variables flipped relationships elsewhere and the sidebar's
     * `.curtain` painted over the title.
     */
    const css = await readFile(join(repoRoot, 'docs/.vitepress/theme/tokens.css'), 'utf8')
    expect(css).toMatch(/\.rk-demo thead tr\s*\{[^}]*z-index:\s*1/)
    expect(css, "do not rewrite the host theme's stacking scale").not.toMatch(/--vp-z-index-\w+:/)
  })

  it('aligns home markdown with the hero', async () => {
    const css = await readFile(join(repoRoot, 'docs/.vitepress/theme/tokens.css'), 'utf8')
    expect(css).toMatch(/\.VPHome \.vp-doc\.container\s*\{[^}]*box-sizing: content-box/)
  })

  it('keeps demo tables as tables', async () => {
    /*
     * VitePress sets `.vp-doc table { display: block }` so long markdown tables
     * scroll. A block-level table's inner grid is shrink-to-fit, so `width:
     * 100%` sizes the block and leaves the cells short — and the table reports
     * full width to `getBoundingClientRect`, which is how this survived a
     * measurement pass while rendering with 619px of dead space beside it.
     */
    const css = await readFile(join(repoRoot, 'docs/.vitepress/theme/tokens.css'), 'utf8')
    expect(css).toMatch(/\.rk-demo table\s*\{[^}]*display:\s*table/)
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
