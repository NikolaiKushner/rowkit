---
'rowkit': minor
---

**Select is now a Windows 98 drop-down list.** The control is Input's white well in a sunken bevel (21, 23 or 27px tall) with the raised 16px drop button and its triangle at the end; with focus and a value, the value shows in navy with white text. The list hangs directly under the control, as wide as it: white, in a 1px black frame, 16px rows, eight before it scrolls, the highlighted option navy, disabled options grey and embossed. It appears instantly.

**A mouse press now opens the list**, and dragging onto an option and releasing chooses it, as in Windows 98. Touch and pen still open it on a tap.

Breaking, on 0.x so marked minor:

- The selected option no longer shows a check mark; the highlight opens on it instead.
- Invalid is quiet: the error mark appears in the control, and the red border and ring are gone. The `invalid` variant is removed from `selectTriggerVariants`.
- The list sits flush under the control (no 4px gap) and is exactly as wide as it, with no 160px minimum.
