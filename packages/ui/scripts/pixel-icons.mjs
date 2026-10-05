#!/usr/bin/env node
/**
 * Pixel icons from the Figma file.
 *
 * Figma exports a pixel-art icon one 1×1 square per pixel —
 * `M3 1H4V2H3V1Z` hundreds of times over. This turns each row of same-colour
 * pixels into one run (`M3 1h10v1h-10z`): the same pixels, a fraction of the
 * bytes. Every rewrite is checked by decoding both paths back to pixel sets
 * and refusing to write if they differ.
 *
 * Usage:
 *   node packages/ui/scripts/pixel-icons.mjs import <file.svg> <Name> "<description>" [--current-color]
 *     Writes src/icons/<Name>Icon.vue from a Figma export. `--current-color`
 *     draws black pixels in `currentColor`, for single-colour glyphs that must
 *     grey out with a disabled control.
 *   node packages/ui/scripts/pixel-icons.mjs optimize
 *     Rewrites the paths of every icon in src/icons in place.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const iconsDir = join(dirname(fileURLToPath(import.meta.url)), '../src/icons')

const NUMBER = String.raw`-?\d+(?:\.\d+)?`

/**
 * Decodes a path made only of axis-aligned integer rectangles into the set of
 * pixels it covers, as `"x,y"` keys. Understands Figma's absolute squares
 * (`M x y H x2 V y2 H x V y Z`) and this script's relative runs
 * (`M x y h w v h h-w z`). Returns `null` for any other path, which is then
 * left as it is.
 *
 * @param {string} d
 * @returns {Set<string> | null}
 */
export function pixelsOf(d) {
  const absolute = new RegExp(
    String.raw`^M(${NUMBER}) (${NUMBER})H(${NUMBER})V(${NUMBER})H(${NUMBER})V(${NUMBER})Z`
  )
  const relative = new RegExp(
    String.raw`^M(${NUMBER}) (${NUMBER})h(${NUMBER})v(${NUMBER})h-(${NUMBER})z`
  )
  const pixels = new Set()
  let rest = d.trim()
  while (rest.length > 0) {
    let x0, y0, x1, y1, match
    if ((match = absolute.exec(rest))) {
      const [, ax, ay, bx, by, cx, cy] = match.map(Number)
      if (cx !== ax || cy !== ay) return null
      ;[x0, y0, x1, y1] = [Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by)]
    } else if ((match = relative.exec(rest))) {
      const [, x, y, w, h, back] = match.map(Number)
      if (back !== w) return null
      ;[x0, y0, x1, y1] = [x, y, x + w, y + h]
    } else {
      return null
    }
    if (![x0, y0, x1, y1].every(Number.isInteger)) return null
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) pixels.add(`${x},${y}`)
    rest = rest.slice(match[0].length)
  }
  return pixels
}

/**
 * Encodes a pixel set as one run per row of adjacent pixels, top to bottom,
 * left to right — so the output is the same for the same pixels.
 *
 * @param {Set<string>} pixels
 * @returns {string}
 */
export function runsOf(pixels) {
  const rows = new Map()
  for (const key of pixels) {
    const [x, y] = key.split(',').map(Number)
    if (!rows.has(y)) rows.set(y, [])
    rows.get(y).push(x)
  }
  let d = ''
  for (const y of [...rows.keys()].sort((a, b) => a - b)) {
    const xs = rows.get(y).sort((a, b) => a - b)
    let start = xs[0]
    for (let i = 1; i <= xs.length; i++) {
      if (xs[i] === xs[i - 1] + 1) continue
      const width = xs[i - 1] - start + 1
      d += `M${start} ${y}h${width}v1h-${width}z`
      start = xs[i]
    }
  }
  return d
}

/** True when two pixel sets cover exactly the same pixels. */
function samePixels(a, b) {
  return a.size === b.size && [...a].every((key) => b.has(key))
}

/**
 * Rewrites every pixel path in a piece of markup as runs. Paths that are not
 * made of integer rectangles are left untouched.
 *
 * @param {string} markup
 * @returns {string}
 */
export function optimizeMarkup(markup) {
  return markup.replace(/ d="([^"]*)"/g, (whole, d) => {
    const pixels = pixelsOf(d)
    if (!pixels) return whole
    const runs = runsOf(pixels)
    const check = pixelsOf(runs)
    if (!check || !samePixels(pixels, check)) {
      throw new Error(`Refusing to rewrite a path whose pixels would change: ${d.slice(0, 60)}…`)
    }
    return ` d="${runs}"`
  })
}

/** Turns a Figma SVG export into the markup an icon component renders. */
function svgToTemplate(svg, currentColor) {
  let out = svg
    .replace(/ id="[^"]*"/g, '')
    .replace('<svg ', '<svg aria-hidden="true" focusable="false" ')
  if (currentColor) out = out.replaceAll('fill="black"', 'fill="currentColor"')
  return optimizeMarkup(out)
}

async function importIcon(file, name, description, currentColor) {
  const svg = await readFile(file, 'utf8')
  const size = /width="(\d+)"/.exec(svg)?.[1] ?? '16'
  const colourNote = currentColor
    ? 'Drawn in `currentColor`, so it greys out with a disabled control.'
    : 'Decorative: whatever it marks is said in words or ARIA elsewhere.'
  const body = svgToTemplate(svg, currentColor)
    .trim()
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')
  const component = `<script setup lang="ts">
/**
 * ${description} ${size}×${size}, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. ${colourNote}
 */
defineOptions({ name: 'Rk${name}Icon' })
</script>

<template>
${body}
</template>
`
  const target = join(iconsDir, `${name}Icon.vue`)
  await writeFile(target, component, 'utf8')
  console.log(`wrote ${target}`)
}

async function optimizeAll() {
  for (const entry of await readdir(iconsDir)) {
    if (!entry.endsWith('.vue')) continue
    const path = join(iconsDir, entry)
    const before = await readFile(path, 'utf8')
    const after = optimizeMarkup(before)
    if (after !== before) {
      await writeFile(path, after, 'utf8')
      console.log(`${entry}: ${before.length} → ${after.length} bytes`)
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [command, ...args] = process.argv.slice(2)
  if (command === 'optimize') {
    await optimizeAll()
  } else if (command === 'import' && args.length >= 3) {
    const [file, name, description] = args
    await importIcon(file, name, description, args.includes('--current-color'))
  } else {
    console.error(
      'Usage: pixel-icons.mjs optimize | import <file.svg> <Name> "<description>" [--current-color]'
    )
    process.exit(1)
  }
}
