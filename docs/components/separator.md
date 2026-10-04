# Separator

**Stage:** 🟡 New

The Windows 98 etched line: 1px of shadow beside 1px of highlight, so it reads
as a groove cut into the silver face. Horizontal, it divides menu groups and
dialog sections; vertical, it divides toolbar groups and stretches to their
height.

```vue
<ButtonGroup aria-label="Edit">
  <ButtonGroup>
    <Button variant="ghost">Cut</Button>
    <Button variant="ghost">Copy</Button>
  </ButtonGroup>
  <Separator orientation="vertical" />
  <ButtonGroup>
    <Button variant="ghost">Undo</Button>
  </ButtonGroup>
</ButtonGroup>
```

<DemoBox>
  <ButtonGroup aria-label="Edit">
    <ButtonGroup>
      <Button variant="ghost">Cut</Button>
      <Button variant="ghost">Copy</Button>
    </ButtonGroup>
    <Separator orientation="vertical" />
    <ButtonGroup>
      <Button variant="ghost">Undo</Button>
    </ButtonGroup>
  </ButtonGroup>
</DemoBox>

## When to use

- Between groups of toolbar buttons, menu items, or sections of a dialog.

## When not to use

- **For spacing.** A gap does that without drawing anything.
- **Around every item.** A line between each row of a list is noise; Windows
  98 separates groups, not items.
- **As a heading.** A separator says "a different group starts here", not
  what the group is. Label groups with text.

## Props

<!-- @props SeparatorProps -->

| Prop          | Type                         | Default        | Description                                                                                                                              |
| ------------- | ---------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the line. Vertical stretches to the height of its row.                                                                      |
| `decorative`  | `boolean`                    | `false`        | Purely visual: hidden from assistive technology. Leave it off when the line divides groups of controls a reader should hear as separate. |
| `class`       | `string`                     | —              | Additional classes, merged so a consumer's utility wins.                                                                                 |

<!-- /@props -->

## Accessibility

- `role="separator"`, with `aria-orientation="vertical"` when vertical. A
  screen reader hears the groups as separate.
- `decorative` sets `role="none"` for a line that only decorates, so it is
  not announced.
- It takes no focus and has no keyboard behaviour.
