# GroupBox

**Stage:** 🟡 New

The Windows 98 group box: an etched frame with its legend sitting on the top
line. It groups the controls of one part of a form, or frames an example.

```vue
<GroupBox legend="Shipping address">
  <Field layout="left" label="Street"><Input v-model="street" /></Field>
  <Field layout="left" label="City"><Input v-model="city" /></Field>
</GroupBox>
```

<DemoBox>
  <GroupBox legend="Shipping address" class="w-[320px] [--rk-field-label-width:4rem]">
    <Field layout="left" label="Street"><Input model-value="12 Analytical Row" /></Field>
    <Field layout="left" label="City"><Input model-value="London" /></Field>
  </GroupBox>
</DemoBox>

## Look

As drawn in the Figma file: the etched groove, its top line 6px down, the
legend 8px in with 2px of silver either side so it cuts the line. Content
starts 16px from the top and 12px from the other sides, 8px apart.

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
