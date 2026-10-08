#!/usr/bin/env node
/**
 * The modern theme's icons, as CSS.
 *
 * rowkit's icons are Windows 98 pixel art, drawn inline. A theme with its own
 * icon set does not replace those components: it hides their pixels, fills
 * their box with a colour and masks the box with its own glyph. This writes
 * the glyphs — `src/icons/modern/<icon>.svg`, one per pixel icon, named by the
 * icon's `data-icon` — into `src/styles/modern-icons.css` as data URIs.
 *
 * Each glyph lives in a variable on `:root`. It draws only where a theme turns
 * the glyphs on — hides the pixels (`--rk-icon-pixels`) and gives the glyph a
 * fill (`--rk-icon-fill`, `--rk-icon-tone-*`) — so the modern theme, and any
 * theme built on it, gets them, and Windows 98 draws its pixels as before.
 *
 * Usage: node packages/ui/scripts/modern-icons.mjs
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = join(root, 'src/icons/modern')
const target = join(root, 'src/styles/modern-icons.css')

/**
 * Status icons keep their colour in the modern theme, as they do in Windows 98.
 * Everything else is drawn in the text colour around it.
 */
const TONES = {
  danger: ['error', 'error-32'],
  warning: ['warning', 'warning-32'],
  info: ['info', 'info-32'],
  success: ['success'],
  folder: ['folder', 'folder-32', 'folder-empty-32', 'folder-open'],
}

/** An SVG as a compact, quoted data URI. */
function dataUri(svg) {
  const compact = svg
    .replace(/\s*\n\s*/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()
  const escaped = compact
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
  return `url("data:image/svg+xml,${escaped}")`
}

const names = (await readdir(sourceDir))
  .filter((file) => file.endsWith('.svg'))
  .map((file) => file.slice(0, -'.svg'.length))
  .sort()

const glyphs = []
for (const name of names) {
  const svg = (await readFile(join(sourceDir, `${name}.svg`), 'utf8'))
    // A mask reads alpha, not colour; black is opaque everywhere it draws.
    .replace(/currentColor/g, 'black')
  glyphs.push([name, dataUri(svg)])
}

const toneOf = (name) => Object.keys(TONES).find((tone) => TONES[tone].includes(name))

const css = `/*
 * The modern theme's icons.
 *
 * GENERATED FILE — DO NOT EDIT.
 * Source: packages/ui/src/icons/modern/*.svg (the Figma file's Icons page)
 * Regenerate with: pnpm icons:modern
 */

/*
 * Every rowkit icon is an <svg data-icon>. A theme that draws its own icons
 * hides the pixels (--rk-icon-pixels: none), fills the box (--rk-icon-fill)
 * and masks it with the glyph below. In Windows 98 the fill is transparent and
 * --rk-icon-glyphs turns the masks off altogether, so these rules change
 * nothing there.
 */
svg[data-icon] {
  background-color: var(--rk-icon-fill);
  -webkit-mask: no-repeat center / contain;
  mask: no-repeat center / contain;
}

svg[data-icon] > * {
  display: var(--rk-icon-pixels);
}

/*
 * The glyphs. Inert until a theme gives them a fill: Windows 98's is
 * transparent, so its pixel icons show and these draw nothing.
 */
:root {
${glyphs.map(([name, uri]) => `  --rk-icon-${name}: ${uri};`).join('\n')}
}

${names
  .map((name) => {
    const tone = toneOf(name)
    const fill = tone ? `\n  background-color: var(--rk-icon-tone-${tone});` : ''
    // --rk-icon-glyphs is empty where a theme draws glyphs and `initial`
    // elsewhere, which makes this whole declaration invalid: no mask at all.
    const layers = `var(--rk-icon-glyphs) var(--rk-icon-${name})`
    return `svg[data-icon='${name}'] {\n  -webkit-mask-image: ${layers};\n  mask-image: ${layers};${fill}\n}`
  })
  .join('\n\n')}
`

await writeFile(target, css, 'utf8')
console.log(`${names.length} glyphs → ${target}`)
