import { describe, expect, it } from 'vitest'
import { semanticColor, type SemanticColorName } from './color'
import { modernDarkColor, modernLightColor } from './themes/modern'
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

  ['a button label', 'control-foreground', 'control', AA_TEXT],
  ['a hovered button label', 'control-foreground', 'control-hover', AA_TEXT],
  ['a held button label', 'control-foreground', 'control-active', AA_TEXT],
  ['a default button label', 'control-primary-foreground', 'control-primary', AA_TEXT],
  [
    'a hovered default button label',
    'control-primary-foreground',
    'control-primary-hover',
    AA_TEXT,
  ],
  ['a held default button label', 'control-primary-foreground', 'control-primary-active', AA_TEXT],
  ['a latched toggle label', 'control-foreground', 'control-latched', AA_TEXT],
  ['an option in a dropped list', 'foreground', 'popover', AA_TEXT],
  ['a column header', 'table-header-foreground', 'table-header', AA_TEXT],
  ['a striped row', 'foreground', 'table-stripe', AA_TEXT],
  ['a row under the pointer', 'foreground', 'table-row-hover', AA_TEXT],
  ['a destructive button label', 'danger-on-subtle', 'control', AA_TEXT],
]

/** Marks that are not text but carry state: WCAG 1.4.11. */
const marks: readonly Pairing[] = [
  ['the mark in a checked box', 'on-checked', 'checked', AA_NON_TEXT],
  ['a progress fill in its track', 'progress', 'track', AA_NON_TEXT],
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

/** The modern theme draws edges with `border-strong` and focus with a blue ring, not with bevels. */
const modernBoundaries: readonly Pairing[] = [
  ['a field’s edge against its well', 'border-strong', 'input', AA_NON_TEXT],
  ['a field’s edge on a panel', 'border-strong', 'card', AA_NON_TEXT],
  ['the focus ring around a control, on the window', 'focus-ring', 'background', AA_NON_TEXT],
  ['the focus ring around a control, on a panel', 'focus-ring', 'card', AA_NON_TEXT],
  ['the focus ring on a row', 'ring', 'input', AA_NON_TEXT],
  ['the focus ring on a selected row', 'on-selected', 'surface-selected', AA_NON_TEXT],
]

type Palette = Record<SemanticColorName, string>

/** [theme, its semantic colours, the boundaries it draws] */
const themes: readonly (readonly [string, Palette, readonly Pairing[]])[] = [
  ['Windows 98', semanticColor, boundaries],
  ['modern, light', modernLightColor, modernBoundaries],
  ['modern, dark', modernDarkColor, modernBoundaries],
]

describe.each(themes)('contrast in %s', (_theme, palette, edges) => {
  // A translucent colour — a glass list, a striped row — is measured over the panel it sits on.
  const ratio = (fg: SemanticColorName, bg: SemanticColorName) =>
    semanticContrast(palette[fg], palette[bg], palette.card)

  it.each(text)('%s: %s on %s at >= %d:1', (_label, fg, bg, min) => {
    const r = ratio(fg, bg)
    expect(r, `got ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(min)
  })

  it.each([...marks, ...edges])('%s: %s on %s at >= %d:1', (_label, fg, bg, min) => {
    const r = ratio(fg, bg)
    expect(r, `got ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(min)
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
