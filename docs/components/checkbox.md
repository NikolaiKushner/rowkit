# Checkbox

**Stage:** 🟡 New

The Windows 98 check box: a 13×13 sunken box beside its label. A native
`<input type="checkbox">` underneath, so it submits with a form, answers
<kbd>Space</kbd>, and is announced as a check box with no extra work.

<script setup>
import CheckboxBasic from '../examples/checkbox/CheckboxBasic.vue'
import CheckboxStates from '../examples/checkbox/CheckboxStates.vue'
import CheckboxSelectAll from '../examples/checkbox/CheckboxSelectAll.vue'
import CheckboxDependent from '../examples/checkbox/CheckboxDependent.vue'
import CheckboxConsent from '../examples/checkbox/CheckboxConsent.vue'
import CheckboxForm from '../examples/checkbox/CheckboxForm.vue'
</script>

<DemoBox>
  <CheckboxBasic />
</DemoBox>

<<< @/examples/checkbox/CheckboxBasic.vue

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### States

Unchecked, checked, indeterminate — the 7×2 bar for «some of these» — and
disabled, which greys the box to silver and embosses the label.

<DemoBox>
  <CheckboxStates />
</DemoBox>

<<< @/examples/checkbox/CheckboxStates.vue

### Select all

A parent box over a group: checked when every child is, indeterminate when
some are, and a click sets them all.

<DemoBox>
  <CheckboxSelectAll />
</DemoBox>

<<< @/examples/checkbox/CheckboxSelectAll.vue

### Options that depend on another

A sub-option that means nothing while its parent is off is disabled, not
hidden — the person can see what turning the parent on would offer.

<DemoBox>
  <CheckboxDependent />
</DemoBox>

<<< @/examples/checkbox/CheckboxDependent.vue

### Agreeing to terms

The default slot takes markup, so the label can hold a link. The submit button
waits for the box.

<DemoBox>
  <CheckboxConsent />
</DemoBox>

<<< @/examples/checkbox/CheckboxConsent.vue

### In a native form

A real `<input type="checkbox">` underneath: with a `name` and `value`, checked
boxes submit with the form and unchecked ones send nothing.

<DemoBox>
  <CheckboxForm />
</DemoBox>

<<< @/examples/checkbox/CheckboxForm.vue

## Look

As drawn in the Figma file: the white box in a sunken bevel, a 7×7 black
check, a 7×2 bar while partly checked. Held down, or disabled, the box turns
silver; disabled, the mark and label turn grey and the label is embossed.
Focus is the dotted ring around the label alone; a check box with no visible
label draws it around the box.

## When to use

- An on/off choice that takes effect when the form is submitted.
- Several independent options in a group — put them in a `GroupBox`.
- A "select all" over a list, with `indeterminate` when some are selected.

## When not to use

- **For one choice out of several.** That is a set of `Radio`s.
- **For a setting that applies at once.** A check box reads as "decided on
  submit"; an instant switch needs an action the user sees happen.

## Props

<!-- @props CheckboxProps -->

| Prop            | Type      | Default | Description                                                                                                                                |
| --------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`         | `string`  | —       | The label beside the box. The default slot replaces it.                                                                                    |
| `indeterminate` | `boolean` | `false` | Partly checked: some of a group, not all. Shows the bar and is announced as "mixed". Checking it clears this; owning that is the caller's. |
| `disabled`      | `boolean` | `false` | Disables the control: a silver box and a grey, embossed label.                                                                             |
| `name`          | `string`  | —       | Name submitted with a native form.                                                                                                         |
| `value`         | `string`  | —       | Value submitted with a native form while checked.                                                                                          |
| `required`      | `boolean` | `false` | Marks the control required for native form validation.                                                                                     |
| `id`            | `string`  | —       | Id for the input. Generated when omitted.                                                                                                  |
| `class`         | `string`  | —       | Additional classes for the row, merged so a consumer's utility wins.                                                                       |

<!-- /@props -->

`v-model` is the checked state, a `boolean`.

## Keyboard

| Key              | Action            |
| ---------------- | ----------------- |
| <kbd>Tab</kbd>   | Moves focus to it |
| <kbd>Space</kbd> | Toggles it        |

## Accessibility

- The row is a `<label>` for the input, so the label names it and clicking the
  text toggles it.
- `indeterminate` sets the input's own `indeterminate` property: a screen
  reader announces "mixed". Checking it clears the property; the caller owns
  what that means.
- With no visible label, name it with `aria-label` — attributes go to the
  input, not the row.
