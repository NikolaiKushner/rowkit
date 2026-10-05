# ButtonGroup

**Stage:** 🟢 Stable

A Windows 98 toolbar group: related buttons edge to edge, each keeping its own
bevel. Ghost buttons are the toolbar look — flat until hovered.

<script setup>
import ButtonGroupBasic from '../examples/button-group/ButtonGroupBasic.vue'
import ButtonGroupZoom from '../examples/button-group/ButtonGroupZoom.vue'
import ButtonGroupVertical from '../examples/button-group/ButtonGroupVertical.vue'
import ButtonGroupDialog from '../examples/button-group/ButtonGroupDialog.vue'
</script>

<DemoBox>
  <ButtonGroupBasic />
</DemoBox>

<<< @/examples/button-group/ButtonGroupBasic.vue

Nest groups to show separate units: they sit 4px apart, and a vertical
[`Separator`](./separator.md) between them draws the etched line of the Figma
toolbars. Children keep their own `variant` and `size`; nothing is merged.

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Raised buttons, edge to edge

Secondary buttons in a group keep their own bevels: zoom out, the level —
which resets it — and zoom in.

<DemoBox>
  <ButtonGroupZoom />
</DemoBox>

<<< @/examples/button-group/ButtonGroupZoom.vue

### Vertical

`orientation="vertical"` stacks the buttons, each the full width — a tool
palette down the side of a window.

<DemoBox>
  <ButtonGroupVertical />
</DemoBox>

<<< @/examples/button-group/ButtonGroupVertical.vue

### A dialog's command row

OK, Cancel, Apply: the default first, as Windows 98 orders them, 6px
apart.

<DemoBox>
  <ButtonGroupDialog />
</DemoBox>

<<< @/examples/button-group/ButtonGroupDialog.vue

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
