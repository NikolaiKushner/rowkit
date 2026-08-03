---
'@rowkit/tokens': minor
'rowkit': minor
---

Adopt the shadcn/ui radius scale, derived from a single `--radius`.

Corners are now multiples of one variable rather than a flat list: `xs` 4px, `sm` 6px, `md` 8px, `lg` 10px, `xl` 14px, up from 2/4/6/8/12px. Setting `--radius` in your own CSS retunes every corner in the library at once.

`radiusBase` is a new export holding that length. Token names are unchanged, so no component or utility class needs editing — only the values they resolve to.

Design language based on shadcn/ui by shadcn, adapted for Vue.
