---
'rowkit': patch
---

**Safari / docs demos.** VitePress theme CSS is wrapped in `@layer vp-theme` so Tailwind utilities beat its form/table reset without `all: revert-layer` (broken in Safari). DemoBox isolates markdown-table chrome on `.rk-demo`. DataTable keeps `h-*` on cells (`min-height` is ignored for `table-cell`). Input/Select use `leading-normal` for Safari text centering.
