import { describe, expect, it } from 'vitest'
import { semanticColor, type SemanticColorName } from './color'
import { semanticContrast } from '../test/color'

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
/** WCAG 1.4.11 — boundaries of interactive components, and focus indicators. */
const AA_NON_TEXT = 3

const text: readonly Pairing[] = [
  ['body text on the window', 'foreground', 'background', AA_TEXT],
  ['body text on a panel', 'foreground', 'card', AA_TEXT],
  ['body text on a toolbar', 'foreground', 'muted', AA_TEXT],
  ['body text on a hovered row', 'foreground', 'accent', AA_TEXT],
  ['body text on a pressed row', 'foreground', 'surface-active', AA_TEXT],
  ['body text in a field', 'foreground', 'input', AA_TEXT],
  ['secondary text on the window', 'muted-foreground', 'background', AA_TEXT],
  ['secondary text in a field', 'muted-foreground', 'input', AA_TEXT],
  ['a placeholder in a field', 'text-subtle', 'input', AA_TEXT],
  ['subtle text on the window', 'text-subtle', 'background', AA_TEXT],
  ['text on a selected row', 'on-selected', 'surface-selected', AA_TEXT],
  ['a link on the window', 'link', 'background', AA_TEXT],
  ['a link in a field', 'link', 'input', AA_TEXT],
  ['a tooltip', 'foreground', 'tooltip-bg', AA_TEXT],

  // The title sits at the left, on the dark end of the gradient.
  ['an active window title', 'titlebar-foreground', 'titlebar-from', AA_TEXT],
  [
    'an inactive window title, dark end',
    'titlebar-inactive-foreground',
    'titlebar-inactive-from',
    AA_TEXT,
  ],
  [
    'an inactive window title, light end',
    'titlebar-inactive-foreground',
    'titlebar-inactive-to',
    AA_TEXT,
  ],

  ['label on a neutral solid', 'neutral-on-solid', 'neutral-solid', AA_TEXT],
  ['label on a primary solid', 'primary-on-solid', 'primary-solid', AA_TEXT],
  ['label on a success solid', 'success-on-solid', 'success-solid', AA_TEXT],
  ['label on a warning solid', 'warning-on-solid', 'warning-solid', AA_TEXT],
  ['label on a danger solid', 'danger-on-solid', 'danger-solid', AA_TEXT],
  ['label on a hovered neutral solid', 'neutral-on-solid', 'neutral-solid-hover', AA_TEXT],
  ['label on a hovered primary solid', 'primary-on-solid', 'primary-solid-hover', AA_TEXT],
  ['label on a hovered success solid', 'success-on-solid', 'success-solid-hover', AA_TEXT],
  ['label on a hovered warning solid', 'warning-on-solid', 'warning-solid-hover', AA_TEXT],
  ['label on a hovered danger solid', 'danger-on-solid', 'danger-solid-hover', AA_TEXT],

  ['text in a neutral chip', 'neutral-on-subtle', 'neutral-subtle', AA_TEXT],
  ['text in a primary chip', 'primary-on-subtle', 'primary-subtle', AA_TEXT],
  ['text in a success chip', 'success-on-subtle', 'success-subtle', AA_TEXT],
  ['text in a warning chip', 'warning-on-subtle', 'warning-subtle', AA_TEXT],
  ['text in a danger chip', 'danger-on-subtle', 'danger-subtle', AA_TEXT],
]

/**
 * A control's boundary is its bevel, and the bevel's outer dark edge is what
 * separates it from what is around it. The fill alone does not have to: a
 * yellow warning button is 1.7:1 against silver, and its black bevel edge is
 * what makes it a button.
 */
const boundaries: readonly Pairing[] = [
  ['a control’s outer edge on the window', 'bevel-dark', 'background', AA_NON_TEXT],
  ['a control’s outer edge on a panel', 'bevel-dark', 'card', AA_NON_TEXT],
  ['a field’s dark inner edge against its white well', 'bevel-dark', 'input', AA_NON_TEXT],
  ['the focus ring on the window', 'ring', 'background', AA_NON_TEXT],
  ['the focus ring in a field', 'ring', 'input', AA_NON_TEXT],
  ['the focus ring on a selected row', 'on-selected', 'surface-selected', AA_NON_TEXT],
  ['the default button’s frame', 'border-strong', 'background', AA_NON_TEXT],
]

describe('contrast', () => {
  it.each(text)('%s: %s on %s at >= %d:1', (_label, fg, bg, min) => {
    const ratio = semanticContrast(semanticColor[fg], semanticColor[bg])
    expect(ratio, `got ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min)
  })

  it.each(boundaries)('%s: %s on %s at >= %d:1', (_label, fg, bg, min) => {
    const ratio = semanticContrast(semanticColor[fg], semanticColor[bg])
    expect(ratio, `got ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min)
  })
})

describe('disabled text', () => {
  // Disabled text is exempt from 1.4.3, and Windows 98 makes it look disabled
  // on purpose. What is asserted is that it still reads as text: grey, with a
  // white emboss that is itself distinct from the face.
  it('is grey on the face, with a lighter emboss under it', () => {
    expect(
      semanticContrast(semanticColor['text-disabled'], semanticColor.background)
    ).toBeGreaterThan(2)
    expect(
      semanticContrast(semanticColor['text-disabled-emboss'], semanticColor.background)
    ).toBeGreaterThan(1.5)
  })
})
