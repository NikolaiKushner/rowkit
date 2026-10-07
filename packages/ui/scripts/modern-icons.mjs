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
 * Each glyph lives in a variable declared on `[data-theme="modern"]`, so it
 * applies only inside that theme and a Windows 98 region nested in it keeps
 * its pixels. Nothing here costs a Windows 98 page anything but this file.
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
  info: ['info', 'info-32', 'question'],
  success: ['success'],
  folder: ['folder', 'folder-32', 'folder-empty-32', 'folder-open'],
}
const TONE_COLOR = {
  danger: 'var(--color-danger-solid)',
  warning: 'var(--color-warning-solid)',
  info: 'var(--color-primary-solid)',
  success: 'var(--color-success-solid)',
  folder: 'var(--color-primary-solid)',
}

/**
 * Stroke width in the glyph's own 24-unit grid. Glyphs inside small controls
 * are drawn heavier so they survive being shown at 8–10px.
 */
function strokeWidth(name) {
  if (name.endsWith('-glyph') || name.startsWith('triangle-')) return 3
  if (name.endsWith('-32')) return 1.5
  return 1.75
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
    .replace(/stroke-width="[^"]*"/, `stroke-width="${strokeWidth(name)}"`)
  glyphs.push([name, dataUri(svg)])
}

const toneOf = (name) => Object.keys(TONES).find((tone) => TONES[tone].includes(name))

const css = `/*
 * The modern theme's icons.
 *
 * GENERATED FILE — DO NOT EDIT.
 * Source: packages/ui/src/icons/modern/*.svg (Lucide, ISC — see LICENSE there)
 * Regenerate with: pnpm icons:modern
 */

/*
 * Every rowkit icon is an <svg data-icon>. A theme that draws its own icons
 * hides the pixels (--rk-icon-pixels: none), fills the box (--rk-icon-fill)
 * and masks it with the glyph below. In Windows 98 the fill is transparent and
 * the pixels show, so these rules draw nothing there.
 */
svg[data-icon] {
  background-color: var(--rk-icon-fill);
  -webkit-mask: no-repeat center / contain;
  mask: no-repeat center / contain;
}

svg[data-icon] > * {
  display: var(--rk-icon-pixels);
}

[data-theme='modern'] {
${glyphs.map(([name, uri]) => `  --rk-icon-${name}: ${uri};`).join('\n')}
${Object.entries(TONE_COLOR)
  .map(([tone, color]) => `  --rk-icon-tone-${tone}: ${color};`)
  .join('\n')}
}

/* Status colours belong to the modern glyphs; a Windows 98 region drops them. */
[data-theme='win98'] {
${Object.keys(TONE_COLOR)
  .map((tone) => `  --rk-icon-tone-${tone}: initial;`)
  .join('\n')}
}

${names
  .map((name) => {
    const tone = toneOf(name)
    const fill = tone
      ? `\n  background-color: var(--rk-icon-tone-${tone}, var(--rk-icon-fill));`
      : ''
    return `svg[data-icon='${name}'] {\n  -webkit-mask-image: var(--rk-icon-${name});\n  mask-image: var(--rk-icon-${name});${fill}\n}`
  })
  .join('\n\n')}
`

await writeFile(target, css, 'utf8')
console.log(`${names.length} glyphs → ${target}`)
