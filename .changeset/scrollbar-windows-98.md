---
'rowkit': minor
---

**New: the Windows 98 scroll bar**, as drawn in the Figma file: 16px thick, raised arrow buttons, a dithered track and a raised thumb. It is a utility, `scrollbar-win98`, in `rowkit/styles`: put it on any element that scrolls.

The `DataTable` body, `DialogBody`, the `Select` list and `WindowBody` now carry it, so their scroll bars change from the browser's default to the Windows 98 one with nothing to do on your side.

It restyles the browser's own scroll bar, so scrolling behaves exactly as before. Chromium and Safari draw every part; Firefox can only colour a scroll bar and shows a silver thumb on a white track. Setting `scrollbar-color` or `scrollbar-width` on the same element brings back the native bar in Chromium.
