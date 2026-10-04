---
'rowkit': minor
---

**EmptyState is now a Windows 98 system message**, as drawn in the Figma file: the 32px icon on the left, then a bold title, the explanation and the buttons stacked beside it. `sm` fits a table body (12px padding, 13px title); `md` and `lg` fill a panel (24px padding, 13px or 14px title), each capped at the width drawn in Figma (280, 360, 440px).

**`reason` now picks the icon** from the Figma set: an empty folder for `no-data`, a magnifier for `no-results`, the red error mark for `error`. `#icon` still replaces it.

DataTable centres its empty state in the table body, 16px from the header, as in the Figma table.

Breaking, on 0.x so marked minor: the layout is horizontal and left-aligned instead of a centred column; the explanation is black for every reason (an `error` no longer turns it red, the icon says it); the title uses the 13/16 and 14/18 UI headings instead of `text-sm` / `text-base` / `text-lg`; the description loses its `max-w-*` cap in favour of the root's width.
