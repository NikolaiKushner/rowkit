---
'@rowkit/tokens': minor
'rowkit': minor
---

**Typeface: W95FA replaces Geist.** `--font-sans` now leads with W95FA (`WIN95FA`, as `@fontsource/win95fa` registers it), a pixel re-creation of the Windows 95 UI font, then Tahoma, Microsoft Sans Serif and Verdana. rowkit does not ship the font: add `@fontsource/win95fa` and `@import '@fontsource/win95fa'` to get it. W95FA covers Latin only, so Cyrillic and other scripts render in the system fallback. `--font-mono` now leads with Lucida Console, then Courier New. If you load `@fontsource-variable/geist` only for rowkit, you can drop it; to keep Geist, override `--font-sans` and `--font-mono`.
