---
'rowkit': minor
---

**New primitives from the Figma file:**

- **`StatusBar` and `StatusBarSection`**: the strip along the bottom of a Windows 98 window. Sunken 18px cells on a 22px silver strip; the first cell fills the width the others leave.
- **`GroupBox`**: the etched frame with its legend on the top line. A `fieldset` with a `legend` by default, so form sections are named for assistive technology; `as="section"` or `as="div"` for a labelled group that is not a form.
- **`ProgressBar`**: the block progress bar. Navy 8×12 blocks in a sunken track, rounded down to whole blocks, with `role="progressbar"` and its value range.
