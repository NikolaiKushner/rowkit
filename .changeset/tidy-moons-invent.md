---
'@rowkit/tokens': minor
'rowkit': minor
---

Repoint the achromatic and destructive status colours to shadcn/ui.

`primary` is now shadcn's `--primary`: near-black in light mode, and it **inverts** under `.dark` to near-white with near-black text. There is no brand hue in this design language — the default action is the darkest thing on the page, not the bluest. `neutral` becomes shadcn's `--secondary`, the quiet near-white chip.

Tooltip moves from `neutral-solid` to `primary-solid`, matching shadcn, whose tooltip is `bg-primary`. Left as it was it would have rendered pale grey on a pale page.

`danger` uses a new `red` primitive scale. Two deviations from shadcn, both forced: its published `oklch(0.577 0.245 27.325)` does not fit in sRGB, so the chroma is clamped to 0.235 — a difference nobody can see, in exchange for a colour that renders the same on sRGB and P3 instead of being gamut-mapped per browser. And shadcn's lighter dark-mode red carries its white label at 2.86:1, the worst failure in its default set, so one red now serves both themes at 4.90:1.

`success` and `warning` are unchanged: shadcn has no equivalent to match, rowkit's existing values are already chroma-matched to their families and pass every gate, and replacing working colours for no fidelity gain is churn.

Design language based on shadcn/ui by shadcn, adapted for Vue.
