# ButtonGroup

**Stage:** 🟢 Stable

Joins related buttons into one control — shared edges, outer corners only —
the Archive / Report / Snooze pattern.

```vue
<ButtonGroup aria-label="Actions">
  <Button variant="outline">Archive</Button>
  <Button variant="secondary">Report</Button>
</ButtonGroup>
```

<DemoBox>
  <ButtonGroup aria-label="Actions">
    <ButtonGroup>
      <Button variant="outline">Archive</Button>
      <Button variant="secondary">Report</Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button variant="outline">Snooze</Button>
      <Button variant="outline" size="icon" aria-label="More">⋯</Button>
    </ButtonGroup>
  </ButtonGroup>
</DemoBox>

Nest groups to space separate units. Children keep their own `variant` and
`size`; the group only merges borders and radii.

## When to use

- Split actions that belong together (Archive + Report, Snooze + overflow).
- Icon + label pairs that should read as one segment.

## When not to use

- **For mutually exclusive toggles.** That is a toggle group, not a button
  group — different selection semantics.
- **To replace spacing.** If buttons should sit apart, use a flex gap, not a
  group with one child each.

## Props

<!-- @props ButtonGroupProps -->

| Prop          | Type                         | Default        | Description                                              |
| ------------- | ---------------------------- | -------------- | -------------------------------------------------------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout axis.                                             |
| `ariaLabel`   | `string`                     | —              | Accessible name for the group.                           |
| `class`       | `string`                     | —              | Additional classes, merged so a consumer's utility wins. |

<!-- /@props -->

## Accessibility

- The root has `role="group"`. Pass `aria-label` (or `aria-labelledby`) so the
  joined controls announce as a unit.
- Tab still visits each button inside the group.
