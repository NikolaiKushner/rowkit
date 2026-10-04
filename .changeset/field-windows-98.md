---
'rowkit': minor
---

**Field is restyled to the Windows 98 design** from the Figma file: the label in the regular UI face (no longer medium weight) with a maroon asterisk when required, the hint in subtle grey, and the error as the 16px error icon followed by the message in maroon. The gaps follow the control size: 4, 6 or 8px. Disabled, the label is grey and embossed instead of faded to 50%.

**New: `layout="left"`**, the Windows 98 property-dialog arrangement. The label sits beside the control with its text level with the control's text, and the hint or error goes under the control. Set `--rk-field-label-width` on a container to line up a column of labels.

The error message now has an icon in front of it, and `fieldErrorVariants`, `fieldHintVariants` and `fieldLabelVariants` drop their `size` variant, since the text is the same 11px UI face at every size.
