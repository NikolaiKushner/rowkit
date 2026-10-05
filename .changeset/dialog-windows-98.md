---
'rowkit': minor
---

**Dialog is now a Windows 98 dialog window**, as drawn in the Figma file: a silver face in the window bevel with 2px of frame, an 18px navy-to-blue title bar holding the title in bold white, and the 16×14 ✕ caption button at its right end. Description, body and footer sit 12px in from the frame and 12px apart; footer buttons are right-aligned 6px apart, the default button first. It opens and closes instantly.

Breaking, on 0.x so marked minor:

- **The title moves into the title bar.** `DialogTitle` stays where you place it in `DialogHeader` but is drawn over the bar and cut off with an ellipsis before the ✕. Anything else in the header starts below the bar. The bar and the ✕ are drawn by `DialogContent`, so they are there whatever the header holds.
- **No backdrop.** The 50% scrim is gone: nothing is drawn behind the window. Clicking outside still closes it (unless `preventClose`), and page scroll is still locked.
- **Fixed widths.** `size` is now 320 (`sm`), 440 (`md`) or 600px (`lg`), narrowed to fit small screens, instead of `max-w-sm` / `max-w-lg` / `max-w-2xl` from the `sm` breakpoint up. A `class` that set `sm:max-w-*` on `DialogContent` should set `max-w-*` instead.
- **No enter or exit animation.** The `animate-overlay-*`, `animate-dialog-*`, `animate-toast-*` and `animate-tooltip-*` utilities are removed from `rowkit/styles`; no component used them any more.

Focus now opens on the first control after the title bar — the first field, or the default button that leads the footer — instead of the close button. A dialog opened from a dialog turns the one underneath inactive (grey title bar) until it closes.

`preventClose` still leaves the ✕ working (the Figma file draws it disabled): a dialog never traps the user.
