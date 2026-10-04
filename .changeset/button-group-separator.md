---
'rowkit': minor
---

**New: `Separator`**, the Windows 98 etched line from the Figma file: 1px of shadow beside 1px of highlight, horizontal or vertical (vertical stretches to its row). It is `role="separator"`, or `decorative` to hide it from assistive technology. Use it between toolbar groups, menu groups and dialog sections.

**ButtonGroup is now a Windows 98 toolbar group.** Buttons sit edge to edge and keep their own bevels; ghost buttons give the flat toolbar look. Nested groups sit 4px apart, with a vertical `Separator` between them to draw the etched line.

Breaking, on 0.x so marked minor: buttons in a group no longer merge their edges (no shared border, no overlap), and nested groups are 4px apart instead of 12px.
