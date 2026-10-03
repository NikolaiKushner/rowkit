import { readFile, readdir, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { repoRoot } from '../scripts/component-api.mjs'

/**
 * AGENTS.md rule 11: rowkit's code and docs do not name its main competitor.
 *
 * Design choices are explained on their own terms. The competitor is named in
 * AGENTS.md (for agents, as a reference to learn from), in changesets and
 * changelogs (history), and in THIRD_PARTY_NOTICES.md (the license notice for
 * code adapted from it) — nowhere else.
 *
 * The name is assembled at runtime so this file does not trip its own check.
 */
const NAME = new RegExp(['re', 'ka'].join(''), 'i')

const SCANNED = [
  'packages/ui/src',
  'packages/tokens/src',
  'docs',
  'playground/app',
  'scripts',
  '.storybook',
  'packages/ui/scripts',
  'packages/tokens/scripts',
  'README.md',
  'ROADMAP.md',
  'packages/ui/README.md',
  'packages/tokens/README.md',
]
const SKIPPED_DIRS = new Set(['node_modules', 'dist', 'cache', '.vitepress/dist', 'public'])
const EXTENSIONS = /\.(ts|mts|mjs|js|vue|md|css|html|json)$/

async function* files(path: string): AsyncGenerator<string> {
  if ((await stat(path)).isFile()) {
    yield path
    return
  }
  yield* walk(path)
}

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.has(entry.name)) yield* walk(path)
    } else if (EXTENSIONS.test(entry.name)) {
      yield path
    }
  }
}

describe('no competitor names in code or docs', () => {
  it('finds none outside AGENTS.md, changesets and third-party notices', async () => {
    const offenders: string[] = []
    for (const dir of SCANNED) {
      for await (const file of files(join(repoRoot, dir))) {
        const lines = (await readFile(file, 'utf8')).split('\n')
        lines.forEach((line, index) => {
          if (NAME.test(line)) offenders.push(`${relative(repoRoot, file)}:${String(index + 1)}`)
        })
      }
    }
    expect(offenders).toEqual([])
  })
})
