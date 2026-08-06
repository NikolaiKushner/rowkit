---
'@rowkit/tokens': minor
'rowkit': minor
---

Restyle rowkit on a shadcn/ui-derived language, then tune it for data-dense SaaS — cool chrome, indigo primary, one control geometry.

**Tokens (breaking if you override theme variables or write rowkit utility classes by hand).** Seven core semantics rename to shadcn’s names: `surface` → `card`, `surface-subtle` → `muted`, `surface-hover` → `accent`, `text` → `foreground`, `text-muted` → `muted-foreground`, `border-control` → `input`, `focus-ring` → `ring`. The greys start from shadcn’s zero-chroma ramp, then pick up rowkit identity: cooler, lighter decorative borders, a cool off-white page, brand indigo primary with a matching focus ring (not near-black), and selected rows on a quiet primary wash. Corners derive from a single `--radius`. New: overlay blur, sticky-header inset shadow, stronger sticky-column scroll shadow. Status families keep the solid/subtle/outline axis Badge and Button already expose.

**Components.** The shared focus recipe (border + translucent ring) lands on every control. Button, Input and Select share height, radius, padding and `text-sm` from `sm` up; Button adds `xs` and `icon`. Secondary is a muted fill so it never reads as another field; fields stay the outlined hollow shell. Chromatic Badge `subtle` is a soft tinted chip. Tooltip inverts foreground/background instead of painting as a primary bubble. DataTable: opaque sticky header with an inset edge that travels while scrolling, unified loaded/loading row heights, quieter hover vs selection. Dialog: blurred scrim, denser padding, footer rule, close matches an icon button. FilterBar, Field, Toast, EmptyState and Pagination follow the same chrome. Docs demos stop inheriting VitePress’s unlayered table grid and zebra over DataTable.

**API (0.x breaking).** `TablePagination` is now `Pagination` — same props, events and slots; docs move to `/components/pagination`. Marked `minor` on purpose: on a 0.x line changesets would turn a `major` into `1.0.0`, and 1.0 should wait for real apps, not a rename.
