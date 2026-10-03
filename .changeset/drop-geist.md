---
'@rowkit/tokens': minor
'rowkit': minor
---

**Typeface: Geist is gone from the font stack.** `--font-sans` now leads with Tahoma, then Microsoft Sans Serif and Verdana; `--font-mono` with Lucida Console, then Courier New. These are faces operating systems already ship, so there is nothing to install. It is an interim stack: the Windows 98 redesign will settle on a pixel face. If you load `@fontsource-variable/geist` only for rowkit, you can drop it; to keep Geist, override `--font-sans` and `--font-mono`.
