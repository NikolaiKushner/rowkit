#!/usr/bin/env node
/**
 * Capture docs homepage + money-shot stills for README / marketing.
 *
 * Usage:
 *   pnpm docs:dev          # in one terminal
 *   pnpm docs:shots        # in another
 *
 * Writes into docs/public/:
 *   home.png            — first viewport of the docs home
 *   datatable-page.png  — the live Users preview alone
 *   mark.png            — espresso mark at 128px (favicon / social)
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const outDir = resolve(process.cwd(), 'docs/public')
const baseUrl = process.argv.includes('--url')
  ? process.argv[process.argv.indexOf('--url') + 1]
  : 'http://127.0.0.1:5173'

async function waitForDocs(page, url) {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 4000 })
      if (res && res.ok()) return
    } catch {
      // not up yet
    }
    await page.waitForTimeout(500)
  }
  throw new Error(`Docs are not reachable at ${url}. Start them with \`pnpm docs:dev\` and retry.`)
}

async function main() {
  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  })

  await waitForDocs(page, baseUrl)

  // Force light — README embeds are read on a light GitHub page.
  await page.emulateMedia({ colorScheme: 'light' })
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await page.waitForTimeout(400)

  await page.waitForSelector('[data-rk-home]', { timeout: 15_000 })
  // Let fonts + table paint settle.
  await page.waitForTimeout(800)

  const homePath = resolve(outDir, 'home.png')
  await page.locator('[data-rk-home]').screenshot({ path: homePath, type: 'png' })
  console.log(homePath)

  const preview = page.locator('[data-rk-home-preview]')
  await preview.waitFor({ state: 'visible' })
  const previewPath = resolve(outDir, 'datatable-page.png')
  await preview.screenshot({ path: previewPath, type: 'png' })
  console.log(previewPath)

  // Rasterise the mark from the SVG for places that want PNG.
  const markSvg = readFileSync(resolve(outDir, 'mark.svg'), 'utf8')
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:transparent">${markSvg}</body></html>`,
    { waitUntil: 'domcontentloaded' },
  )
  await page.setViewportSize({ width: 128, height: 128 })
  const markPath = resolve(outDir, 'mark.png')
  await page.locator('svg').screenshot({ path: markPath, type: 'png', omitBackground: true })
  console.log(markPath)

  await browser.close()
  console.log(`\nWrote shots to ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
