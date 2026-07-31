import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { agentsPath, buildAgentsFiles, docsPath } from '../scripts/generate-agents.mjs'

/**
 * `AGENTS.md` is generated, and this is what keeps that true.
 *
 * It ships inside the npm package, which raises the stakes: a stale copy on
 * disk at `node_modules/rowkit/AGENTS.md` is worse than no copy, because an
 * agent will believe it and write code against props that no longer exist.
 */

const files = await buildAgentsFiles()

describe('generated AGENTS.md', () => {
  it.each([
    ['packages/ui/AGENTS.md', agentsPath],
    ['docs/agents.md', docsPath],
  ])('%s is up to date', async (_name, path) => {
    const committed = await readFile(path, 'utf8')
    expect(files.get(path), 'run `pnpm docs:agents` and commit the result').toBe(committed)
  })

  it('covers every component', async () => {
    const body = await readFile(agentsPath, 'utf8')
    for (const component of [
      'Badge',
      'Button',
      'DataTable',
      'Dialog',
      'EmptyState',
      'Field',
      'FilterBar',
      'Input',
      'Select',
      'Skeleton',
      'TablePagination',
      'Toaster',
      'Tooltip',
    ]) {
      expect(body, `${component} is missing`).toContain(`### ${component}`)
    }
  })

  it('carries the setup step people miss', async () => {
    // The failure this file most needs to prevent: rowkit installed, no
    // `rowkit/styles` import, every component rendering unstyled with nothing
    // in the console.
    const body = await readFile(agentsPath, 'utf8')
    expect(body).toContain("@import 'rowkit/styles';")
  })

  it('documents events, models and slots, not only props', async () => {
    const body = await readFile(agentsPath, 'utf8')
    expect(body).toContain('`v-model:sort`')
    expect(body).toContain('`@row:click`')
    // The per-column slot lives in a mapped type beside the literal one, and
    // reading only the literal half silently drops it.
    expect(body).toContain('`#cell:<key>`')
  })

  it('ships in the package', async () => {
    // Derived from `agentsPath` rather than `import.meta.url`: under Vitest the
    // latter is an http URL, not a file one.
    const manifest = JSON.parse(
      await readFile(agentsPath.replace(/AGENTS\.md$/, 'package.json'), 'utf8')
    ) as { files?: string[] }
    expect(manifest.files, 'AGENTS.md must be published, not just committed').toContain('AGENTS.md')
  })
})
