/**
 * Colour maths for the token tests.
 *
 * Test-only: this lives outside `src` so it never reaches the published bundle.
 * Implemented here rather than pulled from a colour library because the whole
 * point is to check our values independently — a dependency that shares a bug
 * with the generator would validate nothing.
 */

import { colorPrimitives } from '../src/color'

/** Linear-light sRGB, unclamped so out-of-gamut colours stay detectable. */
export type LinearRgb = readonly [number, number, number]

const OKLCH = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/

/** Parses an `oklch(L C H)` string. Throws on anything else, by design. */
export function parseOklch(value: string): { l: number; c: number; h: number } {
  const match = OKLCH.exec(value)
  if (!match) throw new Error(`not a plain oklch() value: ${value}`)
  return { l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) }
}

/** Converts OKLCH to linear-light sRGB. */
export function oklchToLinearRgb(l: number, c: number, hDeg: number): LinearRgb {
  const h = (hDeg * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)
  const lCone = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const mCone = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const sCone = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * lCone - 3.3077115913 * mCone + 0.2309699292 * sCone,
    -1.2684380046 * lCone + 2.6097574011 * mCone - 0.3413193965 * sCone,
    -0.0041960863 * lCone - 0.7034186147 * mCone + 1.707614701 * sCone,
  ]
}

/** True when every channel lands inside sRGB, within floating-point slop. */
export function isInSrgbGamut(rgb: LinearRgb): boolean {
  return rgb.every((channel) => channel >= -0.0001 && channel <= 1.0001)
}

/** WCAG relative luminance. */
export function relativeLuminance(rgb: LinearRgb): number {
  const [r, g, b] = rgb.map((channel) => Math.min(1, Math.max(0, channel))) as unknown as LinearRgb
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
 * Resolves a semantic token's `var(--color-x)` reference to the literal colour
 * of the primitive it points at.
 */
export function resolveColorRef(cssVar: string): LinearRgb {
  const match = /^var\(--color-([a-z0-9-]+)\)$/.exec(cssVar)
  if (!match) throw new Error(`not a primitive colour reference: ${cssVar}`)
  const name = match[1] as keyof typeof colorPrimitives
  const literal = colorPrimitives[name]
  if (literal === undefined) throw new Error(`unknown primitive: --color-${String(name)}`)
  const { l, c, h } = parseOklch(literal)
  return oklchToLinearRgb(l, c, h)
}

/** Contrast between two semantic tokens, each given as a `var()` reference. */
export function semanticContrast(foreground: string, background: string): number {
  return contrastRatio(resolveColorRef(foreground), resolveColorRef(background))
}
