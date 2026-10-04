import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { optimizeMarkup, pixelsOf, runsOf } from '../../scripts/pixel-icons.mjs'

const iconsDir = dirname(fileURLToPath(import.meta.url))

describe('pixel runs', () => {
  // Figma's export: one square per pixel. Two runs, a gap between them.
  const figma = 'M1 2H2V3H1V2ZM2 2H3V3H2V2ZM5 2H6V3H5V2ZM3 4H4V5H3V4Z'

  it('decodes Figma squares to pixels', () => {
    expect(pixelsOf(figma)).toEqual(new Set(['1,2', '2,2', '5,2', '3,4']))
  })

  it('merges a row of adjacent pixels into one run and keeps gaps', () => {
    const runs = runsOf(pixelsOf(figma) ?? new Set())
    expect(runs).toBe('M1 2h2v1h-2zM5 2h1v1h-1zM3 4h1v1h-1z')
    expect(pixelsOf(runs)).toEqual(pixelsOf(figma))
  })

  it('leaves a path that is not pixels alone', () => {
    const curve = '<path d="M0 0C1 1 2 2 3 3Z"/>'
    expect(optimizeMarkup(curve)).toBe(curve)
  })
})

describe('the shipped icons', async () => {
  const files = (await readdir(iconsDir)).filter((name) => name.endsWith('.vue'))

  it.each(files)('%s is already stored as runs', async (file) => {
    // Run `node packages/ui/scripts/pixel-icons.mjs optimize` after adding one.
    const source = await readFile(join(iconsDir, file), 'utf8')
    expect(optimizeMarkup(source)).toBe(source)
  })

  it.each(files)('%s is hidden from assistive technology', async (file) => {
    const source = await readFile(join(iconsDir, file), 'utf8')
    expect(source).toContain('aria-hidden="true"')
  })
})
