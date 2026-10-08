# Scrollbar

The theme's scroll bar, as a utility on the element that scrolls:
`scrollbar-themed`. In Windows 98 it is 16px thick, with raised arrow buttons at
each end, a dithered track, and a raised thumb whose length is the share of the
content in view; in the modern theme, a thin rounded thumb on a clear track.
`scrollbar-win98`, its first name, still works.

```vue
<template>
  <div class="scrollbar-themed h-64 overflow-y-auto" tabindex="0" role="region" aria-label="Log">
    …
  </div>
</template>
```

rowkit's own scrolling regions already carry it: the `DataTable` body, the
`DialogBody`, the `Select` list and `WindowBody` (which scrolls once you give
it an `overflow-*` class).

<DemoBox>
  <div class="inline-block bg-input p-0.5 shadow-sunken">
    <div class="scrollbar-themed h-40 w-80 overflow-y-scroll px-1 text-ui" tabindex="0" role="region" aria-label="Example">
      <p v-for="n in 20" :key="n" class="m-0">Line {{ n }} of a long list.</p>
    </div>
  </div>
</DemoBox>

## How it works

It restyles the browser's own scroll bar rather than drawing a new one. Wheel,
touchpad, touch, keyboard and assistive technology scroll exactly as they do
everywhere else, and nothing runs in JavaScript.

- **Chromium and Safari** draw every part as in the design. In Windows 98
  that is the bevels, the 8px triangles, the dither, the grey arrows of a bar
  with nothing to scroll, and a held arrow that goes flat with its triangle
  stepping 1px down and right. In the modern theme it is a 10px bar with no
  arrows and no track: a rounded, translucent thumb, inset 2px from the edge,
  dark ink in the light scheme and light ink in the dark one.
- **Firefox** can only colour a scroll bar. In Windows 98 it shows a silver
  thumb on a white track, with its own arrows if the platform draws any; in
  the modern theme, the translucent thumb on a clear track.
- **Every part is a token.** Thickness, arrow size, the thumb's inset and
  shape, the track's pattern and every colour come from the theme
  (`--spacing-scrollbar`, `--spacing-scroll-button`, `--color-scroll-thumb`,
  `--rk-dither-image`…). The Windows 98 arrows are drawn from
  `--color-foreground` and grey out to `--color-bevel-shadow`, so a rebrand
  carries through. See [Themes](./themes.md).

## Rules

- **Put it on the element with the `overflow`**, not on a parent. A scroll
  bar belongs to the box that scrolls.
- **Put a bevel on a wrapper.** The bars paint over an inset shadow on the
  element that scrolls, so `shadow-sunken` there loses its right and bottom
  edges. Wrap the region in the well (`bg-input p-0.5 shadow-sunken`) and let
  the bars sit inside it, as Windows 98 did. The same wrapper draws the modern
  theme's field edge.
- **Make the region reachable.** A scrolling box with no focusable content
  inside needs `tabindex="0"` and a name, or keyboard users cannot scroll it.
- **Don't set `scrollbar-color` or `scrollbar-width` on it.** In Chromium
  either one switches the theme's bar off and brings back the native one. The
  utility resets both, so an app-wide rule cannot do it by accident, but one
  set on the same element afterwards still can.

## When not to use

- **On the page itself.** The document's scroll bar belongs to the browser
  window around your app, not to a window inside it.
- **To hide an overflow that should not be there.** A horizontal bar under a
  paragraph usually means a fixed width is wrong; fix the width rather than
  dressing up the bar.
