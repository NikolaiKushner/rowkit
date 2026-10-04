---
'rowkit': minor
---

**Input is now the Windows 98 edit box**, as drawn in the Figma file.

- **A white well in a sunken bevel**, 21, 23 or 27px tall (`sm`, `md`, `lg`) to line up with Button. Read-only and disabled fields turn silver; disabled text is grey and embossed. The placeholder is `text-subtle` (#404040).
- **Invalid is quiet.** The red border and ring are gone: an invalid field shows the error mark at its end, sets `aria-invalid`, and leaves the message to Field.
- **Types bring their own furniture.** `search` shows the magnifier and clears on Escape (without letting the key close a dialog when there was something to clear). `number` has spin buttons that step the value and repeat while held. `date` has a drop button that opens the browser's date picker. The browsers' own spinners, picker icon and clear button are hidden.
- **Focus is a dotted ring inside the field.**
- **Breaking: `class` now goes on the frame**, the box with the bevel, instead of on the `<input>`. A width such as `w-56` keeps working; a class that styled the text itself now needs a descendant selector. Other attributes still go to the `<input>`.
