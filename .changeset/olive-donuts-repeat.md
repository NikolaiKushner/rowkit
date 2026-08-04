---
'rowkit': minor
---

Restyle the table family to shadcn/ui, and carry the focus ring across every component.

The header loses its grey band: shadcn's is transparent with a hairline under it, and the column labels are full-strength foreground rather than muted. rowkit's header stays opaque — it can be sticky, and a transparent sticky header lets rows scroll through it — but takes the table's own surface instead of the recessed one. Row hover drops to half strength so it reads as a pointer follow rather than as selection, which is the full tint. Density tightens to shadcn's `px-2` and `p-2`, and the row separator moves from the faint hairline to the standard one, which the old grey header had been masking.

Selection checkboxes take shadcn's recipe including `shadow-xs`. Their `rounded-xs` is exactly shadcn's `rounded-[4px]` — that is what the `xs` step at 0.4 × `--radius` exists for.

The focus ring introduced for Button now covers Dialog, Input, Select, Toast, TablePagination and every focusable part of DataTable.

**Borderless elements get a solid ring, not shadcn's translucent one.** The recipe is two halves — the border turns the ring colour, and a 3px ring at 50% sits outside it — and the border is the half that carries WCAG 1.4.11, because a 50% ring cannot reach 3:1 alone. On an element with no border, `focus-visible:border-focus-ring` colours a zero-width border and paints nothing, leaving a faint halo that still photographs like a focus ring. shadcn has this on its own ghost buttons; rowkit gives those five elements a fully opaque ring instead, and a new test fails any variant that asks to recolour a border it does not have.
