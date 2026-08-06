---
'@rowkit/tokens': minor
'rowkit': minor
---

Quiet the working surface: cool chrome, indigo primary, and denser table pages that stay scannable.

Decorative borders pick up a cool cast and lift off pure white; the page background is a cool off-white so white cards still lift. Control borders (`input`) follow with a cooler, slightly softer step that still clears WCAG 1.4.11. Primary leaves the near-black inversion for brand indigo, and the focus ring follows it. Selected rows take a quiet primary wash; tooltips invert foreground/background instead of painting as a floating primary button. Sticky column scroll shadows are a touch stronger so a pinned Name column still reads when the grid moves.

Button, Input and Select share one control geometry from `sm` up — same height,
radius, padding and `text-sm`. Secondary is a muted fill (`bg-muted`), not the
hollow `border-input` shell fields use, so a button next to an input stays one
system without looking like another field. Dialog close matches icon-button
geometry and the shared focus recipe. Chromatic Badge `subtle` stays a soft
tinted chip (fill + hairline), same recipe as neutral — not bare coloured text.
