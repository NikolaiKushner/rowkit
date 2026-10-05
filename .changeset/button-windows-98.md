---
'rowkit': minor
---

**Button is now the Windows 98 command button**, as drawn in the Figma file.

- **Breaking: `variant="outline"` is removed.** Use `secondary`, the plain raised button. `default` is now the black-framed default button of a form or dialog, `ghost` a flat toolbar button with a thin bevel on hover, `destructive` a raised button with a maroon label, and `link` blue underlined text.
- **Sizes are Windows 98's own:** `xs` 17px, `sm` 21px, `default` 23px (minimum width 75px), `lg` 27px; icon sizes 20, 22, 24 and 28px.
- **States are bevels.** Pressed sinks the bevel and moves the label 1px right and down without changing the button's size; focus is a dotted ring around the label (plus the black frame on `secondary` and `destructive`); disabled greys and embosses the label instead of fading the button. Nothing animates.
- **Loading shows the hourglass** in place of the spinner.
- **New `pressed` prop** makes a toggle: it sets `aria-pressed`, and on is drawn pressed in over the dither. The dither is a new `bg-dither` utility in `rowkit/styles`.
- **Fixed: `as-child` put the button's classes on its own inner label `<span>`** instead of on your element.
- **Fixed: `text-ui` and the other token font sizes were dropped by class merging** whenever a text colour sat next to them, so components rendered at the inherited size.
