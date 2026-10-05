---
'rowkit': patch
---

**`DataTable`'s selection column uses the public `Checkbox`.** Each row's check box and the select-all are now native `<input type="checkbox">`s — the same control as `Checkbox`, with `indeterminate` for a partly selected page — instead of an internal `<button role="checkbox">`. They still answer Space, still read «Select all rows» and each row's label, and a click still selects the rest when the select-all is partly checked. A test that looked for `[role="checkbox"]` or read `aria-checked` should query `input[type="checkbox"]` or use `toBeChecked()` / `toBePartiallyChecked()`. `dataTableCheckboxVariants` stays exported but is deprecated; nothing in rowkit uses it.

`Checkbox` now colours its mark through the foreground variable, so a check box inside a selected DataTable row keeps a black mark on its white box while its label turns white.
