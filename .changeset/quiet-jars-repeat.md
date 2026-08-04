---
'rowkit': patch
---

Stop the dialog body clipping the focus ring, and separate the footer with a border.

The body is `overflow-y-auto`, which makes it a clipping boundary, and the focus ring is drawn 3px outside the control's border box. With no vertical padding the last field in a form sat flush against that boundary and the bottom of its ring was sliced off — the control read as focused on three sides and cut on the fourth, with nothing wrong in the markup to explain it. The body now carries `pt-1 pb-4`, which is the clearance the ring needs at the top and both the clearance and the visual gap at the bottom.

The footer gains a top border, so the actions read as a separate plane from the content they act on. That matters most when the body scrolls: without it, content scrolling under the footer runs out rather than passing behind an edge.

An interaction test measures the field's rectangle against the scrolling region's and fails if any part of the ring falls outside — asserted from geometry rather than from the class list, because a padding utility that failed to compile would leave the classes correct and the ring still cut.
