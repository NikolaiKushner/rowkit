import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { repoRoot } from '../scripts/component-api.mjs'

/**
 * Published documentation may not hardcode rowkit's own version number.
 *
 * The site said `v0.1.0` for a day after `0.1.1` went out. Nothing failed,
 * because a version typed into prose has nothing to disagree with — the same
 * silent-drift shape as the props tables and `AGENTS.md`, which is why those
 * are generated and gated rather than written by hand.
 *
 * `<NpmVersion />` renders it from the package instead. This test is what keeps
 * a future edit from quietly typing the literal back in.
 *
 * `phases/` is excluded when present: dated planning records are not product
 * docs, and version numbers written there stay historically true. `srcExclude`
 * keeps them off the site entirely.
 */

const docsDir = join(repoRoot, 'docs')

/** Every markdown page VitePress actually publishes. */
async function publishedPages(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        // `srcExclude: ['phases/**']`, plus VitePress's own build output.
        if (entry.name === 'phases' || entry.name === '.vitepress' || entry.name === 'public') {
          return []
        }
        return publishedPages(full)
      }
      return entry.name.endsWith('.md') ? [full] : []
    })
  )
  return files.flat()
}

describe('published docs', () => {
  it('never hardcodes a rowkit version', async () => {
    const pages = await publishedPages(docsDir)
    expect(pages.length, 'no pages found — the walk is looking in the wrong place').toBeGreaterThan(
      5
    )

    /*
     * Two shapes, both narrow on purpose. A bare `\d+\.\d+\.\d+` would flag the
     * WCAG criteria the accessibility sections cite by number (1.4.13, 2.2.1)
     * and the pinned `^6.0.3` in the TypeScript decision record.
     */
    const patterns = [
      { re: /v\d+\.\d+\.\d+/g, what: 'a `vX.Y.Z` literal' },
      { re: /@?rowkit(?:\/tokens)?@\d+\.\d+\.\d+/g, what: 'a pinned `rowkit@X.Y.Z`' },
    ]

    const offences: string[] = []
    for (const page of pages) {
      const text = await readFile(page, 'utf8')
      for (const { re, what } of patterns) {
        for (const match of text.matchAll(re)) {
          offences.push(`${relative(repoRoot, page)}: ${what} — "${match[0]}"`)
        }
      }
    }

    expect(offences, 'use `<NpmVersion />`, which reads the version from the package').toEqual([])
  })
})
