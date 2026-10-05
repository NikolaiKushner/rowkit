---
'rowkit': minor
---

**rowkit now exports its icons**: the Windows 98 pixel set from the Figma file, 42 in all — 8px glyphs for controls and title bars (`TriangleDownIcon`, `CloseGlyphIcon`, `MaximizeGlyphIcon`, …), 16px icons for buttons and lists (`PlusIcon`, `CopyIcon`, `TrashIcon`, `FilterIcon`, `EditIcon`, `FolderIcon`, `DocumentIcon`, `UserIcon`, `CalendarIcon`, `QuestionIcon`, …) and 32px icons for system messages (`Error32Icon`, `Info32Icon`, `Warning32Icon`, `Folder32Icon`, `Book32Icon`, …). Each is the exact Figma pixel art, `aria-hidden`; single-colour glyphs are drawn in `currentColor` so they grey out with a disabled control. Show them at their own size or a whole multiple — never scaled in between. Icon slots still take your own icons.
