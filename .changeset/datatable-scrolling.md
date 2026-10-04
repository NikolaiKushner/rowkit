---
'rowkit': minor
---

**DataTable scrolls like a Windows 98 list view.**

- **Cells no longer wrap**, and the table no longer squeezes its columns to fit the frame. Every column keeps its `width`, every row keeps its 18px or 22px, and columns that do not fit scroll sideways. A table narrower than the frame still fills it. Behaviour change: long text that used to wrap now stays on one line and widens its column.
- **Several pinned columns stack** side by side in column order instead of all sitting at the start edge on top of each other. Only the last one draws the edge shadow.
- **The selection column pins** with them when the table has a pinned column, so the check boxes stay beside their rows while the table scrolls sideways.
- The sticky header stays over all of it while the body scrolls both ways.
