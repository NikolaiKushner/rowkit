/**
 * Colour maths for the token tests.
 *
 * Test-only: this lives outside `src` so it never reaches the published bundle.
 * Implemented here rather than pulled from a colour library because the whole
 * point is to check our values independently — a dependency that shares a bug
 * with the generator would validate nothing.
 */

import { colorPrimitives } from '../src/color'
import { modernPalette } from '../src/themes/modern'

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

/** Parses `#rrggbb` or `#rrggbbaa` into eight-bit channels and an alpha from 0 to 1. */
export function parseHexAlpha(value: string): [number, number, number, number] {
  const match = /^#([0-9a-f]{6})([0-9a-f]{2})?$/.exec(value)
  if (!match) throw new Error(`not a #rrggbb or #rrggbbaa colour: ${value}`)
  const [r, g, b] = parseHex(`#${match[1] ?? ''}`)
  return [r, g, b, match[2] === undefined ? 1 : parseInt(match[2], 16) / 255]
}

/** The literal value of a primitive, from either palette, by its custom property name. */
function primitive(cssVar: string): string {
  const match = /^var\(--color-([a-z0-9-]+)\)$/.exec(cssVar)
  if (!match) throw new Error(`not a primitive colour reference: ${cssVar}`)
  const name = match[1] ?? ''
  const literal = name.startsWith('modern-')
    ? (modernPalette as Record<string, string>)[name.slice('modern-'.length)]
    : (colorPrimitives as Record<string, string>)[name]
  if (literal === undefined) throw new Error(`unknown primitive: --color-${name}`)
  return literal
}

/**
 * Resolves a semantic token's `var(--color-x)` reference to the linear-light
 * colour of the primitive it points at. A translucent primitive is laid over
 * `backdrop` first, the way it is painted.
 */
export function resolveColorRef(cssVar: string, backdrop?: string): LinearRgb {
  const [r, g, b, a] = parseHexAlpha(primitive(cssVar))
  if (a === 1) return [linear(r), linear(g), linear(b)]
  if (backdrop === undefined) throw new Error(`${cssVar} is translucent and needs a backdrop`)
  const [br, bg, bb] = parseHexAlpha(primitive(backdrop))
  const over = (top: number, under: number) => Math.round(top * a + under * (1 - a))
  return [linear(over(r, br)), linear(over(g, bg)), linear(over(b, bb))]
}

/**
 * Contrast between two semantic tokens, each given as a `var()` reference.
 * Translucent colours are laid over `backdrop`, or over the opaque background
 * when only the foreground is translucent.
 */
export function semanticContrast(
  foreground: string,
  background: string,
  backdrop?: string
): number {
  const bg = resolveColorRef(background, backdrop)
  const fg = resolveColorRef(
    foreground,
    parseHexAlpha(primitive(background))[3] === 1 ? background : backdrop
  )
  return contrastRatio(fg, bg)
}
