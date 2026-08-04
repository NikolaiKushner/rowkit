---
'@rowkit/tokens': minor
'rowkit': minor
---

Finish the visual pass: restrained success and warning, and shadcn's geometry everywhere.

`success` and `warning` move to new `green` and `amber` primitive scales sitting at the same lightness band as `red`, so a success, a warning and a destructive control now carry the same perceptual weight and differ only in hue. Both take a white label. That is a real change for warning, which was bright amber with dark text — bright amber is the loudest thing on a shadcn page, and one saturated chip undoes a language built on restraint. shadcn has no success or warning to copy, so the rule here is internal consistency rather than fidelity.

Geometry, from shadcn's source:

- **Tooltip** — `rounded-md px-3 py-1.5 text-xs`, and the drop shadow is gone. A near-black bubble does not need one, and it was reading as a second edge on a light page.
- **Input** — `bg-transparent` so a field inside a card does not paint a second white rectangle, plus `shadow-xs`, `py-1`, muted placeholder, `disabled:opacity-50`, and `rounded-md` at every size. Invalid now tints the focus ring as well as the border, so the state survives being focused.
- **Dialog** — `shadow-lg` rather than `shadow-xl`, title `leading-none`, close button at `opacity-70` rising to full on hover.
- **Toast** — `rounded-lg` with `text-sm`.
- **EmptyState** — the icon moves from subtle to muted, matching shadcn's `text-muted-foreground`.
- **TablePagination** — controls grow to `h-9`, matching Button's default height.
