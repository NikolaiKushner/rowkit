---
'rowkit': minor
'@rowkit/tokens': patch
---

**Breaking (Button).** Variants are now `default` | `outline` | `secondary` | `ghost` | `destructive` | `link` — soft-ink solid is the default (omit `variant` or pass `default`). `primary` and `danger` are removed; soft `destructive` replaces solid danger. Size scale is `default` | `xs` | `sm` | `lg` | `icon` | `icon-xs` | `icon-sm` | `icon-lg`; the `icon` boolean prop is gone. Former bordered `secondary` is now `outline`; `secondary` is a muted fill (`surface-active`). Soft ink solid lightened to `oklch(0.26…)`. Link focus stays typographic (ring only). Dialog Cancel convention is `ghost` so soft Delete wins hierarchy.

**ButtonGroup.** New `ButtonGroup` joins related buttons with shared edges (`orientation` horizontal | vertical). Nested groups use a clear gap.

**Tokens.** Default primary is warm espresso graphite (`oklch(0.31 0.038 48)` / `#402a1f`), not near-black. Soft destructive wash in dark mirrors light (coloured label on a quiet red tint). Link focus is underline-only.
