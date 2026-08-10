---
'rowkit': patch
---

**Docs cascade fix.** Every heading on every docs content page was rendering at body size and weight. Wrapping VitePress's CSS in `@layer vp-theme` left the layer order to first-appearance, and the wrapped CSS lands at the top of the bundle — so `vp-theme` sorted _below_ Tailwind's `base`, and preflight's `h1`–`h6` reset (`font-size: inherit`) beat every VitePress heading rule, since a layer beats specificity. The order statement now rides on the wrapped CSS itself (`@layer theme, base, vp-theme, components, utilities`), which puts `vp-theme` above `base` so headings survive and below `utilities` so live demos still win. `docs-styles.test.ts` now asserts both bounds instead of only the lower one.

**Docs homepage.** The bulk-actions bar moved below the table. Above it, every checkbox tick inserted or removed a band and shoved the table under the cursor — the row you were aiming at moved because you selected the one before it. The demo roster grew to 80 people so the money shot pages through real data — ten rows a page across seven pages, instead of a single page of six — and narrowing a filter now returns to page 1.

**`NEXT.md` is now `ROADMAP.md`**, rewritten as a plan of record: current state, what 1.0 actually requires, and what stays out of scope. The docs page moves from `/next` to `/roadmap`.
