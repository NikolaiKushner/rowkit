---
'rowkit': patch
---

Stop the docs site drawing a grid over every table demo.

VitePress styles markdown tables as a bordered grid, and it does so unlayered:

```css
.vp-doc th,
.vp-doc td {
  border: 1px solid …;
  padding: 8px 16px;
}
.vp-doc th {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}
```

Unlayered CSS beats anything in `@layer utilities` regardless of order or specificity, so all four of those won at once: a DataTable demo rendered with vertical rules between every column, the wrong cell padding, a grey header band and muted header text. Four departures from the real component, none of them visible in its class list, and only on the docs site — the component itself was correct the whole time.

`all: revert-layer` on `th` and `td` inside a demo, the same fix the buttons and inputs already needed. Rows are deliberately left alone: reverting them would take the hover and selected backgrounds with them, and those are layered utilities the component wants.
