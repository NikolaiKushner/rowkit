import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * Every component root is addressable by role, not by its class string.
 *
 * shadcn and the other current libraries mark each part with `data-slot`.
 * The root slot is the component's kebab name. A new component that skips it
 * fails here, which is how the convention in `docs/conventions.md` stays true.
 */

const componentsDir = resolve(dirname(fileURLToPath(import.meta.url)), 'components')

function kebab(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

describe('component roots carry data-slot', () => {
  it('names the root slot after the component', async () => {
    const entries = await readdir(componentsDir, { withFileTypes: true })
    const missing: string[] = []

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const file = join(componentsDir, entry.name, `${entry.name}.vue`)
      const content = await readFile(file, 'utf8')
      const slot = kebab(entry.name)
      if (!content.includes(`data-slot="${slot}"`)) missing.push(`${entry.name} (expected ${slot})`)
    }

    expect(missing).toEqual([])
  })
})
