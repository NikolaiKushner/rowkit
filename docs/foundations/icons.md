# Icons

The Windows 98 pixel icons from the Figma set, in the VGA palette, every pixel
on the integer grid. Each size is drawn separately: 8px glyphs for controls,
16px icons for buttons and lists, 32px icons for system messages.

```vue
<script setup>
import { Button, PlusIcon, TrashIcon } from 'rowkit'
</script>

<template>
  <Button variant="ghost">
    <template #leading><PlusIcon /></template>
    New
  </Button>
</template>
```

## Rules

- **Never scale them** except by a whole number. A 16px icon at 20px smears
  every pixel across two; draw or pick another size instead.
- **They are decorative.** Every icon is `aria-hidden`. Say what it means in
  the button's label, or with `aria-label` on an icon-only button.
- **Glyphs follow the text colour.** Single-colour glyphs — the triangles,
  ✕, ✓, the title-bar glyphs, `PlusIcon` — are drawn in `currentColor`, so
  they grey out with a disabled control. The rest keep their palette.

## 16 × 16

<DemoBox>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4">
    <figure class="m-0 flex flex-col items-center gap-1"><CalendarIcon /><figcaption class="text-ui">CalendarIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><CodeIcon /><figcaption class="text-ui">CodeIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><ComputerIcon /><figcaption class="text-ui">ComputerIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><CopyIcon /><figcaption class="text-ui">CopyIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><DocumentIcon /><figcaption class="text-ui">DocumentIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><EditIcon /><figcaption class="text-ui">EditIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><ErrorIcon /><figcaption class="text-ui">ErrorIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><FilterIcon /><figcaption class="text-ui">FilterIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><FolderIcon /><figcaption class="text-ui">FolderIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><FolderOpenIcon /><figcaption class="text-ui">FolderOpenIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><HourglassIcon /><figcaption class="text-ui">HourglassIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><InfoIcon /><figcaption class="text-ui">InfoIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><PlusIcon /><figcaption class="text-ui">PlusIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><QuestionIcon /><figcaption class="text-ui">QuestionIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><SearchIcon /><figcaption class="text-ui">SearchIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><SuccessIcon /><figcaption class="text-ui">SuccessIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><TrashIcon /><figcaption class="text-ui">TrashIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><UserIcon /><figcaption class="text-ui">UserIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><WarningIcon /><figcaption class="text-ui">WarningIcon</figcaption></figure>
  </div>
</DemoBox>

## 32 × 32 — system messages, EmptyState

<DemoBox>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4">
    <figure class="m-0 flex flex-col items-center gap-1"><ArrowLeft32Icon /><figcaption class="text-ui">ArrowLeft32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><ArrowRight32Icon /><figcaption class="text-ui">ArrowRight32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><ArrowUp32Icon /><figcaption class="text-ui">ArrowUp32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><Book32Icon /><figcaption class="text-ui">Book32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><Code32Icon /><figcaption class="text-ui">Code32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><Computer32Icon /><figcaption class="text-ui">Computer32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><Document32Icon /><figcaption class="text-ui">Document32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><Error32Icon /><figcaption class="text-ui">Error32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><Folder32Icon /><figcaption class="text-ui">Folder32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><FolderEmpty32Icon /><figcaption class="text-ui">FolderEmpty32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><Info32Icon /><figcaption class="text-ui">Info32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><Search32Icon /><figcaption class="text-ui">Search32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><Trash32Icon /><figcaption class="text-ui">Trash32Icon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><Warning32Icon /><figcaption class="text-ui">Warning32Icon</figcaption></figure>
  </div>
</DemoBox>

## Glyphs — controls and title bars

<DemoBox>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4">
    <figure class="m-0 flex flex-col items-center gap-1"><CheckGlyphIcon /><figcaption class="text-ui">CheckGlyphIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><CloseGlyphIcon /><figcaption class="text-ui">CloseGlyphIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><MaximizeGlyphIcon /><figcaption class="text-ui">MaximizeGlyphIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><MinimizeGlyphIcon /><figcaption class="text-ui">MinimizeGlyphIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><RestoreGlyphIcon /><figcaption class="text-ui">RestoreGlyphIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><TriangleDownIcon /><figcaption class="text-ui">TriangleDownIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><TriangleLeftIcon /><figcaption class="text-ui">TriangleLeftIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><TriangleRightIcon /><figcaption class="text-ui">TriangleRightIcon</figcaption></figure>
    <figure class="m-0 flex flex-col items-center gap-1"><TriangleUpIcon /><figcaption class="text-ui">TriangleUpIcon</figcaption></figure>
  </div>
</DemoBox>
