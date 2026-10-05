---
'@rowkit/tokens': minor
'rowkit': minor
---

**Text is set in Windows 98's "Large Fonts" sizes.** At 96 DPI the system's 8pt is 11px, which was readable on a 1998 monitor's large pixels and is too small on today's screens; Windows 98 offered the 120 DPI "Large Fonts" mode for the same reason. The whole ladder moves with it:

| token           | was   | now                                                    |
| --------------- | ----- | ------------------------------------------------------ |
| `text-ui`       | 11/13 | 13/16                                                  |
| `text-heading`  | 13/16 | 16/20                                                  |
| `text-mono`     | 16/16 | 16/16 — VT323 at 16px now matches 13px PT Sans exactly |
| `text-doc`      | 15/24 | 16/26                                                  |
| `text-doc-mono` | —     | 20/20, new: code beside documentation text             |
| `text-doc-h1`   | 24/28 | 26/30                                                  |
| `text-doc-h2`   | 18/22 | 19/24                                                  |
| `text-doc-h3`   | 14/18 | 15/20                                                  |

Bevels, borders and icons keep their pixel sizes, as they did in Windows 98.
