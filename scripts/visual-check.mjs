#!/usr/bin/env node
/**
 * Screenshot Storybook stories for agent visual QA.
 *
 * Usage:
 *   pnpm visual:check              # default matrix, light + dark
 *   pnpm visual:check Button       # only stories whose id contains "button"
 *   pnpm visual:check --url http://127.0.0.1:6006
 *
 * Expects Storybook already running (`pnpm storybook`). Writes PNGs under
 * `.visual-check/` — gitignored. Agents must Read those images before claiming
 * a UI change is done.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'

const outDir = resolve(process.cwd(), '.visual-check')

/** Default stories that cover the visual surface without interaction noise. */
const DEFAULT_STORIES = [
  'foundations-button--variants',
  'foundations-button--sizes',
  'foundations-badge--matrix',
  'foundations-input--states',
  'foundations-field--with-error',
  'foundations-select--states',
  'data-datatable--default',
  'data-datatable--empty',
  'data-datatable--loading',
  'data-pagination--default',
  'data-filterbar--with-controls',
  'data-emptystate--reasons',
  'data-skeleton--variants',
  'overlay-dialog--default',
  'overlay-toaster--variants',
  'overlay-tooltip--placements',
]

function parseArgs(argv) {
  let url = 'http://127.0.0.1:6006'
  const filters = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--url') {
      url = argv[++i] ?? url
    } else if (!arg.startsWith('-')) {
      filters.push(arg.toLowerCase())
    }
  }
  return { url, filters }
}

function pickStories(filters) {
  if (filters.length === 0) return DEFAULT_STORIES
  return DEFAULT_STORIES.filter((id) => filters.some((f) => id.includes(f)))
}

async function waitForStorybook(page, url) {
  const deadline = Date.now() + 15_000
  while (Date.now() < deadline) {
    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 3000 })
      if (res && res.ok()) return
    } catch {
      // Storybook not up yet
    }
    await page.waitForTimeout(500)
  }
  throw new Error(
    `Storybook is not reachable at ${url}. Start it with \`pnpm storybook\` and retry.`,
  )
}

async function shot(page, baseUrl, storyId, theme) {
  const url = `${baseUrl}/iframe.html?id=${storyId}&globals=theme:${theme}&viewMode=story`
  await page.goto(url, { waitUntil: 'networkidle' })
  // Let fonts / Reka portals settle.
  await page.waitForTimeout(200)
  const file = resolve(outDir, `${storyId}__${theme}.png`)
  await page.screenshot({ path: file, fullPage: true })
  return file
}

async function main() {
  const { url, filters } = parseArgs(process.argv.slice(2))
  const stories = pickStories(filters)
  if (stories.length === 0) {
    console.error(`No default stories matched filter: ${filters.join(', ')}`)
    process.exit(1)
  }

  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } })

  try {
    await waitForStorybook(page, url)
    const written = []
    for (const id of stories) {
      for (const theme of ['light', 'dark']) {
        const file = await shot(page, url, id, theme)
        written.push(file)
        console.log(file)
      }
    }
    await writeFile(
      resolve(outDir, 'manifest.json'),
      JSON.stringify({ url, stories, themes: ['light', 'dark'], files: written }, null, 2),
    )
    console.error(`\nWrote ${written.length} screenshots to ${outDir}`)
    console.error('Open the PNGs (Read tool) and inspect before claiming UI work is done.')
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
