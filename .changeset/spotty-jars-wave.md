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

Body rows carry the same problem one level up:

```css
.vp-doc tr {
  background-color: …;
  border-top: 1px solid …;
  transition: background-color 0.5s;
}
.vp-doc tr:nth-child(2n) {
  background-color: var(--vp-c-bg-soft);
}
```

Zebra striping is right for a markdown table and wrong for a component that paints its own rows — every other row went grey, and in the loading state the stripe sat on top of the skeletons and hid them. The row also inherited a border its cells already draw, and a half-second background transition, which is why hover in a demo lagged behind the pointer.

`all: revert-layer` on cells and body rows. It restores the layered value rather than removing it, so the row's own `bg-card`, hover and selected utilities all come back. The row selector has to out-specify `:nth-child(2n)` at 0-2-2 — a plain `.rk-demo tr` is 0-1-1 and loses to the stripe, which is how it survived the first pass at the cells.
