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
  ['body text on the page', 'text', 'background', AA_TEXT],
  ['body text on a surface', 'text', 'surface', AA_TEXT],
  ['body text on a recessed surface', 'text', 'surface-subtle', AA_TEXT],
  ['body text on a hovered row', 'text', 'surface-hover', AA_TEXT],
  ['body text on an active row', 'text', 'surface-active', AA_TEXT],
  ['body text on a selected row', 'text', 'surface-selected', AA_TEXT],
  ['muted text on the page', 'text-muted', 'background', AA_TEXT],
  ['muted text on a surface', 'text-muted', 'surface', AA_TEXT],

  ['label on a primary button', 'primary-on-solid', 'primary-solid', AA_TEXT],
  ['label on a success button', 'success-on-solid', 'success-solid', AA_TEXT],
  ['label on a warning button', 'warning-on-solid', 'warning-solid', AA_TEXT],
  ['label on a danger button', 'danger-on-solid', 'danger-solid', AA_TEXT],

  // Hover keeps the same label colour, so the hovered fill has to clear the
  // bar too. Amber is the one that nearly slipped: darkening on hover would
  // have dropped its dark label to 3.27:1.
  ['label on a hovered primary button', 'primary-on-solid', 'primary-solid-hover', AA_TEXT],
  ['label on a hovered success button', 'success-on-solid', 'success-solid-hover', AA_TEXT],
  ['label on a hovered warning button', 'warning-on-solid', 'warning-solid-hover', AA_TEXT],
  ['label on a hovered danger button', 'danger-on-solid', 'danger-solid-hover', AA_TEXT],

  ['text in a primary badge', 'primary-on-subtle', 'primary-subtle', AA_TEXT],
  ['text in a success badge', 'success-on-subtle', 'success-subtle', AA_TEXT],
  ['text in a warning badge', 'warning-on-subtle', 'warning-subtle', AA_TEXT],
  ['text in a danger badge', 'danger-on-subtle', 'danger-subtle', AA_TEXT],

  ['focus ring against the page', 'focus-ring', 'background', AA_NON_TEXT],
  ['focus ring against a surface', 'focus-ring', 'surface', AA_NON_TEXT],
  ['control border against a surface', 'border-control', 'surface', AA_NON_TEXT],
  ['control border against the page', 'border-control', 'background', AA_NON_TEXT],
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

describe('solid fills are distinguishable from the page behind them', () => {
  // A button whose label is legible but whose body blends into the page is
  // still broken. This is what ruled out mirroring light mode's 600 fill in
  // dark mode, where it only reached 3.6:1 against the background.
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
