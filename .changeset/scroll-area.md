---
'rowkit': minor
---

**New: `ScrollArea`**, a region with Windows 98 scroll bars that rowkit draws itself, so they look the same in every browser, Firefox included. Raised arrows scroll a line and repeat while held, the track pages toward the pointer, and the thumb drags; its length is the share of the content in view. The content still scrolls natively, and the bars sit beside it rather than over it.

```vue
<ScrollArea label="Event log" class="h-64 w-80">…</ScrollArea>
```

`scrollbars="always"` keeps both bars on screen, greyed when there is nothing to scroll. The component exposes `viewport`, the element that scrolls.
