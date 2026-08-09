import { describe, expect, it } from 'vitest'
import { semanticColorDark, semanticColorLight, type SemanticColorName } from './color'
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

describe.each([
  ['light', semanticColorLight],
  ['dark', semanticColorDark],
] as const)('%s mode contrast', (_mode, theme) => {
  it.each(pairings)('%s meets %s on %s at >= %d:1', (_label, fg, bg, min) => {
    const ratio = semanticContrast(theme[fg], theme[bg])
    expect(ratio, `got ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min)
  })
})

describe('translucent tokens are measured as they render', () => {
  /*
   * Dark mode's borders are white at 8% (hairline) and 15% (controls). Measuring
   * the source colour instead of the composite would score them as pure white —
   * around 15:1 against the page — and every threshold above would pass for a
   * border nobody can see. The pass/fail assertions cannot catch that on their
   * own, because the wrong answer is comfortably over the bar too.
   *
   * So the composite is pinned by value. If `semanticContrast` ever stops
   * compositing, these fail; a ratio near 15 is the signature of that bug.
   */
  it('composites the 15% control border over the surface behind it', () => {
    // Dark-mode `input` still clears 3:1 when composited — light mode's
    // resting edge is the quiet one; dark keeps a visible control boundary.
    expect(semanticContrast(semanticColorDark.input, semanticColorDark.card)).toBeCloseTo(3.54, 1)
    expect(semanticContrast(semanticColorDark.input, semanticColorDark.background)).toBeCloseTo(
      3.82,
      1
    )
  })

  it('composites the 8% hairline, which is decorative and stays under 3:1', () => {
    const ratio = semanticContrast(semanticColorDark.border, semanticColorDark.card)
    expect(ratio).toBeLessThan(AA_NON_TEXT)
    expect(ratio).toBeGreaterThan(1.5)
  })

  it('keeps the light resting control border decorative (under 3:1)', () => {
    const onCard = semanticContrast(semanticColorLight.input, semanticColorLight.card)
    const onPage = semanticContrast(semanticColorLight.input, semanticColorLight.background)
    expect(onCard).toBeLessThan(AA_NON_TEXT)
    expect(onPage).toBeLessThan(AA_NON_TEXT)
    expect(onCard).toBeGreaterThan(1.2)
  })
})

/**
 * Soft focus — structure without severity.
 *
 * Light mode matches the reference / shadcn silver (`gray-708`), under 3:1 as a
 * solid. Dark mode uses soft white at the control-border weight. The cue users
 * see is `border-ring` plus a translucent outer ring, not an ink (or neon) halo.
 */
describe('focus ring stays soft', () => {
  it('light mode ring is soft silver against the page', () => {
    const ratio = semanticContrast(semanticColorLight.ring, semanticColorLight.background)
    expect(ratio, `got ${ratio.toFixed(2)}:1`).toBeGreaterThan(2)
    expect(ratio, `got ${ratio.toFixed(2)}:1 — too dark for the soft focus recipe`).toBeLessThan(
      AA_NON_TEXT
    )
  })

  it('light mode ring stays under 3:1 on card and muted', () => {
    for (const surface of ['card', 'muted'] as const) {
      const ratio = semanticContrast(semanticColorLight.ring, semanticColorLight[surface])
      expect(ratio, `${surface}: ${ratio.toFixed(2)}:1`).toBeLessThan(AA_NON_TEXT)
      expect(ratio, `${surface}: ${ratio.toFixed(2)}:1`).toBeGreaterThan(1.8)
    }
  })

  it('dark mode ring matches the quiet control-border weight', () => {
    // Same composite as `input` — soft silver, not a bright primary wash.
    expect(semanticContrast(semanticColorDark.ring, semanticColorDark.background)).toBeCloseTo(
      3.82,
      1
    )
    expect(semanticContrast(semanticColorDark.ring, semanticColorDark.card)).toBeCloseTo(3.54, 1)
  })
})

describe('solid fills are distinguishable from the page behind them', () => {
  // A button whose label is legible but whose body blends into the page is
  // still broken. This is what ruled out mirroring light mode's 600 fill in
  // dark mode, where it only reached 3.6:1 against the background.
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

  it.each([
    ['light', semanticColorLight],
    ['dark', semanticColorDark],
  ] as const)('%s mode', (_mode, theme) => {
    for (const family of families) {
      const ratio = semanticContrast(theme[`${family}-solid`], theme.background)
      expect(ratio, `${family}-solid vs background: ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
        AA_NON_TEXT
      )
    }
  })
})
