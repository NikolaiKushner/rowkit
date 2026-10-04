# ButtonGroup

**Stage:** 🟢 Stable

A Windows 98 toolbar group: related buttons edge to edge, each keeping its own
bevel. Ghost buttons are the toolbar look — flat until hovered.

```vue
<ButtonGroup aria-label="Selection">
  <ButtonGroup>
    <Button variant="ghost">Export</Button>
    <Button variant="ghost">Delete</Button>
  </ButtonGroup>
  <Separator orientation="vertical" />
  <ButtonGroup>
    <Button variant="ghost">Archive</Button>
    <Button variant="ghost">Report</Button>
  </ButtonGroup>
</ButtonGroup>
```

<DemoBox>
  <ButtonGroup aria-label="Selection">
    <ButtonGroup>
      <Button variant="ghost">Export</Button>
      <Button variant="ghost">Delete</Button>
    </ButtonGroup>
    <Separator orientation="vertical" />
    <ButtonGroup>
      <Button variant="ghost">Archive</Button>
      <Button variant="ghost">Report</Button>
    </ButtonGroup>
  </ButtonGroup>
</DemoBox>

Nest groups to show separate units: they sit 4px apart, and a vertical
[`Separator`](./separator.md) between them draws the etched line of the Figma
toolbars. Children keep their own `variant` and `size`; nothing is merged.

## When to use

- A toolbar: actions on the current selection, formatting buttons, view
  switches — grouped by what they act on.
- Split actions that belong together (Archive + Report, Snooze + overflow).

## When not to use

- **For mutually exclusive toggles.** That is a toggle group, not a button
  group — different selection semantics.
- **To replace spacing.** If buttons should sit apart, use a flex gap, not a
  group with one child each.

## Props

<!-- @props ButtonGroupProps -->

| Prop          | Type                         | Default        | Description                                                                                                                                |
| ------------- | ---------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout axis. Buttons sit edge to edge along it; nested groups sit 4px apart, with a `Separator` between them when they are separate units. |
| `ariaLabel`   | `string`                     | —              | Accessible name for the group.                                                                                                             |
| `class`       | `string`                     | —              | Additional classes, merged so a consumer's utility wins.                                                                                   |

<!-- /@props -->

## Accessibility

- The root has `role="group"`. Pass `aria-label` (or `aria-labelledby`) so the
  grouped controls announce as a unit.
- Tab still visits each button inside the group.
