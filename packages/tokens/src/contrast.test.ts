import { describe, expect, it } from 'vitest'
import { semanticColor, type SemanticColorName } from './color'
import { semanticContrast } from '../test/oklch'

/**
 * Contrast is a build gate, not a design intention.
 *
 * Every pairing rowkit's components are allowed to produce is asserted here, so
 * a palette tweak that breaks accessibility fails `pnpm test` rather than
 * surfacing in an audit months later.
 */

/** [description, foreground token, background token, minimum ratio] */
type Pairing = readonly [string, SemanticColorName, SemanticColorName, number]

/** WCAG 1.4.3 — normal-size body text. */
const AA_TEXT = 4.5
/** WCAG 1.4.11 — boundaries of interactive components. */
const AA_NON_TEXT = 3

const pairings: readonly Pairing[] = [
  ['body text on the page', 'foreground', 'background', AA_TEXT],
  ['body text on a surface', 'foreground', 'card', AA_TEXT],
  ['body text on a recessed surface', 'foreground', 'muted', AA_TEXT],
  ['body text on a hovered row', 'foreground', 'accent', AA_TEXT],
  ['body text on an active row', 'foreground', 'surface-active', AA_TEXT],
  ['body text on a selected row', 'foreground', 'surface-selected', AA_TEXT],
  ['muted text on the page', 'muted-foreground', 'background', AA_TEXT],
  ['muted text on a surface', 'muted-foreground', 'card', AA_TEXT],
  // A table header is muted text on a recessed surface, which is the one
  // muted pairing this list originally missed.
  ['muted text on a recessed surface', 'muted-foreground', 'muted', AA_TEXT],
  ['muted text on a selected row', 'muted-foreground', 'surface-selected', AA_TEXT],

  ['label on a neutral button', 'neutral-on-solid', 'neutral-solid', AA_TEXT],
  ['label on a primary button', 'primary-on-solid', 'primary-solid', AA_TEXT],
  ['label on a success button', 'success-on-solid', 'success-solid', AA_TEXT],
  ['label on a warning button', 'warning-on-solid', 'warning-solid', AA_TEXT],
  ['label on a danger button', 'danger-on-solid', 'danger-solid', AA_TEXT],

  // Hover keeps the same label colour, so the hovered fill has to clear the
  // bar too. Amber is the one that nearly slipped: darkening on hover would
  // have dropped its dark label to 3.27:1.
  ['label on a hovered neutral button', 'neutral-on-solid', 'neutral-solid-hover', AA_TEXT],
  ['label on a hovered primary button', 'primary-on-solid', 'primary-solid-hover', AA_TEXT],
  ['label on a hovered success button', 'success-on-solid', 'success-solid-hover', AA_TEXT],
  ['label on a hovered warning button', 'warning-on-solid', 'warning-solid-hover', AA_TEXT],
  ['label on a hovered danger button', 'danger-on-solid', 'danger-solid-hover', AA_TEXT],

  ['text in a neutral badge', 'neutral-on-subtle', 'neutral-subtle', AA_TEXT],
  ['text in a primary badge', 'primary-on-subtle', 'primary-subtle', AA_TEXT],
  ['text in a success badge', 'success-on-subtle', 'success-subtle', AA_TEXT],
  ['text in a warning badge', 'warning-on-subtle', 'warning-subtle', AA_TEXT],
  ['text in a danger badge', 'danger-on-subtle', 'danger-subtle', AA_TEXT],
]

describe('contrast', () => {
  it.each(pairings)('%s meets %s on %s at >= %d:1', (_label, fg, bg, min) => {
    const ratio = semanticContrast(semanticColor[fg], semanticColor[bg])
    expect(ratio, `got ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min)
  })
})

describe('resting control border', () => {
  it('keeps the light resting control border decorative (under 3:1)', () => {
    const onCard = semanticContrast(semanticColor.input, semanticColor.card)
    const onPage = semanticContrast(semanticColor.input, semanticColor.background)
    expect(onCard).toBeLessThan(AA_NON_TEXT)
    expect(onPage).toBeLessThan(AA_NON_TEXT)
    expect(onCard).toBeGreaterThan(1.2)
  })
})

/**
 * Soft focus — structure without severity.
 *
 * The ring matches the reference / shadcn silver (`gray-708`), under 3:1 as a
 * solid. The cue users see is `border-ring` plus a translucent outer ring, not
 * an ink (or neon) halo.
 */
describe('focus ring stays soft', () => {
  it('light mode ring is soft silver against the page', () => {
    const ratio = semanticContrast(semanticColor.ring, semanticColor.background)
    expect(ratio, `got ${ratio.toFixed(2)}:1`).toBeGreaterThan(2)
    expect(ratio, `got ${ratio.toFixed(2)}:1 — too dark for the soft focus recipe`).toBeLessThan(
      AA_NON_TEXT
    )
  })

  it('light mode ring stays under 3:1 on card and muted', () => {
    for (const surface of ['card', 'muted'] as const) {
      const ratio = semanticContrast(semanticColor.ring, semanticColor[surface])
      expect(ratio, `${surface}: ${ratio.toFixed(2)}:1`).toBeLessThan(AA_NON_TEXT)
      expect(ratio, `${surface}: ${ratio.toFixed(2)}:1`).toBeGreaterThan(1.8)
    }
  })
})

describe('solid fills are distinguishable from the page behind them', () => {
  // A button whose label is legible but whose body blends into the page is
  // still broken.
  //
  // `neutral` is deliberately absent. It now carries the reference `--secondary` —
  // a near-white fill on a white page, 1.09:1 — and the reference design is right that this
  // needs no fill contrast, because nothing interactive uses it: Tooltip moved
  // to `primary-solid`, leaving Badge, which is static text. WCAG 1.4.11 governs
  // the boundary of a *user interface component*; a badge is not one, and the
  // contrast that carries its meaning is its label, asserted above.
  //
  // If a future component uses `neutral-solid` as an interactive fill, this
  // exclusion stops being true — put it back and retune the token.
  const families = ['primary', 'success', 'warning', 'danger'] as const

  it('against the background', () => {
    for (const family of families) {
      const ratio = semanticContrast(semanticColor[`${family}-solid`], semanticColor.background)
      expect(ratio, `${family}-solid vs background: ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
        AA_NON_TEXT
      )
    }
  })
})
