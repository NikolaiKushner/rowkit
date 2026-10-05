/**
 * Colour maths for the token tests.
 *
 * Test-only: this lives outside `src` so it never reaches the published bundle.
 * Implemented here rather than pulled from a colour library because the whole
 * point is to check our values independently — a dependency that shares a bug
 * with the generator would validate nothing.
 */

import { colorPrimitives } from '../src/color'

/** Linear-light sRGB. */
export type LinearRgb = readonly [number, number, number]

const HEX = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/

/** Parses a six-digit lowercase `#rrggbb` into eight-bit channels. */
export function parseHex(value: string): [number, number, number] {
  const match = HEX.exec(value)
  if (!match) throw new Error(`not a #rrggbb colour: ${value}`)
  const [, r = '', g = '', b = ''] = match
  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
}

/** Decodes one sRGB channel (0–255) to linear light. */
function linear(channel: number): number {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG relative luminance. */
export function relativeLuminance([r, g, b]: LinearRgb): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.x contrast ratio between two colours, from 1 to 21. */
export function contrastRatio(a: LinearRgb, b: LinearRgb): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ]
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Resolves a semantic token's `var(--color-x)` reference to the linear-light
 * colour of the primitive it points at.
 */
export function resolveColorRef(cssVar: string): LinearRgb {
  const match = /^var\(--color-([a-z0-9-]+)\)$/.exec(cssVar)
  if (!match) throw new Error(`not a primitive colour reference: ${cssVar}`)
  const name = match[1] as keyof typeof colorPrimitives
  const literal = colorPrimitives[name] as string | undefined
  if (literal === undefined) throw new Error(`unknown primitive: --color-${String(name)}`)
  const [r, g, b] = parseHex(literal)
  return [linear(r), linear(g), linear(b)]
}

/** Contrast between two semantic tokens, each given as a `var()` reference. */
export function semanticContrast(foreground: string, background: string): number {
  return contrastRatio(resolveColorRef(foreground), resolveColorRef(background))
}
