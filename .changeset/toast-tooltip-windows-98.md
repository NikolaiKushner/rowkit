---
'rowkit': minor
---

**Toast and Tooltip now follow the Windows 98 design** from the Figma file.

- **A toast is a small window**: the silver face in a window bevel, the same for every variant, with a 16px icon that says which (information, success, warning, error). An action is a small raised button under the text; the close button is a 16×14 caption button with the ✕ glyph. Toasts appear and go instantly; nothing slides.
- **New `title` option** on `toast()` and its shortcuts: a bold first line above the message.
- **A danger toast now stays until it is closed** unless you pass a `duration`. Other variants still dismiss after 5 seconds.
- **A tooltip is the pale yellow info box** with a 1px black border, 11px text, up to 240px wide. No arrow, shadow, rounding or animation.
- **Tooltips open after 500ms** by default, both for a standalone `Tooltip` (was 300ms) and under a `TooltipProvider` (was 700ms).
