# GroupBox

**Stage:** 🟡 New

The Windows 98 group box: an etched frame with its legend sitting on the top
line. It groups the controls of one part of a form, or frames an example.

<script setup>
import GroupBoxBasic from '../examples/group-box/GroupBoxBasic.vue'
import GroupBoxSettings from '../examples/group-box/GroupBoxSettings.vue'
import GroupBoxSection from '../examples/group-box/GroupBoxSection.vue'
</script>

<DemoBox>
  <GroupBoxBasic />
</DemoBox>

<<< @/examples/group-box/GroupBoxBasic.vue

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### A settings page

Groups side by side, each with its own legend: option buttons in one,
check boxes in the other, as Windows 98 Display Properties lays them out.

<DemoBox>
  <GroupBoxSettings />
</DemoBox>

<<< @/examples/group-box/GroupBoxSettings.vue

### Framing content that is not a form

`as="section"` frames read-only content — a summary, a definition list —
named by its legend. The default `fieldset` is for controls.

<DemoBox>
  <GroupBoxSection />
</DemoBox>

<<< @/examples/group-box/GroupBoxSection.vue

## Look

As drawn in the Figma file: the etched groove, its top line 6px down, the
legend 8px in with 2px of silver either side so it cuts the line. Content
starts 16px from the top and 12px from the other sides, 8px apart.

In the modern theme there is no groove: the content sits on a faintly tinted
panel with rounded corners and a hairline edge, and the legend, in semibold,
sits above the panel rather than on its edge.

## When to use

- A section of a form: an address, notification settings, a set of radios.
- Framing an example or a preview.

## When not to use

- **Around a whole form.** One frame around everything groups nothing; the
  window already does that.
- **Nested.** A group box inside a group box reads as a mistake. Use a
  `Separator` or a second box beside the first.
- **As a card.** It is a grouping, not a surface to click.

## Props

<!-- @props GroupBoxProps -->

| Prop     | Type                               | Default      | Description                                                                 |
| -------- | ---------------------------------- | ------------ | --------------------------------------------------------------------------- |
| `legend` | `string`                           | —            | The text on the frame's top line. Names the group for assistive technology. |
| `as`     | `'fieldset' \| 'section' \| 'div'` | `'fieldset'` | The element.                                                                |
| `class`  | `string`                           | —            | Additional classes, merged so a consumer's utility wins.                    |

<!-- /@props -->

## Accessibility

- By default the root is a `fieldset` and the legend a `legend`, so the browser
  names the group itself and a screen reader announces "Shipping address,
  group" on entering it.
- With `as="section"` or `as="div"` the root gets `role="group"` and
  `aria-labelledby` pointing at the legend — the same announcement for content
  that is not a form.
- The frame is drawn by an `aria-hidden` layer and takes no focus.
