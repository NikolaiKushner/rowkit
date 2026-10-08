# Separator

**Stage:** 🟡 New

The Windows 98 etched line: 1px of shadow beside 1px of highlight, so it reads
as a groove cut into the silver face. Horizontal, it divides menu groups and
dialog sections; vertical, it divides toolbar groups and stretches to their
height. In the modern theme it is a single 1px hairline in the border grey.

<script setup>
import SeparatorBasic from '../examples/separator/SeparatorBasic.vue'
import SeparatorSections from '../examples/separator/SeparatorSections.vue'
import SeparatorInline from '../examples/separator/SeparatorInline.vue'
</script>

<DemoBox>
  <SeparatorBasic />
</DemoBox>

<<< @/examples/separator/SeparatorBasic.vue

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Between sections

Horizontal, between the parts of a panel or a dialog: options in one group,
a setting apart from them, the command row.

<DemoBox>
  <SeparatorSections />
</DemoBox>

<<< @/examples/separator/SeparatorSections.vue

### Between items of text

Vertical in a row of text, as a status line divides its facts. `decorative`
keeps it from screen readers, which have the words already.

<DemoBox>
  <SeparatorInline />
</DemoBox>

<<< @/examples/separator/SeparatorInline.vue

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
