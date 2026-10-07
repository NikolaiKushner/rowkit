# ScrollArea

**Stage:** 🟡 New

A region with Windows 98 scroll bars that rowkit draws itself: raised arrow
buttons, a dithered track and a raised thumb, identical in every browser. The
content scrolls natively (wheel, touchpad, touch, keyboard); only the bars are
drawn. They sit beside and below the content, never over it.

<script setup>
import ScrollAreaBasic from '../examples/scroll-area/ScrollAreaBasic.vue'
import ScrollAreaHorizontal from '../examples/scroll-area/ScrollAreaHorizontal.vue'
import ScrollAreaListBox from '../examples/scroll-area/ScrollAreaListBox.vue'
</script>

<DemoBox>
  <ScrollAreaBasic />
</DemoBox>

<<< @/examples/scroll-area/ScrollAreaBasic.vue

Give the root a size — `h-*`, `max-h-*`, `w-*` — through `class`. The bars
appear on whichever axis the content outgrows; the content scrolls natively,
by wheel, touchpad, touch and keyboard, and only the bars are drawn.

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Sideways

Content wider than its box gets a bar along the bottom, below the content —
never over it.

<DemoBox>
  <ScrollAreaHorizontal />
</DemoBox>

<<< @/examples/scroll-area/ScrollAreaHorizontal.vue

### A list box

A list longer than its box gets the vertical bar only. To draw the bars even
when nothing overflows, as a fixed Windows 98 list box does, set
`scrollbars="always"`: with nothing to scroll, the arrows grey and there is no
thumb.

<DemoBox>
  <ScrollAreaListBox />
</DemoBox>

<<< @/examples/scroll-area/ScrollAreaListBox.vue

## How the bars behave

- **Arrow:** one line (16px) per click. Held, it repeats after half a second,
  pauses while the pointer is off it, and goes flat with its triangle stepping
  1px down and right.
- **Track:** a page per click, toward the pointer. Held, it keeps paging until
  the thumb reaches the pointer.
- **Thumb:** drag it. Its length is the share of the content in view, never
  shorter than 8px; with no room for that, the track shows none.

## When to use

- When the bars have to look the same in every browser — a page built to the
  Windows 98 design, a screenshot, a demo.
- In the site chrome built from the design: explorer panes, folder trees,
  code views.

## When not to use

- **When the browser's bar will do.** The `scrollbar-themed` utility restyles it
  with no script at all, and rowkit's own `DataTable`, `DialogBody`, `Select`
  list and `WindowBody` already use it. Only Firefox shows the difference. See
  [Scrollbar](/foundations/scrollbar).
- **For the page itself.** The document scrolls in the browser window, not in
  a window of your app.
- **For a very long list.** Thousands of rows want virtualisation, which
  needs control of the scrolling element; put the list in a `ScrollArea` only
  if your virtualiser can take its viewport.

## Props

<!-- @props ScrollAreaProps -->

| Prop         | Type                 | Default  | Description                                                                                 |
| ------------ | -------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `label`      | `string`             | —        | Accessible name for the scrolling region.                                                   |
| `scrollbars` | `'auto' \| 'always'` | `'auto'` | When the bars show.                                                                         |
| `class`      | `string`             | —        | Additional classes for the root — its size goes here — merged so a consumer's utility wins. |

<!-- /@props -->

The component exposes `viewport`, the element that scrolls, for reading or
setting the scroll position:

```vue
<script setup>
const area = useTemplateRef('area')
const toTop = () => area.value?.viewport?.scrollTo({ top: 0 })
</script>

<template>
  <ScrollArea ref="area" class="h-64">…</ScrollArea>
</template>
```

## Accessibility

- The scrolling region takes focus while there is something to scroll, so the
  keyboard can scroll it: arrow keys, <kbd>Page Up</kbd>, <kbd>Page Down</kbd>,
  <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>Space</kbd>.
- With `label`, it is a named `region`. Give it one whenever nothing inside is
  focusable, so a screen reader can say what is being scrolled.
- The drawn bars are hidden from assistive technology. The region scrolls on
  its own, and arrow buttons would only add noise.
