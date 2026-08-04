---
'@rowkit/tokens': minor
'rowkit': minor
---

Repoint the neutral core to the shadcn/ui palette.

Page, surfaces, text, borders, focus ring and skeleton now use shadcn's zero-chroma greys instead of rowkit's blue-tinted `neutral` ramp. Dark-mode borders are white at 10% and 15% alpha, as shadcn's are, which is what keeps them soft on both the page and a card. The selected table row is no longer tinted with the brand.

New `gray` and `whiteAlpha` primitive scales, exported alongside the existing ramps. `gray` is keyed by OKLCH lightness — `gray-922` is `oklch(0.922 0 0)` — so a step can be checked against shadcn's published value by reading its name.

Three values deviate from shadcn deliberately, each the smallest change that clears WCAG: `--ring` and `--input` (2.59:1 and 1.26:1 against a white page, both failing 1.4.11) and `--muted-foreground` (4.34:1 on the recessed surface a table header sits on). The decorative `--border` keeps shadcn's value exactly, so row and card hairlines are unchanged.

Token names are unchanged; no component or utility class needs editing. Status colours — primary, success, warning, danger — are untouched and follow in a later release.

Design language based on shadcn/ui by shadcn, adapted for Vue.
