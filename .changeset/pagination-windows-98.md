---
'rowkit': minor
---

**Pagination is now drawn as in the Figma Home template's status bar.** Page numbers and the «◀ Back» / «Next ▶» buttons are Windows 98 command buttons 2px apart: 17px tall at `sm`, 21px at `md`, page numbers square at their narrowest. The current page is pressed in. Back and Next go grey and embossed on the first and last page. The rows-per-page control uses `Field` with `layout="left"`.

**`Button` draws `aria-current="page"` pressed in** (no dither), so a page button or a pager built from `Button` gets the current-page look from the attribute alone.

Breaking, on 0.x so marked minor: `previousLabel` and `nextLabel` are now the visible labels of the Back and Next buttons, and their accessible names, instead of hidden `aria-label`s. Their defaults change from "Previous page" / "Next page" to "Back" / "Next".
