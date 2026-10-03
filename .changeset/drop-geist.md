---
'@rowkit/tokens': minor
'rowkit': minor
---

**Typeface: PT Sans replaces Geist.** `--font-sans` now leads with PT Sans, the closest open match to Tahoma, then Tahoma, Microsoft Sans Serif and Verdana. rowkit does not ship the font: add `@fontsource/pt-sans` and import its `400.css` and `700.css`. PT Sans covers Latin and Cyrillic. `--font-mono` now leads with Lucida Console, then Courier New. If you load `@fontsource-variable/geist` only for rowkit, you can drop it; to keep Geist, override `--font-sans` and `--font-mono`.
