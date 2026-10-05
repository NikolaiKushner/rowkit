# Field & Input

**Stage:** 🟢 Stable

`Field` owns the label, hint, error and the ARIA wiring between them. `Input`
is the text control. They are documented together because `Field` exists to
make `Input` — and `Select` — correct without the consumer doing the work.

<script setup>
import FieldBasic from '../examples/field/FieldBasic.vue'
import FieldValidation from '../examples/field/FieldValidation.vue'
import FieldTypes from '../examples/field/FieldTypes.vue'
import FieldSizes from '../examples/field/FieldSizes.vue'
import FieldAdornments from '../examples/field/FieldAdornments.vue'
import FieldStates from '../examples/field/FieldStates.vue'
import FieldPropertySheet from '../examples/field/FieldPropertySheet.vue'
import FieldSignUp from '../examples/field/FieldSignUp.vue'
</script>

<DemoBox layout="stack">
  <FieldBasic />
</DemoBox>

<<< @/examples/field/FieldBasic.vue

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Validation

Click into the field and leave it: the error appears once the person has
moved on, not on their first keystroke. The hint stays while the error shows —
both are referenced by `aria-describedby`, so fixing a mistake never costs the
guidance that would have prevented it.

<DemoBox layout="stack">
  <FieldValidation />
</DemoBox>

<<< @/examples/field/FieldValidation.vue

### Input types

`number` draws the Windows 98 spin buttons, and ↑ ↓ step it from the
keyboard; `date` gets a calendar button. Passwords, phone numbers and URLs keep
the browser's own keyboard and autofill.

<DemoBox layout="stack">
  <FieldTypes />
</DemoBox>

<<< @/examples/field/FieldTypes.vue

### Sizes

`size` on the `Field` reaches the control inside and sets the gaps: 4px at
`sm`, 6px at `md`, 8px at `lg`.

<DemoBox>
  <FieldSizes />
</DemoBox>

<<< @/examples/field/FieldSizes.vue

### Icons, units and a clear button

The `leading` and `trailing` slots sit inside the field's frame: a search
icon, a unit after a number, a button that clears the text.

<DemoBox>
  <FieldAdornments />
</DemoBox>

<<< @/examples/field/FieldAdornments.vue

### Disabled, read-only, invalid, required

Disabled at the `Field` greys the label and reaches the control. Read-only
text can still be selected and copied. An `error` marks the control invalid; a
`required` field draws a maroon asterisk.

<DemoBox layout="stack">
  <FieldStates />
</DemoBox>

<<< @/examples/field/FieldStates.vue

### Labels beside the controls

`layout="left"` is the Windows 98 property-sheet arrangement: the label beside
the control, the hint or error under it. `--rk-field-label-width` on a
container lines up a column of labels.

<DemoBox layout="stack">
  <FieldPropertySheet />
</DemoBox>

<<< @/examples/field/FieldPropertySheet.vue

### A sign-up form

Errors appear after the first submit and then follow the typing; a failed
submit moves focus to the first invalid field, so a keyboard or screen reader
user lands on the problem rather than hunting for it.

<DemoBox layout="stack">
  <FieldSignUp />
</DemoBox>

<<< @/examples/field/FieldSignUp.vue

## Look

As drawn in the Figma file: the label in the regular UI face with a maroon
asterisk when required, the control, then the hint in subtle grey or the error
— the 16px error icon and the message in maroon. The gaps follow the control:
4px at `sm`, 6px at `md`, 8px at `lg`. Disabled, the label turns grey and
embossed like the control's text.

`layout="left"` is the Windows 98 property-dialog arrangement: the label beside
the control, 8px from it, its text level with the control's, and the hint or
error under the control. Set `--rk-field-label-width` on a container to line
up a column of labels:

```vue
<div class="[--rk-field-label-width:5rem]">
  <Field layout="left" label="Name"><Input v-model="name" /></Field>
  <Field layout="left" label="Email"><Input v-model="email" /></Field>
</div>
```

## Anatomy

| Part    | Purpose                                                                     |
| ------- | --------------------------------------------------------------------------- |
| Label   | Always rendered. `labelSrOnly` hides it visually, never from screen readers |
| Control | Whatever you put in the default slot. Receives the generated id             |
| Hint    | Guidance shown while the value is valid — and kept while it is not          |
| Error   | Validation message. `role="alert"`, so it is announced when it appears      |

## When to use

- Every form control. A control without a label is a control nobody can use.
- Wrap `Select` with it too — the same id, description and state flow through.

## When not to use

- **As a layout wrapper.** `Field` provides context to one control. Two
  controls inside one `Field` share an id, and the label points at only one.
  For a date range or a split phone number, use two `Field`s, or a
  `<fieldset>` with a `<legend>`.
- **With a placeholder instead of a label.** The placeholder disappears when
  typing starts, is not announced reliably, and fails contrast on most
  palettes. `labelSrOnly` is the honest way to hide a label.
- **`Input` for checkboxes, radios or file uploads.** The `type` prop
  deliberately excludes them; they need different markup and different labels.
- **Errors that appear while typing.** Validate on submit or on blur. `Field`
  shows an error whenever `error` is set, so the timing is yours to get right.

## Props

### Field

<!-- @props FieldProps -->

| Prop          | Type                   | Default | Description                                                                                                                                 |
| ------------- | ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`       | `string`               | —       | Visible label. Always render one — a placeholder is not a label.                                                                            |
| `hint`        | `string`               | —       | Help text shown below the control while it is valid.                                                                                        |
| `error`       | `string`               | —       | Validation message. Its presence is what puts the field into the error state; there is no separate `invalid` flag to keep in sync.          |
| `required`    | `boolean`              | `false` | Marks the control required and shows the required indicator.                                                                                |
| `disabled`    | `boolean`              | `false` | Disables the control inside.                                                                                                                |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`  | Sizes the label, hint, error and — via field context — the nested control when that control omits its own `size`.                           |
| `layout`      | `'top' \| 'left'`      | `'top'` | Where the label sits.                                                                                                                       |
| `id`          | `string`               | —       | Id for the control. Generated when omitted — supply one only when something outside the field needs to reference it.                        |
| `labelSrOnly` | `boolean`              | `false` | Hides the label visually while leaving it available to screen readers. For a search box in a toolbar whose purpose is obvious from context. |
| `class`       | `string`               | —       | Additional classes, merged so a consumer's utility wins.                                                                                    |

<!-- /@props -->

Slots: `default` (the control), `hint`, `error`.

### Input

<!-- @props InputProps -->

| Prop          | Type                                                                                  | Default  | Description                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `size`        | `'sm' \| 'md' \| 'lg'`                                                                | —        | Control height: `sm` 21px, `md` 23px, `lg` 27px — the same as Button's `sm`, `default` and `lg`, so a field and its button line up. |
| `type`        | `'number' \| 'text' \| 'email' \| 'password' \| 'search' \| 'tel' \| 'url' \| 'date'` | `'text'` | Native input type.                                                                                                                  |
| `placeholder` | `string`                                                                              | —        | Short example of the expected value. Never a substitute for a label.                                                                |
| `disabled`    | `boolean`                                                                             | `false`  | Disables the input. A surrounding disabled `Field` also disables it.                                                                |
| `invalid`     | `boolean`                                                                             | `false`  | Marks the value invalid: `aria-invalid` and the error mark at the end of the field.                                                 |
| `required`    | `boolean`                                                                             | `false`  | Marks the input required. A required `Field` also sets it.                                                                          |
| `readonly`    | `boolean`                                                                             | `false`  | Makes the value read-only while keeping it focusable and selectable.                                                                |
| `id`          | `string`                                                                              | —        | Id for the input. Inherited from a surrounding `Field` when omitted.                                                                |
| `class`       | `string`                                                                              | —        | Additional classes for the frame — the visible box with the bevel — merged so a consumer's utility wins.                            |

<!-- /@props -->

`modelValue` is the `v-model`, typed `string | number`.

Slots: `leading`, `trailing` — rendered inside the bevel, beside the text. A
`leading` slot replaces the magnifier of a search field.

`class` goes on the frame — the white box with the sunken bevel — so a width
like `w-56` sizes what the user sees. Unrecognised attributes (`autocomplete`,
`name`, `inputmode`, listeners, …) land on the `<input>` itself.

The type decides what else is in the frame: `search` adds the magnifier and
clears on Escape, `number` adds spin buttons that repeat while held, `date`
adds a drop button that opens the browser's date picker. An invalid field
shows the red error mark at its end and nothing else changes colour — the
message is the Field's job.

### How state combines

A control's own prop and the surrounding `Field` combine with **OR**. A `Field`
can turn `disabled`, `invalid` or `required` on; a control inside cannot turn
them back off. This mirrors `<fieldset disabled>`, where a descendant has no
way to re-enable itself.

## Keyboard

| Key            | Behaviour                         |
| -------------- | --------------------------------- |
| <kbd>Tab</kbd> | Moves focus to the input          |
| Text keys      | Edit the value, unless `readonly` |

Clicking the label focuses the control, because the label's `for` points at the
control's generated id.

## Accessibility

- `aria-describedby` lists the hint first, then the error, so guidance is read
  before the correction. The hint does not disappear because the value is
  currently wrong.
- The error is `role="alert"`: a message that appears after a submit attempt is
  announced without the user going looking for it.
- The required asterisk is `aria-hidden`. `required` is already on the control;
  announcing it twice per field is noise, and an asterisk alone has never been
  a reliable signal — say it in the hint if it matters.
- Ids are generated with Vue's `useId()`, so they are stable across SSR and
  hydration.
