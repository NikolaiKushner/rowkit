---
'rowkit': minor
---

**New: `Checkbox` and `Radio`**, the Windows 98 check box and option button from the Figma file. Both are native inputs inside a `<label>`: they submit with a form, `Radio`s sharing a `name` move with the arrow keys, and the label names them.

- `Checkbox`: a 13×13 sunken box with a 7×7 check; `indeterminate` draws the 7×2 bar and is announced as mixed. `v-model` is a boolean.
- `Radio`: the 12×12 round well with a 4×4 dot. `v-model` is the group's chosen value; bind the same ref on every option.

Held down or disabled, the box or well turns silver. Disabled labels are grey and embossed. Focus is the dotted ring round the label.
