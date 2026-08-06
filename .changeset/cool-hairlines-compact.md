---
'@rowkit/tokens': minor
'rowkit': patch
---

Soften the chrome and give primary a real colour, while keeping controls the same shape everywhere.

Decorative borders pick up a cool cast (hue 264) and lift off pure white: light mode `border` moves from the reference `0.922` to `oklch(0.940 0.004 264)`, with matching softer `border-strong` and recessed `muted`/`accent` steps. The page background becomes a cool off-white so white cards still lift without heavy outlines; dark mode hairlines drop from 10% to 8% white.

Primary leaves the near-black/near-white inversion for brand indigo (`primary-600` / `primary-400`), and the focus ring follows it. Tooltips, checkboxes and primary buttons share that fill.

Button, Input, Select and pagination items all use the same height band and `rounded-md`, and Pagination's rows-per-page Select inherits the pagination `size` instead of staying stuck on `sm`. Stale `text-text*` classes in Select, Pagination and Storybook's preview are aligned to the renamed tokens so playground, Storybook and VitePress render the same controls.
